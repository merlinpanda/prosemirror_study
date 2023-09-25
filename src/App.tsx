// import { schema } from "prosemirror-schema-basic";
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
import { Schema } from "prosemirror-model";

function App() {
  const editorBox = useRef(null);
  const [content, setContent] = useState({});

  useEffect(() => {
    if (editorBox.current) {
      const state = EditorState.create({
        schema: new Schema({
          nodes: {
            doc: {
              content: "block+",
            },
            paragraph: {
              group: "block",
              content: "text*",
              toDOM() {
                return ["div", 0];
              },
              marks: "_",
            },
            heading: { group: "block", content: "text*", marks: "" },
            text: { inline: true },
          },
          marks: {
            strong: {},
            em: {
              parseDOM: [
                /**
                 * ParseRule interface
                 * tag: ?⁠string
                 *    一个描述了需要匹配那种 DOM 元素的 CSS 选择器。每个 rule 都应该有一个 tag 属性 或者 style 属性。
                 * namespace: ?⁠string
                 *    需要匹配的命名空间。应该和 tag 一起使用。只有命名空间匹配之后或者为 null 表示没有命名空间，才会开始匹配节点。
                 * style: ?⁠string
                 *    需要匹配的 CSS 属性名。如果给定的话，这个 rule 将会匹配包含该属性的行内样式。 也可以是 "property=value"
                 *    的形式，这种情况下 property 的值完全符合给定值时 rule 才会匹配。 （对于更复杂的过滤方式，使用 getAttrs，
                 *    然后返回 false 表示匹配失败。）
                 * priority: ?⁠number
                 *    可以使用它来提升 schema 中 parse rule 的优先级顺序。更高优先级的更先被 parse。 没有优先级设置的 rule
                 *    则被默认设置一个 50 的优先级。该属性只在 schema 中才有意义。 而在直接构造一个 parser 的时候使用的是
                 *    rule 数组的顺序。
                 * consuming: ?⁠boolean
                 *    默认情况下，如果一个 rule 匹配了一个元素或者样式，那么就不会进一步的匹配接下来的 rule 了。 而通过设置该
                 *    参数为 false，你可以决定即使当一个 rule 匹配了，在该 rule 之后的 rule 也依然会运行一次。
                 * context: ?⁠string
                 *    如果设置了该属性，则限制 rule 只匹配给定的上下文表达式，该上下文即为被 parsed 的内容所在的父级节点。
                 *    应该包含一个或者多个节点名或者节点 group 名，用一个或者两个斜杠结尾。例如 "paragraph/" 表示只有当
                 *    父级节点是段落的时候才会被匹配， "blockquote/paragraph/" 限制只有在一个 blockquote 中的一个段落
                 *    中才会被匹配，"section//" 表示匹配在一个 section 中的任何位置--一个双斜线表示匹配 任何祖先节点序列。
                 *    为了允许多个不同的上下文，它们可以用 | 分隔，比如 "blockquote/|list_item/"。
                 * node: ?⁠string
                 *    当 rule 匹配的时候，将要创建的节点类型的名字。仅对带有 tag 属性的 rules 可用，对样式 rule 无效。 每个
                 *    rule 应该有 node、mark、ignore 属性的其中一个（除非是当 rule 出现在一个 node 或者 mark spec 中时，
                 *    在这种情况下，node 或者 mark 属性将会从它的位置推断出来）。
                 * mark: ?⁠string
                 *    包裹匹配内容的 mark 类型的名字。
                 * ignore: ?⁠bool
                 *    如果是 true，则当前 rule 的内容会被忽略。
                 * closeParent: ?⁠bool
                 *    如果是 true，则会在寻找匹配该 rule 的元素的时候关闭当前节点。
                 * skip: ?⁠bool
                 *    如果是 true，则会忽略匹配当前规则的节点，但是会 parse 它的内容。
                 * attrs: ?⁠Object
                 *    由该 rule 创建的节点或者 mark 的 attributes。如果 getAttrs 存在的话，getAttrs 优先。
                 * getAttrs: ?⁠fn(dom.Node | string) → ?⁠Object | false
                 *    用来计算由当前 rule 新建的节点或者 mark 的 attributes。也可以用来描述进一步 DOM 元素或者行内样式匹配的
                 *    话需要满足的条件。 当它返回 false，则 rule 不会匹配。当它返回 null 或者 undefined，则被当成是一个空的/默
                 *    认的 attributes 集合。
                 *    对于 tag rule 来说该方法参数是一个 DOM 元素，对于 style rule 来说参数是一个字符串（即行内样式的值）
                 * contentElement: ?⁠string | fn(dom.Node) → dom.Node
                 *    对于 tag rule 来说，其产生一个非叶子节点的 node 或者 marks，默认情况下 DOM 元素的内容被 parsed 作为该
                 *    mark 或者 节点的内容。如果子节点在一个子孙节点中，则这个可能是一个 CSS 选择器字符串， parser 必须使用它以
                 *    寻找实际的内容元素，或者是一个函数， 为 parser 返回实际的内容元素。
                 * getContent: ?⁠fn(dom.Node, schema: Schema) → Fragment
                 *    如果设置了该方法，则会使用函数返回的结果来作为匹配节点的内容，而不是 parsing 节点的子节点。
                 * preserveWhitespace: ?⁠bool | "full"
                 *    控制当 parsing 匹配元素的内容的时候，空白符是否应该保留。false 表示空白符应该不显示， true 表示空白符应该不
                 *    显示但是换行符会被换成空格，"full" 表示换行符也应该被保留。
                 */
                { tag: "em" }, // Match <em> nodes
                { tag: "i" }, // and <i> nodes
                { style: "font-style=italic" }, // and inline 'font-style: italic'
              ],
            },
          },
        }),

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
              className="border border-slate-200 rounded p-2 bg-slate-100"
              ref={editorBox}
            ></div>
          </div>
        </div>
        <div className="flex-none w-1/4 h-screen overflow-y-auto bg-slate-800 rounded-l-lg p-6 text-white">
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
