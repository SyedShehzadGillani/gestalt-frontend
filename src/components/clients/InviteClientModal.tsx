import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InviteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const industries = [
  "Software",
  "Real Estate",
  "Health & Wellness",
  "Financial Services",
  "E-commerce",
  "Manufacturing",
  "Education",
  "Other",
];

export function InviteClientModal({ isOpen, onClose }: InviteClientModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit - just close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[480px] bg-card border border-border p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-[20px] font-semibold text-foreground mb-2">
          Invite a New Client
        </h2>
        <p className="text-[13px] text-foreground-secondary mb-6">
          Clients own their data. Send them an invite to connect with your agency.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="company" className="text-[12px] text-foreground-secondary mb-2 block">
              Client Company Name
            </Label>
            <Input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="bg-muted border-border text-foreground placeholder:text-foreground-muted"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-[12px] text-foreground-secondary mb-2 block">
              Contact Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@company.com"
              className="bg-muted border-border text-foreground placeholder:text-foreground-muted"
            />
          </div>

          <div>
            <Label htmlFor="industry" className="text-[12px] text-foreground-secondary mb-2 block">
              Industry
            </Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="bg-muted border-border text-foreground">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {industries.map((ind) => (
                  <SelectItem
                    key={ind}
                    value={ind}
                    className="text-foreground hover:bg-muted focus:bg-muted"
                  >
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              className="bg-gold text-primary-foreground hover:bg-gold/90"
            >
              Send Invitation
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="text-[13px] text-foreground-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
