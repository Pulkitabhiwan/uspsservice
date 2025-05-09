import * as React from "react";
import { Edit, SimpleForm, EditProps, TextInput } from "react-admin";

export const DeliveryEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="status" source="status" />
        <TextInput label="trackingId" source="trackingId" />
      </SimpleForm>
    </Edit>
  );
};
