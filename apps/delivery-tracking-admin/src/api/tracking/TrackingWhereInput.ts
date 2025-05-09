import { StringFilter } from "../../util/StringFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";

export type TrackingWhereInput = {
  id?: StringFilter;
  location?: StringNullableFilter;
  trackingId?: StringNullableFilter;
};
