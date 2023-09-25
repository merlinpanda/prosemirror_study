import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useRef, useEffect } from "react";

function App() {
  const editorBox = useRef(null);

  useEffect(() => {
    if (editorBox.current) {
      const state = EditorState.create({ schema });
      const editor = new EditorView(editorBox.current, {
        state,
        dispatchTransaction(transaction) {
          console.log(
            "Document size went from",
            transaction.before.content,
            "to",
            transaction.doc.content,
          );
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
