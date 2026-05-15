import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function VaultSearch({ value, onChange, placeholder }: Props) {
  return (
    <div className="vault-search">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search VAULT documents..."}
        aria-label="Search VAULT documents"
      />
    </div>
  );
}
