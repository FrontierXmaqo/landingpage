// Payload shape mirrors the destination workflow's expected JSON 1:1 (see
// project notes). Most keys come from a multi-purpose CRM form template and
// do not apply to this site; they stay blank. Only the fields the receiving
// webhook actually reads are populated from real submission data.
export type LeadWebhookInput = {
  fullName: string;
  phone: string;
  email: string;
  state: string;
  monthlyBillRange: string;
  propertyType: string;
  electricSupply: string;
  preferredLanguage: string;
  sourceOfLeads: string;
  campaignId: string;
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

  payload.customData["Name"] = input.fullName;
  // Salutation stays blank: the current form doesn't collect it.
  payload.customData["Email"] = input.email;
  payload.customData["Monthly TNB Bill"] = input.monthlyBillRange;
  payload.customData["Source of Leads"] = input.sourceOfLeads;
  payload.customData["Campaign ID"] = input.campaignId;

  return payload;
}
