import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ContactInfoServiceBase } from "./base/contactInfo.service.base";

@Injectable()
export class ContactInfoService extends ContactInfoServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
