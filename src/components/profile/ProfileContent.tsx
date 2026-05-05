import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Download } from "lucide-react";

const MOCK_USER = {
  initials: "AC",
  name: "Alex Chen",
  tagline: "The sum is greater than its parts",
  email: "alex@northgate.io",
  phone: "+1 612 384 9292",
  address: "5808 Oak Drive",
  city: "Minneapolis",
  state: "Minnesota",
  zip: "55345",
  company: "Northgate Solutions",
  timezone: "AMERICA/CHICAGO",
};

const MOCK_ORDERS = [
  { id: "550099", date: "10.28.25", status: "DELIVERED", method: "STRIPE", price: "$797.00" },
  { id: "450272", date: "9.03.25", status: "PENDING", method: "CREDIT CARD", price: "$45.00" },
  { id: "350099", date: "6.29.25", status: "DELIVERED", method: "STRIPE", price: "$104.00" },
  { id: "320099", date: "2.22.25", status: "DELIVERED", method: "FREE", price: "$0.00" },
];

const CONTACT_FIELDS: Array<[string, keyof typeof MOCK_USER]> = [
  ["EMAIL", "email"],
  ["PHONE", "phone"],
  ["ADDRESS", "address"],
  ["CITY", "city"],
  ["STATE", "state"],
  ["ZIP", "zip"],
  ["COMPANY", "company"],
];

export function ProfileContent() {
  const user = MOCK_USER;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <Breadcrumb className="mb-8">
        <BreadcrumbList className="text-[11px] tracking-[0.18em]">
          <BreadcrumbItem className="text-muted-foreground">GESTALT</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>PROFILE</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <Avatar className="w-[76px] h-[76px] mx-auto mb-1.5 border border-border bg-card">
          <AvatarFallback className="text-[22px] tracking-wider text-muted-foreground bg-transparent">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          className="inline-flex items-center justify-center mb-4 text-muted-foreground hover:text-foreground"
          aria-label="Edit avatar"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <div className="text-[22px] font-bold mb-1">{user.name}</div>
        <div className="text-xs italic text-muted-foreground">"{user.tagline}"</div>
      </div>

      <div className="max-w-sm mx-auto mb-9">
        <table className="w-full text-[11px] border-collapse">
          <tbody>
            {CONTACT_FIELDS.map(([label, key]) => (
              <tr key={label}>
                <td className="py-1 pr-3 text-right text-muted-foreground tracking-[0.14em] font-medium">{label}:</td>
                <td className="py-1">{user[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] tracking-[0.18em] font-medium text-foreground/80 mb-3.5">
        PURCHASE HISTORY
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[10px] tracking-[0.14em]">ORDER</TableHead>
            <TableHead className="text-[10px] tracking-[0.14em]">DATE</TableHead>
            <TableHead className="text-[10px] tracking-[0.14em]">STATUS</TableHead>
            <TableHead className="text-[10px] tracking-[0.14em]">METHOD</TableHead>
            <TableHead className="text-[10px] tracking-[0.14em] text-right">PRICE</TableHead>
            <TableHead className="text-[10px] tracking-[0.14em]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_ORDERS.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="text-[10px]">{order.id}</TableCell>
              <TableCell className="text-[10px]">{order.date}</TableCell>
              <TableCell className={`text-[10px] ${order.status === "PENDING" ? "text-gold" : ""}`}>
                {order.status}
              </TableCell>
              <TableCell className="text-[10px]">{order.method}</TableCell>
              <TableCell className="text-[10px] text-right font-medium">{order.price}</TableCell>
              <TableCell>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[10px] tracking-[0.12em] text-muted-foreground hover:text-foreground"
                >
                  <Download className="w-3 h-3" />
                  RECEIPT
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="text-[10px] text-muted-foreground mt-4 mb-9">
        Transactions are based on <span className="font-medium text-foreground">your local time zone</span> ({user.timezone})
      </div>

      <div className="text-center text-[11px] tracking-[0.18em] text-muted-foreground">
        THANK YOU.
      </div>
    </div>
  );
}
