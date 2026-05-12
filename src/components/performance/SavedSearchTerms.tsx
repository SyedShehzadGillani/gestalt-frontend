import React, { useState, useRef } from 'react';
import { Search, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
interface SavedSearchTermsProps {
  onSearchTermClick?: (term: string) => void;
  className?: string;
}
export const SavedSearchTerms: React.FC<SavedSearchTermsProps> = ({
  onSearchTermClick,
  className = ""
}) => {
  const [searchTerms, setSearchTerms] = useState<string[]>(['STAFF', 'TECH', 'OD', 'SURGEON', 'RECEPTION', 'CALL CENTER']);
  const [searchInput, setSearchInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && !searchTerms.includes(searchInput.trim().toUpperCase())) {
      const newTerm = searchInput.trim().toUpperCase();
      setSearchTerms(prev => [...prev, newTerm]);
      setSearchInput('');
      setShowInput(false);
      onSearchTermClick?.(newTerm);

      // Scroll to show the new term
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
      }, 100);
    }
  };
  const deleteTerm = (termToDelete: string) => {
    setSearchTerms(prev => prev.filter(term => term !== termToDelete));
  };
  const handleTermClick = (term: string) => {
    onSearchTermClick?.(term);
  };
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current ? scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth : false;
  return <div className={`flex items-center gap-2 bg-black/25 rounded-lg p-2 border-2 border-black/10 ${className}`}>
      {/* Left scroll arrow */}
      {canScrollLeft && <Button variant="ghost" size="icon" onClick={scrollLeft} className="h-8 w-8 shrink-0 hover:bg-transparent hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Button>}

      {/* Scrollable container for search terms */}
      <div ref={scrollContainerRef} className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1" style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }} onScroll={handleScroll}>
        {searchTerms.map((term, index) => (
          <div key={index} className="grid grid-cols-[1fr_auto] gap-2 items-center bg-black/50 text-white px-3 py-1.5 rounded-[2pt] shrink-0 cursor-pointer hover:bg-black/30 hover:text-white transition-colors border-2 border-black/50" onClick={() => handleTermClick(term)}>
            <span className="text-sm font-medium truncate">{term}</span>
            <div className="w-4 flex justify-center">
              <button onClick={e => {
                e.stopPropagation();
                deleteTerm(term);
              }} className="text-white hover:text-gray-200 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        {/* Search input field (when shown) */}
        {showInput && <form onSubmit={handleSearchSubmit} className="flex items-center gap-1 shrink-0">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search term..." className="pl-7 h-8 w-32 text-sm border-2 border-black/50" autoFocus onBlur={() => {
            if (!searchInput.trim()) {
              setShowInput(false);
            }
          }} />
            </div>
          </form>}
      </div>

      {/* Right scroll arrow */}
      {canScrollRight && <Button variant="ghost" size="icon" onClick={scrollRight} className="h-8 w-8 shrink-0 hover:bg-transparent hover:text-foreground">
          <ChevronRight className="h-4 w-4" />
        </Button>}

      {/* ADD button */}
      <Button variant="outline" size="sm" onClick={() => setShowInput(true)} disabled={showInput} className="shrink-0 h-8 px-3 text-xs bg-black/25 text-white hover:bg-black/30 hover:text-white border-2 border-black/50 text-left">
        <Plus className="h-3 w-3 mr-1" />
        ADD
      </Button>
    </div>;
};