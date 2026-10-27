"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAICTE } from "@/hooks/use-aicte";
import { ApplicationStage, ApprovalApplication } from "@/lib/aicte-data";

export default function ApplicationsPage() {
  const { applications, advanceApplicationStage, revertWithDeficiency } = useAICTE();
  const [filterStage, setFilterStage] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Deficiency Revert
  const [revertModalOpen, setRevertModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApprovalApplication | null>(null);
  const [deficiencyText, setDeficiencyText] = useState("");

  const handleOpenRevert = (app: ApprovalApplication) => {
    setSelectedApp(app);
    setDeficiencyText("");
    setRevertModalOpen(true);
  };

  const handleConfirmRevert = () => {
    if (selectedApp && deficiencyText.trim()) {
      revertWithDeficiency(selectedApp.id, deficiencyText);
      setRevertModalOpen(false);
      setSelectedApp(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStage =
      filterStage === "ALL" ||
      (filterStage === "SCRUTINY" && app.currentStage === "SCRUTINY") ||
      (filterStage === "EVC" && (app.currentStage === "EVC_QUEUE" || app.currentStage === "EVC_SCHEDULED")) ||
      (filterStage === "DEFICIENCY" && app.currentStage === "DEFICIENCY") ||
      (filterStage === "APPROVED" && app.currentStage === "APPROVED");

    const matchesSearch =
      app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.aicteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStage && matchesSearch;
  });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Scrutiny & Approval Workflow Board
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor and route applications through APH statutory stages: Scrutiny, EVC, SAC/SHC, and Final EoA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            APH 2026–2027 Pipeline Active
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "ALL", label: "All Cases" },
            { id: "SCRUTINY", label: "In Scrutiny" },
            { id: "EVC", label: "EVC Queue" },
            { id: "DEFICIENCY", label: "Deficiency / Reverted" },
            { id: "APPROVED", label: "Approved (EoA)" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={filterStage === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStage(tab.id)}
              className="text-xs font-medium"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search College or AICTE ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Applications Grid / List */}
      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            No applications found matching the current filter.
          </div>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app.id} className="border-line/70 transition-all hover:border-primary/40">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left: Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{app.applicationNo}</span>
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                        AICTE ID: {app.aicteId}
                      </span>
                      <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        {app.region} Region
                      </span>
                      <span className="rounded border border-primary/20 bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground">
                        Route: {app.route}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground">{app.institutionName}</h3>
                    <p className="text-xs text-muted-foreground">
                      Applied for: <span className="font-medium text-foreground">{app.program}</span>
                    </p>

                    {/* Deficiency Box if reverted */}
                    {app.currentStage === "DEFICIENCY" && app.deficiencyRemarks && (
                      <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-300">
                          <AlertTriangle className="h-4 w-4" /> Official Deficiency Notes:
                        </div>
                        <p className="mt-1 font-mono text-[11px] leading-relaxed">{app.deficiencyRemarks}</p>
                      </div>
                    )}
                  </div>

                  {/* Middle: Stage & Ageing */}
                  <div className="flex items-center gap-4 lg:border-l lg:border-r lg:px-6 lg:border-line/60">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Processing Stage
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                        <Layers className="h-3.5 w-3.5" /> {app.currentStage}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Stage Ageing
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs font-mono font-bold">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className={app.daysPending > 14 ? "text-red-500" : app.daysPending > 7 ? "text-amber-500" : "text-emerald-500"}>
                          {app.daysPending} Days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:w-64 lg:justify-end">
                    {app.currentStage !== "APPROVED" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => advanceApplicationStage(app.id)}
                          className="gap-1.5 text-xs font-semibold shadow-sm"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {app.currentStage === "SCRUTINY" ? "Approve to EVC" : "Clear & Advance"}
                        </Button>

                        {app.currentStage !== "DEFICIENCY" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenRevert(app)}
                            className="gap-1 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Revert
                          </Button>
                        )}
                      </>
                    )}

                    {app.currentStage === "APPROVED" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> EoA Granted
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Revert Deficiency Dialog */}
      <Dialog open={revertModalOpen} onOpenChange={setRevertModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" /> Revert Application for Deficiency
            </DialogTitle>
            <DialogDescription>
              Record the specific APH non-compliance remarks for{" "}
              <span className="font-semibold text-foreground">{selectedApp?.institutionName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="text-xs text-muted-foreground">
              Application No: <span className="font-mono font-bold text-foreground">{selectedApp?.applicationNo}</span>
            </div>
            <Textarea
              placeholder="E.g., Deficiency under APH 2026 Section 4.2: Land lease deed missing notarized endorsement. Cadre ratio short by 2 Associate Professors."
              value={deficiencyText}
              onChange={(e) => setDeficiencyText(e.target.value)}
              className="text-xs font-mono h-28"
            />
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" size="sm" onClick={() => setRevertModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmRevert}
              disabled={!deficiencyText.trim()}
              className="gap-1.5"
            >
              <Send className="h-3.5 w-3.5" /> Issue Deficiency Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
