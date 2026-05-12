import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { toast } from "sonner";
import { Brain, Database, FileText, Plus, RefreshCcw, Save, Upload, Trash2, LogOut, Columns, Link2, Pointer, Edit3, ZoomIn, ZoomOut, Maximize, Grid3x3, Lock, Unlock } from "lucide-react";
import { CLINIC_NAMES } from "@/lib/clinics";

// Simple node components with navigation "+" action
function DatabaseTableNode({ data }: { data: { name: string; path?: string } }) {
  const onOpen = () => {
    if (data?.path) {
      window.dispatchEvent(new CustomEvent("nodes:navigate", { detail: data.path }));
    } else {
      toast.info("No linked page for this table yet");
    }
  };
  return (
    <div className="relative rounded-md border border-border bg-card text-card-foreground shadow p-3 min-w-[160px]">
      <button
        aria-label="Open related page"
        className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-background/80 hover:bg-muted"
        onClick={onOpen}
      >
        <Plus className="h-3 w-3" />
      </button>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">Table</div>
      <div className="text-sm font-semibold">{data.name}</div>
    </div>
  );
}

function PageNode({ data }: { data: { path: string; title?: string } }) {
  const onOpen = () => {
    const href = data?.path || "/";
    window.dispatchEvent(new CustomEvent("nodes:navigate", { detail: href }));
  };
  return (
    <div className="relative rounded-md border border-border bg-card text-card-foreground shadow p-3 min-w-[180px]">
      <button
        aria-label="Open this page"
        className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-background/80 hover:bg-muted"
        onClick={onOpen}
      >
        <Plus className="h-3 w-3" />
      </button>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">Page</div>
      <div className="text-sm font-semibold break-all">{data.title || data.path}</div>
      <div className="text-xs text-muted-foreground">{data.path}</div>
    </div>
  );
}

function ThoughtNode({ data }: { data: { text: string; path?: string } }) {
  const onOpen = () => {
    if (data?.path) {
      window.dispatchEvent(new CustomEvent("nodes:navigate", { detail: data.path }));
    } else {
      toast.info("No linked page for this note yet");
    }
  };
  return (
    <div className="relative rounded-md border border-border bg-secondary text-secondary-foreground shadow p-3 min-w-[160px]">
      <button
        aria-label="Open related page"
        className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-background/80 hover:bg-muted"
        onClick={onOpen}
      >
        <Plus className="h-3 w-3" />
      </button>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">Thought</div>
      <div className="text-sm font-medium whitespace-pre-wrap">{data.text}</div>
    </div>
  );
}

const nodeTypes = {
  dbTable: DatabaseTableNode,
  page: PageNode,
  thought: ThoughtNode,
};

const STORAGE_KEY = "nodes-mode-graph-v1";

export default function Nodes() {
  // SEO basics
  useEffect(() => {
    document.title = "Nodes Mode - FORTIFIED DB & Pages Map";
    const metaDesc = document.querySelector('meta[name="description"]');
    const desired = "Visualize FORTIFIED database and page relationships in Nodes Mode.";
    if (metaDesc) metaDesc.setAttribute("content", desired);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = desired;
      document.head.appendChild(m);
    }
  }, []);

  // Load from storage
  const stored = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as { nodes: Node[]; edges: Edge[] };
    } catch {
      return null;
    }
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(stored?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(stored?.edges || []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection }, eds));
  }, [setEdges]);

  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    toast.success("Nodes saved");
  }, [nodes, edges]);

  const load = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return toast.info("Nothing saved yet");
    try {
      const parsed = JSON.parse(raw) as { nodes: Node[]; edges: Edge[] };
      setNodes(parsed.nodes || []);
      setEdges(parsed.edges || []);
      toast.success("Loaded saved graph");
    } catch {
      toast.error("Failed to load saved graph");
    }
  }, [setNodes, setEdges]);

  const clearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Cleared");
  }, [setNodes, setEdges]);

  // Helpers to add nodes
  const nextId = useMemo(() => () => Math.random().toString(36).slice(2, 9), []);

  const addTable = useCallback((name?: string) => {
    const tableName = name?.trim() || `table_${nodes.length + 1}`;
    const id = `t_${nextId()}`;
    setNodes((nds) => nds.concat({
      id,
      type: "dbTable",
      position: { x: 100 + nds.length * 20, y: 100 + nds.length * 20 },
      data: { name: tableName },
    } as Node));
  }, [nodes.length, nextId, setNodes]);

  const addPage = useCallback((path?: string, title?: string) => {
    const route = path || "/";
    const id = `p_${nextId()}`;
    setNodes((nds) => nds.concat({
      id,
      type: "page",
      position: { x: 200 + nds.length * 20, y: 120 + nds.length * 20 },
      data: { path: route, title },
    } as Node));
  }, [nextId, setNodes]);

  const addThought = useCallback((text?: string) => {
    const t = text || "Reason about data mapping or UI state here";
    const id = `a_${nextId()}`;
    setNodes((nds) => nds.concat({
      id,
      type: "thought",
      position: { x: 300 + nds.length * 20, y: 140 + nds.length * 20 },
      data: { text: t },
    } as Node));
  }, [nextId, setNodes]);

  const loadSitePages = useCallback(() => {
    // Known routes in this app
    const pages = [
      { path: "/", title: "Dashboard" },
      { path: "/add-location", title: "Add Location" },
      { path: "/add-employee", title: "Add Employee" },
      { path: "/nodes", title: "Nodes Mode" },
      { path: "*", title: "Not Found" },
    ];
    pages.forEach((p, idx) => addPage(p.path, p.title));
    toast.success("Pages added");
  }, [addPage]);

  const [newName, setNewName] = useState("");
  const [splitView, setSplitView] = useState(false);

  const syncFromSupabase = useCallback(async () => {
    try {
      // No public tables in this project yet; keep graceful UX
      toast.info("No public tables detected. Add virtual tables to plan your schema.");
    } catch (e) {
      toast.error("Could not sync from database");
    }
  }, []);

  // Preview iframe source and link highlighting
  const [previewSrc, setPreviewSrc] = useState("/");
  const iframeRef = useRef<HTMLIFrameElement>(null);
const [highlightLinks, setHighlightLinks] = useState(false);
  const [showMapOverlay, setShowMapOverlay] = useState(false);
const [inlineForm, setInlineForm] = useState<null | "employee" | "location">(null);
const roles = ["STAFF", "TECH", "OD", "SURGEON", "RECEPTION", "CALL CENTER", "MANAGER"];
const [empForm, setEmpForm] = useState({ first: "", last: "", email: "", phone: "", location: "", role: "" });
const empReady = Boolean(empForm.first && empForm.last && empForm.email && empForm.location && empForm.role);

  // Quadrant label states and locking
  const [staffLabel, setStaffLabel] = useState<string>(() => localStorage.getItem('q:staffLabel') || 'CHOOSE TITLE')
  const [patientLabel, setPatientLabel] = useState<string>(() => localStorage.getItem('q:patientLabel') || 'CHOOSE TITLE')
  const [staffLocked, setStaffLocked] = useState<boolean>(() => {
    const v = localStorage.getItem('q:staffLocked')
    return v ? v === 'true' : false // start unlocked if not set
  })
  const [patientLocked, setPatientLocked] = useState<boolean>(() => {
    const v = localStorage.getItem('q:patientLocked')
    return v ? v === 'true' : false // start unlocked if not set
  })

  useEffect(() => {
    localStorage.setItem('q:staffLabel', staffLabel)
    localStorage.setItem('q:patientLabel', patientLabel)
    localStorage.setItem('q:staffLocked', String(staffLocked))
    localStorage.setItem('q:patientLocked', String(patientLocked))
  }, [staffLabel, patientLabel, staffLocked, patientLocked])

  // Bi-directional selection & element tooling
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pickMode, setPickMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  useEffect(() => {
    const handler = (e: any) => {
      const path = e?.detail as string | undefined;
      if (!path) return;
      if (path === "/add-employee") { setInlineForm("employee"); return; }
      if (path === "/add-location") { setInlineForm("location"); return; }
      setInlineForm(null);
      setPreviewSrc(path);
    };
    window.addEventListener("nodes:navigate", handler as any);
    return () => window.removeEventListener("nodes:navigate", handler as any);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    const id = "nodes-link-highlighter-style";
    let styleEl = doc.getElementById(id) as HTMLStyleElement | null;

    if (highlightLinks) {
      if (!styleEl) {
        styleEl = doc.createElement("style");
        styleEl.id = id;
        styleEl.textContent = `a, [role="link"], button, [data-linkable="true"] { outline: 2px dashed hsl(var(--border)); outline-offset: 2px; }
        a:hover, [role="link"]:hover, button:hover, [data-linkable="true"]:hover { outline: 2px solid hsl(var(--foreground)); }`;
        doc.head.appendChild(styleEl);
      }
      const onClick = (ev: any) => { ev.preventDefault(); ev.stopPropagation(); };
      doc.addEventListener("click", onClick, { capture: true });
      return () => { doc.removeEventListener("click", onClick, { capture: true } as any); };
    } else if (styleEl) {
      styleEl.remove();
    }
  }, [highlightLinks, previewSrc]);

  // Helpers for bi-directional Nodes <> Preview sync
  const getDoc = useCallback(() => {
    const iframe = iframeRef.current;
    return iframe?.contentDocument || iframe?.contentWindow?.document || null;
  }, []);

  function buildSelector(el: Element): string {
    if ((el as HTMLElement).id) return `#${(el as HTMLElement).id}`;
    const parts: string[] = [];
    let node: Element | null = el;
    while (node && parts.length < 5) {
      let sel = node.nodeName.toLowerCase();
      const classList = Array.from((node as HTMLElement).classList || []);
      if (classList.length) sel += '.' + classList.slice(0, 2).join('.');
      const parent: Element | null = node.parentElement;
      if (parent) {
        const sibs = Array.from(parent.children).filter((c: Element) => c.nodeName === node!.nodeName);
        if (sibs.length > 1) {
          const idx = sibs.indexOf(node as Element) + 1;
          sel += `:nth-of-type(${idx})`;
        }
      }
      parts.unshift(sel);
      node = parent;
    }
    return parts.join(' > ');
  }

  const highlightBoxId = "nodes-selected-box";
  const hoverBoxId = "nodes-hover-box";

  const drawBox = (doc: Document, rect: DOMRect, id: string, colorVar = '--primary') => {
    let el = doc.getElementById(id) as HTMLDivElement | null;
    if (!el) {
      el = doc.createElement('div');
      el.id = id;
      el.style.position = 'absolute';
      el.style.zIndex = '999999';
      el.style.pointerEvents = 'none';
      el.style.border = `2px solid hsl(var(${colorVar}))`;
      el.style.borderRadius = '4px';
      el.style.boxShadow = '0 0 0 2px hsl(var(--background) / 0.4)';
      doc.body.appendChild(el);
    }
    const w = (doc.defaultView || window);
    el.style.top = (w.scrollY + rect.top) + 'px';
    el.style.left = (w.scrollX + rect.left) + 'px';
    el.style.width = rect.width + 'px';
    el.style.height = rect.height + 'px';
  };

  const clearBox = (doc: Document, id: string) => {
    const el = doc.getElementById(id);
    if (el) el.remove();
  };

  const highlightSelectedInPreview = useCallback((scrollIntoView = true) => {
    const doc = getDoc();
    if (!doc || !selectedNode) return;
    const selector = (selectedNode as any)?.data?.selector as string | undefined;
    if (!selector) return;
    const target = doc.querySelector(selector) as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    if (scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    drawBox(doc, rect, highlightBoxId, '--primary');
  }, [getDoc, selectedNode]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      highlightSelectedInPreview(true);
    };
    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, [previewSrc, highlightSelectedInPreview]);

  // Intercept in-iframe navigation to Add forms and show inline in left panel instead
  useEffect(() => {
    const iframe = iframeRef.current;
    const win = iframe?.contentWindow;
    const doc = iframe?.contentDocument || win?.document;
    if (!win || !doc) return;

    const openInline = (path: string) => {
      if (path === '/add-employee') { setInlineForm('employee'); toast.info('Add Employee opened in sidebar'); return true; }
      if (path === '/add-location') { setInlineForm('location'); toast.info('Add Location opened in sidebar'); return true; }
      return false;
    };

    const intercept = (url?: string | URL | null) => {
      if (!url) return false;
      try {
        const u = typeof url === 'string' ? new URL(url, win.location.href) : url;
        return openInline(u.pathname);
      } catch { return false; }
    };

    const origPush = win.history.pushState.bind(win.history);
    (win.history as any).pushState = function(state: any, title: string, url?: string | URL | null) {
      if (intercept(url)) return;
      return origPush(state, title, url as any);
    } as any;

    const origReplace = win.history.replaceState.bind(win.history);
    (win.history as any).replaceState = function(state: any, title: string, url?: string | URL | null) {
      if (intercept(url)) return;
      return origReplace(state, title, url as any);
    } as any;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const a = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (a && openInline(a.pathname)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    doc.addEventListener('click', onClick, { capture: true });
    return () => doc.removeEventListener('click', onClick as any, { capture: true } as any);
  }, [previewSrc]);

  const handleSelectionChange = useCallback(({ nodes: selNodes }: { nodes: Node[]; edges: Edge[] }) => {
    const active = selNodes?.[0]?.id ?? null;
    setSelectedNodeId(active);
    if (active) {
      const n = nodes.find((n) => n.id === active);
      const path = (n as any)?.data?.path as string | undefined;
      if (path) setPreviewSrc(path);
      setTimeout(() => highlightSelectedInPreview(true), 150);
    }
  }, [nodes, highlightSelectedInPreview]);

  useEffect(() => {
    const doc = getDoc();
    if (!doc) return;
    if (!pickMode) { clearBox(doc, hoverBoxId); return; }
    if (!selectedNode) { toast.info('Select a node first, then pick an element.'); setPickMode(false); return; }
    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      drawBox(doc, rect, hoverBoxId, '--ring');
    };
    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const selector = buildSelector(target);
      setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? ({ ...n, data: { ...(n as any).data, selector } }) : n));
      toast.success('Element linked to node');
      setPickMode(false);
      setTimeout(() => highlightSelectedInPreview(false), 50);
    };
    doc.addEventListener('mousemove', onMove, { capture: true });
    doc.addEventListener('click', onClick, { capture: true });
    return () => {
      doc.removeEventListener('mousemove', onMove as any, { capture: true } as any);
      doc.removeEventListener('click', onClick as any, { capture: true } as any);
      clearBox(doc, hoverBoxId);
    };
  }, [pickMode, selectedNode, getDoc, setNodes, highlightSelectedInPreview]);

  useEffect(() => {
    const doc = getDoc();
    if (!doc || pickMode) return;
    const nodeSelectors = nodes
      .map((n) => ({ id: n.id, selector: (n as any)?.data?.selector as string | undefined }))
      .filter((x) => !!x?.selector) as { id: string; selector: string }[];
    if (!nodeSelectors.length) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const hit = nodeSelectors.find((ns) => target.matches(ns.selector) || (target as HTMLElement).closest(ns.selector));
      if (hit) {
        setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === hit.id })));
        setSelectedNodeId(hit.id);
      }
    };
    doc.addEventListener('click', onClick, { capture: true });
    return () => doc.removeEventListener('click', onClick as any, { capture: true } as any);
  }, [nodes, pickMode, getDoc, setNodes]);

  const canEdit = !!selectedNode && !!(selectedNode as any)?.data?.selector;
  const toggleEdit = useCallback(() => {
    const doc = getDoc();
    if (!doc || !selectedNode) return;
    const selector = (selectedNode as any).data?.selector as string | undefined;
    if (!selector) { toast.info('Link an element first.'); return; }
    const el = doc.querySelector(selector) as HTMLElement | null;
    if (!el) { toast.error('Element not found in preview'); return; }
    if (!editMode) {
      el.setAttribute('contenteditable', 'true');
      el.focus();
      toast.success('Editing enabled. Press button again to stop.');
      setEditMode(true);
    } else {
      el.removeAttribute('contenteditable');
      setEditMode(false);
      toast.success('Editing disabled');
    }
  }, [getDoc, selectedNode, editMode]);

  const FlowControls = () => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    return (
      <Panel position="top-left">
        <div className="rounded-md border border-border bg-background/60 backdrop-blur px-2 py-1 shadow flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => zoomIn()} aria-label="Zoom in">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => zoomOut()} aria-label="Zoom out">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => fitView({ padding: 0.2 })} aria-label="Fit view">
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fit view</TooltipContent>
          </Tooltip>
        </div>
      </Panel>
    );
  };

  const SiteMapPanel = () => {
    const routes = [
      { path: "/", title: "Dashboard" },
      { path: "/add-location", title: "Add Location" },
      { path: "/add-employee", title: "Add Employee" },
      { path: "/nodes", title: "Nodes Mode" },
    ];
    return (
      <aside className="h-full w-full overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="px-3 py-2 border-b border-border bg-background/60 backdrop-blur">
            <div className="text-sm font-semibold">Sitemap</div>
            <div className="text-xs text-muted-foreground">Routes & locations</div>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {routes.map((r) => (
              <button
                key={r.path}
                onClick={() => {
                  if (r.path === "/add-employee") { setInlineForm("employee"); return; }
                  if (r.path === "/add-location") { setInlineForm("location"); return; }
                  setInlineForm(null);
                  setPreviewSrc(r.path);
                }}
                className="w-full text-left rounded-md border border-border bg-card hover:bg-muted px-3 py-2"
              >
                <div className="text-sm font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.path}</div>
              </button>
            ))}

            {inlineForm && (
              <div className="mt-3 rounded-md border border-border bg-background/75 p-3">
                {inlineForm === 'employee' ? (
                    <div>
                      <div className="text-sm font-semibold mb-2">Employee Details</div>
                      <p className="text-xs text-muted-foreground">All fields are required except Telephone.</p>
                      <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="empFirst">First Name *</Label>
                          <Input id="empFirst" placeholder="First" value={empForm.first} onChange={(e) => setEmpForm(f => ({ ...f, first: e.target.value }))} />
                        </div>
                        <div>
                          <Label htmlFor="empLast">Last Name *</Label>
                          <Input id="empLast" placeholder="Last" value={empForm.last} onChange={(e) => setEmpForm(f => ({ ...f, last: e.target.value }))} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="empEmail">Email *</Label>
                          <Input id="empEmail" type="email" placeholder="name@company.com" value={empForm.email} onChange={(e) => setEmpForm(f => ({ ...f, email: e.target.value }))} />
                        </div>
                        <div>
                          <Label htmlFor="empPhone">Phone</Label>
                          <Input id="empPhone" type="tel" placeholder="(555) 555-5555" value={empForm.phone} onChange={(e) => setEmpForm(f => ({ ...f, phone: e.target.value }))} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="empLocation">Clinic Location *</Label>
                          <Select value={empForm.location} onValueChange={(v) => setEmpForm(f => ({ ...f, location: v }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a clinic" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {CLINIC_NAMES.map((name) => (
                                <SelectItem key={name} value={name}>
                                  {name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="empRole">Position *</Label>
                          <Select value={empForm.role} onValueChange={(v) => setEmpForm(f => ({ ...f, role: v }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {roles.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="text-xs uppercase text-muted-foreground mb-1">Quadrant Labels</div>
<div className="grid grid-cols-2 gap-2">
  {/* PERSONAL - fixed, white background, black text, black lock icon */}
  <div className="relative">
    <div
      aria-label="PERSONAL field"
      title="PERSONAL"
      className="uppercase border-2 rounded-[2pt] h-10 w-full px-3 pr-8 flex items-center select-none"
      style={{ borderColor: `hsl(var(--q-personal))`, backgroundColor: `hsl(var(--q-personal))` }}
    >
      <span className="text-primary-foreground">PERSONAL</span>
      <Lock
        className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground"
      />
    </div>
  </div>

  {/* STAFF - selectable (STAFF/TEAM), unlock/lock behavior */}
  <div className="relative">
    {staffLocked ? (
      <button
        type="button"
        onClick={() => setStaffLocked(false)}
        aria-label="STAFF field (locked)"
        title={staffLabel}
        className="uppercase border-2 rounded-[2pt] h-10 w-full px-3 pr-8 flex items-center"
        style={{ borderColor: `hsl(var(--q-staff))`, backgroundColor: `hsl(var(--q-staff))` }}
      >
        <span className="text-primary-foreground">{staffLabel}</span>
        <Lock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground" />
      </button>
    ) : (
      <div className="relative">
        <Select onValueChange={(v) => { setStaffLabel(v); setStaffLocked(true); }}>
          <SelectTrigger
            className="uppercase border-2 rounded-[2pt] h-10 w-full px-3 pr-8 flex items-center"
            style={{ borderColor: `hsl(var(--q-staff))`, backgroundColor: `hsl(var(--q-staff) / 0.2)`, color: `hsl(var(--q-staff))` }}
          >
            <SelectValue placeholder="CHOOSE TITLE" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-popover shadow-md border border-border rounded-[2pt]">
            <SelectItem value="STAFF">STAFF</SelectItem>
            <SelectItem value="TEAM">TEAM</SelectItem>
          </SelectContent>
        </Select>
        <Unlock
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: `hsl(var(--q-staff))` }}
        />
      </div>
    )}
  </div>

  {/* PATIENT - selectable (PATIENT/CUSTOMER/CLIENT/ORGANIZATION), unlock/lock behavior */}
  <div className="relative">
    {patientLocked ? (
      <button
        type="button"
        onClick={() => setPatientLocked(false)}
        aria-label="PATIENT field (locked)"
        title={patientLabel}
        className="uppercase border-2 rounded-[2pt] h-10 w-full px-3 pr-8 flex items-center"
        style={{ borderColor: `hsl(var(--q-patient))`, backgroundColor: `hsl(var(--q-patient))` }}
      >
        <span className="text-primary-foreground">{patientLabel}</span>
        <Lock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground" />
      </button>
    ) : (
      <div className="relative">
        <Select onValueChange={(v) => { setPatientLabel(v); setPatientLocked(true); }}>
          <SelectTrigger
            className="uppercase border-2 rounded-[2pt] h-10 w-full px-3 pr-8 flex items-center"
            style={{ borderColor: `hsl(var(--q-patient))`, backgroundColor: `hsl(var(--q-patient) / 0.2)`, color: `hsl(var(--q-patient))` }}
          >
            <SelectValue placeholder="CHOOSE TITLE" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-popover shadow-md border border-border rounded-[2pt]">
            <SelectItem value="PATIENT">PATIENT</SelectItem>
            <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
            <SelectItem value="CLIENT">CLIENT</SelectItem>
            <SelectItem value="ORGANIZATION">ORGANIZATION</SelectItem>
          </SelectContent>
        </Select>
        <Unlock
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: `hsl(var(--q-patient))` }}
        />
      </div>
    )}
  </div>

  {/* KNOWLEDGE - fixed, royal blue background, black lock icon */}
  <div className="relative">
    <div
      aria-label="KNOWLEDGE field"
      title="KNOWLEDGE"
      className="uppercase border-2 rounded-[2pt] h-10 w-full px-3 pr-8 flex items-center select-none"
      style={{ borderColor: `hsl(var(--q-knowledge))`, backgroundColor: `hsl(var(--q-knowledge))` }}
    >
      <span className="text-primary-foreground">KNOWLEDGE</span>
      <Lock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground" />
    </div>
  </div>
</div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => setInlineForm(null)}>Cancel</Button>
                        <Button size="sm" disabled={!empReady} onClick={() => { toast.success('Employee created'); setInlineForm(null); }}>Create Employee</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-semibold mb-2">Location Details</div>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="locName">Location Name *</Label>
                        <Input id="locName" placeholder="Name" />
                      </div>
                      <div>
                        <Label htmlFor="locAddress">Address *</Label>
                        <Textarea id="locAddress" placeholder="Street, City, State" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="locPhone">Phone</Label>
                          <Input id="locPhone" type="tel" />
                        </div>
                        <div>
                          <Label htmlFor="locEmail">Email</Label>
                          <Input id="locEmail" type="email" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => setInlineForm(null)}>Cancel</Button>
                        <Button size="sm" onClick={() => { toast.success('Location created'); setInlineForm(null); }}>Create Location</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="border-t border-border p-3 bg-background/60 backdrop-blur space-y-3">
            <div>
              <div className="text-sm font-semibold mb-2">Node Mode</div>
              {selectedNode ? (
                <div className="space-y-1 text-sm">
                  <div className="text-xs uppercase text-muted-foreground">Selected</div>
                  <div className="font-medium break-all">{selectedNode.type}</div>
                  {"data" in selectedNode && (
                    <>
                      {(selectedNode as any).data?.title && <div>Title: {(selectedNode as any).data.title}</div>}
                      {(selectedNode as any).data?.path && <div>Path: {(selectedNode as any).data.path}</div>}
                      {(selectedNode as any).data?.name && <div>Name: {(selectedNode as any).data.name}</div>}
                      {(selectedNode as any).data?.text && <div>Text: {(selectedNode as any).data.text}</div>}
                      {(selectedNode as any).data?.selector && (
                        <div className="text-xs text-muted-foreground">Selector: {(selectedNode as any).data.selector}</div>
                      )}
                    </>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => highlightSelectedInPreview(false)} disabled={!((selectedNode as any)?.data?.selector)}>
                      Focus in Preview
                    </Button>
                    <Button size="sm" variant={editMode ? "default" : "outline"} disabled={!canEdit} onClick={toggleEdit}>
                      {editMode ? "Stop Edit" : "Edit Text"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">Select a node to inspect and act on it.</div>
              )}
            </div>

          </div>
        </div>
      </aside>
    );
  };

  return (
    <main className="fixed inset-0">
      {/* Grid overlay: 20% white lines over the site's background */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 ${splitView ? "hidden" : ""}`}
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Toolbar */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-2 rounded-md border border-border bg-background/70 backdrop-blur px-3 py-2 shadow">
          <div className="flex items-center gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name (table/page/thought)"
              className="h-8 w-56 bg-background border-border text-foreground"
            />
            <Button size="sm" onClick={() => addTable(newName)}><Database className="mr-1 h-4 w-4" />Add Table</Button>
            <Button size="sm" variant="secondary" onClick={() => addPage(newName || "/new-page", newName)}><FileText className="mr-1 h-4 w-4" />Add Page</Button>
            <Button size="sm" variant="outline" onClick={() => addThought(newName)}><Brain className="mr-1 h-4 w-4" />Add Thought</Button>
          </div>
          <div className="mx-2 h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Button size="sm" variant={splitView ? "default" : "outline"} onClick={() => setSplitView((v) => !v)}>
              <Columns className="mr-1 h-4 w-4" />Current Build
            </Button>
            <Button size="sm" variant={highlightLinks ? "default" : "outline"} onClick={() => setHighlightLinks((v) => !v)}>
              <Link2 className="mr-1 h-4 w-4" />Highlight Links
            </Button>
            <Button size="sm" variant={showMapOverlay ? "default" : "outline"} onClick={() => setShowMapOverlay((v) => !v)}>
              <Grid3x3 className="mr-1 h-4 w-4" />Map Overlay
            </Button>
            <Button size="sm" variant={pickMode ? "default" : "outline"} onClick={() => setPickMode((v) => !v)}>
              <Pointer className="mr-1 h-4 w-4" />Pick Element
            </Button>
            <Button size="sm" variant={editMode ? "default" : "outline"} disabled={!canEdit} onClick={toggleEdit}>
              <Edit3 className="mr-1 h-4 w-4" />Edit Text
            </Button>
            <Button size="sm" variant="outline" onClick={loadSitePages}><Plus className="mr-1 h-4 w-4" />Pages</Button>
            <Button size="sm" variant="outline" onClick={syncFromSupabase}><RefreshCcw className="mr-1 h-4 w-4" />Sync DB</Button>
            <Button size="sm" variant="outline" onClick={save}><Save className="mr-1 h-4 w-4" />Save</Button>
            <Button size="sm" variant="outline" onClick={load}><Upload className="mr-1 h-4 w-4" />Load</Button>
            <Button size="sm" variant="destructive" onClick={clearAll}><Trash2 className="mr-1 h-4 w-4" />Clear</Button>
            <a href="/" className="ml-2">
              <Button size="sm" variant="secondary"><LogOut className="mr-1 h-4 w-4" />Exit</Button>
            </a>
          </div>
        </div>
      </header>

      {/* Canvas */}
      {splitView ? (
        <section className="absolute inset-0 z-[1]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left: Site Map + Node Inspector */}
            <ResizablePanel defaultSize={22} minSize={16}>
              <div className="h-full border-r border-border bg-background/40">
                <SiteMapPanel />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Middle: live site preview with optional overlay */}
            <ResizablePanel defaultSize={43} minSize={30}>
              <div className="relative h-full">
                {showMapOverlay && (
                  <div className="pointer-events-none absolute inset-0 z-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(to bottom, hsl(var(--border)/0.6) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)/0.6) 1px, transparent 1px)",
                        backgroundSize: "100% 33.3333%, 25% 100%",
                        backgroundPosition: "0 33%, 25% 0",
                      }}
                    />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded border border-border bg-background/70 backdrop-blur">Header</div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded border border-border bg-background/70 backdrop-blur">Main</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded border border-border bg-background/70 backdrop-blur">Footer</div>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src={previewSrc}
                  title="Current Build Preview"
                  className="h-full w-full border-0 bg-background"
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Right: nodes with grid overlay */}
            <ResizablePanel defaultSize={35} minSize={24}>
              <div className="relative h-full">
                {/* Grid overlay only on nodes side */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(hsl(0 0% 100% / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.05) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0",
                  }}
                />
                <ReactFlow
                  className="h-full bg-transparent"
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  fitView
                  attributionPosition="bottom-left"
                  onSelectionChange={handleSelectionChange}
                >
                  <MiniMap zoomable pannable />
                  <FlowControls />
                  <Background color="transparent" />
                </ReactFlow>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </section>
      ) : (
        <section className="absolute inset-0 z-[1]">
          <ReactFlow
            className="bg-transparent"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <MiniMap zoomable pannable />
            <FlowControls />
            {/* keep background transparent; grid is handled by overlay */}
            <Background color="transparent" />
          </ReactFlow>
        </section>
      )}
    </main>
  );
}
