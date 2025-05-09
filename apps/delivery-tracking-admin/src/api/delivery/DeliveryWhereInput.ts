import { StringFilter } from "../../util/StringFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";

export type DeliveryWhereInput = {
  id?: StringFilter;
  status?: StringNullableFilter;
  trackingId?: StringNullableFilter;
};
