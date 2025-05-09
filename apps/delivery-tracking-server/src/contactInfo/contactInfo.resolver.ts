import * as graphql from "@nestjs/graphql";
import { ContactInfoResolverBase } from "./base/contactInfo.resolver.base";
import { ContactInfo } from "./base/ContactInfo";
import { ContactInfoService } from "./contactInfo.service";

@graphql.Resolver(() => ContactInfo)
export class ContactInfoResolver extends ContactInfoResolverBase {
  constructor(protected readonly service: ContactInfoService) {
    super(service);
  }
}
