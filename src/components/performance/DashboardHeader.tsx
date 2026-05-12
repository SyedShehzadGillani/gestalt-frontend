
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SavedSearchTerms } from "./SavedSearchTerms";
import { RoleFilter } from "./RoleFilter";
import { useState } from "react";

interface DashboardHeaderProps {
  onCreateStrategy?: () => void;
  onFilterChange?: (filter: string) => void;
  onSearchChange?: (search: string) => void;
  onRoleFilterChange?: (roles: string[]) => void;
  onAnalyticsQuery?: (query: string) => void;
}

export const DashboardHeader = ({ 
  onCreateStrategy, 
  onFilterChange, 
  onSearchChange,
  onRoleFilterChange,
  onAnalyticsQuery,
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const hiveRoot = `/client/${id}/hive`;

  return (
    <div className="space-y-4">
      {/* Controls Section */}
      <div className="flex items-center justify-end">
        <Button
          onClick={() => navigate(`${hiveRoot}/add-employee`)}
          className="bg-black/50 text-white hover:bg-black/30 hover:text-white border-2 border-black/50"
        >
          <Plus className="mr-2 h-4 w-4" />
          EMPLOYEE
        </Button>
      </div>

      {/* Filter and Analytics Section (search terms and tags removed) */}
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-dashboard-border bg-transparent hover:bg-transparent text-muted-foreground hover:text-foreground">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border">
              <DropdownMenuItem onClick={() => onFilterChange?.('all')} className="text-foreground hover:bg-muted">
                All Locations
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange?.('excellent')} className="text-foreground hover:bg-muted">
                Excellent Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange?.('good')} className="text-foreground hover:bg-muted">
                Good Performance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange?.('warning')} className="text-foreground hover:bg-muted">
                Needs Attention
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden sm:block w-64">
            <input
              type="text"
              placeholder="Ask analytics... (e.g., revenue this month)"
              onKeyDown={(e) => {
                const target = e.target as HTMLInputElement;
                if (e.key === 'Enter' && target.value.trim()) {
                  onAnalyticsQuery?.(target.value.trim());
                  target.value = '';
                }
              }}
              className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {/* Analytics button removed */}
        </div>
      </div>
    </div>
  );
};
