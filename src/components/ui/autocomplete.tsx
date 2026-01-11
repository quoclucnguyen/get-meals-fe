import * as React from 'react';

export interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  disabled?: boolean;
}

export function Autocomplete({
  value,
  onChange,
  options,
  placeholder = 'Tìm kiếm...',
  disabled = false,
}: Readonly<AutocompleteProps>) {
  const [inputValue, setInputValue] = React.useState(value || '');

  React.useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative">
      <input
        type="text"
        list="meal-names"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex h-11 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:ring-2 file:ring-ring file:ring-offset-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <datalist id="meal-names">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
    </div>
  );
}
