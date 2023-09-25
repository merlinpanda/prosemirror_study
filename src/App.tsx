import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import { useRef, useEffect } from "react";

function App() {
  const editorBox = useRef(null);
  const editorContent = useRef(null);

  useEffect(() => {
    if (editorBox.current && editorContent.current) {
      const mySchema = new Schema({
        nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
        marks: schema.spec.marks,
      });

      const editor = new EditorView(editorBox.current, {
        state: EditorState.create({
          doc: DOMParser.fromSchema(mySchema).parse(editorContent.current),
          plugins: exampleSetup({ schema: mySchema }),
        }),
      });

      return () => {
        editor.destroy();
      };
    }
  }, []);

  return (
    <>
      <div ref={editorBox}>
        <div ref={editorContent}>
          <div className="">aaa</div>
          <div className="">aaaasd</div>
        </div>
      </div>
    </>
  );
}

export default App;
