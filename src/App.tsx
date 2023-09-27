import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";
import { Document } from "./plugins/document";
import { UniqueID } from "./plugins/block";
import { Paragraph } from "./plugins/paragraph";
import { Hash } from "./plugins/hash";
import { Text } from "./plugins/text";
import { useState } from "react";
import Git from "./utils/git";
import JSONPretty from "react-json-pretty";
import { Heading } from "@tiptap/extension-heading";
import { Bold } from "@tiptap/extension-bold";
import { Comment } from "./plugins/comment";
// import { BubbleMenu } from '@tiptap/extension-bubble-menu';

export default function App() {
  const [value, setValue] = useState("");

  const editor = useEditor({
    editable: true,
    extensions: [
      Document,
      Bold,
      UniqueID.configure({
        types: ["paragraph", "image", "heading"],
      }),
      Hash.configure({
        types: ["paragraph", "image", "heading"],
        generateHash: (content: string) => Git.calculateHash(content),
      }),
      Comment,
      Paragraph,
      Text,
      Heading,
    ],
    content: `
    <div data-block-id="0a0c7f8a-39c9-4dc7-a9da-ecb402eacaf5" data-hash="c93f9ea79a6cce1b59cad8ba575b8485562053d8">this is hash %asdlasdasdsaddasd</div><div data-block-id="3861bb20-2f35-41ca-9533-72fbeaf40c52" data-hash="81b03af9b6c8737a2be232a059c5cc829f9d7790">a</div><div data-block-id="34f05a54-1a15-4638-9d8d-1c8f19af4a66" data-hash="8144c46e2db4682adb180bf0389965bfc503690a">asdasdasdaqwe</div><div data-block-id="3d85bec3-4958-4af3-9de7-247082c6a28c" data-hash="d744181cbf3959ab0cf722e9f567887f62d43bc3">qweqw</div>
    `,
  });

  return (
    <>
      <div className="flex flex-row">
        <div className="flex-grow p-4">
          <div className="">
            {editor && (
              <BubbleMenu editor={editor}>
                <button
                  className="px-3 py-1 rounded bg-slate-100"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  加粗
                </button>
                <button
                  className="px-3 py-1 rounded bg-slate-100"
                  onClick={() =>
                    editor.chain().focus().setTemporaryComment().run()
                  }
                >
                  评论
                </button>
                <button
                  className="px-3 py-1 rounded bg-slate-100"
                  onClick={() => editor.chain().focus().unsetComment().run()}
                >
                  取消评论
                </button>
                <button
                  className="px-3 py-1 rounded bg-slate-100"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setComment(new Date().getTime().toString())
                      .run()
                  }
                >
                  设置评论
                </button>
              </BubbleMenu>
            )}
          </div>
          <EditorContent editor={editor} className="bg-slate-200 p-4 rounded" />
          <div className="">Hash生成器</div>
          <div className="flex flex-row gap-4">
            <input
              type="text"
              className="border border-slate-200 p-2 rounded focus:outline-0"
              onChange={(e) => {
                const v = e.target.value;
                setValue(v);
                console.log(v, v.length);
              }}
            />
            {Git.calculateHash(value)}
          </div>
        </div>
        <div className="flex-none w-1/4 text-xs text-white bg-slate-700 p-4 rounded-l-xl h-screen overflow-y-auto">
          <JSONPretty data={editor?.getJSON()} />
        </div>
      </div>
    </>
  );
}
