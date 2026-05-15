import { useMemo, useState } from "react";
import { VAULT_CATEGORIES } from "@/data/vault-categories";
import type { VaultCategory, VaultDocument } from "@/data/vault-types";

interface Props {
  documents: VaultDocument[];
  selectedPath: string | null;
  onSelect: (path: string | null) => void;
}

interface TreeNode extends VaultCategory {
  children: TreeNode[];
  docCount: number;
}

function buildTree(categories: VaultCategory[], documents: VaultDocument[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  categories.forEach((c) => byId.set(c.id, { ...c, children: [], docCount: 0 }));

  const docCountByPath = new Map<string, number>();
  documents.forEach((doc) => {
    const cat = categories.find((c) => c.section_code === doc.section_code);
    if (!cat) return;
    let path: string | null = cat.path;
    while (path) {
      docCountByPath.set(path, (docCountByPath.get(path) ?? 0) + 1);
      const parts = path.split(" / ");
      parts.pop();
      path = parts.length ? parts.join(" / ") : null;
    }
  });

  const roots: TreeNode[] = [];
  byId.forEach((node) => {
    node.docCount = docCountByPath.get(node.path) ?? 0;
    if (node.parent_id) {
      const parent = byId.get(node.parent_id);
      parent?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortRec = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order);
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

function NodeRow({
  node,
  selectedPath,
  onSelect,
  expanded,
  toggle,
}: {
  node: TreeNode;
  selectedPath: string | null;
  onSelect: (path: string | null) => void;
  expanded: Set<string>;
  toggle: (id: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isOpen = expanded.has(node.id);
  const isActive = selectedPath === node.path;

  return (
    <div>
      <div
        className={`vault-tree-node${isActive ? " is-active" : ""}`}
        onClick={() => {
          onSelect(node.path);
          if (hasChildren) toggle(node.id);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(node.path);
            if (hasChildren) toggle(node.id);
          }
        }}
      >
        <span>
          {hasChildren ? (isOpen ? "▾ " : "▸ ") : "· "}
          {node.name}
        </span>
        {node.docCount > 0 && <span className="vault-count-badge">{node.docCount}</span>}
      </div>
      {hasChildren && isOpen && (
        <div className="vault-tree-children">
          {node.children.map((c) => (
            <NodeRow
              key={c.id}
              node={c}
              selectedPath={selectedPath}
              onSelect={onSelect}
              expanded={expanded}
              toggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function VaultCategoryTree({ documents, selectedPath, onSelect }: Props) {
  const roots = useMemo(() => buildTree(VAULT_CATEGORIES, documents), [documents]);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(VAULT_CATEGORIES.filter((c) => !c.parent_id).map((c) => c.id)),
  );

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <nav className="vault-tree" aria-label="VAULT categories">
      <div
        className={`vault-tree-node${selectedPath === null ? " is-active" : ""}`}
        onClick={() => onSelect(null)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(null);
          }
        }}
      >
        <span>All documents</span>
        <span className="vault-count-badge">{documents.length}</span>
      </div>
      {roots.map((r) => (
        <NodeRow
          key={r.id}
          node={r}
          selectedPath={selectedPath}
          onSelect={onSelect}
          expanded={expanded}
          toggle={toggle}
        />
      ))}
    </nav>
  );
}
