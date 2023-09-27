import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

/**
 * 计算右键点击位置
 */
export const RightClick = Extension.create({
  name: "right-click",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            mousedown: (view: EditorView, event: MouseEvent) => {
              console.log("handleDOMEvents click view", view);
              console.log("handleDOMEvents click event", event);
            },
          },
        },
      }),
    ];
  },
});
