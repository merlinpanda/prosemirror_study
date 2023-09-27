import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    comment: {
      setTemporaryComment: () => ReturnType;
      setComment: (commentId: string) => ReturnType;
      unsetComment: () => ReturnType;
    };
  }
}

export const Comment = Mark.create({
  name: "comment",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-comment-id"),
        renderHTML(attributes) {
          if (!attributes.commentId) {
            return {};
          }

          return {
            "data-comment-id": attributes.commentId,
          };
        },
      },
      temporaryComment: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-temporary-comment"),
        renderHTML(attributes) {
          if (!attributes.temporaryComment) {
            return {};
          }

          return {
            "data-temporary-comment": attributes.temporaryComment,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (node) =>
          ((node as HTMLElement).getAttribute("data-comment-id") !== null ||
            (node as HTMLElement).getAttribute("data-temporary-comment") !==
              null) &&
          null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setTemporaryComment:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            temporaryComment: true,
          });
        },

      setComment:
        (commentId) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            commentId,
          });
        },

      unsetComment:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
