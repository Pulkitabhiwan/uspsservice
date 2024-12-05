import { Module } from "@nestjs/common";
import { TrackingModuleService } from "./trackingmodule.service";
import { TrackingModuleController } from "./trackingmodule.controller";
import { TrackingModuleResolver } from "./trackingmodule.resolver";

@Module({
  controllers: [TrackingModuleController],
  providers: [TrackingModuleService, TrackingModuleResolver],
  exports: [TrackingModuleService],
})
export class TrackingModuleModule {}
