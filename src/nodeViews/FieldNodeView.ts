import type { Node } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";
import type { ElementNodeView } from "./ElementNodeView";
import { FieldType } from "./ElementNodeView";

/**
 * A NodeView (https://prosemirror.net/docs/ref/#view.NodeView) representing a
 * node that contains fields that are updated atomically.
 */
export abstract class FieldNodeView<Fields extends unknown>
  implements ElementNodeView<Fields> {
  public static propName: string;
  public static fieldType = FieldType.ATTRIBUTES;
  // The parent DOM element for this view. Public
  // so it can be mounted by consuming elements.
  public nodeViewElement = document.createElement("div");

  constructor(
    // The node that this NodeView is responsible for rendering.
    protected node: Node,
    // The outer editor instance. Updated from within this class when the inner state changes.
    protected outerView: EditorView,
    // Returns the current position of the parent Nodeview in the document.
    protected getPos: () => number,
    // The offset of this node relative to its parent NodeView.
    protected offset: number,
    defaultFields: Fields
  ) {
    this.createInnerView(node.attrs.fields || defaultFields);
  }

  public getNodeValue(node: Node): Fields {
    return node.attrs.fields as Fields;
  }

  public getNodeFromValue(fields: Fields): Node {
    return this.node.type.create({ fields });
  }

  protected abstract createInnerView(fields: Fields): void;

  protected abstract updateInnerView(fields: Fields): void;

  public update(node: Node, elementOffset: number) {
    if (!node.sameMarkup(this.node)) {
      return false;
    }

    this.offset = elementOffset;

    this.updateInnerView(node.attrs as Fields);

    return true;
  }

  public destroy() {
    // Nothing to do – the DOM element is garbage collected.
  }

  /**
   * Update the outer editor with a new field state.
   */
  protected updateOuterEditor(fields: Fields) {
    const outerTr = this.outerView.state.tr;
    // When we insert content, we must offset to account for a few things:
    //  - getPos() returns the position directly before the parent node (+1)
    const contentOffset = 1;
    const nodePos = this.getPos() + this.offset + contentOffset;
    outerTr.setNodeMarkup(nodePos, undefined, {
      fields,
    });

    const shouldUpdateOuter = outerTr.docChanged;

    if (shouldUpdateOuter) this.outerView.dispatch(outerTr);
  }
}
