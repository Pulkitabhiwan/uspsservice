import { Tracking as TTracking } from "../api/tracking/Tracking";

export const TRACKING_TITLE_FIELD = "location";

export const TrackingTitle = (record: TTracking): string => {
  return record.location?.toString() || String(record.id);
};
