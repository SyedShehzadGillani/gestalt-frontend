import { useState, useCallback, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { WidgetContainer } from "./WidgetContainer";
import { MOCK_DAILY_TASKS, CURRENT_USER } from "@/data/mockData.js";

const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

const BUCKETS = [
  { key: "BY_NOON", label: "TODAY BY NOON" },
  { key: "END_OF_DAY", label: "TODAY BY END OF DAY" },
  { key: "THIS_WEEK", label: "THIS WEEK" },
  { key: "NEXT_17_DAYS", label: "NEXT 17 DAYS" },
  { key: "NEXT_21_DAYS", label: "NEXT 21 DAYS" },
  { key: "THIS_MONTH", label: "THIS MONTH" },
] as const;

type BucketKey = typeof BUCKETS[number]["key"];

interface Task {
  id: string;
  title: string;
  bucket: string;
  estimatedMinutes: number | null;
  module: string;
  priority: string;
  dollarsAtStake: number;
  done: boolean;
  dismissed: boolean;
  reminder?: string | null;
}

const MOCK_IS_PAST_NOON = true;

const TOP_HOUR_OPTIONS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];

function interpolateColor(c1: string, c2: string, t: number): string {
  const hex = (s: string) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
  const [r1, g1, b1] = hex(c1);
  const [r2, g2, b2] = hex(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

export function DailyRoutineWidget() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tasks, setTasks] = useState<Task[]>(MOCK_DAILY_TASKS.map(t => ({ ...t, reminder: null })));
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated] = useState("Today, 7:00 AM");
  const [regeneratesLeft, setRegeneratesLeft] = useState(2);
  const [expandedBuckets, setExpandedBuckets] = useState<Set<string>>(new Set(["BY_NOON", "END_OF_DAY"]));
  const [activeShotClock, setActiveShotClock] = useState<string | null>(null);
  const [shotClockSeconds, setShotClockSeconds] = useState(0);
  const [shotClockPaused, setShotClockPaused] = useState(false);
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [removingTask, setRemovingTask] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [tooltipTask, setTooltipTask] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bg3 = isDark ? "hsl(0 0% 10%)" : "hsl(210 12% 93%)";
  const border = isDark ? "hsl(0 0% 15%)" : "hsl(214 18% 83%)";
  const border2 = isDark ? "hsl(0 0% 20%)" : "hsl(214 14% 75%)";
  const text1 = isDark ? "#fff" : "#1a1a1a";
  const text2 = isDark ? "hsl(0 0% 63%)" : "hsl(215 10% 40%)";
  const text3 = isDark ? "hsl(0 0% 50%)" : "hsl(215 8% 55%)";
  const text4 = isDark ? "hsl(0 0% 40%)" : "hsl(215 8% 55%)";
  const gold = "#c9a227";
  const green = "#5fcc00";
  const red = "#873025";

  // Shot clock timer
  useEffect(() => {
    if (activeShotClock && !shotClockPaused) {
      timerRef.current = setInterval(() => {
        setShotClockSeconds(s => s + 1);
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeShotClock, shotClockPaused]);

  const activeTasks = tasks.filter(t => !t.dismissed);
  const todayTasks = activeTasks.filter(t => t.bucket === "BY_NOON" || t.bucket === "END_OF_DAY");
  const doneToday = todayTasks.filter(t => t.done).length;
  const totalToday = todayTasks.length;
  const progressPct = totalToday > 0 ? (doneToday / totalToday) * 100 : 0;

  const toggleBucket = (key: string) => {
    setExpandedBuckets(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleCheck = (taskId: string) => {
    setRemovingTask(taskId);
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: true } : t));
      setRemovingTask(null);
    }, 300);
  };

  const handleDismiss = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, dismissed: true } : t));
  };

  const handleStartShotClock = (taskId: string) => {
    setActiveShotClock(taskId);
    setShotClockSeconds(0);
    setShotClockPaused(false);
  };

  const handleShotClockDone = () => {
    if (activeShotClock) {
      setTasks(prev => prev.map(t => t.id === activeShotClock ? { ...t, done: true } : t));
    }
    setActiveShotClock(null);
    setShotClockSeconds(0);
  };

  const handleCarryForward = () => {
    if (activeShotClock) {
      setTasks(prev => prev.map(t => t.id === activeShotClock ? { ...t, bucket: "THIS_WEEK" } : t));
    }
    setActiveShotClock(null);
    setShotClockSeconds(0);
  };

  const handleSetReminder = (taskId: string, time: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, reminder: time } : t));
    setShowTimePicker(null);
  };

  const handleClearReminder = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, reminder: null } : t));
  };

  const handleRegenerate = async () => {
    if (regeneratesLeft <= 0) return;
    const prevTasks = [...tasks];
    setIsGenerating(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Return only a valid JSON array. No markdown. No explanation. Each item: { id, title, bucket (BY_NOON|END_OF_DAY|THIS_WEEK|NEXT_17_DAYS|NEXT_21_DAYS|THIS_MONTH), estimatedMinutes (number or null), module (string), priority (HIGH|MEDIUM|LOW|STRATEGIC), dollarsAtStake (number), done: false, dismissed: false }",
          messages: [{ role: "user", content: `Generate a prioritized daily task list for ${(CURRENT_USER as any).company}. Include 5-8 tasks across different buckets.` }],
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setTasks(parsed.map((t: any) => ({ ...t, reminder: null })));
        setRegeneratesLeft(r => r - 1);
      } else throw new Error("Invalid response");
    } catch {
      setTasks(prevTasks);
      setErrorMsg("REGENERATE FAILED — previous tasks restored");
      setTimeout(() => setErrorMsg(null), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Drag and drop between buckets
  const handleDragStart = (taskId: string) => setDragTaskId(taskId);
  const handleDragOver = (e: React.DragEvent, bucketKey: string) => {
    e.preventDefault();
    setDropTarget(bucketKey);
  };
  const handleDrop = (bucketKey: string) => {
    if (dragTaskId) {
      setTasks(prev => prev.map(t => t.id === dragTaskId ? { ...t, bucket: bucketKey } : t));
    }
    setDragTaskId(null);
    setDropTarget(null);
  };
  const handleDragEnd = () => { setDragTaskId(null); setDropTarget(null); };

  const activeTask = activeShotClock ? tasks.find(t => t.id === activeShotClock) || null : null;

  // Shot clock computation
  const estimatedSeconds = activeTask?.estimatedMinutes ? activeTask.estimatedMinutes * 60 : 0;
  const scProgress = estimatedSeconds > 0 ? Math.min(shotClockSeconds / estimatedSeconds, 1) : 0;
  const isAt75 = scProgress >= 0.75 && scProgress < 1;
  const isOvertime = scProgress >= 1;

  const timerColor = (() => {
    if (isOvertime) return red;
    if (scProgress <= 0.75) return gold;
    const t = (scProgress - 0.75) / 0.25;
    return interpolateColor(gold, red, t);
  })();

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const truncatedName = activeTask
    ? activeTask.title.length > 45 ? activeTask.title.slice(0, 45) + "…" : activeTask.title
    : "";

  // Shot clock bar bg
  const scBg = isOvertime
    ? "rgba(135,48,37,0.08)"
    : isAt75
    ? "rgba(201,162,39,0.06)"
    : bg3;
  const scBorderTop = isOvertime ? `1px solid ${red}` : isAt75 ? `1px solid ${gold}` : `1px solid ${border}`;

  const shotClockElement = activeTask ? (
    <div style={{
      height: 48, width: "100%", backgroundColor: scBg,
      borderTop: scBorderTop, borderBottom: `1px solid ${border}`,
      borderRadius: 0, display: "flex", alignItems: "center",
      padding: "0 16px", gap: 16, fontFamily: font, flexShrink: 0,
    }}>
      {/* Left: task name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: text2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {truncatedName}
        </div>
        <div style={{ fontSize: 7, fontWeight: 800, color: gold, letterSpacing: 2 }}>
          IN PROGRESS
        </div>
      </div>

      {/* Center: timer or overtime buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isOvertime ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShotClockPaused(true)} style={{ ...scBtnStyle, border: `1px solid ${gold}`, color: gold }}>NEED MORE TIME</button>
            <button onClick={handleCarryForward} style={{ ...scBtnStyle, border: `1px solid ${text4}`, color: text4 }}>CARRY FORWARD</button>
            <button onClick={handleShotClockDone} style={{ ...scBtnStyle, backgroundColor: green, color: "#000", border: "none" }}>DONE</button>
          </div>
        ) : (
          <span style={{ fontSize: 20, fontWeight: 900, color: timerColor, fontVariantNumeric: "tabular-nums", fontFamily: font }}>
            {formatTime(shotClockSeconds)}
          </span>
        )}
      </div>

      {/* Right: action icons */}
      {!isOvertime && (
        <div style={{ display: "flex", gap: 8 }}>
          {/* Pause/Resume */}
          <button
            onClick={shotClockPaused ? () => setShotClockPaused(false) : () => setShotClockPaused(true)}
            style={scIconBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: "stroke 150ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.stroke = text2; }}
              onMouseLeave={(e) => { e.currentTarget.style.stroke = text4; }}
            >
              {shotClockPaused
                ? <path d="M5 3l14 9-14 9V3z" />
                : <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              }
            </svg>
          </button>
          {/* Done */}
          <button onClick={handleShotClockDone} style={scIconBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: "stroke 150ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.stroke = green; }}
              onMouseLeave={(e) => { e.currentTarget.style.stroke = text4; }}
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </button>
          {/* Carry Forward */}
          <button onClick={handleCarryForward} style={scIconBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: "stroke 150ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.stroke = gold; }}
              onMouseLeave={(e) => { e.currentTarget.style.stroke = text4; }}
            >
              <path d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  ) : null;

  return (
    <WidgetContainer title="DAILY ROUTINE" size="medium" helpId="widget-daily-routine" belowContent={shotClockElement}>
      <div style={{ fontFamily: font, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: gold, letterSpacing: 1.5 }}>GESTALT INTELLIGENCE</span>
            <span style={{ fontSize: 9, color: text4 }}>Generated {lastGenerated}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: text4, letterSpacing: 1 }}>{regeneratesLeft} REGENERATES LEFT</span>
            <button
              onClick={handleRegenerate}
              disabled={regeneratesLeft <= 0 || isGenerating}
              style={{
                fontFamily: font, fontSize: 10, fontWeight: 800, color: gold,
                border: `1px solid ${gold}`, borderRadius: 2, background: "none",
                padding: "3px 10px", cursor: regeneratesLeft > 0 ? "pointer" : "default",
                opacity: regeneratesLeft <= 0 ? 0.35 : 1, letterSpacing: 1,
              }}
            >
              {isGenerating ? "GENERATING..." : "REGENERATE"}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ fontSize: 11, fontWeight: 700, color: red, textAlign: "center", padding: 4 }}>
            {errorMsg}
          </div>
        )}

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: text3, letterSpacing: 1 }}>
            {doneToday} OF {totalToday} COMPLETE TODAY
          </span>
          <div style={{ width: 80, height: 2, backgroundColor: border, borderRadius: 0, position: "relative" }}>
            <div style={{ width: `${progressPct}%`, height: "100%", backgroundColor: green, transition: "width 300ms" }} />
          </div>
        </div>

        {/* Buckets */}
        {BUCKETS.map(bucket => {
          const bucketTasks = activeTasks.filter(t => t.bucket === bucket.key);
          const unchecked = bucketTasks.filter(t => !t.done);
          const allDone = bucketTasks.length > 0 && unchecked.length === 0;
          const dollarTotal = unchecked.reduce((sum, t) => sum + t.dollarsAtStake, 0);
          const isExpanded = expandedBuckets.has(bucket.key);
          const isDropZone = dropTarget === bucket.key;

          const isByNoonAlert = bucket.key === "BY_NOON" && MOCK_IS_PAST_NOON && unchecked.length > 0;

          return (
            <div
              key={bucket.key}
              onDragOver={(e) => handleDragOver(e, bucket.key)}
              onDrop={() => handleDrop(bucket.key)}
              style={{
                backgroundColor: isDropZone ? "rgba(201,162,39,0.06)" : undefined,
                borderLeft: isDropZone ? `2px solid ${gold}` : undefined,
              }}
            >
              {/* Bucket header */}
              <button
                onClick={() => toggleBucket(bucket.key)}
                style={{
                  width: "100%", height: 36, display: "flex", alignItems: "center",
                  justifyContent: "space-between", padding: "0 10px",
                  backgroundColor: bg3, borderTop: `1px solid ${border}`,
                  border: "none", cursor: "pointer", fontFamily: font,
                }}
              >
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: 2,
                  color: isByNoonAlert ? red : text3,
                  textTransform: "uppercase",
                }}>
                  {bucket.label}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {allDone ? (
                    <span style={{ fontSize: 9, fontWeight: 700, color: green, letterSpacing: 1 }}>COMPLETE</span>
                  ) : (
                    <>
                      <span style={{ fontSize: 9, fontWeight: 600, color: text4 }}>{bucketTasks.length}</span>
                      {dollarTotal > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 900, color: gold }}>${dollarTotal.toLocaleString()}</span>
                      )}
                    </>
                  )}
                  <svg
                    width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 200ms" }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Tasks */}
              {isExpanded && (
                <div>
                  {bucketTasks.length === 0 ? (
                    <div style={{ textAlign: "center", fontSize: 11, color: text4, padding: 10 }}>CLEAR</div>
                  ) : (
                    bucketTasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        isDark={isDark}
                        isRemoving={removingTask === task.id}
                        isHovered={hoveredTask === task.id}
                        showTimePicker={showTimePicker === task.id}
                        showTooltip={tooltipTask === task.id}
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => { setHoveredTask(null); setTooltipTask(null); }}
                        onCheck={() => handleCheck(task.id)}
                        onDismiss={() => handleDismiss(task.id)}
                        onStart={() => handleStartShotClock(task.id)}
                        onDragStart={() => handleDragStart(task.id)}
                        onDragEnd={handleDragEnd}
                        onToggleTimePicker={() => setShowTimePicker(showTimePicker === task.id ? null : task.id)}
                        onSetReminder={(time) => handleSetReminder(task.id, time)}
                        onClearReminder={() => handleClearReminder(task.id)}
                        onShowTooltip={() => setTooltipTask(task.id)}
                        onHideTooltip={() => setTooltipTask(null)}
                        theme={{ bg3, border, border2, text1, text2, text3, text4, gold, green, red }}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </WidgetContainer>
  );
}

// ── Task Item Component ──
interface TaskItemProps {
  task: Task;
  isDark: boolean;
  isRemoving: boolean;
  isHovered: boolean;
  showTimePicker: boolean;
  showTooltip: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCheck: () => void;
  onDismiss: () => void;
  onStart: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onToggleTimePicker: () => void;
  onSetReminder: (time: string) => void;
  onClearReminder: () => void;
  onShowTooltip: () => void;
  onHideTooltip: () => void;
  theme: Record<string, string>;
}

function TaskItem({
  task, isDark, isRemoving, isHovered, showTimePicker, showTooltip,
  onMouseEnter, onMouseLeave, onCheck, onDismiss, onStart, onDragStart, onDragEnd,
  onToggleTimePicker, onSetReminder, onClearReminder, onShowTooltip, onHideTooltip,
  theme,
}: TaskItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        minHeight: 48, display: "flex", alignItems: "center", padding: "6px 10px",
        borderBottom: `1px solid ${theme.border}`, fontFamily: font,
        opacity: isRemoving ? 0 : 1,
        transform: isRemoving ? "translateX(40px)" : "translateX(0)",
        transition: "opacity 300ms, transform 300ms",
        position: "relative",
      }}
    >
      {/* Drag handle */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, cursor: "grab", marginRight: 8, flexShrink: 0 }}>
        {[0, 1, 2].map(r => (
          <div key={r} style={{ display: "flex", gap: 2 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: theme.border2 }} />
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: theme.border2 }} />
          </div>
        ))}
      </div>

      {/* Checkbox */}
      <button
        onClick={task.done ? undefined : onCheck}
        style={{
          width: 14, height: 14, borderRadius: 2, flexShrink: 0, marginRight: 8,
          border: task.done ? "none" : `1px solid ${theme.border2}`,
          backgroundColor: task.done ? theme.gold : "transparent",
          cursor: task.done ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
        }}
      >
        {task.done && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </button>

      {/* Title + reminder badge */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            fontSize: 12, fontWeight: 600, color: task.done ? theme.text4 : theme.text1,
            textDecoration: task.done ? "line-through" : "none",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}
        >
          {task.title}
        </span>
        {task.reminder && (
          <button
            onClick={onClearReminder}
            style={{
              fontSize: 9, fontWeight: 700, color: theme.gold, letterSpacing: 0.5,
              background: theme.bg3, border: `1px solid ${theme.border}`,
              borderRadius: 2, padding: "1px 5px", cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: font,
            }}
          >
            REMINDER {task.reminder}
          </button>
        )}
      </div>

      {/* Dollar amount — always visible */}
      {task.dollarsAtStake > 0 && !task.done && (
        <span style={{ fontSize: 13, fontWeight: 900, color: theme.gold, marginRight: 8, whiteSpace: "nowrap", fontFamily: font }}>
          ${task.dollarsAtStake.toLocaleString()}
        </span>
      )}

      {/* Action icons (hover only) */}
      {isHovered && !task.done && (
        <div style={{ display: "flex", gap: 4, marginLeft: 4, position: "relative" }}>
          {/* Clock - Set Reminder */}
          <button onClick={onToggleTimePicker} style={actionBtnStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
          </button>
          {/* Play - Start Shot Clock */}
          <button onClick={onStart} style={actionBtnStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </button>
          {/* X - Dismiss */}
          <button onClick={onDismiss} style={actionBtnStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Time picker dropdown */}
          {showTimePicker && (
            <div style={{
              position: "absolute", top: "100%", right: 0, marginTop: 4, zIndex: 60,
              background: theme.bg3, border: `1px solid ${theme.border}`,
              borderRadius: 2, padding: 4, display: "flex", flexDirection: "column", gap: 1,
            }}>
              {TOP_HOUR_OPTIONS.map(time => (
                <button
                  key={time}
                  onClick={() => onSetReminder(time)}
                  style={{
                    fontFamily: font, fontSize: 11, fontWeight: 600, color: theme.text2,
                    background: "none", border: "none", padding: "3px 8px",
                    cursor: "pointer", textAlign: "left", borderRadius: 2,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(201,162,39,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex",
};

const scBtnStyle: React.CSSProperties = {
  fontFamily: "'Gotham', 'Montserrat', system-ui, sans-serif",
  fontSize: 9, fontWeight: 800, letterSpacing: 1, padding: "4px 10px",
  borderRadius: 2, cursor: "pointer", background: "none", textTransform: "uppercase",
};

const scIconBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 0, border: "none", background: "none",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
};