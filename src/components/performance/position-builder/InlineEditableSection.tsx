import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Plus, X, Check, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InlineEditableSectionProps {
  items: string[];
  isEditing: boolean;
  onSave: (items: string[]) => void;
  onCancel: () => void;
  className?: string;
}

export function InlineEditableSection({
  items,
  isEditing,
  onSave,
  onCancel,
  className,
}: InlineEditableSectionProps) {
  const [editedItems, setEditedItems] = useState<string[]>(items);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reset when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditedItems(items);
    }
  }, [isEditing, items]);

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...editedItems];
    newItems[index] = value;
    setEditedItems(newItems);
  };

  const handleAddItem = () => {
    setEditedItems([...editedItems, ""]);
  };

  const handleRemoveItem = (index: number) => {
    if (editedItems.length > 1) {
      setEditedItems(editedItems.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    const filteredItems = editedItems.filter(item => item.trim() !== "");
    onSave(filteredItems.length > 0 ? filteredItems : items);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Add new item after current one
      const newItems = [...editedItems];
      newItems.splice(index + 1, 0, "");
      setEditedItems(newItems);
      // Focus the new item after render
      setTimeout(() => {
        const textareas = containerRef.current?.querySelectorAll("textarea");
        if (textareas && textareas[index + 1]) {
          textareas[index + 1].focus();
        }
      }, 0);
    } else if (e.key === "Backspace" && editedItems[index] === "" && editedItems.length > 1) {
      e.preventDefault();
      handleRemoveItem(index);
      // Focus previous item
      setTimeout(() => {
        const textareas = containerRef.current?.querySelectorAll("textarea");
        if (textareas && textareas[Math.max(0, index - 1)]) {
          textareas[Math.max(0, index - 1)].focus();
        }
      }, 0);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  if (!isEditing) {
    return (
      <ul className={cn("text-sm text-muted-foreground space-y-1", className)}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div ref={containerRef} className={cn("space-y-2", className)}>
      {editedItems.map((item, index) => (
        <div key={index} className="flex items-start gap-2 group/item">
          <div className="flex-1 relative">
            <textarea
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder="Enter item..."
              className="w-full min-h-[32px] px-2 py-1.5 text-sm bg-muted/50 border border-border/50 rounded-[2pt] resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/50"
              rows={1}
              autoFocus={index === editedItems.length - 1 && item === ""}
              style={{ 
                height: 'auto',
                minHeight: '32px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity text-destructive hover:text-destructive"
            onClick={() => handleRemoveItem(index)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddItem}
          className="gap-1.5 text-xs h-7"
        >
          <Plus className="h-3 w-3" />
          Add Item
        </Button>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="gap-1.5 text-xs h-7"
          >
            <Undo2 className="h-3 w-3" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="gap-1.5 text-xs h-7"
          >
            <Check className="h-3 w-3" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
