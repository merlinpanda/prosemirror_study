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
      documentId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-document-id"),
        renderHTML: (attributes) => {
          if (!attributes.documentId) {
            return;
          }

          return {
            "data-document-id": attributes.documentId,
          };
        },
      },
    };
  },
});
