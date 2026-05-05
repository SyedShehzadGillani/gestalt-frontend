
import React, { useState } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RoleFilterProps {
  onFilterChange: (roles: string[]) => void;
  availableRoles: string[];
  onRoleAdd: (role: string) => void;
  onRoleRemove: (role: string) => void;
  className?: string;
}

export const RoleFilter: React.FC<RoleFilterProps> = ({ 
  onFilterChange, 
  availableRoles, 
  onRoleRemove, 
  onRoleAdd, 
  className 
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);

  const handleRoleToggle = (role: string) => {
    const updatedRoles = selectedRoles.includes(role)
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];
    
    setSelectedRoles(updatedRoles);
    onFilterChange(updatedRoles);
  };

  const handleAddRole = () => {
    if (newRole.trim() && !availableRoles.includes(newRole.trim().toUpperCase())) {
      onRoleAdd(newRole.trim().toUpperCase());
      setNewRole('');
      setShowAddRole(false);
    }
  };

  const handleRemoveRole = (role: string) => {
    onRoleRemove(role);
    setSelectedRoles(prev => prev.filter(r => r !== role));
    onFilterChange(selectedRoles.filter(r => r !== role));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-1">
        {availableRoles.map(role => (
          <div key={role} className="grid grid-cols-[1fr_auto] gap-1 items-center mt-5">
            <button
              onClick={() => handleRoleToggle(role)}
              className={`px-2 py-1 text-xs rounded-[2pt] transition-colors text-left
                bg-[hsl(0_0%_100%_/_0.05)] text-[hsl(0_0%_100%_/_0.25)]
                hover:bg-[hsl(0_0%_100%_/_0.3)]
              `}
            >
              {role}
            </button>
            <div className="w-4 flex justify-center">
              <button
                onClick={() => handleRemoveRole(role)}
                className="text-gray-400 hover:text-red-400 p-0.5"
                title="Remove role"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        ))}
        
        {showAddRole ? (
          <div className="flex items-center gap-1">
            <Input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="search tags"
              className="h-6 text-xs w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[28rem]"
              onKeyPress={(e) => e.key === 'Enter' && handleAddRole()}
            />
            <Button
              onClick={handleAddRole}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-foreground hover:bg-transparent hover:text-foreground"
            >
              <Plus size={10} />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowAddRole(true)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 mt-5 text-foreground/70 hover:bg-transparent hover:text-foreground"
            aria-label="Open search"
            title="Open search"
          >
            <Search className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};
