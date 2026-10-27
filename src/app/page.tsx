import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] border-x border-line/70">
        {/* Navigation Bar */}
        <header className="flex h-20 items-center justify-between border-b border-line/70 px-6 sm:px-10">
          <Logo href="/dashboard" />
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground hidden sm:inline-block"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/applications"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground hidden sm:inline-block"
            >
              Scrutiny Board
            </Link>
            <Link
              href="/dashboard/compliance"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground hidden sm:inline-block"
            >
              Lease Vault
            </Link>
            <ThemeToggle />
            <Link href="/dashboard" className={buttonVariants({ size: "default" })}>
              Launch Portal <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-20 sm:px-12 lg:px-20 border-b border-line/70 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              HireFlow Enterprise • Automated Workflow Engine
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.15]">
              Integrated Workflow Automation, Compliance &amp; Alert Engine
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              End-to-end automation of technical institution approval workflows under the Approval Process Handbook (APH 2026–2027). Eliminates manual coordination with automated scrutiny routing, 90/60/30-day lease validity countdowns, and hierarchical SLA escalations.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/dashboard" className={buttonVariants({ size: "xl" })}>
                Open Executive Dashboard <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
              <Link href="/dashboard/applications" className={buttonVariants({ size: "xl", variant: "outline" })}>
                View Scrutiny Pipeline
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Core Features Showcase */}
        <section className="px-6 py-16 sm:px-12 lg:px-20 border-b border-line/70">
          <div className="mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
              Core Technical Capabilities
            </h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Engineered for Regulation Bureau Excellence
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-xl border border-line/70 bg-card p-6 space-y-3 transition-all hover:border-primary/50 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">1. Pendency &amp; Ageing Monitor</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Consolidated real-time dashboards tracking application ageing curves across 6 AICTE regions with automated bottleneck detection.
              </p>
              <Link href="/dashboard" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
                Explore Dashboard &rarr;
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-line/70 bg-card p-6 space-y-3 transition-all hover:border-primary/50 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">2. Scrutiny Workflow Board</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Configurable APH stage routing: Scrutiny, EVC, and SAC/SHC. Includes deficiency notice generation and audit trails.
              </p>
              <Link href="/dashboard/applications" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
                View Scrutiny Board &rarr;
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-line/70 bg-card p-6 space-y-3 transition-all hover:border-primary/50 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">3. Lease &amp; Document Validity</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Continuous countdown tracking for registered 30-year lease deeds and building permits with 90/60/30-day alerts and renewal uploads.
              </p>
              <Link href="/dashboard/compliance" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
                Open Lease Vault &rarr;
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-line/70 bg-card p-6 space-y-3 transition-all hover:border-primary/50 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">4. EVC Inspection Roster</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automated committee queuing, senior faculty expert assignment, site visit scheduling, and overdue inspection escalation.
              </p>
              <Link href="/dashboard/evc" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
                Manage EVC Queue &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8 sm:px-12 lg:px-20 text-xs text-muted-foreground border-t border-line/70">
          <div>
            HireFlow Workflow Automation &amp; Compliance Monitoring Platform
          </div>
          <div className="font-mono text-[11px]">
            Enterprise Process Compliant
          </div>
        </footer>
      </div>
    </main>
  );
}
