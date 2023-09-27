// 以下代码来自 @tiptap/extension-unique-id

import { Extension, findChildren, findChildrenInRange } from "@tiptap/core";
import { Plugin, PluginKey, Transaction } from "prosemirror-state";
import combineTransactionSteps from "./helpers/combineTransactionSteps";
import getChangedRanges from "./helpers/getChangedRanges";
import { SHA1 } from "crypto-js";

export interface HashOptions {
  attributeName: string;
  types: string[];
  generateHash: (content: string) => string;
  filterTransaction: ((transaction: Transaction) => boolean) | null;
}

export const Hash = Extension.create<HashOptions>({
  name: "hash",

  // we’ll set a very high priority to make sure this runs first
  // and is compatible with `appendTransaction` hooks of other extensions
  priority: 10000,

  addOptions() {
    return {
      attributeName: "current-hash",
      types: [],
      generateHash: (content: string) => SHA1(content).toString(),
      filterTransaction: null,
    };
  },

  addStorage() {
    return {
      hashMap: new Map<string, string>(),
    };
  },

  /**
   * 添加全局属性
   *
   * @returns
   */
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          hash: {
            default: null,
            parseHTML: (element) => element.getAttribute(`data-hash`),
            renderHTML: (attributes) => {
              if (!attributes.hash) {
                return {};
              }

              return {
                [`data-hash`]: attributes.hash,
              };
            },
          },
          changed: {
            default: false,
            parseHTML: (element) => element.getAttribute("data-changed"),
            renderHTML: (attributes) => {
              if (!attributes.changed) {
                return {};
              }

              return {
                [`data-changed`]: attributes.changed,
              };
            },
          },
        },
      },
    ];
  },

  // check initial content for missing ids
  onCreate() {
    const { state } = this.editor;

    const { doc } = state;
    const { types, generateHash } = this.options;
    const nodesWithoutId = findChildren(doc, (node) => {
      return types.includes(node.type.name) && node.attrs.currentHash === null;
    });

    nodesWithoutId.forEach(({ node }) => {
      const currentHash = generateHash(JSON.stringify(node.content.toJSON()));
      this.storage.hashMap.set(node.attrs["block-id"], currentHash);
    });
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("hash"),

        appendTransaction: (transactions, oldState, newState) => {
          const docChanges =
            transactions.some((transaction) => transaction.docChanged) &&
            !oldState.doc.eq(newState.doc);
          const filterTransactions =
            this.options.filterTransaction &&
            transactions.some((tr) => !this.options.filterTransaction?.(tr));

          // 判断文档是否变更
          if (!docChanges || filterTransactions) {
            return;
          }

          const { tr } = newState;
          const { types, generateHash } = this.options;

          // @ts-ignore
          const transform = combineTransactionSteps(oldState.doc, transactions);

          // get changed ranges based on the old state
          const changes = getChangedRanges(transform);

          changes.forEach((change) => {
            const newRange = {
              from: change.newStart,
              to: change.newEnd,
            };

            const newNodes = findChildrenInRange(
              newState.doc,
              newRange,
              (node) => {
                return types.includes(node.type.name);
              },
            );

            newNodes.forEach(({ node, pos }) => {
              const currentHash = generateHash(
                JSON.stringify(node.content.toJSON()),
              );

              this.storage.hashMap.set(node.attrs["block-id"], currentHash);

              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                changed: currentHash !== node.attrs["hash"],
              });

              return;
            });
          });

          if (!tr.steps.length) {
            return;
          }

          return tr;
        },
      }),
    ];
  },
});
