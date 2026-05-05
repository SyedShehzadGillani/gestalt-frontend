import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: "in-progress" | "awaiting-signoff" | "not-started";
  progress: number;
  dueDate: string;
}

interface ActiveProjectsProps {
  projects: Project[];
}

const statusStyles = {
  "in-progress": { bg: "bg-info-dim", text: "text-info", label: "In Progress" },
  "awaiting-signoff": { bg: "bg-warning-dim", text: "text-warning", label: "Awaiting Sign-off" },
  "not-started": { bg: "bg-muted", text: "text-foreground-muted", label: "Not Started" },
};

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  return (
    <div className="bg-card border border-border p-6" data-tour="projects-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-semibold text-foreground">Active Projects</h3>
        <button className="text-[13px] text-gold hover:text-gold/80 transition-colors">
          View All →
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => {
          const status = statusStyles[project.status];
          return (
            <div
              key={project.id}
              className="p-4 bg-muted border border-border hover:border-gold/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-medium text-foreground">
                  {project.name}
                </span>
                <span
                  className={`text-[9px] font-bold tracking-[0.5px] px-2 py-1 ${status.bg} ${status.text}`}
                  data-tour={project.status === 'awaiting-signoff' ? 'signoff-banner' : undefined}
                >
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-1.5 bg-card">
                  <div
                    className="h-full bg-gold transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-[12px] text-foreground-muted w-10 text-right">
                  {project.progress}%
                </span>
              </div>
              <div className="text-[12px] text-foreground-secondary">
                Due {project.dueDate}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Button */}
      <Button variant="secondary" className="w-full mt-4 gap-2">
        <Plus className="w-4 h-4" />
        New Project
      </Button>
    </div>
  );
}
