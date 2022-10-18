import { createCustomDropdownField } from "../../plugin/fieldViews/CustomFieldView";
import { createTextField } from "../../plugin/fieldViews/TextFieldView";
import { maxLength, required } from "../../plugin/helpers/validation";
import { useTyperighterAttrs } from "../helpers/typerighter";

export const ldFields = {
  html: createTextField({
    rows: 4,
    validators: [
      required("Linked Data cannot be empty"),
      //To display a warning to users
      maxLength(120, undefined, "WARN"),
      //To prevent publication
      maxLength(1000, "Linked Data is too long", "ERROR"),
    ],
    absentOnEmpty: true,
    placeholder: "Enter a pull quote here…",
    attrs: useTyperighterAttrs,
  }),
  attribution: createTextField({
    absentOnEmpty: true,
    placeholder: "Enter attribution here…",
  }),
  role: createCustomDropdownField("supporting", [
    { text: "supporting (default)", value: "supporting" },
    { text: "inline", value: "inline" },
    { text: "showcase", value: "showcase" },
  ]),

  subject: createTextField({
    absentOnEmpty: true,
    placeholder: "Enter subject here…",

  }),

  predicate: createTextField({
    absentOnEmpty: true,
    placeholder: "Enter predicate here…",
    validators: [
      required("predicate cannot be empty")
    ],
  }),

  object: createTextField({
    absentOnEmpty: true,
    placeholder: "Enter object here…",
    validators: [
      required("Object cannot be empty")
    ],
  }),

  graph: createTextField({
    absentOnEmpty: true,
    placeholder: "Enter graph here…",
  }),





};
