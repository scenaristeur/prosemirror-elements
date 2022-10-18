import { Column, Columns } from "@guardian/src-layout";
import React from "react";
import { FieldWrapper } from "../../editorial-source-components/FieldWrapper";
import { FieldLayoutVertical } from "../../editorial-source-components/VerticalFieldLayout";
import { createReactElementSpec } from "../../renderers/react/createReactElementSpec";
import { CustomDropdownView } from "../../renderers/react/customFieldViewComponents/CustomDropdownView";
import { ldFields } from "./LdSpec";

export const LdElementTestId = "LdElement";

export const ldElement = createReactElementSpec(
  ldFields,
  ({ fields }) => {
    // It is necessary to filter errors for the HTML field as we have two overlapping length check validators.
    // We only want to show the smaller length check "warning" instead of the higher length check "error".
    // The desired behaviour is to display a "WARN" level error if there is one, otherwise show what's found.
    const htmlErrors = fields.html.errors.length
    ? [
      fields.html.errors.reduce((acc, cur) => {
        if (acc.level === "WARN") {
          return acc;
        } else {
          return cur;
        }
      }),
    ]
    : [];

    return (
      <div data-cy={LdElementTestId}>

      <Columns>
      <Column width={1 / 4}>
      <FieldWrapper
      headingLabel="Subject"
      field={fields.subject}
      />
      </Column>

      <Column width={1 / 4}>
      <FieldWrapper
      headingLabel="predicate"
      field={fields.predicate}
      />
      </Column>

      <Column width={1 / 4}>
      <FieldWrapper
      headingLabel="Object"
      field={fields.object}
      />
      </Column>

      <Column width={1 / 4}>
      <FieldWrapper
      headingLabel="graph"
      field={fields.graph}
      />
      </Column>

      </Columns>


      <Columns>
      <Column width={2 / 3}>
      <FieldWrapper
      headingLabel="Pullquote"
      field={fields.html}
      errors={htmlErrors}
      />
      </Column>
      <Column width={1 / 3}>
      <FieldLayoutVertical>
      <FieldWrapper
      headingLabel="Attribution"
      field={fields.attribution}
      />
      <CustomDropdownView label="Weighting" field={fields.role} />
      </FieldLayoutVertical>
      </Column>
      </Columns>
      </div>
    );
  }
);