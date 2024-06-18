import { ContactInfoWhereInput } from "./ContactInfoWhereInput";
import { ContactInfoOrderByInput } from "./ContactInfoOrderByInput";

export type ContactInfoFindManyArgs = {
  where?: ContactInfoWhereInput;
  orderBy?: Array<ContactInfoOrderByInput>;
  skip?: number;
  take?: number;
};
