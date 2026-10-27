"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import {
  CalendarDays,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/** Three or more notifications this close together pop up as one summary that counts up, not a stack. */
const BURST_MS = 10_000;
const BURST_AT = 3;

type NavItem = { href: string; label: string; icon: LucideIcon; badge?: "review" | "pending" };

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Approval Workflow",
    items: [
      { href: "/dashboard", label: "Overview & Pendency", icon: LayoutDashboard },
      { href: "/dashboard/applications", label: "Scrutiny & Workflow", icon: Layers, badge: "pending" },
      { href: "/dashboard/compliance", label: "Lease & Document Validity", icon: FileText, badge: "review" },
      { href: "/dashboard/evc", label: "EVC Inspection Hub", icon: CalendarDays },
    ],
  },
];

function initials(name: string | undefined) {
  return (name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const me = {
    full_name: "Dr. R. K. Srivastav",
    email: "ro.north@aicte-india.org",
  };
  const isLoading = false;
  const live = true;
  const status = { to_review: 4, pending_approval: 2 };

  const logout = () => {
    router.replace("/");
  };

  const current = NAV.flatMap((s) => s.items).find((i) => (i.href === "/dashboard" ? pathname === i.href : pathname.startsWith(i.href)));

  const badgeFor = (badge?: NavItem["badge"]) => {
    if (badge === "review") return status?.to_review || 0;
    if (badge === "pending") return status?.pending_approval || 0;
    return 0;
  };

  const renderNav = (scope: string) => (
    <LayoutGroup id={scope}>
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto py-6 scrollbar-thin" aria-label="Dashboard">
      {NAV.map(({ section, items }) => (
        <div key={section}>
          <p className="label-caps mb-2 px-6 text-[10px] text-muted-foreground">{section}</p>
          {items.map(({ href, label, icon: Icon, badge }) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            const count = badgeFor(badge);
            return (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined}
                className={cn("group relative mx-3 flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                  active ? "text-primary-foreground" : "text-foreground/75 hover:bg-accent hover:text-accent-foreground")}>
                {/* The blue highlight slides from the old item to the new one */}
                {active && <motion.span layoutId="nav-active" aria-hidden className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                  transition={{ type: "spring", stiffness: 520, damping: 42 }} />}
                <Icon className="relative h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                <span className="relative flex-1 truncate">{label}</span>
                {count > 0 && (
                  <span className={cn("relative min-w-6 rounded-full border px-1.5 text-center text-[10px] leading-5 tabular-nums",
                    active ? "border-primary-foreground/70" : badge === "review" ? "border-primary bg-primary text-primary-foreground" : "border-warning text-warning")}>
                    {count > 999 ? "999+" : count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
    </LayoutGroup>
  );

  const footer = (
    <div className="border-t border-line/60 px-6 py-4 text-xs text-muted-foreground">
      <div className="flex items-center justify-between">
        <span className="label-caps text-[10px]">SLA Compliance</span>
        <span className="tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">92.4%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary/15">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: "92.4%" }} />
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span>Review Cycle</span>
        <span className="font-mono text-foreground font-semibold">2026–2027</span>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        HireFlow Platform
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-line/60 lg:flex">
        <div className="flex h-16 items-center border-b border-line/60 px-6"><Logo href="/dashboard" /></div>
        {renderNav("desktop-nav")}
        {footer}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex w-[272px] flex-col gap-0 border-line/60 p-0">
          <SheetTitle className="flex h-16 items-center border-b border-line/60 px-6"><Logo href="/dashboard" /></SheetTitle>
          <SheetDescription className="sr-only">Dashboard navigation</SheetDescription>
          {renderNav("mobile-nav")}
          {footer}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-line/60 bg-background/90 px-4 backdrop-blur lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></Button>
          <p className="label-caps hidden text-muted-foreground sm:block">
            <span className="text-primary font-bold">HireFlow</span> / {current?.label || "Dashboard"}
          </p>
          <div className="flex-1" />
          
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-muted/60 border rounded-lg text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-muted-foreground">Role:</span>
            <span className="font-semibold text-foreground">Regional Officer (RO)</span>
          </div>

          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 flex items-center gap-3 px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
              <div className="hidden text-right text-sm sm:block">
                <p className="font-medium leading-tight">{me?.full_name}</p>
                <p className="text-xs text-muted-foreground">{me?.email}</p>
              </div>
              <Avatar className="h-9 w-9 border border-line">
                <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">{initials(me?.full_name)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="font-medium">{me?.full_name}</p>
                <p className="text-xs text-muted-foreground">{me?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={logout}><LogOut className="mr-2 h-4 w-4" /> Home / Exit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
