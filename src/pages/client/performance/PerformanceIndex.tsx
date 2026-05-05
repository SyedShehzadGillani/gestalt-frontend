import { LocationPerformanceCard } from "@/components/performance/LocationPerformanceCard";
import { DashboardHeader } from "@/components/performance/DashboardHeader";
import { GestaltInsightCards } from "@/components/performance/GestaltInsightCards";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Monitor, FileText, Eye, EyeOff } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnalyticsCard, AnalyticsCardData } from "@/components/performance/AnalyticsCard";
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import OnboardingBuilder from "@/components/performance/OnboardingBuilder";
interface LocationPerformance {
  id: string;
  name: string;
  image: string;
  overallScore: number;
  growthOpportunity: number;
  status: "excellent" | "good" | "warning" | "poor";
  metrics: {
    revenue: {
      current: number;
      past: number;
      target: number;
      unit?: string;
    };
    employees: {
      current: number;
      past: number;
      target: number;
      unit?: string;
    };
    satisfaction: {
      current: number;
      past: number;
      target: number;
      unit?: string;
    };
    capacity: {
      current: number;
      past: number;
      target: number;
      unit?: string;
    };
  };
  quadrants: {
    name: "Personal" | "Patient" | "Staff" | "Knowledge";
    value: number;
    color: string;
  }[];
  trend: number;
}
const Index = () => {
  const {
    toast
  } = useToast();
  const [locations, setLocations] = useState<LocationPerformance[]>([{
    id: "1",
    name: "VGH Medical Center",
    image: "/placeholder.svg",
    overallScore: 87,
    growthOpportunity: 13,
    status: "excellent",
    metrics: {
      revenue: {
        current: 2150,
        past: 1980,
        target: 2300,
        unit: 'K'
      },
      // Combined revenue from all 15 locations
      employees: {
        current: 3247,
        past: 3098,
        target: 3500
      },
      // Combined employees from all 15 locations
      satisfaction: {
        current: 94,
        past: 91,
        target: 95,
        unit: '%'
      },
      capacity: {
        current: 78,
        past: 82,
        target: 85,
        unit: '%'
      }
    },
    quadrants: [{
      name: "Personal",
      value: 28.3,
      color: "#FFD700"
    }, {
      name: "Staff",
      value: 31.7,
      color: "#FF8C00"
    }, {
      name: "Patient",
      value: 24.8,
      color: "#FFFFFF"
    }, {
      name: "Knowledge",
      value: 15.2,
      color: "#4169E1"
    }],
    trend: 5.2
  }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [highlightsFullscreen, setHighlightsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [analyticsCards, setAnalyticsCards] = useState<AnalyticsCardData[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [notesContent, setNotesContent] = useState<string>("");
  const [presentationQuery, setPresentationQuery] = useState<string>("");
const [showHighlightsBlock, setShowHighlightsBlock] = useState(true);
const [hiddenCardIds, setHiddenCardIds] = useState<Set<string>>(new Set());
const toggleCardVisibility = (id: string) => {
  setHiddenCardIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};
const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleAnalyticsQuery = (query: string) => {
    const q = query.toLowerCase();
    let card: AnalyticsCardData;
    if (q.includes("revenue")) {
      card = { id: `${Date.now()}`, title: "Revenue (This Month)", value: `$${(totalRevenue * 1.02).toLocaleString()}k`, trend: 2.3, subtitle: "All locations" };
    } else if (q.includes("employee") || q.includes("staff")) {
      card = { id: `${Date.now()}`, title: "Total Employees", value: totalEmployees, trend: 1.5, subtitle: "Active staff" };
    } else if (q.includes("satisfaction")) {
      card = { id: `${Date.now()}`, title: "Patient Satisfaction", value: `${locations[0]?.metrics.satisfaction.current}%`, trend: 0.8, subtitle: "CSAT" };
    } else {
      card = { id: `${Date.now()}`, title: `Result for: ${query}`, value: "N/A", subtitle: "No data mapping yet" };
    }
    setAnalyticsCards((prev) => [...prev, card]);
    toast({ title: "Analytics added", description: `Created card for "${query}"` });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = analyticsCards.findIndex((c) => c.id === active.id);
    const newIndex = analyticsCards.findIndex((c) => c.id === over.id);
    setAnalyticsCards((items) => arrayMove(items, oldIndex, newIndex));
  };

  const SortableItem = ({ id, data }: { id: string; data: AnalyticsCardData }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style: React.CSSProperties = {
      transform: transform ? CSS.Transform.toString(transform) : undefined,
      transition,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-move">
        <AnalyticsCard data={data} presentation />
      </div>
    );
  };
  // Calculate stats
  const totalLocations = locations.length;
  const excellentLocations = locations.filter(l => l.status === "excellent").length;
  const totalRevenue = locations.reduce((sum, l) => sum + l.metrics.revenue.current, 0);
  const totalEmployees = locations.reduce((sum, l) => sum + l.metrics.employees.current, 0);
  const averageScore = Math.round(locations.reduce((sum, l) => sum + l.overallScore, 0) / locations.length);

  const generateMeetingNotes = () => {
    const dateStr = new Date().toLocaleString();
    return `# Company Meeting - ${dateStr}\n\nAgenda:\n- Review Performance Highlights\n- Revenue: $${(totalRevenue).toLocaleString()}k\n- Employees: ${totalEmployees.toLocaleString()}\n- Average Score: ${averageScore}%\n\nDiscussion Points:\n- Wins and challenges\n- Opportunities and risks\n- Action items and next steps\n\nAction Items:\n- [ ] Owner — Task — Due date\n\nNotes:\n- `;
  };

  useEffect(() => {
    if (highlightsFullscreen && showNotes && (!notesContent || notesContent.trim() === "")) {
      setNoteTitle(`Company Meeting – ${new Date().toLocaleDateString()}`);
      setNotesContent(generateMeetingNotes());
    }
  }, [highlightsFullscreen, showNotes]);

  // Filter locations
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || location.status === filter;
    return matchesSearch && matchesFilter;
  });
  const handleCreateLocation = () => {
    // This would create a new location in a real app
    toast({
      title: "Add Location",
      description: "Feature coming soon - add new location functionality."
    });
  };
  const handleDeleteLocation = (id: string) => {
    const location = locations.find(l => l.id === id);
    setLocations(locations.filter(l => l.id !== id));
    toast({
      title: "Location Removed",
      description: `${location?.name} has been removed.`,
      variant: "destructive"
    });
  };
  const handleViewLocation = (location: LocationPerformance) => {
    toast({
      title: "Location Details",
      description: `Viewing details for ${location.name}`
    });
  };
  return <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-6 py-4">
          {/* Performance Highlights Header - above insight cards */}
          {!highlightsFullscreen && (
            <Collapsible open={!isStatsCollapsed} onOpenChange={(open) => setIsStatsCollapsed(!open)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Performance Highlights</h2>
                <div className="flex items-center">
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="relative h-8 w-8 text-muted-foreground hover:text-foreground transition-transform duration-200"
                      aria-label={isStatsCollapsed ? "Expand highlights" : "Collapse highlights"}
                    >
                      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${isStatsCollapsed ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`}>
                        <Plus className="h-4 w-4" />
                      </span>
                      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${isStatsCollapsed ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`}>
                        <Minus className="h-4 w-4" />
                      </span>
                    </Button>
                  </CollapsibleTrigger>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 ml-2 text-muted-foreground hover:text-foreground" 
                    onClick={() => setHighlightsFullscreen(true)}
                    aria-label="Presentation mode"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CollapsibleContent className="space-y-4 transition-all duration-300 data-[state=closed]:-translate-y-4 data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100">
                {/* GESTALT AI Insight Cards - now includes all metrics */}
                <GestaltInsightCards />
                
                {analyticsCards.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analyticsCards.map((card) => (
                      <AnalyticsCard key={card.id} data={card} />
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {/* Onboarding Builder view (current build) */}
          <OnboardingGate />
          <div className="space-y-4">
          {!highlightsFullscreen && (
            <Collapsible open={showControls}>
              <CollapsibleContent className="transition-all duration-300 data-[state=closed]:-translate-y-2 data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100">
                <DashboardHeader 
                  onCreateStrategy={handleCreateLocation} 
                  onFilterChange={setFilter} 
                  onSearchChange={setSearchTerm} 
                  onRoleFilterChange={() => {}}
                  onAnalyticsQuery={handleAnalyticsQuery}
                />
              </CollapsibleContent>
            </Collapsible>
          )}
          {/* Presentation Mode - inline, not overlapping nav */}
          {highlightsFullscreen && (
            <div className="absolute inset-0 z-50 bg-background p-6 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Highlights</h2>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8" 
                    onClick={() => setShowNotes((v) => !v)} 
                    aria-label="Toggle meeting notes"
                    title="Meeting notes"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8" 
                    onClick={() => setHighlightsFullscreen(false)}
                    aria-label="Exit presentation mode"
                    title="Exit presentation"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Top add/query bar with tags */}
              <div className="sticky top-0 z-10 mb-4">
                <div className="bg-card/80 backdrop-blur border border-border rounded-md p-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a query and press Enter..."
                      className="h-9 flex-1"
                      value={presentationQuery}
                      onChange={(e) => setPresentationQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const v = presentationQuery.trim();
                          if (v) { handleAnalyticsQuery(v); setPresentationQuery(""); }
                        }
                      }}
                    />
                    <Button size="sm" onClick={() => { const v = presentationQuery.trim(); if (v) { handleAnalyticsQuery(v); setPresentationQuery(""); } }}>Add</Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      variant={showHighlightsBlock ? "secondary" : "outline"}
                      size="sm"
                      className="h-7"
                      onClick={() => setShowHighlightsBlock((v) => !v)}
                      title="Toggle highlights visibility"
                    >
                      <span className="mr-2">Highlights</span>
                      {showHighlightsBlock ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                    {analyticsCards.map((card) => (
                      <Button
                        key={card.id}
                        variant={hiddenCardIds.has(card.id) ? "outline" : "secondary"}
                        size="sm"
                        className="h-7 max-w-[220px]"
                        onClick={() => toggleCardVisibility(card.id)}
                        title="Hide/show element"
                      >
                        <span className="mr-2 truncate">{card.title}</span>
                        {hiddenCardIds.has(card.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${showNotes ? 'mr-[420px]' : ''}`}>
                {showHighlightsBlock && (
                  <GestaltInsightCards />
                )}
                {analyticsCards.length > 0 && (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={analyticsCards.filter((c) => !hiddenCardIds.has(c.id)).map((c) => c.id)} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {analyticsCards.filter((c) => !hiddenCardIds.has(c.id)).map((card) => (
                          <SortableItem key={card.id} id={card.id} data={card} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              {showNotes && (
                <div className="absolute right-6 top-16 bottom-6 w-[380px] bg-card/80 backdrop-blur border border-border rounded-lg p-4 overflow-auto shadow-lg">
                  <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-center mb-3">
                    <div className="text-sm font-medium text-foreground">Meeting Notes</div>
                    <Button variant="secondary" size="sm" onClick={() => {
                      const data = { title: noteTitle || `Company Meeting – ${new Date().toLocaleDateString()}`, content: notesContent, timestamp: Date.now() };
                      localStorage.setItem('companyMeetingNotes', JSON.stringify(data));
                      toast({ title: 'Notes saved', description: 'Saved as current company meeting notes.' });
                    }}>Save</Button>
                    <div className="w-8 flex justify-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowNotes(false)} aria-label="Close notes">✕</Button>
                    </div>
                  </div>
                  <Input 
                    placeholder="Title"
                    className="mb-3"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                  <Textarea 
                    className="min-h-[calc(100%-6rem)]"
                    value={notesContent}
                    onChange={(e) => setNotesContent(e.target.value)}
                  />
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => {
                      navigator.clipboard.writeText(`# ${noteTitle || 'Company Meeting'}\n\n${notesContent}`);
                      toast({ title: 'Copied', description: 'Notes copied to clipboard.' });
                    }}>Copy</Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      const blob = new Blob([`# ${noteTitle || 'Company Meeting'}\n\n${notesContent}`], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${(noteTitle || 'Company Meeting').replace(/\s+/g,'-')}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>Download</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!highlightsFullscreen && (
            <>
              {/* Locations Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredLocations.map(location => <LocationPerformanceCard key={location.id} location={location} />)}
              </div>

              {filteredLocations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No locations found matching your criteria.</p>
                </div>
              )}
            </>
          )}
          </div>
        </div>
    </div>;
};

function OnboardingGate() {
  const [hasModel, setHasModel] = useState<boolean>(() => {
    try { return !!localStorage.getItem('onboarding-model'); } catch { return false; }
  });
  useEffect(() => {
    const onUpdate = () => setHasModel(() => !!localStorage.getItem('onboarding-model'));
    window.addEventListener('onboarding:model-updated', onUpdate as any);
    return () => window.removeEventListener('onboarding:model-updated', onUpdate as any);
  }, []);
  if (!hasModel) return null;
  return (
    <div className="mb-6 animate-fade-in">
      <OnboardingBuilder />
    </div>
  );
}
export default Index;
