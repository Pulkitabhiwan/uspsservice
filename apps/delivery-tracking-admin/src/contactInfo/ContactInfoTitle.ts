import { ContactInfo as TContactInfo } from "../api/contactInfo/ContactInfo";

export const CONTACTINFO_TITLE_FIELD = "phoneNumber";

export const ContactInfoTitle = (record: TContactInfo): string => {
  return record.phoneNumber?.toString() || String(record.id);
};
