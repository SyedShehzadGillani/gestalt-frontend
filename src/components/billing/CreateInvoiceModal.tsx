import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

const clients = [
  "Meridian Tech",
  "Coastal Living",
  "Summit Fitness",
  "Nova Financial",
];

const paymentTerms = [
  { value: "net15", label: "Net 15" },
  { value: "net30", label: "Net 30" },
  { value: "net45", label: "Net 45" },
];

export function CreateInvoiceModal({ isOpen, onClose }: CreateInvoiceModalProps) {
  const [client, setClient] = useState("");
  const [terms, setTerms] = useState("net30");
  const [taxRate, setTaxRate] = useState("0");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0 },
  ]);

  if (!isOpen) return null;

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: "", quantity: 1, rate: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const tax = subtotal * (parseFloat(taxRate) / 100);
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-[600px] max-h-[90vh] overflow-y-auto bg-card border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-card flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-[20px] font-semibold text-foreground">
            Create New Invoice
          </h2>
          <button
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client & Invoice Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[12px] text-foreground-secondary mb-2 block">
                Client
              </Label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {clients.map((c) => (
                    <SelectItem key={c} value={c} className="text-foreground">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[12px] text-foreground-secondary mb-2 block">
                Invoice Number
              </Label>
              <Input
                value="INV-2026-043"
                disabled
                className="bg-muted border-border text-foreground-muted"
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <Label className="text-[12px] text-foreground-secondary mb-3 block">
              Line Items
            </Label>
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 text-[10px] font-bold tracking-[1px] text-foreground-secondary uppercase">
                <span>Description</span>
                <span>Qty</span>
                <span>Rate</span>
                <span>Amount</span>
                <span></span>
              </div>
              {/* Items */}
              {lineItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 items-center"
                >
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(item.id, "description", e.target.value)
                    }
                    placeholder="Service description"
                    className="bg-muted border-border text-foreground"
                  />
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(item.id, "quantity", parseInt(e.target.value) || 0)
                    }
                    className="bg-muted border-border text-foreground"
                  />
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)
                    }
                    className="bg-muted border-border text-foreground"
                  />
                  <div className="text-[14px] text-foreground px-2">
                    ${(item.quantity * item.rate).toLocaleString()}
                  </div>
                  <button
                    onClick={() => removeLineItem(item.id)}
                    className="text-foreground-muted hover:text-red transition-colors"
                    disabled={lineItems.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={addLineItem}
              className="mt-3 gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Line Item
            </Button>
          </div>

          {/* Totals */}
          <div className="bg-muted p-4 space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-foreground-secondary">Subtotal</span>
              <span className="text-foreground">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <div className="flex items-center gap-2">
                <span className="text-foreground-secondary">Tax</span>
                <Input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-16 h-7 bg-card border-border text-foreground text-center"
                />
                <span className="text-foreground-secondary">%</span>
              </div>
              <span className="text-foreground">${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[16px] font-semibold pt-2 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-gold">${total.toLocaleString()}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[12px] text-foreground-secondary mb-2 block">
                Issue Date
              </Label>
              <Input
                type="date"
                defaultValue="2026-01-26"
                className="bg-muted border-border text-foreground"
              />
            </div>
            <div>
              <Label className="text-[12px] text-foreground-secondary mb-2 block">
                Payment Terms
              </Label>
              <Select value={terms} onValueChange={setTerms}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {paymentTerms.map((term) => (
                    <SelectItem key={term.value} value={term.value} className="text-foreground">
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-[12px] text-foreground-secondary mb-2 block">
              Notes (Optional)
            </Label>
            <Textarea
              placeholder="Additional notes for the client..."
              className="bg-muted border-border text-foreground placeholder:text-foreground-muted min-h-[80px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary">Create Draft</Button>
          <Button className="bg-gold text-primary-foreground hover:bg-gold/90">
            Create & Send
          </Button>
        </div>
      </div>
    </div>
  );
}
