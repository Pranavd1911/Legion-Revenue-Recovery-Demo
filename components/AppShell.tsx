"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Bell, Bot, CalendarDays, ChartNoAxesCombined, ChevronDown, Inbox, LayoutDashboard, MessageSquare, Plug, Search, Settings, Sparkles, UserCircle, Workflow } from "lucide-react";

export type Screen = "overview" | "leads" | "conversations" | "appointments" | "workflows" | "analytics" | "agent" | "integrations" | "settings" | "onboarding";

const navItems: { id: Screen; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "leads", label: "Lead Inbox", icon: Inbox },
  { id: "conversations", label: "Conversations", icon: MessageSquare },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "workflows", label: "Recovery Workflows", icon: Workflow },
  { id: "analytics", label: "Revenue Analytics", icon: ChartNoAxesCombined },
  { id: "agent", label: "AI Agent", icon: Bot },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "settings", label: "Settings", icon: Settings }
];

export function AppShell({
  active,
  onNavigate,
  location,
  onLocation,
  range,
  onRange,
  children
  , onStartDemo
}: {
  active: Screen;
  onNavigate: (screen: Screen) => void;
  location: string;
  onLocation: (value: string) => void;
  range: string;
  onRange: (value: string) => void;
  children: React.ReactNode;
  onStartDemo?: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#f7f8fb] lg:flex">
      <aside className="border-line bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-r">
        <div className="flex h-16 items-center gap-3 border-b border-line px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">L</div>
          <div>
            <p className="font-semibold leading-tight">Legion</p>
            <p className="text-xs text-muted">Revenue Recovery Engine</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-3 lg:grid lg:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-ink focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                  active === item.id && "bg-indigo-50 text-indigo-700"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="m-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-900">MVP focus</p>
          <p className="mt-1 text-xs leading-5 text-indigo-700">Recover missed inquiries, book consultations, and escalate clinical conversations to people.</p>
        </div>
      </aside>
      <div className="lg:ml-72 lg:flex-1">
        <header className="sticky top-0 z-30 border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="mr-auto">
              <p className="text-sm font-semibold">Glow Aesthetics MedSpa</p>
              <p className="text-xs text-muted">Austin, Texas · 2 locations</p>
            </div>
            <select value={location} onChange={(event) => onLocation(event.target.value)} className="h-10 rounded-md border border-line bg-white px-3 text-sm">
              <option>All locations</option>
              <option>Downtown Austin</option>
              <option>North Austin</option>
            </select>
            <select value={range} onChange={(event) => onRange(event.target.value)} className="h-10 rounded-md border border-line bg-white px-3 text-sm">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This quarter</option>
            </select>
            <div className="hidden h-10 items-center gap-2 rounded-md border border-line bg-slate-50 px-3 md:flex">
              <Search className="h-4 w-4 text-muted" />
              <input className="w-44 bg-transparent text-sm outline-none" placeholder="Search leads, workflows" />
            </div>
            <Button onClick={onStartDemo}>
              <Sparkles className="h-4 w-4" />
              Start Demo
            </Button>
            <Button variant="secondary" onClick={() => onNavigate("conversations")}>
              <Bot className="h-4 w-4" />
              View Live Agent
            </Button>
            <button className="rounded-md border border-line p-2 text-muted hover:bg-slate-50" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-2 rounded-md border border-line px-2 py-2 text-sm" aria-label="User menu">
              <UserCircle className="h-5 w-5 text-muted" />
              <ChevronDown className="h-3 w-3 text-muted" />
            </button>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-ink">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
