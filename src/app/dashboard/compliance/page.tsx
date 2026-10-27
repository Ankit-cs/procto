"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAICTE } from "@/hooks/use-aicte";
import { PrescribedDocument } from "@/lib/aicte-data";

export default function CompliancePage() {
  const { documents, renewDocument } = useAICTE();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Renewal Upload
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<PrescribedDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleOpenUpload = (doc: PrescribedDocument) => {
    setSelectedDoc(doc);
    setIsUploading(false);
    setUploadModalOpen(true);
  };

  const handleConfirmRenew = () => {
    if (!selectedDoc) return;
    setIsUploading(true);
    setTimeout(() => {
      renewDocument(selectedDoc.id, 30);
      setIsUploading(false);
      setUploadModalOpen(false);
      setSelectedDoc(null);
    }, 800);
  };

  const totalDocs = documents.length;
  const validDocs = documents.filter((d) => d.status === "VALID").length;
  const expiringSoonDocs = documents.filter((d) => d.status === "EXPIRING_SOON").length;
  const criticalDocs = documents.filter((d) => d.status === "CRITICAL" || d.status === "EXPIRED").length;

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter =
      filterStatus === "ALL" ||
      (filterStatus === "CRITICAL" && (doc.status === "CRITICAL" || doc.status === "EXPIRED")) ||
      (filterStatus === "EXPIRING_SOON" && doc.status === "EXPIRING_SOON") ||
      (filterStatus === "VALID" && doc.status === "VALID");

    const matchesSearch =
      doc.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.aicteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Lease & Prescribed Document Validity Vault
          </h1>
          <p className="text-sm text-muted-foreground">
            Continuous validity monitoring of registered 30-year lease deeds, land titles, building approvals, and FDRs under APH regulations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Automated 90/60/30-Day Alert Matrix Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Monitored Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocs}</div>
            <p className="text-xs text-muted-foreground mt-1">Institutional Deeds & Proofs</p>
          </CardContent>
        </Card>

        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Valid (&gt; 90 Days)
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{validDocs}</div>
            <p className="text-xs text-muted-foreground mt-1">Legally Verified & Active</p>
          </CardContent>
        </Card>

        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Expiring Soon (30–90d)
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{expiringSoonDocs}</div>
            <p className="text-xs text-muted-foreground mt-1">Advance Notice Dispatched</p>
          </CardContent>
        </Card>

        <Card className="border-line/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Critical / Expired (&lt; 30d)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalDocs}</div>
            <p className="text-xs text-muted-foreground mt-1">Immediate Escalation & Block</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "ALL", label: "All Documents" },
            { id: "CRITICAL", label: "Critical (<30d & Expired)" },
            { id: "EXPIRING_SOON", label: "Expiring Soon (30–90d)" },
            { id: "VALID", label: "Valid (>90d)" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={filterStatus === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(tab.id)}
              className="text-xs font-medium"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Institution, Document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Document Table */}
      <Card className="border-line/70">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Institution & AICTE ID</th>
                  <th className="py-3 px-4">Prescribed Document</th>
                  <th className="py-3 px-4">Validity Range</th>
                  <th className="py-3 px-4">Days Left</th>
                  <th className="py-3 px-4">Compliance Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{doc.institutionName}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">AICTE ID: {doc.aicteId}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <FileCheck className="h-4 w-4 text-primary shrink-0" />
                        <span>{doc.docType}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                      <div>From: {doc.validFrom}</div>
                      <div>To: <span className="font-semibold text-foreground">{doc.validTo}</span></div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold">
                      {doc.daysRemaining <= 0 ? (
                        <span className="text-red-600 dark:text-red-400">EXPIRED ({Math.abs(doc.daysRemaining)}d ago)</span>
                      ) : doc.daysRemaining < 30 ? (
                        <span className="text-red-500">{doc.daysRemaining} days</span>
                      ) : doc.daysRemaining <= 90 ? (
                        <span className="text-amber-500">{doc.daysRemaining} days</span>
                      ) : (
                        <span className="text-emerald-500">{doc.daysRemaining} days</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {doc.status === "EXPIRED" && (
                        <span className="inline-flex items-center gap-1 rounded bg-red-600/15 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-300">
                          <AlertTriangle className="h-3 w-3" /> Statutory Expiry • Approval Blocked
                        </span>
                      )}
                      {doc.status === "CRITICAL" && (
                        <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                          <AlertCircle className="h-3 w-3" /> Critical &lt; 30d • Final Notice Sent
                        </span>
                      )}
                      {doc.status === "EXPIRING_SOON" && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          <Clock className="h-3 w-3" /> Expiring Soon • Reminder Dispatched
                        </span>
                      )}
                      {doc.status === "VALID" && (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Compliant &amp; Active
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant={doc.status === "VALID" ? "outline" : "default"}
                        onClick={() => handleOpenUpload(doc)}
                        className="gap-1 text-xs"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        {doc.status === "VALID" ? "Update Document" : "Upload Renewal Deed"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Renewal Deed Upload Dialog */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <UploadCloud className="h-5 w-5 text-primary" /> Upload Registered Renewal Deed
            </DialogTitle>
            <DialogDescription>
              Submit verified renewed document for{" "}
              <span className="font-semibold text-foreground">{selectedDoc?.institutionName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1">
              <div><span className="text-muted-foreground">Document:</span> <span className="font-semibold">{selectedDoc?.docType}</span></div>
              <div><span className="text-muted-foreground">AICTE ID:</span> <span className="font-mono">{selectedDoc?.aicteId}</span></div>
              <div><span className="text-muted-foreground">Previous Expiry:</span> <span className="font-mono text-red-500">{selectedDoc?.validTo}</span></div>
            </div>

            <div className="rounded-xl border border-dashed p-6 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-xs font-semibold text-foreground">Registered_Deed_Sub_Registrar_Signed.pdf</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">3.4 MB • Digital Stamp &amp; Registration Verified</p>
            </div>

            <div className="text-[11px] text-muted-foreground">
              By confirming, the system verifies the 30-year lease extension clause and automatically restores the institution to full statutory compliance.
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" size="sm" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmRenew}
              disabled={isUploading}
              className="gap-1.5"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Verifying with Land Registry...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Confirm &amp; Extend Validity (30 Yrs)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
