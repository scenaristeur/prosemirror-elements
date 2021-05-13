import OrderedMap from "orderedmap";
import type { NodeSpec, Schema } from "prosemirror-model";
import type { EditorState, Transaction } from "prosemirror-state";
import { buildCommands, defaultPredicate } from "./helpers";
import { createPlugin } from "./plugin";
import type { ElementProps, TEmbed } from "./types/Embed";
import type { TFields } from "./types/Fields";

export const build = <Props extends ElementProps, Name extends string>(
  embedSpec: Array<TEmbed<Props, Name>>,
  predicate = defaultPredicate
) => {
  const typeNames = embedSpec.map((_) => _.name);

  const insertEmbed = (type: Name, fields: TFields) => (
    state: EditorState,
    dispatch: (tr: Transaction<Schema>) => void
  ): void => {
    if (!typeNames.includes(type)) {
      throw new Error(
        `[prosemirror-embeds]: ${type} is not recognised. Only ${typeNames.join(
          ", "
        )} can be added`
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- we cannot be sure the schema has been amended
    if (!(state.schema as Schema).nodes[type]) {
      console.log(state.schema);
      throw new Error(
        `[prosemirror-embeds]: ${type} is not included in the state schema. Did you add the NodeSpec generated by this plugin to the schema?`
      );
    }
    const newNode = (state.schema as Schema).nodes[type].createAndFill({
      type,
      fields,
    });
    if (newNode) {
      dispatch(state.tr.replaceSelectionWith(newNode));
    } else {
      // This shouldn't happen, as the schema should always be able to fill
      // the node with correct children if we're not supplying content –
      // see https://prosemirror.net/docs/ref/#model.NodeType.createAndFill
      console.warn(`[prosemirror-embeds]: could not create node for ${type}`);
    }
  };

  const plugin = createPlugin(embedSpec, buildCommands(predicate));
  const nodeSpec = embedSpec
    .map((embed) => embed.nodeSpec)
    .reduce((acc, spec) => acc.append(spec), OrderedMap.from<NodeSpec>({}));

  return {
    insertEmbed,
    hasErrors: (state: EditorState) => plugin.getState(state).hasErrors,
    plugin,
    nodeSpec,
  };
};
