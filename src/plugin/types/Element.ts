import type { Schema } from "prosemirror-model";
import type {
  CheckboxField,
  CheckboxFieldView,
} from "../fieldViews/CheckboxFieldView";
import type {
  CustomField,
  CustomFieldView,
} from "../fieldViews/CustomFieldView";
import type {
  DropdownField,
  DropdownFieldView,
} from "../fieldViews/DropdownFieldView";
import type { FieldView } from "../fieldViews/FieldView";
import type {
  FieldNameToValueMap,
  FieldTypeToViewMap,
} from "../fieldViews/helpers";
import type {
  RichTextField,
  RichTextFieldView,
} from "../fieldViews/RichTextFieldView";
import type { TextField, TextFieldView } from "../fieldViews/TextFieldView";
import type { CommandCreator } from "./Commands";

export type Field =
  | TextField
  | RichTextField
  | CheckboxField
  | CustomField
  | DropdownField;

export type FieldSpec<Names extends string> = Record<Names, Field>;

export type SchemaFromElementFieldSpec<
  FSpec extends FieldSpec<string>
> = Schema<Extract<keyof FSpec, string>>;

export type FieldViews =
  | TextFieldView
  | RichTextFieldView
  | CheckboxFieldView
  | CustomFieldView
  | DropdownFieldView;

export type NonCustomFieldViews =
  | TextFieldView
  | RichTextFieldView
  | CheckboxFieldView;

export interface FieldViewSpec<F> {
  fieldView: F;
  fieldSpec: Field;
  name: string;
  update: (value: F extends FieldView<infer Value> ? Value : never) => void;
}

export interface CustomFieldViewSpec<Data = unknown, Props = unknown>
  extends FieldViewSpec<CustomFieldView<Data>> {
  fieldSpec: CustomField<Data, Props>;
}

export type FieldNameToFieldViewSpec<FSpec extends FieldSpec<string>> = {
  [name in Extract<keyof FSpec, string>]: FSpec[name] extends CustomField<
    infer Data,
    infer Props
  >
    ? CustomFieldViewSpec<Data, Props>
    : FieldViewSpec<FieldTypeToViewMap<FSpec[name]>[FSpec[name]["type"]]>;
};

export type ElementSpec<FSpec extends FieldSpec<string>> = {
  fieldSpec: FSpec;
  createUpdator: (
    dom: HTMLElement,
    fields: FieldNameToFieldViewSpec<FSpec>,
    updateState: (
      fields: FieldNameToValueMap<FSpec>,
      hasErrors: boolean
    ) => void,
    initFields: FieldNameToValueMap<FSpec>,
    commands: ReturnType<CommandCreator>
  ) => (
    fields: FieldNameToValueMap<FSpec>,
    commands: ReturnType<CommandCreator>
  ) => void;
};

export type ElementSpecMap<
  FSpec extends FieldSpec<string>,
  ElementNames extends string
> = Record<ElementNames, ElementSpec<FSpec>>;

export type ExtractFieldValues<ESpec> = ESpec extends ElementSpec<infer F>
  ? FieldNameToValueMap<F>
  : never;

// Construct a union of the possible element data values from an ElementSpec.
export type ExtractDataTypeFromElementSpec<T, U> = U extends keyof T
  ? {
      elementName: U;
      values: ExtractFieldValues<T[U]>;
    }
  : never;

export type ExtractPartialDataTypeFromElementSpec<T, U> = U extends keyof T
  ? {
      elementName: U;
      values: Partial<ExtractFieldValues<T[U]>>;
    }
  : never;
