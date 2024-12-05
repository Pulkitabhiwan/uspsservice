import { TrackingWhereInput } from "./TrackingWhereInput";
import { TrackingOrderByInput } from "./TrackingOrderByInput";

export type TrackingFindManyArgs = {
  where?: TrackingWhereInput;
  orderBy?: Array<TrackingOrderByInput>;
  skip?: number;
  take?: number;
};
