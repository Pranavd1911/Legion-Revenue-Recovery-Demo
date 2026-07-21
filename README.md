# Legion Revenue Recovery Engine

Interactive Next.js prototype for a Growth Product Manager take-home assignment. The product is positioned for independent MedSpas that lose revenue when inquiries, missed calls, DMs, and follow-ups are not handled quickly.

## Product Overview

Legion Revenue Recovery Engine helps Glow Aesthetics MedSpa respond immediately to new inquiries, qualify leads, book consultations, update CRM context, automate follow-up, escalate clinical or sensitive conversations to staff, and report estimated recovered revenue.

The prototype reinforces the MVP boundary: Legion does not replace front-desk teams or provide medical decision support. It handles repetitive communication and booking workflows while routing clinical, sensitive, or complex interactions to humans.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main Screens

- Overview dashboard with KPIs, charts, recovery highlights, and activity feed
- Lead Inbox with filters, sorting, lead status changes, and a detail drawer
- AI Conversation Experience with conversation tabs, CRM actions, and human escalation
- Appointment Scheduling with calendar-style appointment cards and action simulation
- Recovery Workflows with workflow cards and missed-call automation builder
- Revenue Analytics with attribution explanation and recovered opportunity table
- AI Agent Configuration for Ava, the Glow Aesthetics AI Concierge
- Integrations with simulated configuration modals and success states
- Settings and Onboarding wizard with activation summary

## Summary of Improvements

- Added an AI Executive Summary with leadership-ready operational insights and a drawer for drivers, risks, and recommendations.
- Upgraded KPI cards with icons, trend pills, sparklines, hover explanations, and stronger hierarchy.
- Replaced the generic funnel with a stepped conversion view showing conversion, drop-off, and pipeline value.
- Added a revenue recovery timeline and filterable Ava Activity feed.
- Improved lead scoring with intent category, confidence, progress visualization, estimated value, and next best action.
- Reworked conversations into a three-column AI inbox with an operational panel and a serious human escalation audit flow.
- Upgraded workflows into a more polished automation builder with version state, zoom controls, branch blocks, and simulation log.
- Expanded revenue analytics with executive summary cards, more charts, attribution confidence, and a visible “estimated, not guaranteed” label.
- Improved the AI Agent page into a configuration console with restrictions, knowledge cards, and richer test output.
- Enhanced integrations with categories, sync metadata, connection testing, loading states, and local status updates.

## Final Dashboard Refinements

- The Leads vs Booked Consultations chart uses explicit W1 through W12 labels and aligned data points.
- The Qualified to Consultations Booked funnel stage now clarifies that 178 leads are not yet booked, not permanently lost.
- The 178 unbooked qualified leads are divided into 61 active follow-up, 42 later-date requests, 31 staff-review leads, and 44 inactive or opted-out leads.
- The dashboard includes a Recommended Next Action card that turns the largest drop-off into a measurable experiment.
- Ava Activity uses operational status labels and does not show revenue beside clinical or safety events.

## Demo Mode

Use **Start Demo** in the top bar to run a guided product story:

1. AI Executive Summary
2. Lead Funnel
3. Recommended Next Action
4. Sarah Mitchell Recovery Timeline
5. Lead Inbox
6. Conversation
7. Clinical Escalation
8. Revenue Analytics

The demo supports Back, Next, Restart, and Exit Demo.

## Revenue Attribution Methodology

A recovered opportunity is attributed to Legion when Legion responds to a missed inquiry, re-engages an inactive lead, completes qualification, directly books or rebooks a consultation, or triggers the workflow that results in booking.

Estimated recovered revenue =
Attributed booked consultations × historical consultation-to-treatment conversion rate × average treatment value.

Confidence levels:
- High confidence: direct AI-led booking.
- Medium confidence: AI and staff jointly influenced conversion.
- Low confidence: Legion influenced the journey but did not directly complete booking.

Revenue estimates are directional and should be reconciled with completed treatments and payment data.

## Experiment Workflow

The Recommended Next Action and opportunity drawers can launch a simulated experiment setup for **Qualified Lead Second Follow-Up**. The modal includes hypothesis, audience, control, variant, duration, primary metric, guardrails, minimum sample, and prototype actions for saving, simulation, and starting.

## Actual, Estimated, Projected

- Actual: measured lead, booking, response-time, workflow, or activity data.
- Estimated: revenue or pipeline value derived from attribution and historical conversion assumptions.
- Projected: modeled impact from a proposed experiment or recommendation.

## Design Decisions

- Preserved the existing navigation, local mock data, single-page routing, and component structure.
- Kept the visual system restrained: white surfaces, soft grays, charcoal typography, indigo and sky accents, subtle borders, and light shadows.
- Framed AI output as operational summaries, not private reasoning.
- Made revenue recovery, attribution, and staff escalation visible in the first few minutes of the walkthrough.

## Accessibility Notes

- Interactive controls include visible focus rings and accessible labels where needed.
- Modal and drawer close buttons include aria labels.
- Tables retain semantic headers.
- Reduced-motion preferences are respected for transitions and animations.

## Demo Flow

1. Start on **Overview** and call out first response time, booking rate, missed calls recovered, and estimated recovered revenue.
2. Move to **Lead Inbox**, filter by high score or needs review, then open Sarah Martinez to show a recovered Botox inquiry.
3. Use **Conversations** to show Ava qualifying Sarah, booking the Wednesday consultation, updating CRM, and activating reminders.
4. Continue to **Appointments** and demonstrate confirm, reschedule, assign provider, and reminder actions.
5. Open **Revenue Analytics** and explain the estimated recovered revenue formula.
6. Return to **Conversations** and show the swelling scenario, where the AI restricts its response and escalates to the Nurse Coordinator.

## Assumptions

- The attached strategy report was not available in this workspace at `/mnt/data/Final Report.pdf`, so the implementation uses the full product strategy contained in the provided prompt.
- All data is local mock data.
- Integration, CRM, SMS, email, and calendar actions are simulated in the browser.
- Estimated revenue is modeled as an attributed estimate, not guaranteed collected revenue.

## Limitations

- No backend, authentication, external database, paid APIs, or real integrations are included.
- Toasts, status changes, modal connects, workflow toggles, and AI test responses are local state only.
- The prototype is optimized for desktop and tablet review.
- Drawers and modals are simulated UI surfaces; prototype focus behavior is simplified compared with production-grade focus trapping.
