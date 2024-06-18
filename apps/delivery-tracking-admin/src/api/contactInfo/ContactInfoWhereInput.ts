import { StringFilter } from "../../util/StringFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";

export type ContactInfoWhereInput = {
  id?: StringFilter;
  phoneNumber?: StringNullableFilter;
};
