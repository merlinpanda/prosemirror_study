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
      commentIdPrefix: "stument-comment-id-",
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: [],
        parseHTML: (element) => {
          const ids: string[] = [];
          (element as HTMLElement).classList.forEach((classname) => {
            if (classname.indexOf(this.options.commentIdPrefix) !== -1) {
              ids.push(classname.replace(this.options.commentIdPrefix, ""));
            }
          });

          return ids;
        },
        renderHTML: (attributes) => {
          if (attributes.commentId.length === 0) {
            return {};
          }

          const classnames: string = this.options.HTMLAttributes?.class;

          let classList: string[] = [];
          if (classnames) {
            classList = classList.concat(classnames.split(" "));
          }

          classList = classList.concat(
            attributes.commentId.map((commentId: string) => {
              return this.options.commentIdPrefix + commentId;
            }),
          );

          return {
            class: classList.join(" "),
          };
        },
      },
      temporaryComment: {
        default: false,
        parseHTML: (element) => {
          // stument-temporary-comment
          (element as HTMLElement).classList.forEach((classname) => {
            if (classname.indexOf("stument-temporary-comment") !== -1) {
              return true;
            }
          });

          return null;
        },
        renderHTML: (attributes) => {
          if (!attributes.temporaryComment) {
            return {};
          }

          const classnames = this.options.HTMLAttributes?.class;
          let classList = [];
          if (classnames) {
            classList = classnames.split(" ");
          }

          classList.push("stument-temporary-comment");

          console.log("classList", classList);
          return {
            class: classList.join(" "),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (node) => {
          console.log("parseHTML");
          return (
            ((node as HTMLElement).classList.contains(
              "stument-temporary-comment",
            ) ||
              (node as HTMLElement).className.indexOf(
                this.options.commentIdPrefix,
              ) !== -1) &&
            null
          );
        },
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
