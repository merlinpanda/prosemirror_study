import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { undo, redo, history } from "prosemirror-history";
// keymap 插件, 它用来绑定键盘输入的 actions.
import { keymap } from "prosemirror-keymap";

// prosemirror-commands 这个包提供了很多基本的编辑 commands,
// 包括在编辑器中按照你的期望映射 enter 和 delete 按键的行为.
import { baseKeymap } from "prosemirror-commands";
import { useRef, useEffect, useState } from "react";

import { testPlugin } from "./plugins/test-plugin";

// JSON美化
import JSONPretty from "react-json-pretty";

function App() {
  const editorBox = useRef(null);
  const [content, setContent] = useState({});

  useEffect(() => {
    if (editorBox.current) {
      const state = EditorState.create({
        schema,

        // Plugins 会在创建 state 的时候被注册(因为它们需要访问 state 的 transactions 的权限).
        plugins: [
          history(),
          testPlugin(),
          keymap({
            // 大多数的编辑行为都会被写成 commands 的形式，因此可以被绑定到
            // 特定的键上, 以供编辑菜单调用, 或者暴露给用户来操作
            "Mod-z": undo,
            "Mod-y": redo,
          }),

          keymap(baseKeymap),
        ],
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

          // 获取编辑器结构内容
          setContent(editor.state.doc.toJSON());

          // 当这是一个原子时，即当它没有直接可编辑的内容时，则为 true。
          // 这通常与 `isLeaf` 相同，但可以使用节点规范上的 [`atom` 属性] 进行配置
          //（通常在节点显示为不可编辑的 [节点视图] 时使用）
          console.log("isAtom", transaction.doc.isAtom);

          // isBlock 和 isInline 告诉你这个 node 是一个 block 类型的 node(类似 div)还是一个 inline 的 node(类似 span).
          console.log("isInline", transaction.doc.isInline);
          console.log("isBlock", transaction.doc.isBlock);

          // inlineContent 为 true 表示该 node 只接受 inline 元素作为 content
          // (可以通过判断此节点来决定下一步是否往里面加 inline node or not)
          console.log("inlineContent", transaction.doc.inlineContent);

          // isTextBlock 为 true 表示这个 node 是个含有 inline content 的 block nodes.
          console.log("isTextBlock ", transaction.doc.isTextblock);

          // isLeaf 为 true 表示该 node 不允许含有任何 content.
          console.log("isLeaf", transaction.doc.isLeaf);
        },
      });

      return () => {
        editor.destroy();
      };
    }
  }, []);

  return (
    <>
      <div className="flex flex-row">
        <div className="p-6 flex-grow">
          <div>
            <div
              className="border border-slate-200 rounded p-2"
              ref={editorBox}
            ></div>
          </div>
        </div>
        <div className="flex-none w-1/4 h-screen bg-slate-800 rounded-l-lg p-6 text-white">
          <h1 className="text-lg font-bold">Doc JSON</h1>
          <div className="mt-4 text-xs">
            <JSONPretty id="json-pretty" data={content}></JSONPretty>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
