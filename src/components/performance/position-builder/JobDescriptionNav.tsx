import { useState } from "react";
import { Plus, GripVertical, Pencil, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export interface JobDescriptionItem {
  id: string;
  title: string;
  position: string;
}

interface JobDescriptionNavProps {
  items: JobDescriptionItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdatePosition: (id: string, position: string) => void;
  onDelete: (id: string) => void;
  getNextCustomNumber?: () => number;
}

export function JobDescriptionNav({
  items,
  activeId,
  onSelect,
  onAdd,
  onUpdateTitle,
  onUpdatePosition,
  onDelete,
  getNextCustomNumber,
}: JobDescriptionNavProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<JobDescriptionItem | null>(null);

  const startEditing = (item: JobDescriptionItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditPosition(item.position);
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateTitle(editingId, editTitle);
      onUpdatePosition(editingId, editPosition);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditPosition("");
  };

  const handleDeleteClick = (item: JobDescriptionItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="w-64 bg-background/30 border border-border/50 rounded-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Job Descriptions
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onAdd}
            title="Add new job description"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Navigation List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group relative rounded-md transition-colors",
                activeId === item.id
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-muted/50 border border-transparent"
              )}
            >
              {editingId === item.id ? (
                <div className="p-2 space-y-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                    className="h-7 text-xs"
                    autoFocus
                  />
                  <Input
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    placeholder="Position"
                    className="h-7 text-xs"
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={saveEdit}
                    >
                      <Check className="h-3 w-3 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={cancelEdit}
                    >
                      <X className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onSelect(item.id)}
                  className="w-full text-left p-2 flex items-start gap-2"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      activeId === item.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground/70 truncate">
                      {item.position}
                    </p>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(item);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 hover:bg-destructive/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </button>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No job descriptions yet.
              <br />
              <button
                onClick={onAdd}
                className="text-primary hover:underline mt-1"
              >
                Add your first one
              </button>
            </div>
          )}
        </div>
      </ScrollArea>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Description</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this job description
              {itemToDelete ? ` "${itemToDelete.title}"` : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
