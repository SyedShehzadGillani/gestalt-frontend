import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CLINIC_NAMES } from "@/lib/clinics";

export default function AddEmployee() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const hiveRoot = `/client/${id}/hive`;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    location: "",
    startDate: "",
    notes: ""
  });

  const roles = ["STAFF", "TECH", "OD", "SURGEON", "RECEPTION", "CALL CENTER", "MANAGER"];
// using centralized clinic names
  const [quadrantLabels, setQuadrantLabels] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('quadrantLabels') || ''); } catch { return ["PERSONAL","CHOOSE TITLE","CHOOSE TITLE","KNOWLEDGE"]; }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { localStorage.setItem('quadrantLabels', JSON.stringify(quadrantLabels)); } catch {}

    const seed = { ...formData, quadrantLabels };
    try {
      const { data, error } = await supabase.functions.invoke('generate-onboarding', { body: { seed } });
      if (error) throw error;
      const model = (data as any)?.model;
      if (model) {
        try { localStorage.setItem('onboarding-model', JSON.stringify(model)); } catch {}
        window.dispatchEvent(new CustomEvent('onboarding:model-updated'));
      }
      toast.success('Employee created. Builder generated.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to generate builder. Using defaults.');
    }

    navigate(hiveRoot);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const isReady = Boolean(
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.location &&
    formData.role &&
    formData.department &&
    formData.startDate
  );

  return (
    <div className="min-h-screen bg-background">

      
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(hiveRoot)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Add New Employee</h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Employee Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">All fields are required except Telephone.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Clinic Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLINIC_NAMES.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="role">Position *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Quadrant Labels</div>
                <div className="grid grid-cols-2 gap-4">
                  {quadrantLabels.map((label, idx) => (
                    <div key={idx}>
                      <Label>Label {idx + 1}</Label>
                      <Input
                        value={label}
                        onChange={(e) => {
                          const next = [...quadrantLabels];
                          next[idx] = e.target.value;
                          setQuadrantLabels(next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(hiveRoot)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!isReady}>
                  Create Employee
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
