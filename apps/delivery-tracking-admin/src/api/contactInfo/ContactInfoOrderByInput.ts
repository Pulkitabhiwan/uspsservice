import { SortOrder } from "../../util/SortOrder";

export type ContactInfoOrderByInput = {
  createdAt?: SortOrder;
  id?: SortOrder;
  phoneNumber?: SortOrder;
  updatedAt?: SortOrder;
};
