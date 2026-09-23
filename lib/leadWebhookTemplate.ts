// Payload shape mirrors the destination workflow's expected JSON 1:1 (see
// project notes). Most keys come from a multi-purpose CRM form template and
// do not apply to this site; they stay blank. Only the fields the receiving
// webhook actually reads are populated from real submission data.
export type LeadWebhookInput = {
  salutation: string;
  fullName: string;
  /** C&I only — blank on residential/EV submissions. */
  companyName: string;
  phone: string;
  email: string;
  state: string;
  monthlyBillRange: string;
  propertyType: string;
  electricSupply: string;
  /** C&I only — blank on residential/EV submissions. */
  industry: string;
  /** C&I only — blank on residential/EV submissions. */
  roleInOrganization: string;
  preferredLanguage: string;
  sourceOfLeads: string;
  campaignId: string;
  gclid: string;
  fbclid: string;
  /** Full UTM breakdown behind campaignId — persisted first-touch attribution (see lib/attribution.ts). */
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  /** Which of our own landing pages this lead was submitted from (e.g. "MAQO Main Site", "MAQO EV Landing Page"). */
  sourcePage: string;
  remarks: string;
  /** The clean landing page URL the visitor actually landed on (e.g. "https://get.maqo.asia", "https://get.maqo.asia/ev") — no query strings. */
  landingPageSource: string;
};

function blankTemplate() {
  return {
    "MAQO": "",
    "Preferred Appointment Date:": "",
    "Marital Status:": "",
    "What makes you a suitable candidate for this position?": "",
    "Identification Card (IC) Upload ": "",
    " Description of the Issue:": "",
    "Do you have any specific health coverage needs or preferences?": "",
    "Electric Bill (RM)": "",
    "Billing Address - City": "",
    "Which services are you requesting?": "",
    "Date of Service:": "",
    "Billing Address - State": "",
    "Billing Address - Zip Code": "",
    "Upload Resume": "",
    "Type of Business": "",
    "Business Name": "",
    "Site Location": "",
    "Job Scope": "",
    "Preferred Communication Language 2": "",
    "Vehicle Make:": "",
    "Billing Address - Full Address": "",
    "Billing Address - Phone Number": "",
    "Preferred Contact Method:": "",
    "Monthly Electric Bill (RM)": "",
    "Attach any relevant photos or documents related to the service request (if applicable).": "",
    "What additional solar services are you interested in?": "",
    "consultant": "",
    "Why do you want to work with our company?": "",
    "Gender:": "",
    "Do you currently have a solar system installed?": "",
    "Any Additional Comments, Questions Or Special Requests?": "",
    "How did you hear about us?": "",
    "Position Applied": "",
    " Type of Service Needed (Check all that apply):": "",
    "follower": "",
    "Preferred Date:": "",
    "Type of Coverage Needed:": "",
    "Occupation": "",
    "Identification Card (IC)": "",
    "Years in Operation": "",
    "Property Type (Condo/Apartment not suitable)": "",
    "What is your role in this  organization?": "",
    "What solution are you interested in?": "",
    "Brief description of your situation": "",
    "Location/Address": "",
    "Preferred Communication Language 1": "",
    "salespartner": "",
    "Details": "",
    "Tell Us Your Skincare Needs": "",
    "If yes, please specify:": "",
    "Interested": "",
    " Type of Service Request:": "",
    "Existing Customer": "",
    "File Upload 498q": "",
    "Phone Number": "",
    "Position Applied For": "",
    "What best describes your current stage in the solar energy journey? ": "",
    "Do you have any pre-existing health conditions?": "",
    "Message": "",
    "Multi Dropdown 1tw9": "",
    "Remarks": "",
    "Preferred Appointment Time:": "",
    "Monthly Electric Bills (RM)": "",
    "Campaign ID": "",
    "Location": "",
    "What type of real estate service are you interested in?": "",
    "Position": "",
    "Billing Address - Country": "",
    "sprecruit": "",
    "Signature 19ei": "",
    "Salutation": "",
    "Nationality": "",
    "bizpartner": "",
    "If yes, please provide details:  System size, Installation date, & Manufacturer": "",
    "Billing Address - Full Name": "",
    "How can we help?": "",
    "Primary Care Physician:": "",
    "Description of Request:": "",
    "Vehicle Model:": "",
    "Graduation Date": "",
    "Vehicle Year:": "",
    "Preferred Communication Language": "",
    "Industry": "",
    "Additional Notes": "",
    "Current Job Status": "",
    "Electric Supply": "",
    "Name of Company": "",
    "referrer": "",
    "Attachment": "",
    "Type of Service Needed - Check all that apply": "",
    "staff": "",
    "Electric Bills (RM)": "",
    "referer": "",
    "Preferred time slots": "",
    "Product Category": "",
    "contact_id": "",
    "first_name": "",
    "last_name": "",
    "full_name": "",
    "email": "",
    "phone": "",
    "tags": "",
    "country": "",
    "timezone": "",
    "date_created": "",
    "contact_source": "",
    "full_address": "",
    "contact_type": "",
    "gclid": "",
    "location": {},
    "workflow": {},
    "triggerData": {},
    "contact": {},
    "attributionSource": {},
    "customData": {
      "Name": "",
      "Salutation": "",
      "Phone": "",
      "Email": "",
      "Location": "",
      "Property Type": "",
      "Electric Supply": "",
      "Monthly TNB Bill": "",
      "Source of Leads": "",
      "Campaign ID": "",
      "Landing Page Source": "",
      "Fbclid": "",
      "UTM Source": "",
      "UTM Medium": "",
      "UTM Campaign": "",
      "UTM Term": "",
      "UTM Content": "",
    },
  };
}

/** Fields the destination webhook actually reads. Everything else in the
 * template above is left blank on purpose (see project notes for the full list). */
export function buildLeadWebhookPayload(input: LeadWebhookInput) {
  const payload = blankTemplate();

  payload["phone"] = input.phone;
  payload["Location"] = input.state;
  payload["Property Type (Condo/Apartment not suitable)"] = input.propertyType;
  payload["Electric Supply"] = input.electricSupply;
  payload["Preferred Communication Language 2"] = input.preferredLanguage;
  payload["contact_source"] = input.sourcePage;
  payload["gclid"] = input.gclid;
  payload["Campaign ID"] = input.campaignId;
  if (input.remarks) payload["Remarks"] = input.remarks;

  payload.customData["Name"] = input.fullName;
  payload.customData["Salutation"] = input.salutation;
  payload.customData["Email"] = input.email;
  payload.customData["Monthly TNB Bill"] = input.monthlyBillRange;
  payload.customData["Source of Leads"] = input.sourceOfLeads;
  payload.customData["Campaign ID"] = input.campaignId;
  payload.customData["Landing Page Source"] = input.landingPageSource;
  payload.customData["Fbclid"] = input.fbclid;
  payload.customData["UTM Source"] = input.utmSource;
  payload.customData["UTM Medium"] = input.utmMedium;
  payload.customData["UTM Campaign"] = input.utmCampaign;
  payload.customData["UTM Term"] = input.utmTerm;
  payload.customData["UTM Content"] = input.utmContent;

  return payload;
}

/** C&I reads a different subset of the same multi-purpose CRM template than
 * residential/EV — some as single-element arrays, matching an actual C&I
 * contact record from the destination CRM (see project notes). */
export function buildCiLeadWebhookPayload(input: LeadWebhookInput) {
  const payload: Record<string, unknown> = blankTemplate();

  payload["phone"] = input.phone;
  payload["email"] = input.email;
  payload["full_name"] = input.fullName;
  payload["Salutation"] = input.salutation;
  payload["Location"] = input.state;
  payload["Name of Company"] = input.companyName;
  payload["Industry"] = [input.industry];
  payload["Electric Bill (RM)"] = [input.monthlyBillRange];
  payload["What is your role in this  organization?"] = [input.roleInOrganization];
  payload["contact_source"] = input.sourcePage;
  payload["gclid"] = input.gclid;
  payload["Campaign ID"] = input.campaignId;

  const customData = payload.customData as Record<string, string>;
  customData["Name"] = `${input.salutation} ${input.fullName}`.trim();
  customData["Company Name"] = input.companyName;
  customData["Industry"] = input.industry;
  customData["Phone"] = input.phone;
  customData["Email"] = input.email;
  customData["Role In Organization"] = input.roleInOrganization;
  customData["Monthly Electric Bill"] = input.monthlyBillRange;
  customData["Location"] = input.state;
  customData["UTM Source"] = input.utmSource;
  customData["UTM Medium"] = input.utmMedium;
  customData["UTM Campaign"] = input.utmCampaign;
  customData["UTM Term"] = input.utmTerm;
  customData["UTM Content"] = input.utmContent;

  return payload;
}
