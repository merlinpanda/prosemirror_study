import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { undo, redo, history } from "prosemirror-history";
// keymap 插件, 它用来绑定键盘输入的 actions.
import { keymap } from "prosemirror-keymap";
import { useRef, useEffect } from "react";

function App() {
  const editorBox = useRef(null);

  useEffect(() => {
    if (editorBox.current) {
      const state = EditorState.create({
        schema,

        // Plugins 会在创建 state 的时候被注册(因为它们需要访问 state 的 transactions 的权限).
        plugins: [history(), keymap({ "Mod-z": undo, "Mod-y": redo })],
      });

      const editor = new EditorView(editorBox.current, {
        state,
        dispatchTransaction(transaction) {
          console.log(
            "Document size went from",
            transaction.before.content,
            "to",
            transaction.doc.content,
          );
          // 如果注释下方两行代码，即不应用事务变化，在输入框中将看不到内容
          // 但是仍然可以监测到事务变化信息
          const newState = editor.state.apply(transaction);
          editor.updateState(newState);
        },
      });

      return () => {
        editor.destroy();
      };
    }
  }, []);

  return (
    <>
      <div className="">
        <div ref={editorBox}></div>
      </div>
    </>
  );
}

export default App;
