import { useState } from "react";
import { 
  History, 
  Star, 
  StarOff, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  MessageSquare,
  X,
  Plus,
  Check,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  JobDescriptionVersion, 
  getVersionLabel, 
  formatVersionDate 
} from "@/lib/job-description-version-types";

interface JobDescriptionVersionPanelProps {
  versions: JobDescriptionVersion[];
  activeVersionId: string | null;
  onSelectVersion: (versionId: string) => void;
  onToggleFavorite: (versionId: string) => void;
  onUpdateTags: (versionId: string, tags: string[]) => void;
  onUpdateNotes: (versionId: string, notes: string) => void;
  onDeleteVersion?: (versionId: string) => void;
  showFavoritesOnly?: boolean;
  onToggleShowFavorites?: () => void;
}

export function JobDescriptionVersionPanel({
  versions,
  activeVersionId,
  onSelectVersion,
  onToggleFavorite,
  onUpdateTags,
  onUpdateNotes,
  onDeleteVersion,
  showFavoritesOnly = false,
  onToggleShowFavorites,
}: JobDescriptionVersionPanelProps) {
  const [newTag, setNewTag] = useState("");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  const displayedVersions = showFavoritesOnly 
    ? versions.filter(v => v.isFavorite) 
    : versions;

  const activeVersion = versions.find(v => v.id === activeVersionId);
  const activeIndex = displayedVersions.findIndex(v => v.id === activeVersionId);

  const handlePrevVersion = () => {
    if (activeIndex > 0) {
      onSelectVersion(displayedVersions[activeIndex - 1].id);
    }
  };

  const handleNextVersion = () => {
    if (activeIndex < displayedVersions.length - 1) {
      onSelectVersion(displayedVersions[activeIndex + 1].id);
    }
  };

  const handleAddTag = (versionId: string, currentTags: string[]) => {
    const trimmed = newTag.trim().toUpperCase();
    if (trimmed && !currentTags.includes(trimmed)) {
      onUpdateTags(versionId, [...currentTags, trimmed]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (versionId: string, currentTags: string[], tagToRemove: string) => {
    onUpdateTags(versionId, currentTags.filter(t => t !== tagToRemove));
  };

  const startEditingNotes = (version: JobDescriptionVersion) => {
    setEditingNotesId(version.id);
    setTempNotes(version.notes);
  };

  const saveNotes = (versionId: string) => {
    onUpdateNotes(versionId, tempNotes);
    setEditingNotesId(null);
    setTempNotes("");
  };

  if (versions.length === 0) return null;

  return (
    <div className="rounded-lg border border-border/50 bg-background/30 overflow-hidden">
      {/* Version Navigation Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Version History
          </span>
          <Badge variant="secondary" className="text-xs">
            {versions.length} version{versions.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          {onToggleShowFavorites && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleShowFavorites}
              className={cn(
                "h-7 px-2",
                showFavoritesOnly && "bg-yellow-500/20 text-yellow-400"
              )}
            >
              <Star className="h-3 w-3 mr-1" />
              Favorites
            </Button>
          )}
        </div>
      </div>

      {/* Active Version Navigator */}
      {activeVersion && (
        <div className="p-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevVersion}
              disabled={activeIndex <= 0}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {getVersionLabel(activeVersion)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleFavorite(activeVersion.id)}
                  className="h-6 w-6"
                >
                  {activeVersion.isFavorite ? (
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <StarOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                {onDeleteVersion && versions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteVersion(activeVersion.id)}
                    className="h-6 w-6 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatVersionDate(activeVersion.createdAt)}
              </p>
              {activeVersion.changesSummary && (
                <p className="text-xs text-primary mt-1">
                  {activeVersion.changesSummary}
                </p>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextVersion}
              disabled={activeIndex >= displayedVersions.length - 1}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Tags Section */}
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {activeVersion.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-2 py-0.5 flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(activeVersion.id, activeVersion.tags, tag)}
                    className="hover:text-destructive"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-5 px-1.5">
                    <Plus className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="flex gap-1">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value.toUpperCase())}
                      placeholder="Add tag..."
                      className="h-7 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddTag(activeVersion.id, activeVersion.tags);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => handleAddTag(activeVersion.id, activeVersion.tags)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Notes:</span>
              </div>
              {editingNotesId !== activeVersion.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditingNotes(activeVersion)}
                  className="h-5 px-1.5 text-xs"
                >
                  Edit
                </Button>
              )}
            </div>
            
            {editingNotesId === activeVersion.id ? (
              <div className="space-y-2">
                <Textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Add notes about this version..."
                  className="min-h-[60px] text-xs"
                  autoFocus
                />
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingNotesId(null)}
                    className="h-6 px-2 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => saveNotes(activeVersion.id)}
                    className="h-6 px-2 text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground bg-muted/30 rounded p-2 min-h-[40px]">
                {activeVersion.notes || "No notes added yet."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Version List */}
      <ScrollArea className="max-h-48">
        <div className="p-2 space-y-1">
          {displayedVersions.map((version, index) => (
            <button
              key={version.id}
              onClick={() => onSelectVersion(version.id)}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md text-left transition-colors",
                version.id === activeVersionId
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-muted/50 border border-transparent"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs font-medium",
                  version.id === activeVersionId ? "text-foreground" : "text-muted-foreground"
                )}>
                  {getVersionLabel(version)}
                </span>
                {version.isFavorite && (
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                )}
                {version.tags.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0">
                    {version.tags.length} tag{version.tags.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {formatVersionDate(version.createdAt)}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}