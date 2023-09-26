import { EditorContent, useEditor } from "@tiptap/react";
import { Document } from "./plugins/document";
import { UniqueID } from "./plugins/block";
import { Paragraph } from "./plugins/paragraph";
import { Text } from "./plugins/text";
// import JSONPretty from "react-json-pretty";

export default function App() {
  const editor = useEditor({
    extensions: [
      Document,
      UniqueID.configure({
        types: ["paragraph", "image"],
      }),
      Paragraph,
      Text,
    ],
  });

  return (
    <>
      <div className="flex flex-row">
        <div className="flex-grow p-4">
          <EditorContent editor={editor} className="bg-slate-200 p-4 rounded" />
        </div>
        <div className="flex-none w-1/4 text-xs text-white bg-slate-700 p-4 rounded-l-xl h-screen overflow-y-auto">
          {/* <JSONPretty data= /> */}
          {editor?.getHTML()}
        </div>
      </div>
    </>
  );
}
