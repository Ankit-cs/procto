"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Building,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Plus,
  Send,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAICTE } from "@/hooks/use-aicte";
import { EVCInspection } from "@/lib/aicte-data";

export default function EVCPage() {
  const { evcList, scheduleEVC, advanceApplicationStage } = useAICTE();

  // Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedEvc, setSelectedEvc] = useState<EVCInspection | null>(null);

  const [visitDate, setVisitDate] = useState("2026-11-12");
  const [chairperson, setChairperson] = useState("Prof. M. K. Sharma (IIT Delhi)");
  const [expert1, setExpert1] = useState("Dr. Vandana Rao (NIT Tiruchirappalli)");
  const [expert2, setExpert2] = useState("Prof. Anand Deshmukh (COEP Technological University)");

  const handleOpenSchedule = (evc: EVCInspection) => {
    setSelectedEvc(evc);
    setScheduleModalOpen(true);
  };

  const handleConfirmSchedule = () => {
    if (selectedEvc) {
      scheduleEVC(selectedEvc.id, visitDate, chairperson, [expert1, expert2]);
      setScheduleModalOpen(false);
      setSelectedEvc(null);
    }
  };

  const totalEvc = evcList.length;
  const scheduledCount = evcList.filter((e) => e.status === "SCHEDULED").length;
  const pendingCount = evcList.filter((e) => e.status === "PENDING_SCHEDULE").length;
  const delayedCount = evcList.filter((e) => e.delayDays && e.delayDays > 0).length;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Expert Visit Committee (EVC) Scheduling Hub
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage physical &amp; virtual site inspection queues, committee rosters, and inspection compliance deadlines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            APH Chapter II (Site Inspections)
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Inspection Queue
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvc}</div>
            <p className="text-xs text-muted-foreground mt-1">Institutions Requiring EVC</p>
          </CardContent>
        </Card>

        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Awaiting Committee Roster
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending Official Assignment</p>
          </CardContent>
        </Card>

        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Scheduled Inspections
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Dates Fixed &amp; Experts Notified</p>
          </CardContent>
        </Card>
      </div>

      {/* Inspection List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground">Active Inspection Roster &amp; Queued Institutions</h2>

        {evcList.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            No applications currently pending EVC inspection.
          </div>
        ) : (
          evcList.map((evc) => (
            <Card key={evc.id} className="border-line/70">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left: Institute details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{evc.applicationNo}</span>
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                        AICTE ID: {evc.aicteId}
                      </span>
                      <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        {evc.region} Region
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground">{evc.institutionName}</h3>

                    {evc.status === "SCHEDULED" && (
                      <div className="mt-2 space-y-1 rounded-lg border bg-muted/30 p-3 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span>Inspection Date: {evc.scheduledDate}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground">Committee Chair:</span> {evc.committeeChair}
                        </div>
                        {evc.expertMembers && (
                          <div className="text-[11px] text-muted-foreground">
                            <span className="font-semibold text-foreground">Expert Evaluators:</span>{" "}
                            {evc.expertMembers.join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Middle: Status */}
                  <div className="flex items-center gap-3 lg:border-l lg:border-r lg:px-6 lg:border-line/60">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Visit Status
                      </div>
                      <div className="mt-1">
                        {evc.status === "SCHEDULED" ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Inspection Fixed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                            <Clock className="h-3.5 w-3.5" /> Awaiting Committee Assignment
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:w-56 lg:justify-end">
                    {evc.status === "PENDING_SCHEDULE" ? (
                      <Button
                        size="sm"
                        onClick={() => handleOpenSchedule(evc)}
                        className="gap-1.5 text-xs font-semibold shadow-sm"
                      >
                        <Users className="h-3.5 w-3.5" /> Schedule Committee
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => advanceApplicationStage(evc.applicationId)}
                        className="gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Submit Report &amp; Clear
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Schedule EVC Dialog */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-primary" /> Constitute Expert Visit Committee
            </DialogTitle>
            <DialogDescription>
              Assign approved faculty experts and schedule physical verification for{" "}
              <span className="font-semibold text-foreground">{selectedEvc?.institutionName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground">Visit / Inspection Date</label>
              <Input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground">Committee Chairperson (Senior Professor)</label>
              <Input
                value={chairperson}
                onChange={(e) => setChairperson(e.target.value)}
                placeholder="Name &amp; Institution"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground">Expert Member 1 (Subject Matter Expert)</label>
              <Input
                value={expert1}
                onChange={(e) => setExpert1(e.target.value)}
                placeholder="Name &amp; Institution"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground">Expert Member 2 (Infrastructure &amp; Finance Evaluator)</label>
              <Input
                value={expert2}
                onChange={(e) => setExpert2(e.target.value)}
                placeholder="Name &amp; Institution"
                className="text-xs"
              />
            </div>

            <div className="rounded-lg border bg-muted/40 p-3 text-[11px] text-muted-foreground leading-relaxed">
              Upon confirmation, automated electronic appointment letters will be dispatched with geo-tagged inspection guidelines under APH norms.
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" size="sm" onClick={() => setScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmSchedule} className="gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Committee Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
