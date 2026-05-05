import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  clientName: string;
  status: "active" | "awaiting-signoff" | "completed" | "paused";
  progress: number;
  dueDate: string;
}

interface ProjectsListPageProps {
  clientName?: string;
  isAgencyView: boolean;
  onViewProject: (projectId: string) => void;
}

const mockProjects: Project[] = [
  { id: "1", name: "Website Rebrand", clientName: "Meridian Tech", status: "active", progress: 65, dueDate: "Feb 15, 2026" },
  { id: "2", name: "Brand Guidelines v2", clientName: "Meridian Tech", status: "awaiting-signoff", progress: 90, dueDate: "Jan 30, 2026" },
  { id: "3", name: "Market Analysis", clientName: "Coastal Living", status: "active", progress: 40, dueDate: "Feb 28, 2026" },
  { id: "4", name: "Logo Concepts", clientName: "Summit Fitness", status: "completed", progress: 100, dueDate: "Jan 15, 2026" },
  { id: "5", name: "Crisis Response", clientName: "Nova Financial", status: "paused", progress: 20, dueDate: "TBD" },
];

const statusStyles = {
  active: { bg: "bg-info-dim", text: "text-info", label: "Active" },
  "awaiting-signoff": { bg: "bg-warning-dim", text: "text-warning", label: "Awaiting Sign-off" },
  completed: { bg: "bg-success-dim", text: "text-success", label: "Completed" },
  paused: { bg: "bg-muted", text: "text-foreground-muted", label: "Paused" },
};

const tabs = ["All", "Active", "Completed", "Paused"];

export function ProjectsListPage({ clientName, isAgencyView, onViewProject }: ProjectsListPageProps) {
  const [activeTab, setActiveTab] = useState("All");

  // Filter projects based on context and tab
  const filteredProjects = mockProjects.filter((project) => {
    // If viewing a specific client, only show their projects
    if (clientName && project.clientName !== clientName) {
      // For demo, show all projects for any client
    }

    // Filter by status
    if (activeTab === "All") return true;
    if (activeTab === "Active") return project.status === "active" || project.status === "awaiting-signoff";
    if (activeTab === "Completed") return project.status === "completed";
    if (activeTab === "Paused") return project.status === "paused";
    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground">
            {clientName ? `${clientName} Projects` : "Projects"}
          </h1>
        </div>
        <Button className="gap-2 bg-gold text-primary-foreground hover:bg-gold/90">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-muted p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-[12px] font-medium transition-colors ${
              activeTab === tab
                ? "bg-card text-foreground"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="space-y-3">
        {filteredProjects.map((project) => {
          const status = statusStyles[project.status];
          return (
            <div
              key={project.id}
              onClick={() => onViewProject(project.id)}
              className="flex items-center gap-6 p-5 bg-card border border-border hover:border-gold/50 cursor-pointer transition-colors"
            >
              {/* Left - Project Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[16px] font-medium text-foreground">
                  {project.name}
                </div>
                {isAgencyView && (
                  <div className="text-[12px] text-foreground-secondary mt-0.5">
                    {project.clientName}
                  </div>
                )}
              </div>

              {/* Center - Status & Progress */}
              <div className="flex items-center gap-4">
                <span className={`text-[9px] font-bold tracking-[0.5px] px-2 py-1 ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-[120px] h-1.5 bg-muted">
                    <div
                      className={`h-full transition-all duration-300 ${
                        project.progress === 100 ? "bg-success" : "bg-gold"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-[12px] text-foreground-muted w-8">
                    {project.progress}%
                  </span>
                </div>
              </div>

              {/* Right - Due Date & Action */}
              <div className="flex items-center gap-4">
                <span className="text-[13px] text-foreground-secondary w-24">
                  {project.dueDate}
                </span>
                <Button variant="secondary" size="sm" className="gap-1">
                  View
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-foreground-muted">
          No projects found.
        </div>
      )}
    </div>
  );
}
