import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as errors from "../errors";
import { TrackingModuleService } from "./trackingmodule.service";

@swagger.ApiTags("trackingModules")
@common.Controller("trackingModules")
export class TrackingModuleController {
  constructor(protected readonly service: TrackingModuleService) {}
}
