import { SortOrder } from "../../util/SortOrder";

export type TrackingOrderByInput = {
  createdAt?: SortOrder;
  id?: SortOrder;
  location?: SortOrder;
  trackingId?: SortOrder;
  updatedAt?: SortOrder;
};
