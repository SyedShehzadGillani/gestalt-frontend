import { Icon, MultiIcon, ICO } from "@/icons";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-[hsl(var(--sidebar-accent))] p-0.5">
      <button
        onClick={() => setTheme("light")}
        className={`flex items-center justify-center w-7 h-7 transition-all duration-200 ${
          theme === "light"
            ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
            : "text-[hsl(var(--sidebar-foreground)/0.5)] hover:text-[hsl(var(--sidebar-foreground)/0.8)]"
        }`}
        aria-label="Light mode"
      >
        <MultiIcon
          paths={[
            { d: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" },
            { d: "M12 2v2" }, { d: "M12 20v2" },
            { d: "m4.93 4.93 1.41 1.41" }, { d: "m17.66 17.66 1.41 1.41" },
            { d: "M2 12h2" }, { d: "M20 12h2" },
            { d: "m6.34 17.66-1.41 1.41" }, { d: "m19.07 4.93-1.41 1.41" },
          ]}
          size={14}
        />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center justify-center w-7 h-7 transition-all duration-200 ${
          theme === "dark"
            ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
            : "text-[hsl(var(--sidebar-foreground)/0.5)] hover:text-[hsl(var(--sidebar-foreground)/0.8)]"
        }`}
        aria-label="Dark mode"
      >
        <Icon d={ICO.moon} size={14} />
      </button>
    </div>
  );
}
