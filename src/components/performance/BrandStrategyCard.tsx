import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Target, TrendingUp, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BrandStrategy {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: "active" | "planning" | "completed" | "paused";
  goals: number;
  completedGoals: number;
  deadline: string;
  metrics: {
    engagement: number;
    reach: number;
    conversion: number;
  };
}

interface BrandStrategyCardProps {
  strategy: BrandStrategy;
  onEdit?: (strategy: BrandStrategy) => void;
  onDelete?: (id: string) => void;
  onView?: (strategy: BrandStrategy) => void;
}

const statusColors = {
  active: "bg-brand-success",
  planning: "bg-brand-warning", 
  completed: "bg-brand-primary",
  paused: "bg-muted-foreground"
};

const statusLabels = {
  active: "Active",
  planning: "Planning",
  completed: "Completed", 
  paused: "Paused"
};

export const BrandStrategyCard = ({ 
  strategy, 
  onEdit, 
  onDelete, 
  onView 
}: BrandStrategyCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-brand-primary/20 bg-brand-surface">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-brand-primary transition-colors">
                {strategy.title}
              </h3>
              <Badge 
                variant="secondary" 
                className={`${statusColors[strategy.status]} text-white text-xs px-2 py-1`}
              >
                {statusLabels[strategy.status]}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {strategy.description}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(strategy)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(strategy)}>
                Edit Strategy
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(strategy.id)}
                className="text-destructive"
              >
                Delete Strategy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium text-foreground">{strategy.progress}%</span>
          </div>
          <Progress value={strategy.progress} className="h-2" />
        </div>

        {/* Goals Section */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>{strategy.completedGoals}/{strategy.goals} Goals</span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{strategy.deadline}</span>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/50">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Engagement</div>
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3 text-brand-success" />
              <span className="text-sm font-medium">{strategy.metrics.engagement}%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Reach</div>
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3 text-brand-primary" />
              <span className="text-sm font-medium">{strategy.metrics.reach}K</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Conversion</div>
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3 text-brand-secondary" />
              <span className="text-sm font-medium">{strategy.metrics.conversion}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};