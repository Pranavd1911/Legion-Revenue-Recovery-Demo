export type LeadStatus =
  | "New"
  | "AI Engaged"
  | "Qualified"
  | "Consultation Booked"
  | "Needs Human Review"
  | "Follow-Up"
  | "Converted"
  | "Closed";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  treatment: string;
  source: string;
  score: number;
  status: LeadStatus;
  lastInteraction: string;
  owner: string;
  value: number;
  nextAction: string;
  location: string;
  aiHandled: boolean;
  humanEscalation: boolean;
  summary: string;
  qualification: string[];
  appointment: string;
  followUp: string;
  notes: string;
  handoff: string;
};

export const locations = ["All locations", "Downtown Austin", "North Austin"];
export const providers = ["Dr. Maya Patel", "Nurse Elena Ruiz", "PA Jordan Kim", "Aesthetician Priya Shah", "Nurse Marcus Lee"];
export const treatments = ["Botox", "Dermal Fillers", "Laser Hair Removal", "Hydrafacial", "Microneedling", "Chemical Peel", "Body Contouring"];
export const sources = ["Google Ads", "Instagram", "Website", "Phone", "Facebook", "Referral"];
export const statuses: LeadStatus[] = ["New", "AI Engaged", "Qualified", "Consultation Booked", "Needs Human Review", "Follow-Up", "Converted", "Closed"];

export const leads: Lead[] = [
  { id: 1, name: "Sarah Martinez", phone: "(512) 555-0148", email: "sarah.m@example.com", treatment: "Botox", source: "Website", score: 86, status: "Consultation Booked", lastInteraction: "Today, 9:42 AM", owner: "Ava AI", value: 620, nextAction: "Send 24h reminder", location: "Downtown Austin", aiHandled: true, humanEscalation: false, summary: "Asked about Botox pricing, selected Wednesday consultation slot, and confirmed Downtown preference.", qualification: ["First-time patient", "Interested in forehead and frown lines", "Accepted complimentary consultation"], appointment: "Wed 11:00 AM with Nurse Elena Ruiz", followUp: "Confirmation and reminder workflow active", notes: "Prefers SMS. Asked for natural-looking results.", handoff: "No human handoff required." },
  { id: 2, name: "Emily Chen", phone: "(512) 555-0191", email: "emily.chen@example.com", treatment: "Dermal Fillers", source: "Instagram", score: 78, status: "Qualified", lastInteraction: "Today, 8:18 AM", owner: "Front Desk", value: 980, nextAction: "Offer Thursday slots", location: "North Austin", aiHandled: true, humanEscalation: false, summary: "Requested subtle lip filler and budget range after seeing an Instagram story.", qualification: ["Budget approved", "Wants provider consultation", "No prior filler at Glow"], appointment: "Not booked", followUp: "AI will follow up at 2:00 PM", notes: "Sensitive about overfilled look.", handoff: "AI summarized for staff review." },
  { id: 3, name: "Kayla Brooks", phone: "(512) 555-0102", email: "kayla.b@example.com", treatment: "Laser Hair Removal", source: "Google Ads", score: 91, status: "Converted", lastInteraction: "Yesterday, 4:22 PM", owner: "Maya Patel", value: 1450, nextAction: "Post-treatment follow-up", location: "Downtown Austin", aiHandled: true, humanEscalation: false, summary: "Missed call recovered within 15 seconds and converted to package consultation.", qualification: ["High urgency", "Targeting underarms and bikini", "Ready within two weeks"], appointment: "Completed yesterday", followUp: "Post-consult purchase sequence active", notes: "Purchased starter package.", handoff: "Staff assisted checkout only." },
  { id: 4, name: "Megan O'Neill", phone: "(512) 555-0133", email: "megan.o@example.com", treatment: "Hydrafacial", source: "Phone", score: 64, status: "Follow-Up", lastInteraction: "Yesterday, 2:05 PM", owner: "Ava AI", value: 240, nextAction: "Send second touch", location: "North Austin", aiHandled: true, humanEscalation: false, summary: "Asked for weekend facial availability and did not reply after initial options.", qualification: ["Existing client", "Interested in Saturday", "Low clinical complexity"], appointment: "Tentative Saturday hold expired", followUp: "No-response workflow step 2 due", notes: "Usually books monthly facials.", handoff: "None." },
  { id: 5, name: "Ari Thompson", phone: "(512) 555-0177", email: "ari.t@example.com", treatment: "Body Contouring", source: "Facebook", score: 72, status: "AI Engaged", lastInteraction: "Today, 10:05 AM", owner: "Ava AI", value: 2100, nextAction: "Qualify timeline", location: "Downtown Austin", aiHandled: true, humanEscalation: false, summary: "Asked about abdomen contouring after ad click.", qualification: ["Interested in consultation", "Needs timeline and goals captured"], appointment: "Not booked", followUp: "Active conversation", notes: "Asked about financing.", handoff: "None." },
  { id: 6, name: "Nina Alvarez", phone: "(512) 555-0184", email: "nina.a@example.com", treatment: "Dermal Fillers", source: "Website", score: 39, status: "Needs Human Review", lastInteraction: "Today, 9:03 AM", owner: "Nurse Coordinator", value: 850, nextAction: "Clinical callback", location: "Downtown Austin", aiHandled: false, humanEscalation: true, summary: "Reported swelling after a recent filler visit. AI restricted response and escalated urgently.", qualification: ["Existing patient", "Recent treatment concern", "Clinical guidance required"], appointment: "Urgent staff callback pending", followUp: "Staff SLA under 5 minutes", notes: "Do not automate medical advice.", handoff: "Escalated to Nurse Coordinator with urgent priority." },
  { id: 7, name: "Olivia Grant", phone: "(512) 555-0168", email: "olivia.g@example.com", treatment: "Microneedling", source: "Referral", score: 81, status: "Consultation Booked", lastInteraction: "Mon, 6:45 PM", owner: "Ava AI", value: 780, nextAction: "Confirm provider", location: "North Austin", aiHandled: true, humanEscalation: false, summary: "Booked after-hours consultation from referral link.", qualification: ["Acne scarring concern", "Available weekday mornings", "Referred by Jenna P."], appointment: "Fri 9:30 AM with PA Jordan Kim", followUp: "Reminder active", notes: "Asked for downtime details.", handoff: "None." },
  { id: 8, name: "Rachel Singh", phone: "(512) 555-0110", email: "rachel.s@example.com", treatment: "Chemical Peel", source: "Google Ads", score: 69, status: "Qualified", lastInteraction: "Mon, 1:11 PM", owner: "Front Desk", value: 360, nextAction: "Book consult", location: "Downtown Austin", aiHandled: true, humanEscalation: false, summary: "Qualified for peel consultation and requested provider recommendation.", qualification: ["Uneven tone", "Event in six weeks", "Open to consult"], appointment: "Not booked", followUp: "Availability nudge scheduled", notes: "Wants minimal downtime.", handoff: "Staff to review scheduling constraints." },
  { id: 9, name: "Jasmine Walker", phone: "(512) 555-0159", email: "jasmine.w@example.com", treatment: "Botox", source: "Instagram", score: 88, status: "Converted", lastInteraction: "Sun, 12:06 PM", owner: "Nurse Elena Ruiz", value: 690, nextAction: "Invite to membership", location: "Downtown Austin", aiHandled: true, humanEscalation: false, summary: "Re-engaged abandoned pricing lead and booked consultation that converted.", qualification: ["Previous inquiry", "Accepted member pricing info", "Booked within 24h"], appointment: "Completed", followUp: "Membership offer queued", notes: "Strong repeat potential.", handoff: "Staff completed consult." },
  { id: 10, name: "Tessa Morgan", phone: "(512) 555-0124", email: "tessa.m@example.com", treatment: "Hydrafacial", source: "Phone", score: 57, status: "New", lastInteraction: "Today, 10:27 AM", owner: "Unassigned", value: 260, nextAction: "AI intro SMS", location: "North Austin", aiHandled: false, humanEscalation: false, summary: "Missed call from repeat facial prospect awaiting immediate recovery text.", qualification: ["Phone lead", "No conversation yet"], appointment: "Not booked", followUp: "Missed call workflow queued", notes: "Call came during staff huddle.", handoff: "None." },
  { id: 11, name: "Brooke Hamilton", phone: "(512) 555-0199", email: "brooke.h@example.com", treatment: "Laser Hair Removal", source: "Facebook", score: 74, status: "AI Engaged", lastInteraction: "Sat, 7:51 PM", owner: "Ava AI", value: 1200, nextAction: "Confirm area", location: "Downtown Austin", aiHandled: true, humanEscalation: false, summary: "Asked about package pricing after business hours.", qualification: ["After-hours", "Price shopping", "Considering package"], appointment: "Not booked", followUp: "AI awaiting area selection", notes: "Mentioned competitor quote.", handoff: "None." },
  { id: 12, name: "Lena Park", phone: "(512) 555-0181", email: "lena.p@example.com", treatment: "Microneedling", source: "Website", score: 83, status: "Consultation Booked", lastInteraction: "Fri, 5:30 PM", owner: "Ava AI", value: 820, nextAction: "Send intake form", location: "North Austin", aiHandled: true, humanEscalation: false, summary: "Booked consultation after AI answered downtime and series questions.", qualification: ["Interested in acne scars", "Understands series likely", "Prefers North Austin"], appointment: "Tue 3:30 PM with PA Jordan Kim", followUp: "Intake form sent", notes: "Wants to start before fall.", handoff: "None." },
  { id: 13, name: "Morgan Lee", phone: "(512) 555-0139", email: "morgan.l@example.com", treatment: "Chemical Peel", source: "Referral", score: 61, status: "Follow-Up", lastInteraction: "Thu, 11:09 AM", owner: "Ava AI", value: 340, nextAction: "Education follow-up", location: "Downtown Austin", aiHandled: true, humanEscalation: false, summary: "Paused before booking after asking about downtime.", qualification: ["Medium intent", "Needs reassurance", "Referred by member"], appointment: "Not booked", followUp: "Educational SMS sequence active", notes: "Planning around travel.", handoff: "None." },
  { id: 14, name: "Dana Rivera", phone: "(512) 555-0129", email: "dana.r@example.com", treatment: "Body Contouring", source: "Google Ads", score: 93, status: "Qualified", lastInteraction: "Today, 7:34 AM", owner: "Front Desk", value: 2400, nextAction: "Same-day callback", location: "North Austin", aiHandled: true, humanEscalation: false, summary: "High-value lead with financing questions and strong appointment intent.", qualification: ["Ready this month", "Asked financing", "Wants abdomen and flanks"], appointment: "Not booked", followUp: "Priority task created", notes: "Call before noon.", handoff: "Assigned to front desk for consult fit." },
  { id: 15, name: "Whitney Stone", phone: "(512) 555-0172", email: "whitney.s@example.com", treatment: "Botox", source: "Phone", score: 45, status: "Closed", lastInteraction: "Wed, 3:12 PM", owner: "Front Desk", value: 0, nextAction: "None", location: "Downtown Austin", aiHandled: true, humanEscalation: false, summary: "Lead chose another provider after price comparison.", qualification: ["Price-sensitive", "Not ready to book"], appointment: "Canceled", followUp: "Closed politely", notes: "Potential future nurture candidate.", handoff: "Staff closed after callback." },
  { id: 16, name: "Ivy Bennett", phone: "(512) 555-0161", email: "ivy.b@example.com", treatment: "Dermal Fillers", source: "Instagram", score: 76, status: "Consultation Booked", lastInteraction: "Tue, 8:58 PM", owner: "Ava AI", value: 920, nextAction: "Reminder tomorrow", location: "Downtown Austin", aiHandled: true, humanEscalation: false, summary: "Booked outside business hours from Instagram DM.", qualification: ["Cheek volume interest", "Asked safety questions", "Prefers experienced injector"], appointment: "Thu 2:00 PM with Dr. Maya Patel", followUp: "Reminder active", notes: "Requested before-and-after examples at visit.", handoff: "None." }
];

export const overviewSeries = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  leads: 28 + i * 3 + (i % 3) * 7,
  booked: 8 + i + (i % 4) * 2
}));

export const revenueByChannel = [
  { name: "Google Ads", value: 12100 },
  { name: "Instagram", value: 8450 },
  { name: "Website", value: 7280 },
  { name: "Phone", value: 5920 },
  { name: "Referral", value: 4670 }
];

export const funnel = [
  { stage: "New inquiry", count: 486 },
  { stage: "AI engaged", count: 432 },
  { stage: "Qualified", count: 246 },
  { stage: "Consult booked", count: 132 },
  { stage: "Consult attended", count: 101 },
  { stage: "Treatment purchased", count: 62 }
];

export const sourceBreakdown = sources.map((name, idx) => ({
  name,
  value: [132, 104, 92, 78, 51, 29][idx]
}));

export const analytics90 = Array.from({ length: 90 }, (_, i) => ({
  day: `D${i + 1}`,
  recovered: 280 + Math.round(Math.sin(i / 6) * 90) + i * 7,
  pipeline: 1400 + Math.round(Math.cos(i / 8) * 180) + i * 23
}));

export const workflows = [
  { name: "Missed Call Recovery", status: "Active", enrolled: 63, conversion: "34%", revenue: 14820, modified: "Today", trigger: "Incoming call is missed", channels: "SMS, AI callback" },
  { name: "Unresponsive Lead Follow-Up", status: "Active", enrolled: 118, conversion: "18%", revenue: 9850, modified: "Yesterday", trigger: "No reply after 4 hours", channels: "SMS, email" },
  { name: "Consultation Reminder", status: "Active", enrolled: 74, conversion: "71%", revenue: 7600, modified: "Jul 18", trigger: "Appointment booked", channels: "SMS" },
  { name: "No-Show Recovery", status: "Paused", enrolled: 22, conversion: "23%", revenue: 2860, modified: "Jul 15", trigger: "Appointment missed", channels: "SMS, staff task" },
  { name: "Post-Consultation Follow-Up", status: "Active", enrolled: 47, conversion: "29%", revenue: 4320, modified: "Jul 14", trigger: "Consult completed, no purchase", channels: "SMS, email" },
  { name: "Seasonal Promotion", status: "Draft", enrolled: 0, conversion: "-", revenue: 0, modified: "Jul 11", trigger: "Manual campaign", channels: "SMS, email" },
  { name: "Existing Customer Reactivation", status: "Active", enrolled: 91, conversion: "14%", revenue: 4970, modified: "Jul 10", trigger: "No visit in 120 days", channels: "SMS" }
];

export const appointments = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  customer: leads[i % leads.length].name,
  treatment: treatments[i % treatments.length],
  provider: providers[i % providers.length],
  location: i % 2 ? "North Austin" : "Downtown Austin",
  time: `${["Mon", "Tue", "Wed", "Thu", "Fri"][i % 5]} ${9 + (i % 8)}:${i % 2 ? "30" : "00"} AM`,
  status: ["Confirmed", "Pending", "Reschedule requested", "Completed"][i % 4],
  source: ["AI-booked", "Staff-booked", "Manual"][i % 3],
  value: 240 + (i % 7) * 310
}));

export const integrations = [
  "Google Calendar", "Microsoft Outlook", "HubSpot", "Salesforce", "Boulevard", "Mindbody", "Zenoti", "Facebook Lead Ads", "Instagram", "Google Ads", "Twilio", "Zapier", "Webhooks"
].map((name, i) => ({
  name,
  status: (["Connected", "Available", "Requires Setup", "Coming Soon"] as const)[i % 4]
}));
