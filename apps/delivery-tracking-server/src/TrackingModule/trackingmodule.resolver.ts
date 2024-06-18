import * as graphql from "@nestjs/graphql";
import { TrackingModuleService } from "./trackingmodule.service";

export class TrackingModuleResolver {
  constructor(protected readonly service: TrackingModuleService) {}
}
