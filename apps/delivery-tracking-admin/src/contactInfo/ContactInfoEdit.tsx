import * as React from "react";
import { Edit, SimpleForm, EditProps, TextInput } from "react-admin";

export const ContactInfoEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="phoneNumber" source="phoneNumber" />
      </SimpleForm>
    </Edit>
  );
};
