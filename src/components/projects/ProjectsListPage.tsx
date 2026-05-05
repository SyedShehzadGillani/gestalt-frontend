import { useState } from "react";
import { ArrowLeft, ChevronRight, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  sub: string;
  date: string;
  members: string[];
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  date: string;
  replies: number;
  status: "OPEN" | "RESOLVED";
}

const PRIORITY_PROJECTS: Project[] = [
  { id: "p1", name: "MARKETING", sub: "TIMELINES + PROJECTS", date: "Apr 9, 2024", members: ["SC", "MW", "PP", "JL"] },
  { id: "p2", name: "1IG WEBSITE", sub: "TIMELINES + PROJECTS", date: "Apr 9, 2024", members: ["SC", "MW", "PP"] },
  { id: "p3", name: "1IG PRINT", sub: "TIMELINES + PROJECTS", date: "Apr 9, 2024", members: ["SC", "MW"] },
  { id: "p4", name: "PHOTOGRAPHY", sub: "TIMELINES + PROJECTS", date: "Apr 9, 2024", members: ["SC", "PP", "JR"] },
  { id: "p5", name: "GRAPHICS", sub: "TIMELINES + PROJECTS", date: "Apr 9, 2024", members: ["SC", "MW", "JR"] },
  { id: "p6", name: "BROCHURE A", sub: "TIMELINES + PROJECTS", date: "Apr 9, 2024", members: ["MW"] },
  { id: "p7", name: "PRESENTATIONS", sub: "TIMELINES + PROJECTS", date: "Apr 9, 2024", members: ["PP"] },
  { id: "p8", name: "DIGITAL ADS", sub: "TIMELINES + PROJECTS", date: "Apr 9, 2024", members: ["SC", "PP", "JR"] },
];

const RECENT_UPDATES = [
  { date: "03.16.25", text: "You reopened a discussion: ", bold: "Clinic Lobby Message Frames" },
  { date: "03.16.25", text: "You archived a discussion: ", bold: "Clinic Lobby Message Frames" },
  { date: "03.16.26", text: "You removed Mark B. from the project ", bold: "Interior Signage" },
  { date: "09.10.25", text: "You reopened a discussion: ", bold: "Digital Ads" },
  { date: "08.08.25", text: "You reopened a discussion: ", bold: "Website" },
];

const DISCUSSIONS: Discussion[] = [
  { id: "d1", title: "Website Launch Timeline", author: "Sarah C.", date: "Mar 16", replies: 12, status: "OPEN" },
  { id: "d2", title: "Brand Photography Direction", author: "Priya P.", date: "Mar 14", replies: 8, status: "OPEN" },
  { id: "d3", title: "Print Collateral Review", author: "Marcus W.", date: "Mar 10", replies: 5, status: "RESOLVED" },
  { id: "d4", title: "Digital Ad Creative Approval", author: "Jake R.", date: "Mar 8", replies: 3, status: "OPEN" },
];

const FILE_TREE = [
  { name: "CREATIVE ASSETS", children: ["Logos", "Photography", "Templates"] },
  { name: "DOCUMENTS", children: ["Briefs", "Approvals", "Reports"] },
  { name: "DELIVERABLES", children: ["Print", "Digital", "Video"] },
];

type View = "main" | "project" | "thread";
type ViewMode = "grid" | "list";

interface ProjectsListPageProps {
  clientName?: string;
  isAgencyView?: boolean;
  onViewProject?: (projectId: string) => void;
}

export function ProjectsListPage({ onViewProject }: ProjectsListPageProps = {}) {
  const [view, setView] = useState<View>("main");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [expandedTree, setExpandedTree] = useState<Record<string, boolean>>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const toggleTree = (key: string) => setExpandedTree((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    if (onViewProject) {
      onViewProject(projectId);
    } else {
      setView("project");
    }
  };

  const renderMain = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-[8px] font-bold tracking-[2px] text-muted-foreground/60">S.U.M. / PROJECTS</div>
          <div className="text-lg font-black tracking-[2px]">ACTIVE INITIATIVES</div>
        </div>
        <div className="flex gap-2">
          {(["grid", "list"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-[8px] font-bold tracking-wider border ${
                viewMode === mode ? "bg-gold/15 border-gold text-gold" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="text-[9px] font-bold tracking-[2px] text-gold mb-2">PRIORITY PROJECTS</div>
      <div className={`grid gap-2 mb-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
        {PRIORITY_PROJECTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleProjectClick(p.id)}
            className="text-left p-4 border border-border bg-card hover:border-gold/40 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-[11px] font-extrabold tracking-[1.5px]">{p.name}</div>
                <div className="text-[7px] text-muted-foreground/60 tracking-wider mt-0.5">{p.sub}</div>
              </div>
              <div className="text-[7px] text-muted-foreground/60">{p.date}</div>
            </div>
            <div className="flex gap-1">
              {p.members.map((m, i) => (
                <div
                  key={i}
                  className="w-[22px] h-[22px] bg-gold/15 border border-gold/30 flex items-center justify-center text-[7px] font-bold text-gold"
                >
                  {m}
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="text-[9px] font-bold tracking-[2px] text-muted-foreground mb-2">RECENT UPDATES</div>
      {RECENT_UPDATES.map((u, i) => (
        <div key={i} className="px-3 py-2 border-b border-border flex gap-3 text-[9px]">
          <span className="text-muted-foreground/60 font-semibold flex-shrink-0 w-20">{u.date}</span>
          <span className="text-muted-foreground">
            {u.text}<span className="text-gold font-semibold">{u.bold}</span>
          </span>
        </div>
      ))}
    </div>
  );

  const project = PRIORITY_PROJECTS.find((p) => p.id === selectedProjectId) || PRIORITY_PROJECTS[0];

  const renderProject = () => (
    <div className="p-6">
      <button
        type="button"
        onClick={() => setView("main")}
        className="flex items-center gap-1.5 text-[9px] tracking-wider text-muted-foreground hover:text-foreground mb-3"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        BACK TO PROJECTS
      </button>

      <div className="text-lg font-black tracking-[2px] mb-1">{project.name}</div>
      <div className="text-[8px] text-muted-foreground/60 tracking-wider mb-5">
        TIMELINES + PROJECTS · {project.members.length} MEMBERS · CREATED {project.date.toUpperCase()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div>
          <div className="text-[9px] font-bold tracking-[2px] text-gold mb-2">DISCUSSIONS</div>
          {DISCUSSIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setView("thread")}
              className="w-full text-left px-3.5 py-3 border border-border bg-card mb-1.5 hover:border-gold/40"
            >
              <div className="flex justify-between items-center">
                <div className="text-[10px] font-bold">{d.title}</div>
                <div className={`text-[7px] font-bold tracking-wider px-1.5 py-0.5 ${
                  d.status === "OPEN" ? "text-gold bg-gold/15" : "text-[#5fcc00] bg-[#5fcc00]/15"
                }`}>
                  {d.status}
                </div>
              </div>
              <div className="text-[8px] text-muted-foreground/60 mt-1">
                {d.author} · {d.date} · {d.replies} replies
              </div>
            </button>
          ))}
        </div>

        <div>
          <div className="text-[9px] font-bold tracking-[2px] text-muted-foreground mb-2">FILES</div>
          {FILE_TREE.map((folder) => (
            <div key={folder.name}>
              <button
                type="button"
                onClick={() => toggleTree(folder.name)}
                className="w-full px-2.5 py-2 flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground tracking-wider hover:text-foreground"
              >
                <ChevronRight
                  className={`w-2.5 h-2.5 transition-transform ${expandedTree[folder.name] ? "rotate-90" : ""}`}
                />
                {folder.name}
              </button>
              {expandedTree[folder.name] && folder.children.map((child) => (
                <div key={child} className="px-2.5 py-1 pl-7 text-[8px] text-muted-foreground/60">{child}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderThread = () => (
    <div className="p-6">
      <button
        type="button"
        onClick={() => setView("project")}
        className="flex items-center gap-1.5 text-[9px] tracking-wider text-muted-foreground hover:text-foreground mb-3"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        BACK TO {project.name}
      </button>

      <div className="text-base font-black mb-4">Website Launch Timeline</div>
      <div className="text-[8px] text-muted-foreground/60 mb-5">Sarah C. · Mar 16 · 12 replies · OPEN</div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="px-4 py-3 border border-border bg-card mb-2">
          <div className="flex justify-between mb-1.5">
            <div className="text-[9px] font-bold">Team Member {i}</div>
            <div className="text-[7px] text-muted-foreground/60">Mar {14 + i}</div>
          </div>
          <div className="text-[9px] text-muted-foreground leading-[1.6]">
            Discussion thread reply content. This would contain the actual message from the team member about the project timeline and deliverables.
          </div>
        </div>
      ))}

      <div className="mt-4 flex gap-2">
        <Input placeholder="Add a reply..." className="flex-1 text-[9px]" />
        <Button className="px-4 bg-gold text-black hover:bg-gold/90 text-[9px] font-bold tracking-wider">
          <Send className="w-3 h-3 mr-1" />
          SEND
        </Button>
      </div>
    </div>
  );

  if (view === "project") return renderProject();
  if (view === "thread") return renderThread();
  return renderMain();
}
