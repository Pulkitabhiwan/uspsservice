import * as React from "react";
import { Edit, SimpleForm, EditProps, TextInput } from "react-admin";

export const TrackingEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="location" source="location" />
        <TextInput label="trackingId" source="trackingId" />
      </SimpleForm>
    </Edit>
  );
};
