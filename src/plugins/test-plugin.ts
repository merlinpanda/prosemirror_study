import { Plugin, PluginKey } from "prosemirror-state";
// import { EditorView } from "prosemirror-view";

const TestPluginKey = new PluginKey("test-plugin");

export function testPlugin() {
  return new Plugin({
    // props: {
    //   handleDOMEvents: {
    //     click: (view: EditorView, event: MouseEvent) => {
    //       console.log("handleDOMEvents click view", view);
    //       console.log("handleDOMEvents click event", event);
    //     },
    //     dblclick: (view: EditorView, event: MouseEvent) => {
    //       console.log("handleDOMEvents dblclick view", view);
    //       console.log("handleDOMEvents dblclick event", event);
    //     },
    //     mouseenter: (view: EditorView, event: MouseEvent) => {
    //       console.log("handleDOMEvents mouseenter view", view);
    //       console.log("handleDOMEvents mouseenter event", event);
    //     },
    //     mousedown: (view: EditorView, event: MouseEvent) => {
    //       console.log("handleDOMEvents mousedown view", view);
    //       console.log("handleDOMEvents mousedown event", event);
    //     },
    //     mouseleave: (view: EditorView, event: MouseEvent) => {
    //       console.log("handleDOMEvents mouseleave view", view);
    //       console.log("handleDOMEvents mouseleave event", event);
    //     },
    //     blur: (view: EditorView, event: FocusEvent) => {
    //       console.log("handleDOMEvents blur view", view);
    //       console.log("handleDOMEvents blur event", event);
    //     },
    //     focus: (view: EditorView, event: FocusEvent) => {
    //       console.log("handleDOMEvents focus view", view);
    //       console.log("handleDOMEvents focus event", event);
    //     },
    //     load: (view: EditorView, event: Event) => {
    //       console.log("handleDOMEvents load view", view);
    //       console.log("handleDOMEvents load event", event);
    //     },
    //     drag: (view: EditorView, event: DragEvent) => {
    //       console.log("handleDOMEvents drag view", view);
    //       console.log("handleDOMEvents drag event", event);
    //     },
    //     dragend: (view: EditorView, event: DragEvent) => {
    //       console.log("handleDOMEvents dragend view", view);
    //       console.log("handleDOMEvents dragend event", event);
    //     },
    //     dragenter: (view: EditorView, event: DragEvent) => {
    //       console.log("handleDOMEvents dragenter view", view);
    //       console.log("handleDOMEvents dragenter event", event);
    //     },
    //     dragleave: (view: EditorView, event: DragEvent) => {
    //       console.log("handleDOMEvents dragleave view", view);
    //       console.log("handleDOMEvents dragleave event", event);
    //     },
    //     dragover: (view: EditorView, event: DragEvent) => {
    //       console.log("handleDOMEvents dragover view", view);
    //       console.log("handleDOMEvents dragover event", event);
    //     },
    //     dragstart: (view: EditorView, event: DragEvent) => {
    //       console.log("handleDOMEvents dragstart view", view);
    //       console.log("handleDOMEvents dragstart event", event);
    //     },
    //     drop: (view: EditorView, event: DragEvent) => {
    //       console.log("handleDOMEvents drop view", view);
    //       console.log("handleDOMEvents drop event", event);
    //     },
    //   },
    // handleKeyPress: (view: EditorView, event: KeyboardEvent) => {
    //   console.log("handleKeyPress view", view);
    //   console.log("handleKeyPress event", event);
    // },
    //   handleTextInput: (view, from, to, text) => {
    //     console.log("handleTextInput view", view);
    //     console.log("handleTextInput from", from);
    //     console.log("handleTextInput to", to);
    //     console.log("handleTextInput text", text);
    //   },
    // },
    key: TestPluginKey,

    view: () => {
      return {
        update: (view, prevState) => {
          console.log("view update view", view);
          console.log("view update prevState", prevState);
        },
        destroy: () => {
          console.log("view destory");
        },
      };
    },
  });
}
