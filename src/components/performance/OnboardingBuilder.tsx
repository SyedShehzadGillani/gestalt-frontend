import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export type OBItem = { id: string; label: string; value: string };
export type OBSection = { title: string; items: OBItem[] };
export type OBModel = {
  sections: {
    PERSONAL: OBSection;
    PATIENT: OBSection;
    STAFF: OBSection;
    KNOWLEDGE: OBSection;
  };
  suggestions: {
    PERSONAL: string[];
    PATIENT: string[];
    STAFF: string[];
    KNOWLEDGE: string[];
  };
};

const LS_KEY = "onboarding-model";

export default function OnboardingBuilder() {
  const [model, setModel] = useState<OBModel | null>(() => {
    try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [activeField, setActiveField] = useState<string | null>(null);

  useEffect(() => {
    const onUpdate = () => {
      try { const raw = localStorage.getItem(LS_KEY); setModel(raw ? JSON.parse(raw) : null); } catch {}
    };
    window.addEventListener("onboarding:model-updated", onUpdate as any);
    return () => window.removeEventListener("onboarding:model-updated", onUpdate as any);
  }, []);

  const order = useMemo(() => ["PERSONAL","PATIENT","STAFF","KNOWLEDGE"] as const, []);

  const [staged, setStaged] = useState<number>(0);
  useEffect(() => {
    if (!model) return;
    setStaged(0);
    const ids = [0,1,2,3];
    let i = 0;
    const t = setInterval(() => { setStaged(++i); if (i >= ids.length) clearInterval(t); }, 180);
    return () => clearInterval(t);
  }, [model]);

  const saveModel = (next: OBModel) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
    setModel(next);
    window.dispatchEvent(new CustomEvent("onboarding:model-updated"));
  };

  const handleValueChange = (sectionKey: keyof OBModel["sections"], itemId: string, value: string) => {
    if (!model) return;
    const next: OBModel = JSON.parse(JSON.stringify(model));
    const items = next.sections[sectionKey].items;
    const idx = items.findIndex(i => i.id === itemId);
    if (idx >= 0) items[idx].value = value;
    saveModel(next);
  };

  const [selectedSection, setSelectedSection] = useState<keyof OBModel["suggestions"] | null>("PERSONAL");

  const insertSuggestion = (word: string) => {
    if (!model || !selectedSection) return;
    const firstItem = model.sections[selectedSection].items[0];
    if (!firstItem) return toast.info("No item to insert into yet");
    const sep = firstItem.value ? ", " : "";
    handleValueChange(selectedSection, firstItem.id, firstItem.value + sep + word);
  };

  if (!model) return null;

  return (
    <section aria-label="Onboarding Builder" className="animate-fade-in">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-foreground">AI Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            {order.map((k) => (
              <Button key={k} variant={selectedSection === k ? "secondary" : "outline"} size="sm" onClick={() => setSelectedSection(k)}>
                {k}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {(selectedSection ? model.suggestions[selectedSection] : []).slice(0, 24).map((w, i) => (
              <Button key={i} variant="secondary" size="sm" className="hover-scale animate-fade-in" onClick={() => insertSuggestion(w)}>
                {w}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {order.map((k, idx) => (
          <Card key={k} className={`${idx < staged ? 'animate-fade-in' : 'opacity-0'} transition-opacity`}>
            <CardHeader>
              <CardTitle className="text-foreground">{k}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {model.sections[k].items.map((item) => (
                  <div key={item.id} className="rounded-md border border-border p-3">
                    <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                    {activeField === item.id ? (
                      <Textarea
                        autoFocus
                        value={item.value}
                        onChange={(e) => handleValueChange(k, item.id, e.target.value)}
                        onBlur={() => setActiveField(null)}
                      />
                    ) : (
                      <div
                        role="textbox"
                        tabIndex={0}
                        onDoubleClick={() => setActiveField(item.id)}
                        className="min-h-10 whitespace-pre-wrap cursor-text focus:outline-none"
                      >
                        {item.value || <span className="text-muted-foreground">Double-click to edit…</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => { localStorage.removeItem(LS_KEY); window.dispatchEvent(new CustomEvent("onboarding:model-updated")); }}>Clear</Button>
        <Button onClick={() => toast.success("Saved")}>Save</Button>
      </div>
    </section>
  );
}
