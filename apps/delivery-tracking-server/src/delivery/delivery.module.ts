import { Module } from "@nestjs/common";
import { DeliveryModuleBase } from "./base/delivery.module.base";
import { DeliveryService } from "./delivery.service";
import { DeliveryController } from "./delivery.controller";
import { DeliveryResolver } from "./delivery.resolver";

@Module({
  imports: [DeliveryModuleBase],
  controllers: [DeliveryController],
  providers: [DeliveryService, DeliveryResolver],
  exports: [DeliveryService],
})
export class DeliveryModule {}
