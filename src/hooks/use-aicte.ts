"use client";

import { useEffect, useState } from "react";
import {
  ApprovalApplication,
  PrescribedDocument,
  EVCInspection,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_EVC_INSPECTIONS,
  ApplicationStage,
} from "@/lib/aicte-data";

export type UserRole = "REGIONAL_OFFICER" | "BUREAU_OFFICER" | "INSTITUTION";

export function useAICTE() {
  const [applications, setApplications] = useState<ApprovalApplication[]>(INITIAL_APPLICATIONS);
  const [documents, setDocuments] = useState<PrescribedDocument[]>(INITIAL_DOCUMENTS);
  const [evcList, setEvcList] = useState<EVCInspection[]>(INITIAL_EVC_INSPECTIONS);
  const [role, setRole] = useState<UserRole>("REGIONAL_OFFICER");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedApps = localStorage.getItem("aicte_applications");
      const savedDocs = localStorage.getItem("aicte_documents");
      const savedEvc = localStorage.getItem("aicte_evc");
      const savedRole = localStorage.getItem("aicte_role");

      if (savedApps) setApplications(JSON.parse(savedApps));
      if (savedDocs) setDocuments(JSON.parse(savedDocs));
      if (savedEvc) setEvcList(JSON.parse(savedEvc));
      if (savedRole) setRole(savedRole as UserRole);
    } catch {
      // ignore JSON parse errors
    }
    setIsLoaded(true);
  }, []);

  // Save changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("aicte_applications", JSON.stringify(applications));
      localStorage.setItem("aicte_documents", JSON.stringify(documents));
      localStorage.setItem("aicte_evc", JSON.stringify(evcList));
      localStorage.setItem("aicte_role", role);
    } catch {
      // ignore quota errors
    }
  }, [applications, documents, evcList, role, isLoaded]);

  // Actions: Advance Application Stage
  const advanceApplicationStage = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        let nextStage: ApplicationStage = app.currentStage;
        if (app.currentStage === "SUBMITTED") nextStage = "SCRUTINY";
        else if (app.currentStage === "SCRUTINY" || app.currentStage === "DEFICIENCY") {
          nextStage = app.route.includes("EVC") ? "EVC_QUEUE" : "APPROVED";
          // If moving to EVC_QUEUE, ensure EVC entry exists
          if (nextStage === "EVC_QUEUE") {
            setEvcList((curr) => {
              if (curr.some((e) => e.applicationId === app.id)) return curr;
              return [
                ...curr,
                {
                  id: `evc-${Date.now()}`,
                  applicationId: app.id,
                  applicationNo: app.applicationNo,
                  institutionName: app.institutionName,
                  aicteId: app.aicteId,
                  region: app.region,
                  status: "PENDING_SCHEDULE",
                },
              ];
            });
          }
        } else if (app.currentStage === "EVC_QUEUE" || app.currentStage === "EVC_SCHEDULED") {
          nextStage = app.route.includes("SAC") ? "SAC_SHC" : "APPROVED";
        } else if (app.currentStage === "SAC_SHC") {
          nextStage = "APPROVED";
        }

        return {
          ...app,
          currentStage: nextStage,
          isEscalated: false,
          escalationLevel: 0,
          daysPending: 1,
        };
      })
    );
  };

  // Actions: Revert for Deficiency
  const revertWithDeficiency = (appId: string, remarks: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          currentStage: "DEFICIENCY",
          deficiencyRemarks: remarks,
          daysPending: 1,
        };
      })
    );
  };

  // Actions: Renew Document (e.g. Lease Deed)
  const renewDocument = (docId: string, yearsExtended = 30) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== docId) return doc;
        const newValidFrom = new Date().toISOString().split("T")[0];
        const newExpiryYear = new Date().getFullYear() + yearsExtended;
        const newValidTo = `${newExpiryYear}-10-27`;
        return {
          ...doc,
          validFrom: newValidFrom,
          validTo: newValidTo,
          daysRemaining: yearsExtended * 365,
          status: "VALID",
          lastVerifiedBy: "Automated Registry Verification (Stamp & Registration Dept)",
          alertSent: false,
        };
      })
    );
  };

  // Actions: Schedule EVC
  const scheduleEVC = (
    evcId: string,
    scheduledDate: string,
    chair: string,
    experts: string[]
  ) => {
    setEvcList((prev) =>
      prev.map((evc) => {
        if (evc.id !== evcId) return evc;
        return {
          ...evc,
          scheduledDate,
          committeeChair: chair,
          expertMembers: experts,
          status: "SCHEDULED",
        };
      })
    );

    // Update parent application stage
    const item = evcList.find((e) => e.id === evcId);
    if (item) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === item.applicationId
            ? { ...app, currentStage: "EVC_SCHEDULED" }
            : app
        )
      );
    }
  };

  // Reset to initial demo state
  const resetDemoData = () => {
    setApplications(INITIAL_APPLICATIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setEvcList(INITIAL_EVC_INSPECTIONS);
    setRole("REGIONAL_OFFICER");
    localStorage.removeItem("aicte_applications");
    localStorage.removeItem("aicte_documents");
    localStorage.removeItem("aicte_evc");
    localStorage.removeItem("aicte_role");
  };

  return {
    applications,
    documents,
    evcList,
    role,
    setRole,
    advanceApplicationStage,
    revertWithDeficiency,
    renewDocument,
    scheduleEVC,
    resetDemoData,
  };
}
