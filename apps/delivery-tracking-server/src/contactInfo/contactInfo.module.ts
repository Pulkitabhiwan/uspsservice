import { Module } from "@nestjs/common";
import { ContactInfoModuleBase } from "./base/contactInfo.module.base";
import { ContactInfoService } from "./contactInfo.service";
import { ContactInfoController } from "./contactInfo.controller";
import { ContactInfoResolver } from "./contactInfo.resolver";

@Module({
  imports: [ContactInfoModuleBase],
  controllers: [ContactInfoController],
  providers: [ContactInfoService, ContactInfoResolver],
  exports: [ContactInfoService],
})
export class ContactInfoModule {}
