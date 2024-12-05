import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { TrackingService } from "./tracking.service";
import { TrackingControllerBase } from "./base/tracking.controller.base";

@swagger.ApiTags("trackings")
@common.Controller("trackings")
export class TrackingController extends TrackingControllerBase {
  constructor(protected readonly service: TrackingService) {
    super(service);
  }
}
