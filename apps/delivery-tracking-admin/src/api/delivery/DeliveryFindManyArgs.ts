import { DeliveryWhereInput } from "./DeliveryWhereInput";
import { DeliveryOrderByInput } from "./DeliveryOrderByInput";

export type DeliveryFindManyArgs = {
  where?: DeliveryWhereInput;
  orderBy?: Array<DeliveryOrderByInput>;
  skip?: number;
  take?: number;
};
