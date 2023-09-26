import { Node } from "@tiptap/core";

export const Document = Node.create({
  name: "doc",

  topNode: true,

  content: "block+",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      hash: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-hash"),
        renderHTML: (attributes) => {
          if (!attributes.hash) {
            return;
          }

          return {
            "data-hash": attributes.hash,
          };
        },
      },
      newHash: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-new-hash"),
        renderHTML: (attributes) => {
          if (!attributes.newHash) {
            return;
          }

          return {
            "data-new-hash": attributes.newHash,
          };
        },
      },
    };
  },
});
