import { Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

const TestPluginKey = new PluginKey("test-plugin");

export function testPlugin() {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (view: EditorView, event: MouseEvent) => {
          console.log("handleDOMEvents click view", view);
          console.log("handleDOMEvents click event", event);
        },
      },
    },
    key: TestPluginKey,

    view: () => {
      return {
        update: (view, prevState) => {
          /**
           * Transform class
           *
           * doc: Node
           *    当前文档（即应用了 transform 中 steps 后的结果）。
           *
           * steps: [Step]
           *    transform 中的 steps
           *
           * docs: [Node]
           *    在每个 steps 开始之前的文档们
           *
           * mapping: Mapping
           *    一个 maps 了 transform 中的每一个 steps 的 mapping。
           *
           * before: Node
           *    起始文档。
           *
           * step(step: Step) → this
           *    对当前 transform 应用一个新的 step，然后保存结果。如果应用失败则抛出一个错误。
           *    注: 错误的类叫做「TransformError」。
           *
           * replaceRangeWith(from: number, to: number, node: Node) → this
           *    用给定的 node 替换一个由给定 from 和 to 模糊确定的 range，而不是一个精确的位置。
           *    如果当 from 和 to 相同且都位于父级节点的起始或者结尾位置，而给定的 node 并不适合
           *    此位置的时候，该方法可能将 from 和 to 的范围 扩大 到 超出父级节点以允许给定的 node
           *    被放置，如果给定的 range（from 和 to 形成的）完全覆盖了一个父级节点，则该方法可能完
           *    全替换掉这个父级节点。
           *
           * deleteRange(from: number, to: number) → this
           *    删除给定的 range，会将该 range 扩大到完全覆盖父级节点，直到找到一个有效的替换为止。
           *    注: 有些 range 两侧在不同深度的节点中，因此会先将二者的值扩展到与二者中深度与较小的那个保
           *    持一致以形成完全覆盖一个父级节点的 range。
           *
           * lift(range: NodeRange, target: number) → this
           *    如果 range 内容前后有同级内容，则会将给定 range 从其父级节点中分割，然后将其沿树移动到由target
           *    指定的深度。你可能想要使用 liftTarget 来计算 target，以保证这个沿着树的提升是有效的。
           *
           * wrap(range: NodeRange, wrappers: [{type: NodeType, attrs: ?⁠Object}]) → this
           *    用规定的包裹节点集合来包裹给定的 range。包裹节点们会被假定是适合当前位置的，其应该被 findWrapping
           *    方法合适的计算出来。
           *
           * setBlockType(from: number, to: ?⁠number = from, type: NodeType, attrs: ?⁠Object) → this
           *    将介于 from 和 to 之间的所有的文本块（部分地）设置成带有给定 attributes 的给定的节点类型。
           *
           * setNodeMarkup(pos: number, type: ?⁠NodeType, attrs: ?⁠Object, marks: ?⁠[Mark]) → this
           *    在给定的 pos 处改变节点的类型、attributes、或者/和 marks。如果 type 没有给，则保留当前节点的类型。
           *
           * split(pos: number, depth: ?⁠number = 1, typesAfter: ?⁠[?⁠{type: NodeType, attrs: ?⁠Object}]) → this
           *    分割给定位置的节点，如果传入了 depth 参数，且其大于 1，则任何数量的节点在它之上（？？？）。 默认情
           *    况下，被分割部分的节点类型将会继承原始的节点类型，但是也可以通过传入一个类型数组和 attributes 来在
           *    分割后设置其上。
           *
           * join(pos: number, depth: ?⁠number = 1) → this
           *    将给定位置周围的块级元素连接起来。如果深度是 2，它们最后和第一个同级节点也会被连接，以此类推。
           *    当新建一个 transform 或者决定能否新建一个 transform 的时候，下面几个工具函数非常有用。
           *
           * replaceStep(doc: Node, from: number, to: ?⁠number = from, slice: ?⁠Slice = Slice.empty) → ?⁠Step
           *    将一个 slice 「恰当的」放到文档中给定的位置，会生成一个进行插入操作的 step。如果没有一个有意义的途径
           *    来插入该 slice，或者插入的 slice 没有意义（比如一个空的 slice 带着空的 range）则返回 null。
           *
           * liftTarget(range: NodeRange) → ?⁠number
           *    尝试寻找一个目标深度以让给定的 range 内的内容可以被提升（深度）。不会考虑有属性 isolating 存在的父级节点。
           *
           * findWrapping(range: NodeRange, nodeType: NodeType, attrs: ?⁠Object, innerRange: ?⁠NodeRange = range)
           *    → ?⁠[{type: NodeType, attrs: ?⁠Object}]
           *    尝试找到一个有效的方式来用给定的节点类型包裹给定 range 的内容。如果必要的话，可能会在包裹节点的内部和周
           *    围生成额外的节点。 如果没有可用的包裹方式则返回 null。当 innerRange 给定的时候，该 range 的内容将会被作
           *    为被包裹的内容，而不是 range 的内容。
           *
           * canSplit(doc: Node, pos: number, depth: ?⁠number = 1, typesAfter: ?⁠[?⁠{type: NodeType, attrs: ?⁠Object}])
           *    → bool
           *    检查给定的位置是否允许分割。
           *
           * canJoin(doc: Node, pos: number) → bool
           *    测试在给定位置之前或者之后的块级节点是否可以被连接起来。
           *
           * joinPoint(doc: Node, pos: number, dir: ?⁠number = -1) → ?⁠number
           *    寻找一个给定位置的祖先节点，该节点可以被连接到块级节点之前（或者之后，如果 dir 是正的话）.
           *    如果找到，返回这个可加入的位置。
           *
           * insertPoint(doc: Node, pos: number, nodeType: NodeType) → ?⁠number
           *    当 pos 本身不是有效的位置但位于节点的起始或结尾处时，通过搜索节点的层级结构，尝试找到一个可以
           *    在给定位置的节点附近插入给定节点类型的点。 如果找不到位置，则返回 null。
           *
           * dropPoint(doc: Node, pos: number, slice: Slice) → ?⁠number
           *    寻找一个位置在给定的位置或者附近，以让给定的 slice能够插入。即使原始的位置并不直接在父级节点的
           *    起始或者结束位置， 也会尝试查看父级节点最近的边界然后尝试插入。如果找不到位置，则返回 null。
           */
          // view.state.tr

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
