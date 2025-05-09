import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { ContactInfoService } from "./contactInfo.service";
import { ContactInfoControllerBase } from "./base/contactInfo.controller.base";

@swagger.ApiTags("contactInfos")
@common.Controller("contactInfos")
export class ContactInfoController extends ContactInfoControllerBase {
  constructor(protected readonly service: ContactInfoService) {
    super(service);
  }
}
