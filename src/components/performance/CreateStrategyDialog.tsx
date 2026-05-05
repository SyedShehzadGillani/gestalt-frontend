import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Target, Clock } from "lucide-react";

interface CreateStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (strategy: any) => void;
}

export const CreateStrategyDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit 
}: CreateStrategyDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "planning",
    goals: "",
    deadline: "",
    category: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStrategy = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      progress: 0,
      status: formData.status as "active" | "planning" | "completed" | "paused",
      goals: parseInt(formData.goals) || 0,
      completedGoals: 0,
      deadline: formData.deadline,
      metrics: {
        engagement: 0,
        reach: 0,
        conversion: 0
      }
    };

    onSubmit(newStrategy);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      status: "planning",
      goals: "",
      deadline: "",
      category: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-5 w-5 text-brand-primary" />
            Create New Brand Strategy
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Define your brand strategy goals and set up tracking metrics to monitor progress.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Strategy Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Q1 Brand Awareness Campaign"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-brand-surface border-border/50 focus:border-brand-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the strategy objectives and key activities..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-brand-surface border-border/50 focus:border-brand-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Initial Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-brand-surface border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals" className="text-sm font-medium flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Number of Goals
                </Label>
                <Input
                  id="goals"
                  type="number"
                  placeholder="5"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  min="1"
                  className="bg-brand-surface border-border/50 focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Target Completion
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="bg-brand-surface border-border/50 focus:border-brand-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primary/90 text-white"
              disabled={!formData.title}
            >
              <Target className="w-4 h-4 mr-2" />
              Create Strategy
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};