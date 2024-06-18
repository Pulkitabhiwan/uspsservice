import { Module } from "@nestjs/common";
import { TrackingModuleBase } from "./base/tracking.module.base";
import { TrackingService } from "./tracking.service";
import { TrackingController } from "./tracking.controller";
import { TrackingResolver } from "./tracking.resolver";

@Module({
  imports: [TrackingModuleBase],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingResolver],
  exports: [TrackingService],
})
export class TrackingModule {}
