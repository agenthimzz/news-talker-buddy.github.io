
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NewsCategory } from '@/services/newsService';
import { cn } from '@/lib/utils';

interface NewsFilterProps {
  currentCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const categories: { value: NewsCategory; label: string }[] = [
  { value: 'general', label: 'All Categories' },
  { value: 'business', label: 'Business' },
  { value: 'technology', label: 'Technology' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'science', label: 'Science' },
  { value: 'health', label: 'Health' },
];

const NewsFilter = ({ currentCategory, onCategoryChange }: NewsFilterProps) => {
  const [open, setOpen] = useState(false);
  
  const selectedCategory = categories.find(category => category.value === currentCategory);
  
  return (
    <div className="flex items-center justify-between w-full px-4 py-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open}
            aria-label="Select a news category"
            className="w-[200px] justify-between font-normal transition-all duration-200 border-border/60 hover:border-primary/40"
          >
            {selectedCategory?.label || "Select category"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search category..." className="h-9" />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={() => {
                    onCategoryChange(category.value);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                >
                  <div className={cn(
                    "h-3 w-3 rounded-full",
                    category.value === 'general' ? 'bg-gray-500' :
                    category.value === 'business' ? 'bg-emerald-500' :
                    category.value === 'technology' ? 'bg-blue-500' :
                    category.value === 'entertainment' ? 'bg-purple-500' :
                    category.value === 'sports' ? 'bg-red-500' :
                    category.value === 'science' ? 'bg-amber-500' :
                    'bg-green-500'
                  )} />
                  <span>{category.label}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentCategory === category.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NewsFilter;
