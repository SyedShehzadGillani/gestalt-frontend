import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Pencil, Printer, Sparkles, Save, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { JobDescriptionNav, JobDescriptionItem } from "./JobDescriptionNav";
import { JobDescriptionVersionPanel } from "./JobDescriptionVersionPanel";
import { CollapsibleSectionHeader } from "./CollapsibleSectionHeader";
import { InlineEditableSection } from "./InlineEditableSection";
import { 
  HiveQuadrantData, 
  DEFAULT_HIVE_QUADRANTS, 
  generateCriteriaFromJobDescription,
  getAdditionalSuggestions,
} from "@/lib/job-description-types";
import { 
  JobDescriptionVersion, 
  createVersion 
} from "@/lib/job-description-version-types";
import type { QuadrantCriteria, Quadrant } from "@/lib/position-builder-types";

interface JobDescriptionPanelProps {
  positionName: string;
  patientLabel: string;
  employeeName?: string;
  hireDate?: Date | string;
  version?: string;
  author?: string;
  signedOffBy?: string;
  onEdit?: () => void;
  // Callback to populate quadrants from job description
  onPopulateQuadrants?: (criteria: Record<Quadrant["id"], QuadrantCriteria[]>) => void;
  // Current quadrant data for saving back
  currentQuadrants?: Record<Quadrant["id"], { criteria: QuadrantCriteria[] }>;
  // Callback to request position change when a job description is selected
  onPositionChangeRequest?: (positionName: string) => void;
}

// Extended job description item with HIVE data and versions
interface ExtendedJobDescriptionItem extends JobDescriptionItem {
  hiveQuadrants?: HiveQuadrantData;
  customOverview?: string;
  versions?: JobDescriptionVersion[];
  activeVersionId?: string;
  // Custom section content (overrides default)
  customResponsibilities?: Record<string, { title: string; items: string[] }>;
  customQualifications?: string[];
  customPreferred?: string[];
  customTraits?: string[];
  customHiveOnboarding?: { title: string; items: string[] };
  customGrowthOpportunities?: { title: string; items: string[] };
}

// Section type for inline editing
type SectionType = "responsibility" | "qualifications" | "preferred" | "traits" | "hiveOnboarding" | "growthOpportunities";

// Default LASIK clinic job descriptions with HIVE quadrant data
const DEFAULT_JOB_DESCRIPTIONS: ExtendedJobDescriptionItem[] = [
  { id: "jd-1", title: "Front Desk Coordinator", position: "RECEPTIONIST", hiveQuadrants: DEFAULT_HIVE_QUADRANTS["RECEPTIONIST"] },
  { id: "jd-2", title: "LASIK Technician I", position: "TECH 1", hiveQuadrants: DEFAULT_HIVE_QUADRANTS["TECH 1"] },
  { id: "jd-3", title: "LASIK Technician II", position: "TECH 2", hiveQuadrants: DEFAULT_HIVE_QUADRANTS["TECH 2"] },
  { id: "jd-4", title: "Optometrist", position: "OD", hiveQuadrants: DEFAULT_HIVE_QUADRANTS["OD"] },
  { id: "jd-5", title: "Refractive Surgeon", position: "SURGEON", hiveQuadrants: DEFAULT_HIVE_QUADRANTS["SURGEON"] },
  { id: "jd-6", title: "Patient Coordinator", position: "CALL CENTER", hiveQuadrants: DEFAULT_HIVE_QUADRANTS["CALL CENTER"] },
  { id: "jd-7", title: "Clinic Manager", position: "MANAGER", hiveQuadrants: DEFAULT_HIVE_QUADRANTS["MANAGER"] },
];

export function JobDescriptionPanel({ 
  positionName, 
  patientLabel, 
  employeeName, 
  hireDate, 
  version = "2025-v14.2", 
  author = "HR Department",
  signedOffBy = "Practice Administrator",
  onEdit,
  onPopulateQuadrants,
  currentQuadrants,
  onSuggestedTagsChange,
  onEnhanceJobDescription,
  onActiveJobChange,
  onProvideEnhanceCallback,
  onPositionChangeRequest,
}: JobDescriptionPanelProps & { 
  onSuggestedTagsChange?: (tags: string[]) => void;
  onEnhanceJobDescription?: (updates: HiveQuadrantData) => void;
  onActiveJobChange?: (hiveQuadrants: HiveQuadrantData | undefined) => void;
  onProvideEnhanceCallback?: (callback: (updates: HiveQuadrantData, summary?: string) => void) => void;
  onPositionChangeRequest?: (positionName: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [jobDescriptions, setJobDescriptions] = useState<ExtendedJobDescriptionItem[]>(DEFAULT_JOB_DESCRIPTIONS);
  const [activeJobId, setActiveJobId] = useState<string | null>(jobDescriptions[0]?.id || null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVersionPanel, setShowVersionPanel] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [editingSectionKey, setEditingSectionKey] = useState<string | null>(null);
  const [enhancingSection, setEnhancingSection] = useState<string | null>(null);
  const [clarifyingSection, setClarifyingSection] = useState<string | null>(null);
  
  // Extract suggested words from active job description
  const activeJob = jobDescriptions.find((jd) => jd.id === activeJobId);
  
  // Notify parent of suggested tags when job changes - includes additional AI suggestions
  useEffect(() => {
    if (activeJob?.hiveQuadrants && onSuggestedTagsChange) {
      // Words from the job description
      const jobDescWords = [
        ...activeJob.hiveQuadrants.PERSONAL.map(q => q.word),
        ...activeJob.hiveQuadrants.PATIENT.map(q => q.word),
        ...activeJob.hiveQuadrants.STAFF.map(q => q.word),
        ...activeJob.hiveQuadrants.KNOWLEDGE.map(q => q.word),
      ];
      
      // Get additional AI-suggested words (100% more options)
      const additionalWords = getAdditionalSuggestions(activeJob.hiveQuadrants, activeJob.position);
      
      // Combine and dedupe: job description words first, then additional suggestions
      const allWords = [...new Set([...jobDescWords, ...additionalWords])];
      onSuggestedTagsChange(allWords);
    }
    
    // Notify parent of the active job's HIVE data for enhancement tracking
    if (onActiveJobChange) {
      onActiveJobChange(activeJob?.hiveQuadrants);
    }
  }, [activeJobId, activeJob, onSuggestedTagsChange, onActiveJobChange]);
  
  // Handle enhancement approval - create a new version and update the job description
  const handleEnhanceJobDescription = (updates: HiveQuadrantData, changesSummary?: string) => {
    if (!activeJobId || !activeJob) return;
    
    // Create a new version
    const currentVersions = activeJob.versions || [];
    const newVersionNumber = currentVersions.length + 1;
    const newVersion = createVersion(
      activeJobId,
      newVersionNumber,
      activeJob.title,
      activeJob.position,
      updates,
      changesSummary || `Enhanced with new criteria`
    );
    
    setJobDescriptions(prev => prev.map(jd => 
      jd.id === activeJobId 
        ? { 
            ...jd, 
            hiveQuadrants: updates,
            versions: [...currentVersions, newVersion],
            activeVersionId: newVersion.id,
          }
        : jd
    ));
    
    toast.success(`Saved as version ${newVersionNumber}`);
    
    // Optionally notify parent
    if (onEnhanceJobDescription) {
      onEnhanceJobDescription(updates);
    }
  };

  // Provide the enhance callback to parent
  useEffect(() => {
    if (onProvideEnhanceCallback) {
      onProvideEnhanceCallback(handleEnhanceJobDescription);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onProvideEnhanceCallback, activeJobId, activeJob]);

  // Version management handlers
  const handleSelectVersion = (versionId: string) => {
    if (!activeJob) return;
    
    const version = activeJob.versions?.find(v => v.id === versionId);
    if (!version) return;
    
    setJobDescriptions(prev => prev.map(jd => 
      jd.id === activeJobId 
        ? { 
            ...jd, 
            hiveQuadrants: version.hiveQuadrants,
            activeVersionId: versionId,
          }
        : jd
    ));
    
    // Repopulate quadrants from this version
    if (onPopulateQuadrants) {
      const criteria = generateCriteriaFromJobDescription(version.hiveQuadrants);
      onPopulateQuadrants(criteria);
    }
    
    toast.info(`Loaded version ${version.versionNumber}`);
  };

  const handleToggleFavorite = (versionId: string) => {
    if (!activeJob) return;
    
    setJobDescriptions(prev => prev.map(jd => 
      jd.id === activeJobId 
        ? { 
            ...jd, 
            versions: jd.versions?.map(v => 
              v.id === versionId 
                ? { ...v, isFavorite: !v.isFavorite }
                : v
            ),
          }
        : jd
    ));
  };

  const handleUpdateVersionTags = (versionId: string, tags: string[]) => {
    if (!activeJob) return;
    
    setJobDescriptions(prev => prev.map(jd => 
      jd.id === activeJobId 
        ? { 
            ...jd, 
            versions: jd.versions?.map(v => 
              v.id === versionId 
                ? { ...v, tags }
                : v
            ),
          }
        : jd
    ));
  };

  const handleUpdateVersionNotes = (versionId: string, notes: string) => {
    if (!activeJob) return;
    
    setJobDescriptions(prev => prev.map(jd => 
      jd.id === activeJobId 
        ? { 
            ...jd, 
            versions: jd.versions?.map(v => 
              v.id === versionId 
                ? { ...v, notes }
                : v
            ),
          }
        : jd
    ));
  };

  const handleDeleteVersion = (versionId: string) => {
    if (!activeJob || !activeJob.versions || activeJob.versions.length <= 1) return;
    
    const versionToDelete = activeJob.versions.find(v => v.id === versionId);
    if (!versionToDelete) return;
    
    // Find the next version to select
    const remainingVersions = activeJob.versions.filter(v => v.id !== versionId);
    const newActiveVersionId = remainingVersions[remainingVersions.length - 1]?.id;
    const newActiveVersion = remainingVersions.find(v => v.id === newActiveVersionId);
    
    setJobDescriptions(prev => prev.map(jd => 
      jd.id === activeJobId 
        ? { 
            ...jd, 
            versions: remainingVersions,
            activeVersionId: newActiveVersionId,
            hiveQuadrants: newActiveVersion?.hiveQuadrants || jd.hiveQuadrants,
          }
        : jd
    ));
    
    toast.success(`Deleted version ${versionToDelete.versionNumber}`);
  };

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "[Hire Date]";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  // Sync active job description when position changes from parent (chevron navigation)
  useEffect(() => {
    const matchingJob = jobDescriptions.find(
      (jd) => jd.position.toUpperCase() === positionName.toUpperCase()
    );
    if (matchingJob && matchingJob.id !== activeJobId) {
      setActiveJobId(matchingJob.id);
    }
  }, [positionName, jobDescriptions]);

  // Auto-populate quadrants when a job is selected
  const handleJobSelect = (id: string) => {
    setActiveJobId(id);
    const selectedJob = jobDescriptions.find(jd => jd.id === id);
    
    // Request position change to match the job description
    if (selectedJob && onPositionChangeRequest) {
      onPositionChangeRequest(selectedJob.position);
    }
    
    if (selectedJob?.hiveQuadrants && onPopulateQuadrants) {
      setIsGenerating(true);
      setTimeout(() => {
        const criteria = generateCriteriaFromJobDescription(selectedJob.hiveQuadrants!);
        onPopulateQuadrants(criteria);
        setIsGenerating(false);
      }, 500);
    }
  };

  const handleAddJob = () => {
    const newJob: ExtendedJobDescriptionItem = {
      id: `jd-${Date.now()}`,
      title: "New Position",
      position: `POSITION ${jobDescriptions.length + 1}`,
      hiveQuadrants: {
        PERSONAL: [],
        PATIENT: [],
        STAFF: [],
        KNOWLEDGE: [],
      },
    };
    setJobDescriptions([...jobDescriptions, newJob]);
    setActiveJobId(newJob.id);
  };

  const handleUpdateTitle = (id: string, title: string) => {
    setJobDescriptions(jobDescriptions.map((jd) => 
      jd.id === id ? { ...jd, title } : jd
    ));
  };

  const handleUpdatePosition = (id: string, position: string) => {
    setJobDescriptions(jobDescriptions.map((jd) => 
      jd.id === id ? { ...jd, position } : jd
    ));
  };

  const handleDeleteJob = (id: string) => {
    const remaining = jobDescriptions.filter((jd) => jd.id !== id);
    setJobDescriptions(remaining);
    if (activeJobId === id) {
      setActiveJobId(remaining[0]?.id || null);
    }
  };

  // Get the next sequential number for custom job descriptions
  const getNextCustomNumber = () => {
    const customPattern = /\((\d+)\)$/;
    let maxNumber = 0;
    jobDescriptions.forEach((jd) => {
      const match = jd.title.match(customPattern);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    });
    return maxNumber + 1;
  };

  // Save current quadrant data to job description - creates a new version
  const handleSaveAsNewDescription = () => {
    if (!currentQuadrants || !activeJob) return;

    const newHiveQuadrants: HiveQuadrantData = {
      PERSONAL: currentQuadrants.PERSONAL.criteria.map(c => ({ word: c.label, expectation: c.expectation })),
      PATIENT: currentQuadrants.PATIENT.criteria.map(c => ({ word: c.label, expectation: c.expectation })),
      STAFF: currentQuadrants.STAFF.criteria.map(c => ({ word: c.label, expectation: c.expectation })),
      KNOWLEDGE: currentQuadrants.KNOWLEDGE.criteria.map(c => ({ word: c.label, expectation: c.expectation })),
    };

    // Create a new version with current data
    handleEnhanceJobDescription(newHiveQuadrants, "Manual save of current quadrant configuration");
  };

  // Handle inline section save with versioning
  const handleInlineSectionSave = (
    sectionKey: string, 
    items: string[], 
    title: string, 
    type: "responsibility" | "qualifications" | "preferred" | "traits" | "hiveOnboarding" | "growthOpportunities"
  ) => {
    if (!activeJobId || !activeJob) return;

    // Create updated job description with new section content
    const updatedJob = { ...activeJob };
    
    switch (type) {
      case "responsibility":
        updatedJob.customResponsibilities = {
          ...(activeJob.customResponsibilities || {}),
          [sectionKey]: { title, items },
        };
        break;
      case "qualifications":
        updatedJob.customQualifications = items;
        break;
      case "preferred":
        updatedJob.customPreferred = items;
        break;
      case "traits":
        updatedJob.customTraits = items;
        break;
      case "hiveOnboarding":
        updatedJob.customHiveOnboarding = { title, items };
        break;
      case "growthOpportunities":
        updatedJob.customGrowthOpportunities = { title, items };
        break;
    }

    // Create a new version
    const currentVersions = activeJob.versions || [];
    const newVersionNumber = currentVersions.length + 1;
    const newVersion = createVersion(
      activeJobId,
      newVersionNumber,
      activeJob.title,
      activeJob.position,
      activeJob.hiveQuadrants || { PERSONAL: [], PATIENT: [], STAFF: [], KNOWLEDGE: [] },
      `Updated ${title}`
    );

    setJobDescriptions(prev => prev.map(jd => 
      jd.id === activeJobId 
        ? { 
            ...updatedJob,
            versions: [...currentVersions, newVersion],
            activeVersionId: newVersion.id,
          }
        : jd
    ));

    toast.success(`Saved as version ${newVersionNumber}`);
    setEditingSectionKey(null);
  };

  // Toggle inline editing for a section
  const toggleSectionEdit = (sectionKey: string) => {
    setEditingSectionKey(prev => prev === sectionKey ? null : sectionKey);
  };

  // Handle quick AI enhancement without dialog (triggers versioning)
  const handleQuickAIEnhance = async (sectionKey: string, title: string, items: string[], type: SectionType) => {
    if (!activeJobId || !activeJob) return;
    
    setEnhancingSection(sectionKey);
    
    // Simulate AI enhancement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const enhancedItems = items.map(item => 
      item.includes("H.I.V.E.") ? item : item + " — aligned with H.I.V.E. expectations"
    );
    enhancedItems.push("Continuously improve based on H.I.V.E. performance feedback");
    
    // Update job description
    const updatedJob = { ...activeJob };
    
    switch (type) {
      case "responsibility":
        updatedJob.customResponsibilities = {
          ...(activeJob.customResponsibilities || {}),
          [sectionKey]: { title, items: enhancedItems },
        };
        break;
      case "qualifications":
        updatedJob.customQualifications = enhancedItems;
        break;
      case "preferred":
        updatedJob.customPreferred = enhancedItems;
        break;
      case "traits":
        updatedJob.customTraits = enhancedItems;
        break;
      case "hiveOnboarding":
        updatedJob.customHiveOnboarding = { title, items: enhancedItems };
        break;
      case "growthOpportunities":
        updatedJob.customGrowthOpportunities = { title, items: enhancedItems };
        break;
    }

    // Create a new version
    const currentVersions = activeJob.versions || [];
    const newVersionNumber = currentVersions.length + 1;
    const newVersion = createVersion(
      activeJobId,
      newVersionNumber,
      activeJob.title,
      activeJob.position,
      activeJob.hiveQuadrants || { PERSONAL: [], PATIENT: [], STAFF: [], KNOWLEDGE: [] },
      `AI-enhanced ${title} with H.I.V.E. integration`
    );

    setJobDescriptions(prev => prev.map(jd => 
      jd.id === activeJobId 
        ? { 
            ...updatedJob,
            versions: [...currentVersions, newVersion],
            activeVersionId: newVersion.id,
          }
        : jd
    ));

    setEnhancingSection(null);
    toast.success(`AI-enhanced ${title} — saved as version ${newVersionNumber}`);
  };

  // Handle AI clarity for a section (simplify and clarify content)
  const handleAIClarity = async (sectionKey: string, title: string, items: string[], type: SectionType) => {
    if (!activeJobId || !activeJob) return;
    
    setClarifyingSection(sectionKey);
    
    // Simulate AI clarity - simplify and make content clearer
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const clarifiedItems = items.map(item => {
      // Remove complex language and simplify
      return item
        .replace(/\s+—\s+aligned with H\.I\.V\.E\. expectations/g, '')
        .replace(/\s+\(AI-enhanced.*?\)/g, '')
        .trim();
    }).filter(item => item.length > 0);
    
    // Update job description with clarified content
    const updatedJob = { ...activeJob };
    
    switch (type) {
      case "responsibility":
        updatedJob.customResponsibilities = {
          ...(activeJob.customResponsibilities || {}),
          [sectionKey]: { title, items: clarifiedItems },
        };
        break;
      case "qualifications":
        updatedJob.customQualifications = clarifiedItems;
        break;
      case "preferred":
        updatedJob.customPreferred = clarifiedItems;
        break;
      case "traits":
        updatedJob.customTraits = clarifiedItems;
        break;
      case "hiveOnboarding":
        updatedJob.customHiveOnboarding = { title, items: clarifiedItems };
        break;
      case "growthOpportunities":
        updatedJob.customGrowthOpportunities = { title, items: clarifiedItems };
        break;
    }

    // Create a new version
    const currentVersions = activeJob.versions || [];
    const newVersionNumber = currentVersions.length + 1;
    const newVersion = createVersion(
      activeJobId,
      newVersionNumber,
      activeJob.title,
      activeJob.position,
      activeJob.hiveQuadrants || { PERSONAL: [], PATIENT: [], STAFF: [], KNOWLEDGE: [] },
      `AI-clarified ${title} for readability`
    );

    setJobDescriptions(prev => prev.map(jd => 
      jd.id === activeJobId 
        ? { 
            ...updatedJob,
            versions: [...currentVersions, newVersion],
            activeVersionId: newVersion.id,
          }
        : jd
    ));

    setClarifyingSection(null);
    toast.success(`AI-clarified ${title} — saved as version ${newVersionNumber}`);
  };


  // Generate HIVE-integrated job description based on position
  const getJobDescription = () => {
    const patientTerm = patientLabel.toLowerCase();
    const displayTitle = activeJob?.title || positionName;
    
    // Build expectations summary from HIVE quadrants
    const hiveExpectations = activeJob?.hiveQuadrants ? {
      personal: activeJob.hiveQuadrants.PERSONAL.map(q => q.word).join(", "),
      patient: activeJob.hiveQuadrants.PATIENT.map(q => q.word).join(", "),
      staff: activeJob.hiveQuadrants.STAFF.map(q => q.word).join(", "),
      knowledge: activeJob.hiveQuadrants.KNOWLEDGE.map(q => q.word).join(", "),
    } : null;

    // Default content
    const defaultResponsibilities = {
      experience: {
        title: `${patientLabel} Experience`,
        items: [
          `Greet ${patientTerm}s warmly and professionally; create a calm, welcoming environment`,
          `Guide ${patientTerm}s through check-in, paperwork, and pre-visit expectations`,
          "Answer phones, emails, and inquiries with clarity, empathy, and confidence",
          "Set the tone for trust, professionalism, and premium care",
        ],
      },
      scheduling: {
        title: "Scheduling & Coordination",
        items: [
          "Schedule consultations, procedures, and follow-up visits accurately",
          "Confirm appointments and manage schedule changes efficiently",
          `Coordinate with clinical staff to ensure smooth ${patientTerm} flow`,
        ],
      },
      communication: {
        title: "Communication & Education",
        items: [
          "Provide high-level explanations of the process (no medical diagnosis)",
          "Direct clinical questions appropriately to technicians or providers",
          "Reinforce pre-op and post-op instructions clearly and confidently",
        ],
      },
    };

    const defaultQualifications = [
      `1-3 years experience in a receptionist, front-desk, or ${patientTerm}-facing role`,
      "Exceptional communication and interpersonal skills",
      "High attention to detail and strong organizational habits",
      "Comfort handling confidential information (HIPAA compliant)",
      "Professional appearance and demeanor",
    ];

    const defaultPreferred = [
      "Experience in healthcare, ophthalmology, or elective medical services",
      "Familiarity with EMR or scheduling software",
      "Background in hospitality, concierge, or premium service environments",
    ];

    const defaultTraits = [
      "Calm under pressure",
      `Naturally empathetic and ${patientTerm}-focused`,
      "Detail-oriented with strong follow-through",
      "Confident communicator with professional presence",
    ];

    const defaultHiveOnboarding = {
      title: "H.I.V.E. Onboarding Path",
      items: [
        "Complete structured 90-day onboarding program with milestone check-ins",
        "Master core competencies across four quadrants: Personal, Patient, Staff, and Knowledge",
        "Receive real-time feedback and coaching through performance tracking",
        "Access role-specific training modules and certification pathways",
      ],
    };

    const defaultGrowthOpportunities = {
      title: "Growth & Advancement",
      items: [
        "Clear progression pathway from entry-level to senior positions",
        "Cross-training opportunities in clinical and administrative functions",
        "Leadership development track for high performers",
        "Performance-based advancement tied to H.I.V.E. quadrant mastery",
      ],
    };

    // Merge custom content with defaults
    const responsibilities = activeJob?.customResponsibilities 
      ? { ...defaultResponsibilities, ...activeJob.customResponsibilities }
      : defaultResponsibilities;

    return {
      title: `${displayTitle}`,
      location: "[Clinic Name]",
      reportsTo: "Clinic Manager / Practice Administrator",
      overview: `The ${displayTitle} is the first impression and last touchpoint of the clinic. This role blends front-desk excellence, ${patientTerm} advocacy, and operational precision to ensure every ${patientTerm} feels informed, calm, and confident from their first call to post-procedure follow-up.\n\nThis position is integrated with H.I.V.E. — our performance development system that provides structured onboarding, continuous growth tracking, and clear advancement pathways.`,
      responsibilities,
      qualifications: activeJob?.customQualifications || defaultQualifications,
      preferred: activeJob?.customPreferred || defaultPreferred,
      traits: activeJob?.customTraits || defaultTraits,
      hiveOnboarding: activeJob?.customHiveOnboarding || defaultHiveOnboarding,
      growthOpportunities: activeJob?.customGrowthOpportunities || defaultGrowthOpportunities,
      hiveExpectations,
    };
  };

  const job = getJobDescription();

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <div className="flex justify-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          {isExpanded ? (
            <>
              Hide Job Description
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              View Job Description
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Job Description Content with Navigation */}
      {isExpanded && (
        <div className="flex gap-4 animate-in slide-in-from-top-2 duration-200">
          {/* Left Navigation */}
          <JobDescriptionNav
            items={jobDescriptions}
            activeId={activeJobId}
            onSelect={handleJobSelect}
            onAdd={handleAddJob}
            onUpdateTitle={handleUpdateTitle}
            onUpdatePosition={handleUpdatePosition}
            onDelete={handleDeleteJob}
          />

          {/* Job Description Content */}
          <div className="job-description-print flex-1 bg-background/50 border border-border/50 rounded-lg p-6 relative">
            {/* Generating overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center gap-3 text-primary">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span className="text-sm font-medium">Populating quadrants...</span>
                </div>
              </div>
            )}

            {/* Watermark - Author & Sign-off with timestamps */}
            <div className="absolute top-4 right-4 flex items-start gap-4 print:hidden">
              <div className="text-right space-y-1">
                <div className="text-xs text-muted-foreground/40">
                  <span className="uppercase tracking-wider text-[10px]">Created by</span>
                  <p className="text-muted-foreground/60 font-medium">{author}</p>
                  <p className="text-[10px] text-muted-foreground/30">Jan 15, 2025</p>
                </div>
                <div className="text-xs text-muted-foreground/40 mt-2">
                  <span className="uppercase tracking-wider text-[10px]">Approved by</span>
                  <p className="text-muted-foreground/60 font-medium">{signedOffBy}</p>
                  <p className="text-[10px] text-muted-foreground/30">Jan 22, 2025</p>
                </div>
                <p className="text-[10px] text-muted-foreground/25 mt-2 font-mono">{version}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => window.print()}
                  title="Print job description"
                >
                  <Printer className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onEdit}
                  title="Edit job description"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7",
                    showVersionPanel && "bg-primary/20 text-primary"
                  )}
                  onClick={() => setShowVersionPanel(!showVersionPanel)}
                  title="Version history"
                >
                  <History className="h-3.5 w-3.5" />
                </Button>
                {currentQuadrants && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleSaveAsNewDescription}
                    title="Save as new job description"
                  >
                    <Save className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Version Panel */}
            {showVersionPanel && activeJob?.versions && activeJob.versions.length > 0 && (
              <div className="mb-6 animate-in slide-in-from-top-2 duration-200">
                <JobDescriptionVersionPanel
                  versions={activeJob.versions}
                  activeVersionId={activeJob.activeVersionId || null}
                  onSelectVersion={handleSelectVersion}
                  onToggleFavorite={handleToggleFavorite}
                  onUpdateTags={handleUpdateVersionTags}
                  onUpdateNotes={handleUpdateVersionNotes}
                  onDeleteVersion={handleDeleteVersion}
                  showFavoritesOnly={showFavoritesOnly}
                  onToggleShowFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
                />
              </div>
            )}

            {/* Show message if no versions yet */}
            {showVersionPanel && (!activeJob?.versions || activeJob.versions.length === 0) && (
              <div className="mb-6 p-4 rounded-lg border border-border/50 bg-muted/20 text-center">
                <History className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No versions yet. Enhance the job description to create your first version.
                </p>
              </div>
            )}

            {/* Header */}
            <div className="mb-6 text-muted-foreground">
              <h3 className="text-lg font-medium text-foreground mb-1">{job.title}</h3>
              <p>Location: {job.location}</p>
              <p>Reports to: {job.reportsTo}</p>
              <p>Employee: {employeeName || "[Employee Name]"}</p>
              <p>Hire Date: {formatDate(hireDate)}</p>
            </div>

            {/* Single Column Layout */}
            <div className="space-y-6">
              {/* Role Overview */}
              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
                  Role Overview
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {job.overview}
                </p>
              </div>

              {/* HIVE Quadrant Expectations Summary */}
              {job.hiveExpectations && (
                <div className="border border-border/30 rounded-md overflow-hidden">
                  <div className="w-full flex items-center justify-between p-2 hover:bg-muted/30 transition-colors">
                    <CollapsibleSectionHeader
                      title="H.I.V.E. Performance Expectations"
                      isCollapsed={!!collapsedSections['hiveExpectations']}
                      onToggleCollapse={() => toggleSection('hiveExpectations')}
                      versionCount={activeJob?.versions?.length || 0}
                      onVersionHistory={() => setShowVersionPanel(!showVersionPanel)}
                    />
                  </div>
                  {!collapsedSections['hiveExpectations'] && (
                    <div className="px-3 pb-3 space-y-3 animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 gap-3">
                        {/* Personal - White */}
                        <div className="p-2 rounded-[2pt] border border-white/30 bg-white/5">
                          <span className="text-xs font-medium text-white uppercase tracking-wider">Personal</span>
                          <p className="text-xs text-white/70 mt-1">{job.hiveExpectations.personal || "Not defined"}</p>
                        </div>
                        {/* Patient - Orange */}
                        <div className="p-2 rounded-[2pt] border border-orange-500/50 bg-orange-500/10">
                          <span className="text-xs font-medium text-orange-400 uppercase tracking-wider">{patientLabel}</span>
                          <p className="text-xs text-orange-300/70 mt-1">{job.hiveExpectations.patient || "Not defined"}</p>
                        </div>
                        {/* Staff - Yellow */}
                        <div className="p-2 rounded-[2pt] border border-yellow-500/50 bg-yellow-500/10">
                          <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">Staff</span>
                          <p className="text-xs text-yellow-300/70 mt-1">{job.hiveExpectations.staff || "Not defined"}</p>
                        </div>
                        {/* Knowledge - Indigo */}
                        <div className="p-2 rounded-[2pt] border border-indigo-500/50 bg-indigo-500/10">
                          <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Knowledge</span>
                          <p className="text-xs text-indigo-300/70 mt-1">{job.hiveExpectations.knowledge || "Not defined"}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground/60 italic">
                        Click this job description to auto-populate the quadrant grid above with these expectations.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Key Responsibilities */}
              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                  Key Responsibilities
                </h4>
                <div className="space-y-3">
                  {Object.entries(job.responsibilities).map(([key, section]) => {
                    const isCollapsed = collapsedSections[key];
                    const isEditing = editingSectionKey === key;
                    return (
                      <div key={key} className="border border-border/30 rounded-md overflow-hidden group">
                        <div className="w-full p-2 hover:bg-muted/30 transition-colors">
                          <CollapsibleSectionHeader
                            title={section.title}
                            variant="subsection"
                            isCollapsed={!!isCollapsed}
                            onToggleCollapse={() => toggleSection(key)}
                            onEdit={() => toggleSectionEdit(key)}
                            onAIEnhance={() => handleQuickAIEnhance(key, section.title, section.items, "responsibility")}
                            onAIClarity={() => handleAIClarity(key, section.title, section.items, "responsibility")}
                            onVersionHistory={() => setShowVersionPanel(!showVersionPanel)}
                            isEnhancing={enhancingSection === key}
                            isClarifying={clarifyingSection === key}
                            versionCount={activeJob?.versions?.length || 0}
                          />
                        </div>
                        {!isCollapsed && (
                          <div className="px-3 pb-3 animate-in fade-in duration-200">
                            <InlineEditableSection
                              items={section.items}
                              isEditing={isEditing}
                              onSave={(items) => handleInlineSectionSave(key, items, section.title, "responsibility")}
                              onCancel={() => setEditingSectionKey(null)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Required Qualifications */}
              <div className="border border-border/30 rounded-md overflow-hidden group">
                <div className="w-full p-2 hover:bg-muted/30 transition-colors">
                  <CollapsibleSectionHeader
                    title="Required Qualifications"
                    isCollapsed={!!collapsedSections['qualifications']}
                    onToggleCollapse={() => toggleSection('qualifications')}
                    onEdit={() => toggleSectionEdit('qualifications')}
                    onAIEnhance={() => handleQuickAIEnhance('qualifications', 'Required Qualifications', job.qualifications, "qualifications")}
                    onAIClarity={() => handleAIClarity('qualifications', 'Required Qualifications', job.qualifications, "qualifications")}
                    onVersionHistory={() => setShowVersionPanel(!showVersionPanel)}
                    isEnhancing={enhancingSection === 'qualifications'}
                    isClarifying={clarifyingSection === 'qualifications'}
                    versionCount={activeJob?.versions?.length || 0}
                  />
                </div>
                {!collapsedSections['qualifications'] && (
                  <div className="px-3 pb-3 animate-in fade-in duration-200">
                    <InlineEditableSection
                      items={job.qualifications}
                      isEditing={editingSectionKey === 'qualifications'}
                      onSave={(items) => handleInlineSectionSave('qualifications', items, 'Required Qualifications', "qualifications")}
                      onCancel={() => setEditingSectionKey(null)}
                    />
                  </div>
                )}
              </div>

              {/* Preferred Experience */}
              <div className="border border-border/30 rounded-md overflow-hidden group">
                <div className="w-full p-2 hover:bg-muted/30 transition-colors">
                  <CollapsibleSectionHeader
                    title="Preferred Experience"
                    isCollapsed={!!collapsedSections['preferred']}
                    onToggleCollapse={() => toggleSection('preferred')}
                    onEdit={() => toggleSectionEdit('preferred')}
                    onAIEnhance={() => handleQuickAIEnhance('preferred', 'Preferred Experience', job.preferred, "preferred")}
                    onAIClarity={() => handleAIClarity('preferred', 'Preferred Experience', job.preferred, "preferred")}
                    onVersionHistory={() => setShowVersionPanel(!showVersionPanel)}
                    isEnhancing={enhancingSection === 'preferred'}
                    isClarifying={clarifyingSection === 'preferred'}
                    versionCount={activeJob?.versions?.length || 0}
                  />
                </div>
                {!collapsedSections['preferred'] && (
                  <div className="px-3 pb-3 animate-in fade-in duration-200">
                    <InlineEditableSection
                      items={job.preferred}
                      isEditing={editingSectionKey === 'preferred'}
                      onSave={(items) => handleInlineSectionSave('preferred', items, 'Preferred Experience', "preferred")}
                      onCancel={() => setEditingSectionKey(null)}
                    />
                  </div>
                )}
              </div>

              {/* Traits */}
              <div className="border border-border/30 rounded-md overflow-hidden group">
                <div className="w-full p-2 hover:bg-muted/30 transition-colors">
                  <CollapsibleSectionHeader
                    title="Traits That Thrive in This Role"
                    isCollapsed={!!collapsedSections['traits']}
                    onToggleCollapse={() => toggleSection('traits')}
                    onEdit={() => toggleSectionEdit('traits')}
                    onAIEnhance={() => handleQuickAIEnhance('traits', 'Traits', job.traits, "traits")}
                    onAIClarity={() => handleAIClarity('traits', 'Traits', job.traits, "traits")}
                    onVersionHistory={() => setShowVersionPanel(!showVersionPanel)}
                    isEnhancing={enhancingSection === 'traits'}
                    isClarifying={clarifyingSection === 'traits'}
                    versionCount={activeJob?.versions?.length || 0}
                  />
                </div>
                {!collapsedSections['traits'] && (
                  <div className="px-3 pb-3 animate-in fade-in duration-200">
                    <InlineEditableSection
                      items={job.traits}
                      isEditing={editingSectionKey === 'traits'}
                      onSave={(items) => handleInlineSectionSave('traits', items, 'Traits', "traits")}
                      onCancel={() => setEditingSectionKey(null)}
                    />
                  </div>
                )}
              </div>

              {/* H.I.V.E. Onboarding Path */}
              <div className="border border-border/30 rounded-md overflow-hidden group">
                <div className="w-full p-2 hover:bg-muted/30 transition-colors">
                  <CollapsibleSectionHeader
                    title={job.hiveOnboarding.title}
                    isCollapsed={!!collapsedSections['hiveOnboarding']}
                    onToggleCollapse={() => toggleSection('hiveOnboarding')}
                    onEdit={() => toggleSectionEdit('hiveOnboarding')}
                    onAIEnhance={() => handleQuickAIEnhance('hiveOnboarding', job.hiveOnboarding.title, job.hiveOnboarding.items, "hiveOnboarding")}
                    onAIClarity={() => handleAIClarity('hiveOnboarding', job.hiveOnboarding.title, job.hiveOnboarding.items, "hiveOnboarding")}
                    onVersionHistory={() => setShowVersionPanel(!showVersionPanel)}
                    isEnhancing={enhancingSection === 'hiveOnboarding'}
                    isClarifying={clarifyingSection === 'hiveOnboarding'}
                    versionCount={activeJob?.versions?.length || 0}
                  />
                </div>
                {!collapsedSections['hiveOnboarding'] && (
                  <div className="px-3 pb-3 animate-in fade-in duration-200">
                    <InlineEditableSection
                      items={job.hiveOnboarding.items}
                      isEditing={editingSectionKey === 'hiveOnboarding'}
                      onSave={(items) => handleInlineSectionSave('hiveOnboarding', items, job.hiveOnboarding.title, "hiveOnboarding")}
                      onCancel={() => setEditingSectionKey(null)}
                    />
                  </div>
                )}
              </div>

              {/* Growth & Advancement */}
              <div className="border border-border/30 rounded-md overflow-hidden group">
                <div className="w-full p-2 hover:bg-muted/30 transition-colors">
                  <CollapsibleSectionHeader
                    title={job.growthOpportunities.title}
                    isCollapsed={!!collapsedSections['growthOpportunities']}
                    onToggleCollapse={() => toggleSection('growthOpportunities')}
                    onEdit={() => toggleSectionEdit('growthOpportunities')}
                    onAIEnhance={() => handleQuickAIEnhance('growthOpportunities', job.growthOpportunities.title, job.growthOpportunities.items, "growthOpportunities")}
                    onAIClarity={() => handleAIClarity('growthOpportunities', job.growthOpportunities.title, job.growthOpportunities.items, "growthOpportunities")}
                    onVersionHistory={() => setShowVersionPanel(!showVersionPanel)}
                    isEnhancing={enhancingSection === 'growthOpportunities'}
                    isClarifying={clarifyingSection === 'growthOpportunities'}
                    versionCount={activeJob?.versions?.length || 0}
                  />
                </div>
                {!collapsedSections['growthOpportunities'] && (
                  <div className="px-3 pb-3 animate-in fade-in duration-200">
                    <InlineEditableSection
                      items={job.growthOpportunities.items}
                      isEditing={editingSectionKey === 'growthOpportunities'}
                      onSave={(items) => handleInlineSectionSave('growthOpportunities', items, job.growthOpportunities.title, "growthOpportunities")}
                      onCancel={() => setEditingSectionKey(null)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .job-description-print,
          .job-description-print * {
            visibility: visible;
          }
          .job-description-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 8.5in;
            padding: 0.75in;
            background: white !important;
            color: black !important;
          }
          .job-description-print button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
