import * as graphql from "@nestjs/graphql";
import { TrackingResolverBase } from "./base/tracking.resolver.base";
import { Tracking } from "./base/Tracking";
import { TrackingService } from "./tracking.service";

@graphql.Resolver(() => Tracking)
export class TrackingResolver extends TrackingResolverBase {
  constructor(protected readonly service: TrackingService) {
    super(service);
  }
}
