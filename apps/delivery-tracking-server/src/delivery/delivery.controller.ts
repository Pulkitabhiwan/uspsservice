import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { DeliveryService } from "./delivery.service";
import { DeliveryControllerBase } from "./base/delivery.controller.base";

@swagger.ApiTags("deliveries")
@common.Controller("deliveries")
export class DeliveryController extends DeliveryControllerBase {
  constructor(protected readonly service: DeliveryService) {
    super(service);
  }
}
