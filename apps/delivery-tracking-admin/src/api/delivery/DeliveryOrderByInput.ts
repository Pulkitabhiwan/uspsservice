import { SortOrder } from "../../util/SortOrder";

export type DeliveryOrderByInput = {
  createdAt?: SortOrder;
  id?: SortOrder;
  status?: SortOrder;
  trackingId?: SortOrder;
  updatedAt?: SortOrder;
};
