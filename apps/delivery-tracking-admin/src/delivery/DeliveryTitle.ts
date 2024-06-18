import { Delivery as TDelivery } from "../api/delivery/Delivery";

export const DELIVERY_TITLE_FIELD = "status";

export const DeliveryTitle = (record: TDelivery): string => {
  return record.status?.toString() || String(record.id);
};
