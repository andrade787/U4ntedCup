import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}
export default function SearchInput({
  placeholder = "Pesquisar Jogador",
  disabled = false,
  onChange,
  value,
}: SearchInputProps) {
  return (
    <div className="flex items-center border-b px-3">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

