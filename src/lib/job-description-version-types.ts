// Job Description Version Types

import type { HiveQuadrantData } from "./job-description-types";

export interface JobDescriptionVersion {
  id: string;
  jobDescriptionId: string;
  versionNumber: number;
  title: string;
  position: string;
  hiveQuadrants: HiveQuadrantData;
  createdAt: Date;
  createdBy: string;
  tags: string[];
  notes: string;
  isFavorite: boolean;
  changesSummary?: string; // Description of what changed in this version
}

export interface JobDescriptionWithVersions {
  id: string;
  title: string;
  position: string;
  currentVersionId: string;
  versions: JobDescriptionVersion[];
}

// Create a new version from existing data
export function createVersion(
  jobDescriptionId: string,
  versionNumber: number,
  title: string,
  position: string,
  hiveQuadrants: HiveQuadrantData,
  changesSummary?: string
): JobDescriptionVersion {
  return {
    id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    jobDescriptionId,
    versionNumber,
    title,
    position,
    hiveQuadrants,
    createdAt: new Date(),
    createdBy: "Current User",
    tags: [],
    notes: "",
    isFavorite: false,
    changesSummary,
  };
}

// Get version display label
export function getVersionLabel(version: JobDescriptionVersion): string {
  return `v${version.versionNumber}`;
}

// Format version date
export function formatVersionDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}