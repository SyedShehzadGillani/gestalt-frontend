import { VaultBrowse } from "@/components/vault/VaultBrowse";

export default function ClientVault() {
  return <VaultBrowse basePath="/client/:id/vault" />;
}
