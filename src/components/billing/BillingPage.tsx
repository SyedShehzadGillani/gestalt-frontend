import { useState } from "react";
import { format } from "date-fns";
import { Plus, Search, Calendar, DollarSign, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CreateInvoiceModal } from "./CreateInvoiceModal";

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  issued: string;
  due: string;
}

const mockInvoices: Invoice[] = [
  { id: "1", number: "INV-2026-042", client: "Meridian Tech", amount: 8500, status: "paid", issued: "Jan 15", due: "Jan 30" },
  { id: "2", number: "INV-2026-041", client: "Coastal Living", amount: 4200, status: "overdue", issued: "Jan 1", due: "Jan 15" },
  { id: "3", number: "INV-2026-040", client: "Summit Fitness", amount: 5800, status: "pending", issued: "Jan 20", due: "Feb 5" },
  { id: "4", number: "INV-2026-039", client: "Nova Financial", amount: 6500, status: "pending", issued: "Jan 18", due: "Feb 2" },
  { id: "5", number: "INV-2026-038", client: "Meridian Tech", amount: 7200, status: "paid", issued: "Dec 15", due: "Dec 30" },
];

const stats = [
  { label: "Revenue This Month", value: "$47,500", subtext: "+18% vs last month", icon: DollarSign, color: "text-success" },
  { label: "Outstanding", value: "$12,300", subtext: "3 unpaid invoices", icon: Clock, color: "text-warning" },
  { label: "Overdue", value: "$4,200", subtext: "1 invoice (14 days)", icon: AlertTriangle, color: "text-red" },
  { label: "Collected YTD", value: "$285,000", subtext: "23 invoices", icon: CheckCircle, color: "text-foreground" },
];

const statusStyles = {
  paid: { bg: "bg-success-dim", text: "text-success", label: "Paid" },
  pending: { bg: "bg-warning-dim", text: "text-warning", label: "Pending" },
  overdue: { bg: "bg-red-dim", text: "text-red", label: "Overdue" },
};

const tabs = ["All", "Paid", "Pending", "Overdue"];

export function BillingPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<Date | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "All" ||
      invoice.status === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground">
            Billing & Invoices
          </h1>
          <p className="text-[13px] text-foreground-secondary">
            Manage client invoices and payments
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 bg-gold text-primary-foreground hover:bg-gold/90"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="text-[11px] font-bold tracking-[1px] text-foreground-secondary uppercase">
                  {stat.label}
                </div>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`text-[28px] font-semibold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[11px] text-foreground-muted mt-1">
                {stat.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[12px] font-medium transition-colors ${
                activeTab === tab
                  ? "bg-card text-foreground"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Date */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" className="gap-2">
                <Calendar className="w-4 h-4" />
                {dateRange ? format(dateRange, "MMM d, yyyy") : "Date Range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="end">
              <CalendarComponent
                mode="single"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client..."
              className="w-[200px] pl-9 bg-muted border-border text-foreground placeholder:text-foreground-muted"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border">
        {/* Header */}
        <div className="bg-muted grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3">
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Invoice #
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Client
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Amount
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Status
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Issued
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Due
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Actions
          </span>
        </div>

        {/* Rows */}
        {filteredInvoices.map((invoice) => {
          const status = statusStyles[invoice.status];
          return (
            <div
              key={invoice.id}
              className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-4 border-b border-border hover:bg-card transition-colors"
            >
              <div className="flex items-center">
                <span className="text-[13px] font-medium text-foreground">
                  {invoice.number}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-[13px] text-foreground-muted">
                  {invoice.client}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-[14px] font-medium text-foreground">
                  ${invoice.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`text-[9px] font-bold tracking-[0.5px] px-2 py-1 ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-[13px] text-foreground-secondary">
                  {invoice.issued}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`text-[13px] ${invoice.status === "overdue" ? "text-red" : "text-foreground-secondary"}`}>
                  {invoice.due}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="text-[11px] h-7 px-3">
                  View
                </Button>
                {invoice.status === "overdue" && (
                  <Button variant="secondary" size="sm" className="text-[11px] h-7 px-3 text-warning">
                    Remind
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {filteredInvoices.length === 0 && (
          <div className="px-5 py-12 text-center text-foreground-muted">
            No invoices found.
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
