import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DeliveryServiceBase } from "./base/delivery.service.base";

@Injectable()
export class DeliveryService extends DeliveryServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
