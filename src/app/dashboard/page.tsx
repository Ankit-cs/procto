"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAICTE } from "@/hooks/use-aicte";

export default function OverviewPage() {
  const { applications, documents, evcList } = useAICTE();

  // Metrics calculations
  const totalApps = applications.length;
  const inScrutiny = applications.filter((a) => a.currentStage === "SCRUTINY").length;
  const inEvcQueue = applications.filter(
    (a) => a.currentStage === "EVC_QUEUE" || a.currentStage === "EVC_SCHEDULED"
  ).length;
  const approved = applications.filter((a) => a.currentStage === "APPROVED").length;
  const deficient = applications.filter((a) => a.currentStage === "DEFICIENCY").length;
  const escalated = applications.filter((a) => a.isEscalated).length;

  const criticalDocs = documents.filter(
    (d) => d.status === "CRITICAL" || d.status === "EXPIRED"
  ).length;
  const expiringSoonDocs = documents.filter((d) => d.status === "EXPIRING_SOON").length;

  // Ageing breakdown
  const ageingNormal = applications.filter((a) => a.daysPending <= 7).length;
  const ageingWarning = applications.filter((a) => a.daysPending > 7 && a.daysPending <= 14).length;
  const ageingCritical = applications.filter((a) => a.daysPending > 14).length;

  // Regional breakdown
  const regions = [
    { name: "Northern", count: applications.filter((a) => a.region === "Northern").length, color: "bg-blue-500" },
    { name: "Western", count: applications.filter((a) => a.region === "Western").length, color: "bg-indigo-500" },
    { name: "Southern", count: applications.filter((a) => a.region === "Southern").length, color: "bg-emerald-500" },
    { name: "Central", count: applications.filter((a) => a.region === "Central").length, color: "bg-amber-500" },
    { name: "South-Western", count: applications.filter((a) => a.region === "South-Western").length, color: "bg-purple-500" },
    { name: "Eastern", count: applications.filter((a) => a.region === "Eastern").length, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Top Banner / Problem Statement Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
              HireFlow
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Smart Automation • Operations Hub
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Integrated Approval Workflow & Compliance Monitoring
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            End-to-end automation of scrutiny routing, EVC scheduling, lease validity countdowns, and automated SLA escalations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/applications">
            <Button className="gap-2 shadow-sm">
              <Layers className="h-4 w-4" /> Scrutiny Board
            </Button>
          </Link>
          <Link href="/dashboard/compliance">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Lease Vault
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical Alert Ticker */}
      {(escalated > 0 || criticalDocs > 0) && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-900 dark:text-red-200">
          <ShieldAlert className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1">
            <span className="font-semibold">Urgent Regulatory Alerts:</span>{" "}
            {criticalDocs} document(s) expired or expiring within 30 days. {escalated} application(s) exceeded prescribed APH processing SLA and escalated to higher authorities.
          </div>
          <Link href="/dashboard/compliance">
            <Button size="sm" variant="destructive" className="shrink-0 gap-1 text-xs">
              Resolve Issues <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* 5 KPI Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Applications
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApps}</div>
            <p className="text-xs text-muted-foreground mt-1">Academic Year 2026–27</p>
          </CardContent>
        </Card>

        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              In Scrutiny
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inScrutiny}</div>
            <p className="text-xs text-muted-foreground mt-1">Stage 1 Committee Review</p>
          </CardContent>
        </Card>

        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              EVC Due / Scheduled
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{inEvcQueue}</div>
            <p className="text-xs text-muted-foreground mt-1">Expert Site Inspections</p>
          </CardContent>
        </Card>

        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Critical Expiries
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalDocs}</div>
            <p className="text-xs text-muted-foreground mt-1">Lease / NOC &lt; 30 Days</p>
          </CardContent>
        </Card>

        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Approved (EoA)
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{approved}</div>
            <p className="text-xs text-muted-foreground mt-1">Cleared for Academic Year</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Grid: Regional Pendency & Application Ageing */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Regional Pendency */}
        <Card className="border-line/70">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Regional Distribution & Pendency</CardTitle>
            <CardDescription>
              Real-time application volume and pending caseload across regional offices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {regions.map((reg) => (
              <div key={reg.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground">{reg.name} Region</span>
                  <span className="font-mono text-muted-foreground">{reg.count} cases</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${reg.color} transition-all duration-500`}
                    style={{ width: `${Math.max(10, (reg.count / totalApps) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Application Ageing Breakdown */}
        <Card className="border-line/70">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Application Ageing & SLA Compliance</CardTitle>
            <CardDescription>
              Prescribed turnaround times under AICTE Approval Process Handbook (APH).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {ageingNormal}
                </div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">0–7 Days</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">On Schedule</div>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {ageingWarning}
                </div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">8–14 Days</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Approaching Limit</div>
              </div>

              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {ageingCritical}
                </div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">15+ Days</div>
                <div className="text-[10px] text-red-600 dark:text-red-400 font-medium">Escalated to BO</div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                Automatic Multi-Tier Escalation Matrix Active
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Applications exceeding 7 days in Scrutiny trigger Level 1 Regional Officer notices. Cases exceeding 14 days automatically route to Bureau Head with red flag badges.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active High-Priority Applications Table */}
      <Card className="border-line/70">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Active Applications & Immediate Action Queue</CardTitle>
            <CardDescription>Live state from the multi-stage statutory approval pipeline.</CardDescription>
          </div>
          <Link href="/dashboard/applications">
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Application No</th>
                  <th className="py-2.5 px-3">Institution & Region</th>
                  <th className="py-2.5 px-3">Course / Program</th>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Current Stage</th>
                  <th className="py-2.5 px-3">Ageing</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-foreground">{app.applicationNo}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">{app.institutionName}</div>
                      <div className="text-[11px] text-muted-foreground">AICTE ID: {app.aicteId} • {app.region}</div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{app.program}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{app.route}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        {app.currentStage}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold">
                      {app.daysPending} days
                    </td>
                    <td className="py-3 px-3">
                      {app.isEscalated ? (
                        <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-3 w-3" /> L{app.escalationLevel} Escalated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Within SLA
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
