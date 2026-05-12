import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface StatsOverviewProps {
  totalStrategies: number;
  activeStrategies: number;
  completedGoals: number;
  totalGoals: number;
  averageProgress: number;
  presentation?: boolean;
  draggable?: boolean;
}

// Enhanced donut chart component with growth opportunity
const DonutChart = ({
  percentage,
  color,
  growthOpportunity,
  size = 40,
}: {
  percentage: number;
  color: string;
  growthOpportunity?: number;
  size?: number;
}) => {
  const circumference = 2 * Math.PI * 16;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  const growthStrokeDasharray = growthOpportunity ? `${(growthOpportunity / 100) * circumference} ${circumference}` : '';
  
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg style={{ width: size, height: size }} className="transform -rotate-90" viewBox="0 0 40 40">
        {/* Background circle */}
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-muted/20" />
        
        {/* Growth opportunity ring (lighter color, behind main ring) */}
        {growthOpportunity && (
          <circle 
            cx="20" 
            cy="20" 
            r="16" 
            stroke={color} 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray={growthStrokeDasharray} 
            strokeLinecap="round" 
            className="opacity-30"
          />
        )}
        
        {/* Main performance ring */}
        <circle cx="20" cy="20" r="16" stroke={color} strokeWidth="3" fill="none" strokeDasharray={strokeDasharray} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-semibold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
};

// Spark line component
const SparkLine = ({ large = false }: { large?: boolean }) => {
  const points = [2150, 2280, 2340, 2290, 2450, 2380, 2520, 2480, 2600];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min;
  const pathData = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 100;
    const y = 100 - ((point - min) / range) * 100;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  return (
    <div className={large ? 'w-40 h-12 flex-shrink-0' : 'w-20 h-6 flex-shrink-0'}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={pathData}
          stroke="hsl(var(--chart-primary))"
          strokeWidth="2"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export const StatsOverview = ({
  totalStrategies,
  activeStrategies,
  completedGoals,
  totalGoals,
  averageProgress,
  presentation = false,
  draggable = false,
}: StatsOverviewProps) => {
  const [closedTiles, setClosedTiles] = useState<number[]>([]);

  const handleCloseTile = (index: number) => {
    setClosedTiles((prev) => [...prev, index]);
  };

  const handleAddTile = (index: number) => {
    setClosedTiles((prev) => prev.filter((i) => i !== index));
  };

  const tiles = [
    {
      title: "HIGHEST PERFORMING",
      content: (
        <div className={`flex items-center gap-3 min-w-0 ${presentation ? 'text-base' : ''}`}>
          <Avatar className={presentation ? 'w-14 h-14 flex-shrink-0' : 'w-8 h-8 flex-shrink-0'}>
            <AvatarImage src="/lovable-uploads/david-johnson.png" alt="David Johnson" />
            <AvatarFallback className="text-xs">DJ</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className={`font-medium text-foreground truncate ${presentation ? 'text-lg' : 'text-xs'}`}>David Johnson</div>
          </div>
          <DonutChart percentage={94} color="hsl(var(--chart-success))" growthOpportunity={100} size={presentation ? 80 : 40} />
        </div>
      ),
    },
    {
      title: "HIGHEST PERFORMING CLINIC",
      content: (
        <div className={`flex items-center gap-3 min-w-0 ${presentation ? 'text-base' : ''}`}>
          <div className={presentation ? 'w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0' : 'w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0'}>
            <TrendingUp className={presentation ? 'w-7 h-7 text-primary' : 'w-4 h-4 text-primary'} />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-foreground truncate ${presentation ? 'text-2xl' : 'text-sm'}`}>$2,150K</div>
          </div>
          <DonutChart percentage={87} color="hsl(var(--chart-primary))" growthOpportunity={95} size={presentation ? 80 : 40} />
        </div>
      ),
    },
    {
      title: "MOST IMPROVED EMPLOYEE",
      content: (
        <div className={`flex items-center gap-3 min-w-0 ${presentation ? 'text-base' : ''}`}>
          <Avatar className={presentation ? 'w-14 h-14 flex-shrink-0' : 'w-8 h-8 flex-shrink-0'}>
            <AvatarImage src="/lovable-uploads/michael-anderson.png" alt="Michael Anderson" />
            <AvatarFallback className="text-xs">MA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className={`font-medium text-foreground truncate ${presentation ? 'text-lg' : 'text-xs'}`}>Michael Anderson</div>
          </div>
          <DonutChart percentage={78} color="hsl(var(--chart-warning))" growthOpportunity={90} size={presentation ? 80 : 40} />
        </div>
      ),
    },
    {
      title: "HOLDINGS REVENUE",
      content: (
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-foreground truncate ${presentation ? 'text-2xl' : 'text-sm'}`}>$2,150K</div>
            <div className={`text-muted-foreground truncate ${presentation ? 'text-base' : 'text-[10px]'}`}>YOY Growth</div>
          </div>
          <SparkLine large={presentation} />
        </div>
      ),
    },
  ];

  // Order state for drag-and-drop
  const [order, setOrder] = useState<number[]>(tiles.map((_, i) => i));

  // DnD setup
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(Number(active.id));
    const newIndex = order.indexOf(Number(over.id));
    setOrder((items) => arrayMove(items, oldIndex, newIndex));
  };

  const SortableItem = ({ id, children }: { id: number; children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id.toString() });
    const style: React.CSSProperties = {
      transform: transform ? CSS.Transform.toString(transform) : undefined,
      transition,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={draggable ? 'cursor-move min-w-0' : 'min-w-0'}>
        {children}
      </div>
    );
  };

  const grid = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {order.map((tileIndex) => (
        <SortableItem key={tileIndex} id={tileIndex}>
          {closedTiles.includes(tileIndex) ? (
            <Card className={`${presentation ? 'h-[200px]' : 'h-[100px]'} bg-black/75 border-none hover:shadow-[var(--shadow-card)] transition-all duration-200 flex items-center justify-center`}>
              <Button
                onClick={() => handleAddTile(tileIndex)}
                className="bg-black/25 text-white hover:bg-black/30 hover:text-white border-2 border-black/50"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                ADD
              </Button>
            </Card>
          ) : (
            <Card className={`${presentation ? 'h-[200px]' : 'h-[100px]'} bg-black/75 border-none hover:shadow-[var(--shadow-card)] transition-all duration-200 flex flex-col min-w-0`}>
              <CardHeader className="p-2 pb-1 grid grid-cols-[1fr_auto] gap-2 items-baseline min-h-0 flex-shrink-0">
                <CardTitle className={`${presentation ? 'text-sm' : 'text-[10px]'} font-medium tracking-wider text-muted-foreground uppercase truncate min-w-0`}>
                  {tiles[tileIndex].title}
                </CardTitle>
                <div className="w-8 flex justify-center">
                  <button
                    onClick={() => handleCloseTile(tileIndex)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className={presentation ? 'w-4 h-4' : 'w-3 h-3'} />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-1 flex-1 flex items-center min-h-0 min-w-0">
                {tiles[tileIndex].content}
              </CardContent>
            </Card>
          )}
        </SortableItem>
      ))}
    </div>
  );

  if (!draggable) {
    // Non-draggable mode: render without Sortable wrappers
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {order.map((tileIndex) => (
          <div key={tileIndex} className="min-w-0">
            {closedTiles.includes(tileIndex) ? (
              <Card className={`${presentation ? 'h-[200px]' : 'h-[100px]'} bg-black/75 border-none hover:shadow-[var(--shadow-card)] transition-all duration-200 flex items-center justify-center`}>
                <Button onClick={() => handleAddTile(tileIndex)} className="bg-black/25 text-white hover:bg-black/30 hover:text-white border-2 border-black/50" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  ADD
                </Button>
              </Card>
            ) : (
              <Card className={`${presentation ? 'h-[200px]' : 'h-[100px]'} bg-black/75 border-none hover:shadow-[var(--shadow-card)] transition-all duration-200 flex flex-col min-w-0`}>
                <CardHeader className="p-2 pb-1 grid grid-cols-[1fr_auto] gap-2 items-baseline min-h-0 flex-shrink-0">
                  <CardTitle className={`${presentation ? 'text-sm' : 'text-[10px]'} font-medium tracking-wider text-muted-foreground uppercase truncate min-w-0`}>
                    {tiles[tileIndex].title}
                  </CardTitle>
                  <div className="w-8 flex justify-center">
                    <button onClick={() => handleCloseTile(tileIndex)} className="text-gray-400 hover:text-white">
                      <X className={presentation ? 'w-4 h-4' : 'w-3 h-3'} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-1 flex-1 flex items-center min-h-0 min-w-0">
                  {tiles[tileIndex].content}
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order.map((i) => i.toString())} strategy={rectSortingStrategy}>
        {grid}
      </SortableContext>
    </DndContext>
  );
};
