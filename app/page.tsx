"use client";

import { AppShell, PageTitle, Screen } from "@/components/AppShell";
import { Badge, Button, Card, DataLabel, Modal, StatCard } from "@/components/ui";
import { analytics90, appointments, integrations, leads as seedLeads, locations, providers, revenueByChannel, sources, statuses, treatments, workflows as seedWorkflows, Lead, LeadStatus } from "@/lib/mock-data";
import { currency } from "@/lib/utils";
import { AlertTriangle, ArrowRight, Bot, CalendarCheck, Check, CheckCircle2, CircleDollarSign, Clock, DollarSign, ExternalLink, FileText, Filter, Headphones, MessageCircle, Pause, Phone, Play, Plus, RefreshCcw, Save, Send, Settings2, ShieldAlert, Sparkles, Target, TrendingUp, UserPlus, Users, Workflow, X, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const palette = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#64748b"];

const funnelStages = [
  { stage: "New Leads", count: 486, conversion: "100%", dropoff: "0", value: 296000 },
  { stage: "AI Engaged", count: 442, conversion: "91%", dropoff: "44", value: 269000 },
  { stage: "Qualified", count: 310, conversion: "70%", dropoff: "132", value: 189000 },
  { stage: "Consultations Booked", count: 132, conversion: "43%", dropoff: "178", value: 80800 },
  { stage: "Consultations Attended", count: 118, conversion: "89%", dropoff: "14", value: 72200 },
  { stage: "Treatments Purchased", count: 97, conversion: "82%", dropoff: "21", value: 59400 }
];

const recoveryEvents = [
  {
    name: "Sarah Mitchell",
    value: 650,
    source: "Missed phone call",
    channel: "Phone → SMS",
    workflow: "Missed Call Recovery",
    confidence: "High",
    handling: "6 minutes",
    staff: "None",
    steps: [
      ["9:01 AM", "Missed call detected from Sarah Mitchell"],
      ["9:01 AM", "AI SMS sent within 12 seconds"],
      ["9:04 AM", "Customer replied about Botox pricing"],
      ["9:07 AM", "Consultation booked for Wednesday at 11:00 AM"],
      ["9:07 AM", "CRM updated and reminder workflow activated"]
    ]
  },
  {
    name: "Daniel Brooks",
    value: 2100,
    source: "Google Ads",
    channel: "Ad form → AI callback",
    workflow: "Unresponsive Lead Follow-Up",
    confidence: "Medium",
    handling: "8 minutes",
    staff: "Front desk reviewed financing note",
    steps: [
      ["10:14 AM", "Google Ads body contouring lead submitted"],
      ["10:44 AM", "No response to first staff outreach"],
      ["10:45 AM", "Ava placed AI callback and captured financing question"],
      ["10:50 AM", "Body contouring consultation booked"],
      ["10:51 AM", "CRM updated with staff review task"]
    ]
  },
  {
    name: "Morgan Lee",
    value: 340,
    source: "Website inquiry",
    channel: "Web → SMS",
    workflow: "Unresponsive Lead Follow-Up",
    confidence: "Medium",
    handling: "14 minutes",
    staff: "None",
    steps: [
      ["1:12 PM", "Website inquiry stalled after qualification"],
      ["1:42 PM", "Follow-up workflow sent downtime context"],
      ["1:49 PM", "Customer replied with Saturday preference"],
      ["1:55 PM", "Hydrafacial consultation booked"],
      ["1:56 PM", "CRM updated and reminder sent"]
    ]
  },
  {
    name: "Olivia Grant",
    value: 780,
    source: "No-show appointment",
    channel: "SMS",
    workflow: "No-Show Recovery",
    confidence: "High",
    handling: "11 minutes",
    staff: "None",
    steps: [
      ["3:05 PM", "No-show detected for microneedling consult"],
      ["3:06 PM", "Recovery message sent with rebooking options"],
      ["3:12 PM", "Customer apologized and requested Friday morning"],
      ["3:16 PM", "Consultation rebooked"],
      ["3:16 PM", "No-show workflow closed and CRM synchronized"]
    ]
  }
];

const activityItems = [
  { type: "Bookings", lead: "Sarah Mitchell", action: "Ava booked a Botox consultation.", time: "4m ago", status: "Booked by AI", value: 650, icon: CalendarCheck },
  { type: "Recovery", lead: "Daniel Brooks", action: "Missed call recovered from Google Ads.", time: "18m ago", status: "Missed call recovered", value: 1450, icon: Phone },
  { type: "Escalations", lead: "Nina Alvarez", action: "Post-filler concern escalated to Nurse Coordinator.", time: "31m ago", status: "Clinical escalation", value: 0, icon: ShieldAlert },
  { type: "Follow-up", lead: "Morgan Lee", action: "Follow-up workflow converted an unresponsive lead.", time: "46m ago", status: "Lead re-engaged", value: 340, icon: RefreshCcw },
  { type: "CRM updates", lead: "Maya Patel", action: "Appointment reminder sent and CRM activity logged.", time: "1h ago", status: "CRM synchronized", value: 0, icon: FileText },
  { type: "Bookings", lead: "Dana Rivera", action: "Website inquiry qualified as high intent.", time: "2h ago", status: "High-intent qualified", value: 2400, icon: Target },
  { type: "Escalations", lead: "Tessa Morgan", action: "Customer requested a human handoff.", time: "2h ago", status: "Human handoff requested", value: 0, icon: Headphones },
  { type: "Recovery", lead: "Olivia Grant", action: "No-show recovery workflow rebooked a consultation.", time: "3h ago", status: "No-show rebooked", value: 780, icon: Workflow }
];

const leadSourceMetrics = [
  { name: "Google Ads", leads: 132, bookingRate: "31%", revenue: 12100, average: 720 },
  { name: "Instagram", leads: 104, bookingRate: "24%", revenue: 8450, average: 610 },
  { name: "Website", leads: 92, bookingRate: "28%", revenue: 7280, average: 580 },
  { name: "Phone", leads: 78, bookingRate: "26%", revenue: 5920, average: 540 },
  { name: "Facebook", leads: 51, bookingRate: "19%", revenue: 3210, average: 470 },
  { name: "Referral", leads: 29, bookingRate: "38%", revenue: 4670, average: 760 }
];

function leadIntent(score: number) {
  if (score >= 85) return "Very High Intent";
  if (score >= 72) return "High Intent";
  if (score >= 58) return "Medium Intent";
  if (score >= 45) return "Low Intent";
  return "Needs Review";
}

function confidenceFor(score: number) {
  return Math.min(98, Math.max(62, score + 8));
}

function toneForStatus(status: string) {
  if (["Converted", "Connected", "Active", "Confirmed", "Booked by AI", "Missed call recovered", "Lead re-engaged", "CRM synchronized", "High-intent qualified", "No-show rebooked"].includes(status)) return "green";
  if (["Consultation Booked", "AI Engaged", "Available"].includes(status)) return "blue";
  if (["Qualified", "Requires Setup"].includes(status)) return "purple";
  if (["Needs Human Review", "Urgent", "Clinical escalation", "Human handoff requested"].includes(status)) return "red";
  if (["Follow-Up", "Paused", "Pending"].includes(status)) return "amber";
  return "slate";
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("overview");
  const [location, setLocation] = useState("All locations");
  const [range, setRange] = useState("Last 30 days");
  const [leads, setLeads] = useState(seedLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState(seedWorkflows);
  const [drawer, setDrawer] = useState<"insights" | "funnel" | "recommendation" | null>(null);
  const [demoStep, setDemoStep] = useState<number | null>(null);
  const [experimentModal, setExperimentModal] = useState(false);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function updateLeadStatus(id: number, status: LeadStatus) {
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status, nextAction: status === "Converted" ? "Post-treatment nurture" : lead.nextAction } : lead)));
    setSelectedLead((current) => (current?.id === id ? { ...current, status } : current));
    notify(`Lead marked ${status}.`);
  }

  return (
    <AppShell active={screen} onNavigate={setScreen} location={location} onLocation={setLocation} range={range} onRange={setRange} onStartDemo={() => { setScreen("overview"); setDemoStep(0); }}>
      {screen === "overview" && <Overview onNavigate={setScreen} openDrawer={setDrawer} openLead={setSelectedLead} openExperiment={() => setExperimentModal(true)} />}
      {screen === "leads" && <LeadInbox leads={leads} onOpen={setSelectedLead} onStatus={updateLeadStatus} />}
      {screen === "conversations" && <Conversations />}
      {screen === "appointments" && <Appointments notify={notify} />}
      {screen === "workflows" && <Workflows workflows={workflows} setWorkflows={setWorkflows} notify={notify} />}
      {screen === "analytics" && <Analytics />}
      {screen === "agent" && <AgentConfig notify={notify} />}
      {screen === "integrations" && <Integrations notify={notify} />}
      {screen === "settings" && <Onboarding notify={notify} />}
      {screen === "onboarding" && <Onboarding notify={notify} />}
      {selectedLead && <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} onStatus={updateLeadStatus} notify={notify} />}
      {modal && <IntegrationModal name={modal} onClose={() => setModal(null)} notify={notify} />}
      {drawer && <InsightsDrawer type={drawer} onClose={() => setDrawer(null)} onNavigate={setScreen} openExperiment={() => setExperimentModal(true)} />}
      {experimentModal && <ExperimentModal onClose={() => setExperimentModal(false)} notify={notify} />}
      {demoStep !== null && <DemoMode step={demoStep} setStep={setDemoStep} onNavigate={setScreen} onLead={() => setSelectedLead(seedLeads[9])} />}
      {toast && <div className="fixed bottom-5 right-5 z-[60] rounded-lg bg-ink px-4 py-3 text-sm font-medium text-white shadow-soft">{toast}</div>}
    </AppShell>
  );
}

function Overview({
  onNavigate,
  openDrawer,
  openLead,
  openExperiment
}: {
  onNavigate: (screen: Screen) => void;
  openDrawer: (drawer: "insights" | "funnel" | "recommendation") => void;
  openLead: (lead: Lead) => void;
  openExperiment: () => void;
}) {
  const [eventIndex, setEventIndex] = useState(0);
  const [activityFilter, setActivityFilter] = useState("All");
  const kpis = [
    { label: "Total Leads", value: "486", change: "+19%", icon: Users, tip: "All inbound inquiries captured from phone, web, ads, DMs, and referral sources." },
    { label: "Average First Response Time", value: "18 seconds", change: "-72%", icon: Clock, tip: "Median elapsed time between new inquiry and first AI or staff response." },
    { label: "Consultations Booked", value: "132", change: "+24%", icon: CalendarCheck, tip: "Consultations booked by Ava or staff from Legion-attributed conversations." },
    { label: "Booking Rate", value: "27.2%", change: "+4.8 pts", icon: Target, tip: "Booked consultations divided by total leads in the selected date range." },
    { label: "Missed Calls Recovered", value: "84%", change: "+11 pts", icon: Phone, tip: "Missed calls that received a recovery message and became active conversations." },
    { label: "Estimated Revenue Recovered", value: "$38,420", change: "+31%", icon: CircleDollarSign, sublabel: "Estimated, not guaranteed revenue", kind: "Estimated" as const, tip: "Estimated recovered revenue = Legion-attributed booked consultations × historical consultation-to-treatment conversion rate × average treatment value. Actual revenue may vary based on attendance, treatment selection, pricing, refunds, cancellations, and attribution confidence." },
    { label: "Administrative Hours Saved", value: "96", change: "+18%", icon: Bot, tip: "Estimated staff time saved through AI responses, reminders, CRM updates, and follow-ups." },
    { label: "Human Escalation Rate", value: "12%", change: "-3 pts", icon: ShieldAlert, tip: "Share of conversations routed to staff for clinical, sensitive, or complex handling." }
  ];
  const filteredActivity = activityFilter === "All" ? activityItems : activityItems.filter((item) => item.type === activityFilter);
  const event = recoveryEvents[eventIndex];
  return (
    <>
      <PageTitle
        title="Executive Overview"
        subtitle="Convert more inquiries into booked consultations while keeping clinical and sensitive conversations with staff."
        action={<Button onClick={() => onNavigate("onboarding")}><Sparkles className="h-4 w-4" />Launch onboarding</Button>}
      />
      <Card className="mb-5 border-indigo-100 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"><Sparkles className="h-3.5 w-3.5" />Generated from live activity</div>
            <h2 className="text-xl font-semibold">AI Executive Summary</h2>
            <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-700">During the last 30 days, Ava handled 486 customer inquiries, recovered 41 missed calls, booked 132 consultations, and generated an estimated $38,420 in recovered revenue. Google Ads produced the highest-value leads, while the Missed Call Recovery workflow delivered the strongest conversion performance. Clinical escalations remained low at 12%, allowing staff to focus on sensitive and high-value customer interactions.</p>
          </div>
          <Button variant="secondary" onClick={() => openDrawer("insights")}>View full insights<ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">{["41 missed calls recovered", "23 abandoned leads re-engaged", "17 after-hours consultations booked", "$9,850 recovered from follow-up workflows"].map((chip) => <Badge key={chip} tone="blue">{chip}</Badge>)}</div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, change, icon: Icon, tip, sublabel, kind }, i) => <StatCard key={label} label={label} value={value} change={change} icon={<Icon className="h-4 w-4" />} tooltip={label === "Human Escalation Rate" ? "12% of conversations required staff assistance, down 3 points while clinical escalation compliance remained stable. Clinical escalation compliance: 100%. A lower escalation rate is only considered positive when safety and escalation compliance remain stable." : tip} sublabel={sublabel} dataKind={kind ?? "Actual"} negative={label === "Human Escalation Rate"} spark={[11 + i, 15 + i, 14 + i, 21 + i, 24 + i, 26 + i, 31 + i]} />)}
      </div>
      <RecommendedNextAction openDrawer={() => openDrawer("recommendation")} openExperiment={openExperiment} />
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Leads vs Booked Consultations">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={sourceFiltered(overviewData())}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="week" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line name="Leads" dataKey="leads" stroke="#4f46e5" strokeWidth={3} />
              <Line name="Booked consultations" dataKey="booked" stroke="#0ea5e9" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Revenue Recovered by Channel">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByChannel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => currency(Number(v))} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {revenueByChannel.map((_, i) => <Cell key={i} fill={palette[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <SteppedFunnel openDrawer={() => openDrawer("funnel")} />
        <LeadSourceBreakdown />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <Card className="p-5">
          <h2 className="font-semibold">Revenue Recovery Highlights</h2>
          {[
            [Phone, "Missed calls recovered", "41", "Reached customers before they booked elsewhere.", "+16%"],
            [RefreshCcw, "Abandoned leads re-engaged", "23", "Restarted stalled conversations with useful context.", "+9%"],
            [Clock, "After-hours consultations booked", "17", "Converted demand that arrived while staff were offline.", "+21%"],
            [DollarSign, "Follow-up revenue recovered", "$9,850", "Attributed to no-response and post-consult workflows.", "+28%"]
          ].map(([Icon, label, metric, detail, change]) => {
            const RowIcon = Icon as typeof Phone;
            return <div key={String(label)} className="mt-4 flex items-center gap-4 rounded-md border border-line bg-slate-50 p-3"><div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-indigo-700"><RowIcon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{label as string}: {metric as string}</p><p className="text-xs text-muted">{detail as string}</p></div><Badge tone="green">{change as string}</Badge></div>;
          })}
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-semibold">How Legion Recovered Revenue Today</h2><div className="flex gap-1"><Button variant="ghost" onClick={() => setEventIndex((eventIndex + recoveryEvents.length - 1) % recoveryEvents.length)}>Back</Button><Button variant="ghost" onClick={() => setEventIndex((eventIndex + 1) % recoveryEvents.length)}>Next</Button></div></div>
          <div className="rounded-md bg-slate-50 p-4">
            {event.steps.map(([time, text], i) => <div key={text} className="grid grid-cols-[72px_18px_1fr] gap-3 text-sm"><p className="pb-5 font-semibold text-muted">{time}</p><div className="relative flex justify-center"><span className="mt-1 h-3 w-3 rounded-full bg-indigo-600" />{i < event.steps.length - 1 && <span className="absolute top-5 h-full w-px bg-indigo-100" />}</div><p className="pb-5 text-slate-700">{text}</p></div>)}
            <div className="mt-4 grid gap-2 rounded-md bg-white p-3 text-sm sm:grid-cols-2">
              <Info label="Source" value={event.source} />
              <Info label="Channel" value={event.channel} />
              <Info label="Workflow" value={event.workflow} />
              <Info label="Attribution confidence" value={event.confidence} />
              <Info label="AI handling time" value={event.handling} />
              <Info label="Staff involvement" value={event.staff} />
              <Info label="Consultation value estimate" value={currency(event.value)} />
            </div>
            <div className="mt-3 rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Estimated recovered revenue: +{currency(event.value)}<p className="mt-1 text-xs font-medium text-emerald-700">Estimated based on historical treatment conversion and average treatment value.</p></div>
            <Button className="mt-3" variant="secondary" onClick={() => openLead(seedLeads[0])}>View customer journey</Button>
          </div>
        </Card>
      </div>
      <Card className="mt-5 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Ava Activity</h2><div className="flex flex-wrap gap-2">{["All", "Bookings", "Recovery", "Escalations", "Follow-up", "CRM updates"].map((filter) => <Button key={filter} variant={activityFilter === filter ? "primary" : "secondary"} onClick={() => setActivityFilter(filter)}>{filter}</Button>)}</div></div>
        <div className="grid gap-2">{filteredActivity.map((item) => { const Icon = item.icon; return <div key={`${item.lead}-${item.action}`} className="flex flex-wrap items-center gap-3 rounded-md border border-line p-3 text-sm hover:bg-slate-50"><div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-50 text-indigo-700"><Icon className="h-4 w-4" /></div><div className="min-w-52 flex-1"><p><span className="font-semibold">{item.lead}</span> · {item.action}</p><p className="text-xs text-muted">{item.time}</p></div><Badge tone={toneForStatus(item.status)}>{item.status}</Badge>{item.value > 0 && <p className="font-semibold text-emerald-700">{currency(item.value)}</p>}</div>; })}</div>
      </Card>
    </>
  );
}

function overviewData() {
  return [
    { week: "W1", leads: 32, booked: 9 },
    { week: "W2", leads: 41, booked: 12 },
    { week: "W3", leads: 50, booked: 15 },
    { week: "W4", leads: 44, booked: 15 },
    { week: "W5", leads: 53, booked: 18 },
    { week: "W6", leads: 62, booked: 21 },
    { week: "W7", leads: 56, booked: 21 },
    { week: "W8", leads: 65, booked: 24 },
    { week: "W9", leads: 74, booked: 27 },
    { week: "W10", leads: 68, booked: 27 },
    { week: "W11", leads: 77, booked: 30 },
    { week: "W12", leads: 86, booked: 33 }
  ];
}
function sourceFiltered<T>(data: T[]) { return data; }

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card className="p-5"><h2 className="mb-4 font-semibold">{title}</h2>{children}</Card>;
}

function RecommendedNextAction({ openDrawer, openExperiment }: { openDrawer: () => void; openExperiment: () => void }) {
  return (
    <Card className="mt-5 border-indigo-100 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2"><DataLabel kind="Projected" /><p className="text-xs font-semibold uppercase text-indigo-700">Recommended Next Action</p></div>
          <h2 className="text-lg font-semibold">Reduce qualified-lead booking drop-off</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">178 qualified leads did not immediately book. Sixty-one remain active in recovery workflows. Testing a second follow-up within 30 minutes is projected to recover 9–14 additional consultations per month.</p>
        </div>
        <div className="flex gap-2"><Button variant="secondary" onClick={openDrawer}>Review recommendation</Button><Button onClick={openExperiment}>Create experiment</Button></div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-5"><Info label="Opportunity size" value="61 active leads" /><Info label="Current conversion" value="43%" /><Info label="Target conversion" value="47–49%" /><Info label="Projected impact" value="$4,500–$8,200" /><Info label="Confidence" value="Medium" /></div>
    </Card>
  );
}

function SteppedFunnel({ openDrawer }: { openDrawer: () => void }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold">Lead Funnel</h2>
        <Button variant="secondary" onClick={openDrawer}>Review booking opportunities</Button>
      </div>
      <div className="grid gap-3">
        {funnelStages.map((stage, i) => (
          <div key={stage.stage} title={`${stage.conversion} conversion from previous stage. Drop-off: ${stage.dropoff}.`} className="rounded-md border border-line bg-slate-50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="font-semibold">{stage.count} {stage.stage}</p>
              <div className="flex gap-2"><Badge tone={i === 3 ? "amber" : "blue"}>{stage.conversion} conversion</Badge><Badge>{stage.dropoff} drop-off</Badge><Badge tone="green">{currency(stage.value)} pipeline</Badge></div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${Math.max(18, (stage.count / funnelStages[0].count) * 100)}%` }} /></div>
            {stage.stage === "Consultations Booked" && <div className="mt-3 rounded-md bg-white p-3 text-xs text-slate-700"><p className="font-semibold text-amber-800">178 not yet booked</p><div className="mt-2 grid gap-1 sm:grid-cols-2"><p>61 remain in active follow-up</p><p>42 requested a later date</p><p>31 require staff review</p><p>44 became inactive or opted out</p></div></div>}
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-medium text-amber-800">Largest drop-off: Qualified → Consultation Booked</p>
      <p className="mt-2 text-sm text-muted">Qualified → Consultation Booked remains the largest conversion opportunity. Sixty-one qualified leads are still active in recovery workflows.</p>
    </Card>
  );
}

function LeadSourceBreakdown() {
  return (
    <Card className="p-5">
      <h2 className="mb-4 font-semibold">Lead Source Breakdown</h2>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={leadSourceMetrics}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value, name) => name === "revenue" || name === "average" ? currency(Number(value)) : value} />
          <Legend />
          <Bar name="Lead count" dataKey="leads" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          <Bar name="Recovered revenue" dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">{leadSourceMetrics.map((source) => <div key={source.name} className="rounded-md bg-slate-50 p-2"><p className="font-semibold">{source.name}</p><p className="text-muted">{source.leads} leads · {source.bookingRate} booked · {currency(source.revenue)} recovered · {currency(source.average)} avg value</p></div>)}</div>
      <p className="mt-3 rounded-md bg-indigo-50 p-3 text-sm font-medium text-indigo-800">Google Ads produces the highest recovered revenue, while Referral leads have the highest booking rate.</p>
    </Card>
  );
}

function InsightsDrawer({
  type,
  onClose,
  onNavigate,
  openExperiment
}: {
  type: "insights" | "funnel" | "recommendation";
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
  openExperiment: () => void;
}) {
  const sections = type === "insights" ? [
    ["Performance Drivers", ["Google Ads generated the highest estimated recovered revenue.", "Missed Call Recovery delivered the strongest workflow conversion.", "Seventeen consultations were booked outside normal business hours.", "Follow-up workflows recovered an estimated $9,850.", "Average first response time remained below 20 seconds."]],
    ["Risks and Watch Items", ["The largest funnel loss occurs between qualification and booking.", "Instagram leads convert below the account average.", "Some high-intent leads are not finding suitable appointment times.", "Clinical escalation volume should be monitored as lead volume grows.", "Attribution confidence is lower for staff-assisted conversions."]],
    ["Recommended Actions", ["Test a second qualified-lead follow-up within 30 minutes.", "Add more evening consultation availability.", "Review Instagram campaign quality and targeting.", "Route leads valued above $1,000 to staff after two unsuccessful AI attempts.", "Review clinical escalation examples during the next weekly operations meeting."]],
    ["Expected Impact", ["Projected, not guaranteed: 9–14 additional consultations per month.", "Projected, not guaranteed: $4,500–$8,200 in estimated incremental monthly revenue.", "Projected, not guaranteed: 6–10 additional administrative hours saved.", "Projected, not guaranteed: 3–5 percentage-point improvement in qualified-to-booked conversion."]]
  ] : type === "funnel" ? [
    ["Funnel Opportunity Summary", ["61 qualified leads remain in follow-up.", "19 responded to at least one recovery message.", "12 viewed an offered consultation slot.", "8 requested evening or weekend availability."]],
    ["Primary drop-off reasons", ["No suitable appointment time", "Pricing uncertainty", "Customer requested more time", "Human follow-up required", "No response after qualification"]],
    ["Recommended actions", ["Test a second follow-up within 30 minutes.", "Offer evening consultation slots.", "Send pricing-context messages for high-intent leads.", "Route high-value stalled leads to front-desk staff."]]
  ] : [
    ["Why this is recommended", ["This is the largest funnel drop-off.", "Many affected leads have already shown high purchase intent.", "The solution requires only a workflow timing change.", "The experiment can be measured within two to four weeks."]],
    ["Proposed experiment", ["Control: Current follow-up timing.", "Variant: Second SMS follow-up 30 minutes after qualification.", "Primary metric: Qualified-to-consultation-booked conversion.", "Suggested duration: 4 weeks.", "Suggested sample: At least 100 qualified leads."]],
    ["Guardrail metrics", ["Opt-out rate", "Human escalation rate", "Customer satisfaction", "Duplicate-message rate"]]
  ];
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/25">
      <aside className="h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-soft transition">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-indigo-700">Operational insight</p><h2 className="text-xl font-semibold">{type === "insights" ? "AI Executive Summary" : type === "funnel" ? "Funnel Opportunity Summary" : "Recommended Next Action"}</h2></div><Button variant="ghost" onClick={onClose} aria-label="Close drawer"><X className="h-4 w-4" /></Button></div>
        <div className="mt-5 grid gap-4">{sections.map(([title, items]) => <Card key={title as string} className="p-4"><h3 className="font-semibold">{title as string}</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">{(items as string[]).map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></Card>)}</div>
        <div className="sticky bottom-0 mt-5 flex flex-wrap gap-2 bg-white py-3">
          <Button onClick={openExperiment}>{type === "recommendation" ? "Launch experiment setup" : type === "funnel" ? "Create follow-up experiment" : "Create experiment"}</Button>
          <Button variant="secondary" onClick={() => { onNavigate(type === "insights" ? "analytics" : "leads"); onClose(); }}>{type === "insights" ? "Open Revenue Analytics" : "View affected leads"}</Button>
          {type === "insights" && <Button variant="secondary" onClick={() => { onNavigate("leads"); onClose(); }}>View affected leads</Button>}
        </div>
      </aside>
    </div>
  );
}

function ExperimentModal({ onClose, notify }: { onClose: () => void; notify: (message: string) => void }) {
  function finish(message: string) {
    notify(message);
    onClose();
  }
  return (
    <Modal title="Create experiment" onClose={onClose}>
      <div className="grid max-h-[72vh] gap-3 overflow-y-auto pr-1 text-sm">
        {[
          ["Experiment name", "Qualified Lead Second Follow-Up"],
          ["Hypothesis", "Sending a second SMS within 30 minutes of qualification will increase consultation booking conversion."],
          ["Audience", "Qualified leads who did not book during the initial conversation"],
          ["Control", "Current recovery workflow"],
          ["Variant", "Additional SMS after 30 minutes"],
          ["Duration", "4 weeks"],
          ["Primary metric", "Qualified-to-booked conversion"],
          ["Minimum sample", "100 qualified leads"]
        ].map(([label, value]) => <label key={label} className="grid gap-1 font-medium">{label}<input className="h-10 rounded-md border border-line px-3 font-normal" defaultValue={value} /></label>)}
        <div className="rounded-md bg-slate-50 p-3"><p className="font-medium">Guardrails</p><p className="mt-1 text-muted">Opt-out rate · Complaint rate · Human escalation rate · Duplicate-message rate · Customer satisfaction</p></div>
        <div className="mt-2 flex flex-wrap justify-end gap-2"><Button variant="secondary" onClick={() => finish("Experiment draft saved.")}>Save draft</Button><Button variant="secondary" onClick={() => finish("Experiment simulation launched.")}>Launch simulation</Button><Button onClick={() => finish("Experiment started for qualified lead follow-up.")}>Start experiment</Button></div>
      </div>
    </Modal>
  );
}

function DemoMode({ step, setStep, onNavigate, onLead }: { step: number; setStep: (step: number | null) => void; onNavigate: (screen: Screen) => void; onLead: () => void }) {
  const steps = [
    ["AI Executive Summary", "Legion begins by summarizing business outcomes and identifying the largest opportunity.", "overview"],
    ["Lead Funnel", "The largest conversion gap occurs between qualified leads and consultation booking.", "overview"],
    ["Recommended Next Action", "Legion turns reporting into a recommended, measurable growth experiment.", "overview"],
    ["Sarah Mitchell Recovery Timeline", "A missed call becomes a booked consultation within six minutes.", "overview"],
    ["Lead Inbox", "Every lead remains visible, scored, and assigned a next action.", "leads"],
    ["Conversation", "Ava qualifies intent and offers approved consultation slots.", "conversations"],
    ["Clinical Escalation", "Clinical and sensitive conversations are immediately transferred to staff.", "conversations"],
    ["Revenue Analytics", "Legion connects workflow activity to estimated revenue with clear attribution confidence.", "analytics"]
  ] as const;
  const current = steps[step];
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/25 p-4 sm:items-center">
      <div className="w-full max-w-xl rounded-lg bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3"><Badge tone="purple">Demo mode · {step + 1} of {steps.length}</Badge><Button variant="ghost" onClick={() => setStep(null)}>Exit Demo</Button></div>
        <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        <h2 className="mt-4 text-xl font-semibold">{current[0]}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">{current[1]}</p>
        <div className="mt-5 flex flex-wrap justify-between gap-2">
          <Button variant="secondary" disabled={step === 0} onClick={() => { const next = step - 1; onNavigate(steps[next][2]); setStep(next); }}>Back</Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { onNavigate("overview"); setStep(0); }}>Restart</Button>
            <Button onClick={() => {
              if (step === 4) onLead();
              if (step === steps.length - 1) setStep(null);
              else {
                const next = step + 1;
                onNavigate(steps[next][2]);
                setStep(next);
              }
            }}>{step === steps.length - 1 ? "Finish" : "Next"}<ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadInbox({ leads, onOpen, onStatus }: { leads: Lead[]; onOpen: (lead: Lead) => void; onStatus: (id: number, status: LeadStatus) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [source, setSource] = useState("All");
  const [treatment, setTreatment] = useState("All");
  const [score, setScore] = useState("All");
  const [sort, setSort] = useState("score");
  const filtered = useMemo(() => {
    return leads
      .filter((lead) => `${lead.name} ${lead.treatment}`.toLowerCase().includes(query.toLowerCase()))
      .filter((lead) => status === "All" || lead.status === status)
      .filter((lead) => source === "All" || lead.source === source)
      .filter((lead) => treatment === "All" || lead.treatment === treatment)
      .filter((lead) => score === "All" || (score === "80+" ? lead.score >= 80 : lead.score < 80))
      .sort((a, b) => (sort === "value" ? b.value - a.value : b.score - a.score));
  }, [leads, query, status, source, treatment, score, sort]);

  return (
    <>
      <PageTitle title="Lead Inbox" subtitle="A CRM-style queue for AI-handled inquiries, staff handoffs, and recovered opportunities." />
      <Card className="mb-4 p-4">
        <div className="flex flex-wrap gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads" className="h-10 min-w-56 rounded-md border border-line px-3 text-sm" />
          <Select value={status} onChange={setStatus} options={["All", ...statuses]} />
          <Select value={source} onChange={setSource} options={["All", ...sources]} />
          <Select value={treatment} onChange={setTreatment} options={["All", ...treatments]} />
          <Select value={score} onChange={setScore} options={["All", "80+", "Under 80"]} />
          <Select value={sort} onChange={setSort} options={["score", "value"]} />
          <Button variant="secondary"><Filter className="h-4 w-4" />AI handled</Button>
          <Button variant="secondary"><AlertTriangle className="h-4 w-4" />Human escalation</Button>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-muted">
              <tr>{["Lead name", "Treatment interest", "Lead source", "Lead score", "Status", "Last interaction", "Assigned owner", "Estimated value", "Next action"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-t border-line hover:bg-slate-50">
                  <td className="px-4 py-3"><button className="font-semibold text-ink hover:text-indigo-700" onClick={() => onOpen(lead)}>{lead.name}</button><p className="text-xs text-muted">{lead.location}</p></td>
                  <td className="px-4 py-3">{lead.treatment}</td>
                  <td className="px-4 py-3">{lead.source}</td>
                  <td className="px-4 py-3"><LeadScoreMini lead={lead} /></td>
                  <td className="px-4 py-3"><Badge tone={toneForStatus(lead.status)}>{lead.status}</Badge></td>
                  <td className="px-4 py-3">{lead.lastInteraction}</td>
                  <td className="px-4 py-3">{lead.owner}</td>
                  <td className="px-4 py-3">{currency(lead.value)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{lead.nextAction}</span>
                      <Button variant="ghost" onClick={() => onStatus(lead.id, "Consultation Booked")}><CalendarCheck className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 rounded-md border border-line bg-white px-3 text-sm">{options.map((o) => <option key={o}>{o}</option>)}</select>;
}

function LeadDrawer({ lead, onClose, onStatus, notify }: { lead: Lead; onClose: () => void; onStatus: (id: number, status: LeadStatus) => void; notify: (m: string) => void }) {
  function runAction(label: string) {
    if (label === "Book Consultation") {
      onStatus(lead.id, "Consultation Booked");
      notify(`Consultation booked for ${lead.name}.`);
      return;
    }
    if (label === "Assign Staff") {
      onStatus(lead.id, "Needs Human Review");
      notify(`${lead.name} assigned to front-desk staff.`);
      return;
    }
    if (label === "Start Workflow") {
      onStatus(lead.id, "Follow-Up");
      notify(`Recovery workflow started for ${lead.name}.`);
      return;
    }
    if (label === "Mark Converted") {
      onStatus(lead.id, "Converted");
      return;
    }
    if (label === "Close Lead") {
      onStatus(lead.id, "Closed");
      onClose();
      return;
    }
    notify(`${label} action simulated for ${lead.name}.`);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/25">
      <aside className="h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between">
          <div><h2 className="text-xl font-semibold">{lead.name}</h2><p className="text-sm text-muted">{lead.treatment} · {lead.source}</p></div>
          <Button variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Info label="Phone" value={lead.phone} />
          <Info label="Email" value={lead.email} />
          <Info label="Estimated value" value={currency(lead.value)} />
          <LeadScorePanel lead={lead} />
        </div>
        <Section title="Conversation History">
          <div className="grid gap-2">
            <p className="rounded-md bg-slate-50 p-3">Customer inquiry captured from {lead.source}.</p>
            <p className="rounded-md bg-indigo-50 p-3 text-indigo-950">Ava responded immediately, qualified intent, and recorded the next action for staff visibility.</p>
            <p className="rounded-md bg-slate-50 p-3">{lead.summary}</p>
          </div>
        </Section>
        <Section title="AI-Generated Summary"><p>{lead.summary}</p></Section>
        <Section title="Qualification Details"><ul className="grid gap-2">{lead.qualification.map((q) => <li key={q} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" />{q}</li>)}</ul></Section>
        <Section title="Appointment and Follow-Up"><p>{lead.appointment}</p><p className="mt-2 text-muted">{lead.followUp}</p></Section>
        <Section title="Internal Notes"><p>{lead.notes}</p></Section>
        <Section title="Human Handoff History"><p>{lead.handoff}</p></Section>
        <div className="sticky bottom-0 mt-5 grid grid-cols-2 gap-2 bg-white pt-3 sm:grid-cols-4">
          {["Call", "Send SMS", "Book Consultation", "Assign Staff", "Start Workflow", "Mark Converted", "Close Lead"].map((label) => (
            <Button key={label} variant={label === "Mark Converted" ? "primary" : label === "Close Lead" ? "danger" : "secondary"} onClick={() => runAction(label)}>{label}</Button>
          ))}
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-slate-50 p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}

function LeadScoreMini({ lead }: { lead: Lead }) {
  return (
    <div title="Score uses treatment interest, response behavior, source quality, booking readiness, engagement level, and customer history. It is not medical or financial certainty." className="w-44">
      <div className="flex items-center justify-between"><span className="font-semibold">{lead.score}/100</span><span className="text-xs text-muted">{confidenceFor(lead.score)}% conf.</span></div>
      <div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${lead.score}%` }} /></div>
      <p className="mt-1 text-xs font-medium text-slate-700">{leadIntent(lead.score)}</p>
    </div>
  );
}

function LeadScorePanel({ lead }: { lead: Lead }) {
  return (
    <div className="col-span-2 rounded-md bg-indigo-50 p-3" title="Score uses treatment interest, response behavior, source quality, booking readiness, engagement level, and customer history.">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs text-indigo-700">Lead score</p><p className="mt-1 text-xl font-semibold text-indigo-950">{lead.score} / 100</p></div>
        <Badge tone={lead.score < 45 ? "red" : lead.score >= 80 ? "green" : "purple"}>{leadIntent(lead.score)}</Badge>
      </div>
      <div className="mt-3 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${lead.score}%` }} /></div>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3"><p>Confidence: <span className="font-semibold">{confidenceFor(lead.score)}%</span></p><p>Estimated value: <span className="font-semibold">{currency(lead.value)}</span></p><p>Next best action: <span className="font-semibold">{lead.score >= 72 ? "Offer consultation" : lead.humanEscalation ? "Escalate to staff" : "Nurture lead"}</span></p></div>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mt-5 border-t border-line pt-4"><h3 className="mb-2 text-sm font-semibold">{title}</h3><div className="text-sm leading-6 text-slate-700">{children}</div></div>;
}

function Conversations() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState("Sarah Mitchell");
  const [tab, setTab] = useState("Summary");
  const conversations = [
    { name: "Sarah Mitchell", last: "Wednesday at 11 works.", time: "9:07 AM", channel: "SMS", status: "Booked", intent: "Botox Consultation", unread: true, escalation: false },
    { name: "Nina Alvarez", last: "One side of my face is swelling.", time: "9:03 AM", channel: "Web", status: "Escalated", intent: "Clinical Concern", unread: true, escalation: true },
    { name: "Daniel Brooks", last: "Can you call me back?", time: "10:18 AM", channel: "Phone", status: "AI handling", intent: "Laser Hair Removal", unread: false, escalation: false },
    { name: "Morgan Lee", last: "How long is downtime?", time: "Thu", channel: "SMS", status: "Follow-up", intent: "Chemical Peel", unread: false, escalation: false },
    { name: "Tessa Morgan", last: "Can someone text me?", time: "Today", channel: "Phone", status: "Needs staff", intent: "Hydrafacial", unread: true, escalation: true },
    { name: "Whitney Stone", last: "Thanks, I’m going with another provider.", time: "Wed", channel: "SMS", status: "Closed", intent: "Botox Pricing", unread: false, escalation: false }
  ];
  const conversationDetails: Record<string, {
    location: string;
    badgeTone: "green" | "blue" | "amber" | "red" | "slate" | "purple";
    messages: string[][];
    metrics: string[][];
    tabs: Record<string, string>;
  }> = {
    "Sarah Mitchell": {
      location: "Downtown Austin",
      badgeTone: "green",
      messages: [
        ["Customer", "I’m interested in Botox and wanted to know how much it costs."],
        ["System", "Intent detected: Botox consultation"],
        ["AI", "Hi Sarah, thanks for contacting Glow Aesthetics. Botox pricing depends on the number of treatment areas and units recommended. Most clients begin with a complimentary consultation so one of our providers can create an accurate treatment plan. Are you primarily interested in forehead lines, frown lines, or crow’s feet?"],
        ["Customer", "Forehead and frown lines."],
        ["System", "Appointment availability checked"],
        ["AI", "Thank you. I can help you schedule a complimentary consultation. We currently have availability Tuesday at 3:30 PM or Wednesday at 11:00 AM. Which works better for you?"],
        ["Customer", "Wednesday."],
        ["AI", "Your consultation is scheduled for Wednesday at 11:00 AM at our Downtown Austin location. I’ve sent a confirmation by text. Is there anything else you would like to know before your visit?"],
        ["System", "CRM record updated · Reminder workflow activated"]
      ],
      metrics: [["Intent", "Botox Consultation"], ["Confidence", "96%"], ["Sentiment", "Positive"], ["Urgency", "Medium"], ["Risk", "Low"], ["Estimated Value", "$740"], ["Appointment Probability", "84%"], ["Next Best Action", "Offer consultation"]],
      tabs: {
        Summary: "Customer is interested in forehead and frown-line treatment and accepted an available consultation slot.",
        Customer: "New customer, Downtown preference, SMS preferred, high purchase intent.",
        Workflow: "Confirmation sent, CRM updated, reminder workflow active.",
        Timeline: "Intent detected, availability checked, booking confirmed, CRM updated."
      }
    },
    "Nina Alvarez": {
      location: "Downtown Austin",
      badgeTone: "red",
      messages: [
        ["Customer", "I had filler yesterday and one side of my face is swelling. Is that normal?"],
        ["AI", "I’m sorry you’re experiencing this. Because this concerns a recent treatment and may require clinical guidance, I’m transferring your message to a member of the medical team now. If you experience difficulty breathing, severe pain, or rapidly worsening symptoms, seek urgent medical care."],
        ["System", "Clinical concern detected · AI automation paused · Nurse Coordinator notified"]
      ],
      metrics: [["Intent", "Clinical Concern"], ["Confidence", "98%"], ["Sentiment", "Concerned"], ["Urgency", "High"], ["Risk", "Clinical"], ["Estimated Value", "Not shown"], ["Appointment Probability", "Paused"], ["Next Best Action", "Human handoff"]],
      tabs: {
        Summary: "Post-treatment concern requires approved staff handoff. AI automation is paused.",
        Customer: "Existing patient, recent filler visit, urgent clinical callback requested.",
        Workflow: "Clinical escalation workflow active; Nurse Coordinator SLA under 5 minutes.",
        Timeline: "Concern detected, restricted response sent, staff notified, audit trail preserved."
      }
    },
    "Daniel Brooks": {
      location: "North Austin",
      badgeTone: "blue",
      messages: [
        ["System", "Missed Google Ads call detected"],
        ["AI", "Hi Daniel, this is Ava from Glow Aesthetics. Sorry we missed your call. I can help with body contouring consultation options or have a team member call you back."],
        ["Customer", "Can you call me back? I’m interested in abdomen and flanks."],
        ["System", "AI callback placed · Financing question captured"],
        ["AI", "I can help get you started. We have body contouring consultation availability Thursday at 4:30 PM or Friday at 10:00 AM. Which works better?"]
      ],
      metrics: [["Intent", "Body Contouring"], ["Confidence", "91%"], ["Sentiment", "Interested"], ["Urgency", "Medium"], ["Risk", "Low"], ["Estimated Value", "$2,100"], ["Appointment Probability", "72%"], ["Next Best Action", "Confirm callback slot"]],
      tabs: {
        Summary: "Missed paid-search call was recovered and moved into AI callback qualification.",
        Customer: "High-value body contouring lead, North Austin preference, financing question.",
        Workflow: "Missed Call Recovery started, AI callback completed, staff task queued if no booking.",
        Timeline: "Call missed, recovery SMS sent, callback requested, treatment areas captured."
      }
    },
    "Morgan Lee": {
      location: "Downtown Austin",
      badgeTone: "amber",
      messages: [
        ["Customer", "How long is downtime for a chemical peel?"],
        ["AI", "Downtime depends on peel type and skin goals. A provider can recommend the right option during a complimentary consultation. Are you preparing for an event or looking for general skin refresh?"],
        ["Customer", "I have travel next month, so I’m not ready to pick a date."],
        ["System", "Follow-up workflow scheduled · Education message queued"]
      ],
      metrics: [["Intent", "Chemical Peel"], ["Confidence", "82%"], ["Sentiment", "Cautious"], ["Urgency", "Low"], ["Risk", "Low"], ["Estimated Value", "$340"], ["Appointment Probability", "48%"], ["Next Best Action", "Send education follow-up"]],
      tabs: {
        Summary: "Qualified but not ready to book; follow-up should reduce uncertainty around downtime.",
        Customer: "Referral lead, travel constraint, needs reassurance before selecting a slot.",
        Workflow: "Educational SMS sequence active with a booking prompt after 24 hours.",
        Timeline: "Question answered, readiness constraint captured, follow-up workflow activated."
      }
    },
    "Tessa Morgan": {
      location: "North Austin",
      badgeTone: "red",
      messages: [
        ["System", "Missed phone inquiry detected"],
        ["AI", "Hi Tessa, this is Ava from Glow Aesthetics. Sorry we missed you. I can help with Hydrafacial availability or connect you with our front desk."],
        ["Customer", "Can someone text me? I have a membership question."],
        ["System", "Human handoff requested · Front-desk task created"]
      ],
      metrics: [["Intent", "Hydrafacial Membership"], ["Confidence", "79%"], ["Sentiment", "Neutral"], ["Urgency", "Medium"], ["Risk", "Account question"], ["Estimated Value", "$260"], ["Appointment Probability", "52%"], ["Next Best Action", "Front-desk follow-up"]],
      tabs: {
        Summary: "Customer requested staff help for a membership question, so Ava created a front-desk task.",
        Customer: "Existing Hydrafacial prospect, North Austin, prefers SMS from staff.",
        Workflow: "AI handling paused for staff handoff; reminder task remains open.",
        Timeline: "Missed call recovered, membership intent detected, human handoff requested."
      }
    },
    "Whitney Stone": {
      location: "Downtown Austin",
      badgeTone: "slate",
      messages: [
        ["Customer", "Thanks, I’m going with another provider."],
        ["AI", "Thanks for letting us know. If you have questions in the future, Glow Aesthetics is happy to help."],
        ["System", "Lead closed politely · Future nurture tag available"]
      ],
      metrics: [["Intent", "Botox Pricing"], ["Confidence", "67%"], ["Sentiment", "Resolved"], ["Urgency", "Low"], ["Risk", "Low"], ["Estimated Value", "$0"], ["Appointment Probability", "Closed"], ["Next Best Action", "No action"]],
      tabs: {
        Summary: "Lead chose another provider after pricing comparison and was closed without further automation.",
        Customer: "Price-sensitive Botox lead, no active appointment intent.",
        Workflow: "Closed politely; eligible for future seasonal reactivation only.",
        Timeline: "Pricing compared, customer declined, CRM closed with nurture note."
      }
    }
  };
  const filtered = filter === "All" ? conversations : conversations.filter((c) => {
    if (filter === "AI handling") return c.status === "AI handling";
    if (filter === "Needs staff") return c.status === "Needs staff";
    if (filter === "Booked") return c.status === "Booked";
    if (filter === "Escalated") return c.escalation;
    if (filter === "Closed") return c.status === "Closed";
    return true;
  });
  const tabs = ["Summary", "Customer", "Workflow", "Timeline"];
  const selectedConversation = conversations.find((item) => item.name === selected) ?? conversations[0];
  const detail = conversationDetails[selectedConversation.name];

  useEffect(() => {
    if (filtered.length > 0 && !filtered.some((item) => item.name === selected)) {
      setSelected(filtered[0].name);
      setTab("Summary");
    }
  }, [filter, filtered, selected]);

  return (
    <>
      <PageTitle title="AI Conversation Experience" subtitle="Ava handles routine buying intent, updates CRM context, and books a consultation without replacing the front desk." />
      <div className="grid gap-5 xl:grid-cols-[320px_1fr_360px]">
        <Card className="overflow-hidden">
          <div className="border-b border-line p-4"><h2 className="font-semibold">Conversation List</h2><div className="mt-3 flex flex-wrap gap-2">{["All", "AI handling", "Needs staff", "Booked", "Escalated", "Closed"].map((f) => <Button key={f} variant={filter === f ? "primary" : "secondary"} onClick={() => setFilter(f)}>{f}</Button>)}</div></div>
          <div className="divide-y divide-line">{filtered.length === 0 ? <div className="p-5 text-sm text-muted">No conversations match this filter.</div> : filtered.map((item) => <button key={item.name} onClick={() => { setSelected(item.name); setTab("Summary"); }} className={`w-full p-4 text-left transition hover:bg-slate-50 ${selected === item.name ? "bg-indigo-50" : ""}`}><div className="flex items-center justify-between gap-3"><p className="font-semibold">{item.name}</p>{item.unread && <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}</div><p className="mt-1 truncate text-sm text-muted">{item.last}</p><div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted"><span>{item.time}</span><span>{item.channel}</span><Badge tone={toneForStatus(item.status)}>{item.status}</Badge>{item.escalation && <ShieldAlert className="h-4 w-4 text-rose-600" />}</div><p className="mt-2 text-xs font-medium text-slate-700">{item.intent}</p></button>)}</div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-semibold">{selectedConversation.name}</h2><p className="text-sm text-muted">{selectedConversation.channel} · {detail.location} · {selectedConversation.status === "Closed" ? "Closed" : selectedConversation.escalation ? "Staff active" : "Ava active"}</p></div><Badge tone={detail.badgeTone}>{selectedConversation.status}</Badge></div>
          <Chat messages={detail.messages} />
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">AI Operational Panel</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">{detail.metrics.map(([label, value]) => <Info key={label} label={label} value={value} />)}</div>
          <div className="mt-4 flex flex-wrap gap-2">{tabs.map((t) => <Button key={t} variant={tab === t ? "primary" : "secondary"} onClick={() => setTab(t)}>{t}</Button>)}</div>
          <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6">{detail.tabs[tab]}</div>
        </Card>
      </div>
      <Escalation />
    </>
  );
}

function Chat({ messages }: { messages: string[][] }) {
  return <div className="grid gap-3">{messages.map(([who, body], i) => <div key={i} className={`${who === "System" ? "mx-auto max-w-[92%] bg-amber-50 text-amber-800" : who === "AI" ? "max-w-[82%] bg-indigo-50 text-indigo-950" : who === "Staff" ? "max-w-[82%] bg-emerald-50 text-emerald-950" : "ml-auto max-w-[82%] bg-ink text-white"} rounded-lg p-3 text-sm leading-6 shadow-sm`}><p className="mb-1 text-xs font-semibold opacity-70">{who}</p>{body}</div>)}</div>;
}
function PanelText({ items }: { items: string[] }) {
  return <div className="grid gap-3">{items.map((item) => <div key={item} className="rounded-md bg-slate-50 p-4 text-sm leading-6">{item}</div>)}</div>;
}

function Escalation() {
  const [resolved, setResolved] = useState(false);
  return (
    <Card className="mt-5 border-rose-100 p-5">
      <PageTitle title="Human Escalation Scenario" subtitle="The AI refuses to diagnose or treat medical concerns and routes urgent clinical messages to staff." />
      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <Chat messages={[
          ["Customer", "I had filler yesterday and one side of my face is swelling. Is that normal?"],
          ["AI", "I’m sorry you’re experiencing this. Because this concerns a recent treatment and may require clinical guidance, I’m transferring your message to a member of the medical team now. If you experience difficulty breathing, severe pain, or rapidly worsening symptoms, seek urgent medical care."]
        ]} />
        <div>
          {["Clinical concern detected", "AI response restricted", "Priority: Urgent", "Escalated to: Nurse Coordinator", "Response SLA: Under 5 minutes", "Staff notification sent", "AI automation paused", "Customer advised to seek urgent care for severe symptoms"].map((item) => <div key={item} className="mb-3 flex items-center gap-2 rounded-md bg-rose-50 p-3 text-sm text-rose-800"><AlertTriangle className="h-4 w-4" />{item}</div>)}
          <div className="mt-4 grid grid-cols-2 gap-2">{["Accept handoff", "Assign staff member", "Call customer", "Send secure response", "Mark resolved"].map((action) => <Button key={action} variant={action === "Mark resolved" ? "primary" : "secondary"} onClick={() => action === "Mark resolved" && setResolved(true)}>{action}</Button>)}</div>
          {resolved && <p className="mt-3 rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-800">Escalation marked resolved. Audit trail preserved.</p>}
          <Section title="Escalation Audit Timeline"><PanelText items={["9:03 AM Clinical concern detected", "9:03 AM AI automation paused", "9:04 AM Nurse Coordinator notified", "9:05 AM Staff handoff accepted"]} /></Section>
        </div>
      </div>
    </Card>
  );
}

function Appointments({ notify }: { notify: (m: string) => void }) {
  const [selected, setSelected] = useState(appointments[0]);
  return (
    <>
      <PageTitle title="Appointment Scheduling" subtitle="Calendar operations for AI-booked, staff-booked, and manually entered consultations." action={<Button onClick={() => notify("New consultation slot created.")}><Plus className="h-4 w-4" />Add slot</Button>} />
      <div className="grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
        <Card className="p-5"><div className="mb-4 flex flex-wrap gap-3"><Select value="All providers" onChange={() => null} options={["All providers", ...providers]} /><Select value="All treatments" onChange={() => null} options={["All treatments", ...treatments]} /><Select value="All locations" onChange={() => null} options={locations} /></div><div className="grid gap-3 md:grid-cols-2">{appointments.map((apt) => <button key={apt.id} onClick={() => setSelected(apt)} className="rounded-lg border border-line bg-white p-4 text-left transition hover:border-indigo-200 hover:shadow-sm"><div className="flex justify-between gap-3"><p className="font-semibold">{apt.customer}</p><Badge tone={toneForStatus(apt.status)}>{apt.status}</Badge></div><p className="mt-1 text-sm text-muted">{apt.time} · {apt.treatment}</p><p className="mt-2 text-xs text-muted">{apt.provider} · {apt.location} · {apt.source}</p></button>)}</div></Card>
        <Card className="p-5"><h2 className="font-semibold">Appointment Details</h2><Section title={selected.customer}><p>{selected.treatment} consultation, estimated value {currency(selected.value)}.</p><p>{selected.provider} at {selected.location}</p></Section><Section title="Conversation Summary"><p>Lead accepted available consultation slot after Ava answered scheduling and treatment-fit questions.</p></Section><div className="mt-5 grid grid-cols-2 gap-2">{["Confirm", "Reschedule", "Cancel", "Assign provider", "Send reminder"].map((a) => <Button key={a} variant="secondary" onClick={() => notify(`${a} simulated for ${selected.customer}.`)}>{a}</Button>)}</div></Card>
      </div>
    </>
  );
}

function Workflows({ workflows, setWorkflows, notify }: { workflows: typeof seedWorkflows; setWorkflows: (w: typeof seedWorkflows) => void; notify: (m: string) => void }) {
  const [simulation, setSimulation] = useState<string[]>([]);
  const blocks = [
    ["Trigger", "Incoming call is missed"],
    ["Action", "Send SMS within 15 seconds"],
    ["Wait", "10 minutes"],
    ["Condition", "Customer replied?"],
    ["YES", "Start AI qualification"],
    ["NO", "Place AI callback"],
    ["Action", "Offer consultation slots"],
    ["Action", "Update CRM"],
    ["Condition", "No response after 24 hours?"],
    ["YES", "Notify front-desk staff"],
    ["NO", "End workflow"]
  ];
  return (
    <>
      <PageTitle title="Recovery Workflows" subtitle="Automation for repetitive lead recovery, with staff notifications where human judgment is needed." />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{workflows.map((wf, i) => <Card key={wf.name} className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{wf.name}</h2><p className="mt-1 text-xs text-muted">Owner: {["Operations", "Front Desk", "Ava AI", "Practice Manager"][i % 4]}</p></div><Badge tone={toneForStatus(wf.status)}>{wf.status}</Badge></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><Info label="Leads enrolled" value={`${wf.enrolled}`} /><Info label="Conversion rate" value={wf.conversion} /><Info label="Revenue recovered" value={currency(wf.revenue)} /><Info label="Last modified" value={wf.modified} /></div><p className="mt-3 text-sm text-muted">Trigger: {wf.trigger}</p><p className="text-sm text-muted">Channels: {wf.channels}</p><Button className="mt-4" variant="secondary" onClick={() => { const copy = [...workflows]; copy[i] = { ...wf, status: wf.status === "Active" ? "Paused" : "Active" }; setWorkflows(copy); notify(`${wf.name} ${copy[i].status.toLowerCase()}.`); }}>{wf.status === "Active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{wf.status === "Active" ? "Pause" : "Start"}</Button></Card>)}</div>
      <Card className="mt-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Missed Call Recovery Builder</h2><p className="mt-1 text-sm text-muted">Published v1.4 · Draft changes available · Simulation mode ready</p></div><div className="flex flex-wrap gap-2"><Button variant="secondary">75%</Button><Button variant="secondary">Fit to screen</Button><Button variant="secondary"><Plus className="h-4 w-4" />Add step</Button></div></div>
        <div className="mt-5 overflow-x-auto rounded-lg border border-line bg-slate-50 p-5">
          <div className="grid min-w-[760px] grid-cols-3 gap-4">
            {blocks.map(([kind, label], i) => <div key={`${kind}-${label}`} className={`${kind === "YES" ? "col-start-1" : kind === "NO" ? "col-start-3" : "col-start-2"} rounded-lg border border-line bg-white p-4 text-center shadow-sm`}><Badge tone={kind === "Condition" ? "amber" : kind === "Trigger" ? "purple" : kind === "NO" ? "slate" : "blue"}>{kind}</Badge><p className="mt-3 text-sm font-semibold">{label}</p>{i < blocks.length - 1 && <ArrowRight className="mx-auto mt-3 h-4 w-4 rotate-90 text-muted" />}</div>)}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2"><Button onClick={() => { setSimulation(["0s Missed call captured", "12s SMS sent", "3m customer replied", "6m AI qualification complete", "7m consultation offered", "8m CRM updated"]); notify("Simulation complete: missed call recovered, qualified, and booked."); }}><Play className="h-4 w-4" />Test workflow</Button><Button variant="secondary">Version history</Button><Button variant="secondary">Publish draft</Button></div>
        {simulation.length > 0 && <div className="mt-4 rounded-md bg-ink p-4 text-sm text-white"><p className="mb-2 font-semibold">Simulation log</p>{simulation.map((line) => <p key={line} className="py-1 text-slate-200">{line}</p>)}</div>}
      </Card>
    </>
  );
}

function Analytics() {
  const byTreatment = treatments.map((name, i) => ({ name, value: 12 + i * 4 }));
  const locationData = [{ name: "Downtown Austin", value: 22400 }, { name: "North Austin", value: 16020 }];
  const spendData = revenueByChannel.map((item, i) => ({ name: item.name, spend: [4200, 3100, 1800, 900, 1200][i], recovered: item.value }));
  return (
    <>
      <PageTitle title="Revenue Analytics" subtitle="Estimated recovered revenue is labeled clearly and tied to attribution logic, not promised treatment revenue." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Recovered This Month", "$38,420", "+31%", CircleDollarSign],
          ["Pipeline Value", "$96,800", "+22%", TrendingUp],
          ["Highest ROI Workflow", "Missed Call", "+34%", Workflow],
          ["Best Lead Source", "Google Ads", "+28%", Target],
          ["Average Consultation Value", "$612", "+8%", DollarSign],
          ["Top Treatment", "Botox", "+18%", Sparkles],
          ["Estimated ROI", "6.8x", "+1.2x", TrendingUp],
          ["Cost per Booked Consultation", "$42", "-14%", CircleDollarSign]
        ].map(([label, value, change, Icon]) => {
          const RealIcon = Icon as typeof CircleDollarSign;
          const name = label as string;
          const kind = name.includes("Revenue") || name.includes("Pipeline") || name.includes("ROI") || name.includes("Value") ? "Estimated" : name.includes("Highest") || name.includes("Best") || name.includes("Top") ? "Actual" : "Actual";
          return <StatCard key={name} label={name} value={value as string} change={change as string} icon={<RealIcon className="h-4 w-4" />} dataKind={kind as "Actual" | "Estimated"} sublabel={name === "Recovered This Month" ? "Estimated, not guaranteed revenue" : undefined} tooltip="Estimated recovered revenue = Attributed booked consultations × historical consultation-to-treatment conversion rate × average treatment value. Revenue estimates are directional and should be reconciled with completed treatments and payment data." />;
        })}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Revenue Recovered Over Time"><ResponsiveContainer width="100%" height={280}><AreaChart data={analytics90}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" /><XAxis dataKey="day" hide /><YAxis /><Tooltip /><Area dataKey="recovered" stroke="#4f46e5" fill="#e0e7ff" /></AreaChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Revenue by Channel"><ResponsiveContainer width="100%" height={280}><BarChart data={revenueByChannel}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" /><XAxis dataKey="name" /><YAxis tickFormatter={(v) => `$${v / 1000}k`} /><Tooltip formatter={(v) => currency(Number(v))} /><Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Conversion by Treatment"><ResponsiveContainer width="100%" height={280}><BarChart data={byTreatment}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Revenue per Workflow"><ResponsiveContainer width="100%" height={280}><BarChart data={seedWorkflows}><XAxis dataKey="name" hide /><YAxis tickFormatter={(v) => `$${v / 1000}k`} /><Tooltip formatter={(v) => currency(Number(v))} /><Bar dataKey="revenue" fill="#0ea5e9" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Conversion by Location"><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={locationData} dataKey="value" nameKey="name" outerRadius={105}>{locationData.map((_, i) => <Cell key={i} fill={palette[i]} />)}</Pie><Tooltip formatter={(v) => currency(Number(v))} /></PieChart></ResponsiveContainer></ChartCard>
        <ChartCard title="AI-Handled vs Staff-Assisted Conversion"><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: "AI-led", value: 68 }, { name: "Staff-assisted", value: 32 }]} dataKey="value" nameKey="name" outerRadius={105}>{[0, 1].map((i) => <Cell key={i} fill={palette[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Marketing Spend vs Recovered Revenue"><ResponsiveContainer width="100%" height={280}><BarChart data={spendData}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(v) => currency(Number(v))} /><Bar dataKey="spend" fill="#94a3b8" radius={[6, 6, 0, 0]} /><Bar dataKey="recovered" fill="#10b981" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
      </div>
      <Card className="mt-5 p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2"><h2 className="font-semibold">Revenue Attribution Methodology</h2><DataLabel kind="Estimated" /></div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div><h3 className="text-sm font-semibold">Attribution logic</h3><ul className="mt-2 grid gap-2 text-sm text-slate-700"><li>Legion responds to a previously missed inquiry.</li><li>Legion re-engages an inactive lead.</li><li>Legion completes qualification.</li><li>Legion directly books or rebooks the consultation.</li><li>Legion triggers the workflow that results in booking.</li></ul></div>
          <div><h3 className="text-sm font-semibold">Revenue estimate</h3><p className="mt-2 rounded-md bg-slate-50 p-3 text-sm leading-6">Estimated recovered revenue = Attributed booked consultations × historical consultation-to-treatment conversion rate × average treatment value</p></div>
          <div><h3 className="text-sm font-semibold">Confidence levels</h3><div className="mt-2 grid gap-2 text-sm"><p><Badge tone="green">High confidence</Badge> Direct AI-led booking</p><p><Badge tone="purple">Medium confidence</Badge> AI and staff jointly influenced conversion</p><p><Badge tone="slate">Low confidence</Badge> Legion influenced the journey but did not directly complete booking</p></div></div>
        </div>
        <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-medium text-amber-800">Revenue estimates are directional and should be reconciled with completed treatments and payment data.</p>
      </Card>
      <Card className="mt-5 overflow-hidden"><div className="p-5"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">Recovered Opportunities</h2><Badge tone="amber">Estimated, not guaranteed revenue</Badge></div><p className="mt-2 text-sm text-muted">Estimated recovered revenue = booked consultations attributed to Legion x consultation-to-treatment conversion rate x average treatment value.</p></div><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-muted"><tr>{["Customer", "Original issue", "Recovery action", "Consultation booked", "Estimated revenue", "Attribution confidence", "Lead source", "Workflow"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{["Sarah Martinez", "Kayla Brooks", "Jasmine Walker", "Olivia Grant", "Dana Rivera"].map((name, i) => <tr key={name} className="border-t border-line"><td className="px-4 py-3 font-semibold">{name}</td><td className="px-4 py-3">{["Pricing question", "Missed call", "Abandoned lead", "After-hours inquiry", "Financing question"][i]}</td><td className="px-4 py-3">{["AI qualification", "SMS in 15 seconds", "Re-engagement workflow", "AI booking", "Staff callback task"][i]}</td><td className="px-4 py-3">Yes</td><td className="px-4 py-3">{currency([620,1450,690,780,2400][i])}</td><td className="px-4 py-3" tabIndex={0} title="High confidence: first engaged, qualified, and booked directly through a Legion workflow. Medium confidence: Legion contributed to follow-up or booking, but staff also participated. Low confidence: Legion influenced the journey, but direct causation is uncertain."><Badge tone={i === 4 ? "purple" : "green"}>{i === 4 ? "Medium confidence" : "High confidence"}</Badge></td><td className="px-4 py-3">{sources[i]}</td><td className="px-4 py-3">{seedWorkflows[i].name}</td></tr>)}</tbody></table></Card>
    </>
  );
}

function AgentConfig({ notify }: { notify: (m: string) => void }) {
  const [message, setMessage] = useState("How much is Botox for forehead lines?");
  const [response, setResponse] = useState("Preview response will appear here.");
  const isEscalation = message.toLowerCase().includes("swelling") || message.toLowerCase().includes("filler");
  return (
    <>
      <PageTitle title="AI Agent Configuration" subtitle="Ava is configured to answer approved business questions, book consultations, and escalate clinical or sensitive topics." action={<Button onClick={() => notify("Agent configuration saved.")}><Save className="h-4 w-4" />Save</Button>} />
      <div className="grid gap-5 xl:grid-cols-[1fr_.85fr]">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-indigo-700">Agent profile</p><h2 className="text-xl font-semibold">Ava</h2><p className="text-sm text-muted">Glow Aesthetics AI Concierge</p></div><Badge tone="green">Active</Badge></div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">{[["Role", "AI receptionist"], ["Voice", "Warm professional"], ["Language", "English, Spanish"], ["Location coverage", "Downtown and North Austin"], ["Last updated", "Today, 8:30 AM"], ["Active channels", "SMS, web, phone, Instagram"]].map(([label, value]) => <Info key={label} label={label} value={value} />)}</div>
          <h3 className="mt-6 font-semibold">Tone Controls</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-5">{["Warm", "Professional", "Concise", "Consultative", "Luxury"].map((tone, i) => <label key={tone} className={`rounded-md border p-3 text-sm ${["Warm", "Professional"].includes(tone) ? "border-indigo-200 bg-indigo-50" : "border-line"}`}><span className="font-medium">{tone}</span><input aria-label={`${tone} tone`} type="range" min="0" max="100" defaultValue={[84, 92, 64, 76, 58][i]} className="mt-3 w-full" /></label>)}</div>
          <h3 className="mt-6 font-semibold">Enabled Restrictions</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">{["No medical diagnosis", "No treatment recommendations", "Escalate post-procedure complications", "Escalate pricing exceptions", "Escalate customer complaints", "Require human review for urgent concerns", "Respect contact preferences", "Follow message frequency limits"].map((item) => <div key={item} className="flex items-center gap-2 rounded-md bg-slate-50 p-3 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{item}</div>)}</div>
        </Card>
        <div className="grid gap-5">
          <Card className="p-5"><h2 className="font-semibold">Knowledge Base</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{["Treatments", "Frequently Asked Questions", "Locations", "Providers", "Pricing Ranges", "Consultation Policies", "Cancellation Policies", "Promotions", "Safety and Escalation Rules"].map((item, i) => <div key={item} className="rounded-md border border-line p-3 text-sm"><div className="flex justify-between gap-2"><span className="font-semibold">{item}</span><Badge tone="green">Synced</Badge></div><p className="mt-2 text-xs text-muted">{18 + i * 7} entries · updated {i + 1}d ago</p><Button className="mt-3" variant="ghost">Edit</Button></div>)}</div></Card>
          <Card className="p-5"><h2 className="font-semibold">Test Agent</h2><p className="mt-1 text-sm text-muted">Ask Ava a test question</p><div className="mt-3 flex flex-wrap gap-2">{["What does Botox cost?", "Can I book tomorrow?", "I am having swelling after filler.", "Can I reschedule?", "Do you offer financing?"].map((sample) => <Button key={sample} variant="secondary" onClick={() => setMessage(sample)}>{sample}</Button>)}</div><textarea aria-label="Ask Ava a test question" value={message} onChange={(e) => setMessage(e.target.value)} className="mt-3 h-24 w-full rounded-md border border-line p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /><Button className="mt-3" onClick={() => setResponse(isEscalation ? "This may require clinical guidance, so I’m transferring you to the medical team now. For severe or rapidly worsening symptoms, seek urgent medical care." : "Thanks for reaching out. Pricing depends on treatment areas and provider recommendations, so I can help schedule a complimentary consultation for an accurate plan.")}><Send className="h-4 w-4" />Preview response</Button><p className="mt-3 rounded-md bg-indigo-50 p-3 text-sm leading-6 text-indigo-950">{response}</p><div className="mt-3 grid grid-cols-2 gap-3 text-sm"><Info label="Intent detected" value={isEscalation ? "Clinical concern" : "Consultation inquiry"} /><Info label="Escalation decision" value={isEscalation ? "Escalate to staff" : "AI can handle"} /><Info label="Knowledge source" value={isEscalation ? "Safety rules" : "Pricing guidance"} /><Info label="Confidence" value={isEscalation ? "98%" : "94%"} /><Info label="Actions triggered" value={isEscalation ? "Pause AI, notify nurse" : "Offer booking slots"} /></div></Card>
        </div>
      </div>
    </>
  );
}

function Integrations({ notify }: { notify: (message: string) => void }) {
  const [cards, setCards] = useState(integrations.map((item, i) => ({
    ...item,
    category: ["Calendar", "Calendar", "CRM", "CRM", "Scheduling", "Scheduling", "Scheduling", "Ads", "Social", "Ads", "Messaging", "Automation", "Developer"][i],
    description: ["Sync consultation availability.", "Sync staff calendars.", "Create and update contacts.", "Route high-value opportunities.", "Read appointments and providers.", "Sync class and booking data.", "Connect medspa operations.", "Capture paid leads.", "Recover social DMs.", "Attribute recovered revenue.", "Send SMS and callback events.", "Trigger automations.", "Send event payloads."][i],
    lastSync: item.status === "Connected" ? "12 minutes ago" : "Not synced",
    data: ["Appointments", "Availability", "Contacts", "Deals", "Bookings", "Clients", "Providers", "Leads", "Messages", "Campaigns", "SMS", "Zaps", "Events"][i]
  })));
  const [configuring, setConfiguring] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <PageTitle title="Integrations" subtitle="Simulated connections for calendars, CRMs, scheduling systems, ad sources, messaging, and automation." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((integration, i) => <Card key={integration.name} className="p-4"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-indigo-700"><PlugIcon name={integration.name} /></div><div><h2 className="font-semibold">{integration.name}</h2><p className="mt-1 text-xs font-medium text-muted">{integration.category}</p></div></div><Badge tone={toneForStatus(integration.status)}>{integration.status}</Badge></div><p className="mt-3 text-sm text-muted">{integration.description}</p><div className="mt-3 grid grid-cols-2 gap-2 text-sm"><Info label="Last sync" value={integration.lastSync} /><Info label="Data shared" value={integration.data} /></div><div className="mt-4 flex gap-2"><Button variant="secondary" disabled={integration.status === "Coming Soon"} onClick={() => setConfiguring(i)}><ExternalLink className="h-4 w-4" />Configure</Button><Button variant="ghost" disabled={integration.status !== "Connected"} onClick={() => notify(`${integration.name} connection healthy.`)}>Test connection</Button></div></Card>)}</div>
      {configuring !== null && <Modal title={`Configure ${cards[configuring].name}`} onClose={() => setConfiguring(null)}><div className="grid gap-3 text-sm"><label className="grid gap-1 font-medium">Account name<input className="h-10 rounded-md border border-line px-3 font-normal" defaultValue="Glow Aesthetics MedSpa" /></label><label className="grid gap-1 font-medium">Sync mode<Select value="Leads and appointments" onChange={() => null} options={["Leads and appointments", "Appointments only", "Events only"]} /></label><Button disabled={loading} onClick={() => { const name = cards[configuring].name; setLoading(true); window.setTimeout(() => { setCards((current) => current.map((card, i) => i === configuring ? { ...card, status: "Connected", lastSync: "Just now" } : card)); setLoading(false); setConfiguring(null); notify(`${name} connected successfully.`); }, 700); }}>{loading ? "Connecting..." : "Connect integration"}</Button></div></Modal>}
    </>
  );
}

function PlugIcon({ name }: { name: string }) {
  const letter = name.slice(0, 1);
  return <span className="text-sm font-bold">{letter}</span>;
}

function IntegrationModal({ name, onClose, notify }: { name: string; onClose: () => void; notify: (m: string) => void }) {
  return <Modal title={`Configure ${name}`} onClose={onClose}><div className="grid gap-3 text-sm"><label className="grid gap-1 font-medium">Account name<input className="h-10 rounded-md border border-line px-3 font-normal" defaultValue="Glow Aesthetics MedSpa" /></label><label className="grid gap-1 font-medium">Sync mode<Select value="Leads and appointments" onChange={() => null} options={["Leads and appointments", "Appointments only", "Events only"]} /></label><Button onClick={() => { notify(`${name} connected successfully.`); onClose(); }}><Check className="h-4 w-4" />Connect integration</Button></div></Modal>;
}

function Onboarding({ notify }: { notify: (m: string) => void }) {
  const [step, setStep] = useState(1);
  const steps = ["Business Profile", "Communication", "Calendar", "AI Agent", "Activation"];
  return (
    <>
      <PageTitle title="Settings and Onboarding" subtitle="Five-step setup for activating the revenue recovery engine at Glow Aesthetics." />
      <Card className="p-5">
        <div className="mb-6 grid gap-2 md:grid-cols-5">{steps.map((s, i) => <button key={s} onClick={() => setStep(i + 1)} className={`rounded-md border p-3 text-sm font-medium ${step === i + 1 ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-line bg-white"}`}>{i + 1}. {s}</button>)}</div>
        {step < 5 ? <div className="grid gap-4 md:grid-cols-2">{["Business name", "Primary location", "Phone number", "SMS provider", "Scheduling system", "Default workflow"].map((f) => <label key={f} className="grid gap-1 text-sm font-medium">{f}<input className="h-10 rounded-md border border-line px-3 font-normal" defaultValue={f === "Business name" ? "Glow Aesthetics MedSpa" : ""} /></label>)}</div> : <div className="rounded-lg bg-emerald-50 p-5 text-emerald-900"><h2 className="text-xl font-semibold">Your Legion Revenue Recovery Engine is ready.</h2>{["Phone connected", "SMS connected", "Calendar connected", "AI agent configured", "Missed-call workflow active", "Analytics tracking enabled"].map((item) => <p key={item} className="mt-3 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{item}</p>)}</div>}
        <div className="mt-6 flex justify-between"><Button variant="secondary" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</Button><Button onClick={() => step === 5 ? notify("Activation summary confirmed.") : setStep(step + 1)}>{step === 5 ? "Finish" : "Continue"}<ArrowRight className="h-4 w-4" /></Button></div>
      </Card>
    </>
  );
}
