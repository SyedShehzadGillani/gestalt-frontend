import * as React from "react";
import { cn } from "@/lib/utils";

interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface FrameHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

interface FrameContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Frame = React.forwardRef<HTMLDivElement, FrameProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-frame-border bg-frame overflow-hidden shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Frame.displayName = "Frame";

const FrameHeader = React.forwardRef<HTMLDivElement, FrameHeaderProps>(
  ({ className, children, icon, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between px-4 py-3 bg-frame-header border-b border-frame-border",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-primary">{icon}</span>
        )}
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {children}
        </span>
      </div>
      {action && (
        <div className="flex items-center">{action}</div>
      )}
    </div>
  )
);
FrameHeader.displayName = "FrameHeader";

const FrameContent = React.forwardRef<HTMLDivElement, FrameContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-4", className)}
      {...props}
    >
      {children}
    </div>
  )
);
FrameContent.displayName = "FrameContent";

export { Frame, FrameHeader, FrameContent };
