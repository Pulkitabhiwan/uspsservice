import * as React from "react";
import { Create, SimpleForm, CreateProps, TextInput } from "react-admin";

export const TrackingCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="location" source="location" />
        <TextInput label="trackingId" source="trackingId" />
      </SimpleForm>
    </Create>
  );
};
