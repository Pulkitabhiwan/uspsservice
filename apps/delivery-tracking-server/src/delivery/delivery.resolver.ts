import * as graphql from "@nestjs/graphql";
import { DeliveryResolverBase } from "./base/delivery.resolver.base";
import { Delivery } from "./base/Delivery";
import { DeliveryService } from "./delivery.service";

@graphql.Resolver(() => Delivery)
export class DeliveryResolver extends DeliveryResolverBase {
  constructor(protected readonly service: DeliveryService) {
    super(service);
  }
}
