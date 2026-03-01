"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { SelectPrimitive }
  from '@/app/primitives/Select.primitive';

interface FilterOption {
  filter_id: string;
  type: string;
  filter_option_id: string | null;
  dynamic_value: string | number | null;
}

interface FilterOptionItem {
  id: string;
  title: string;
  [key: string]: unknown;
}

interface CategoryFilter {
  id: string;
  name?: string;
  title?: string;
  type: string;
  options?: unknown[];
  category_filter_options?: FilterOptionItem[];
  [key: string]: unknown;
}

interface ProviderOptionsSelectorWidgetProps {
  category_filters?: CategoryFilter[];
  filters?: CategoryFilter[];
  onOptionsChange: (options: FilterOption[]) => void;
  initialOptions?: FilterOption[];
}

export function ProviderOptionsSelectorWidget({
  category_filters,
  filters,
  onOptionsChange,
  initialOptions = []
}: ProviderOptionsSelectorWidgetProps) {
  const [selectedOptions, setSelectedOptions] = useState<FilterOption[]>([]);
  const hasInitialized = useRef(false);

  // Memoize initialOptions to prevent unnecessary re-renders
  const memoizedInitialOptions = useMemo(() => {
    return initialOptions && Array.isArray(initialOptions) ? initialOptions : [];
  }, [JSON.stringify(initialOptions)]); // Use JSON.stringify for deep comparison

  // Set initial options when component mounts or initialOptions changes meaningfully
  useEffect(() => {
    // Only set initial options if we haven't initialized yet or if the options actually changed
    if (!hasInitialized.current ||
      JSON.stringify(selectedOptions) !== JSON.stringify(memoizedInitialOptions)) {

      if (memoizedInitialOptions.length > 0) {
        setSelectedOptions(memoizedInitialOptions);
      } else if (!hasInitialized.current) {
        setSelectedOptions([]);
      }
      hasInitialized.current = true;
    }
  }, [memoizedInitialOptions]);

  const handleOptionChange = (filterId: string | number, optionValue: string | number, type: string) => {
    // If empty value is selected, remove the option
    const filterIdStr = String(filterId);
    const optionValueStr = String(optionValue);

    if (!optionValue || optionValue === '') {
      setSelectedOptions(prevOptions => {
        const newOptions = prevOptions.filter(option => option.filter_id !== filterIdStr);
        onOptionsChange(newOptions);
        return newOptions;
      });
      return;
    }

    setSelectedOptions(prevOptions => {
      const currentOptions = Array.isArray(prevOptions) ? prevOptions : [];

      // Remove any existing options for this group to prevent duplicates
      const filteredOptions = currentOptions.filter(option => option.filter_id !== filterIdStr);

      // Determine the structure of the update based on the options_groups type
      const updatedOption = {
        filter_id: filterIdStr,
        type,
        // If the type is DYNAMIC, set option_id to null and assign optionValue to dynamic_value.
        // Otherwise, set option_id to optionValue and dynamic_value to null.
        filter_option_id: type === 'DYNAMIC' ? null : optionValueStr,
        dynamic_value: type === 'DYNAMIC' ? optionValue : null,
      };

      // Add the new/updated option
      const newOptions = [...filteredOptions, updatedOption];

      onOptionsChange(newOptions);
      return newOptions;
    });
  };

  // Helper function to get the current value for a options_groups
  const getCurrentValue = (filterId: string | number): string => {
    const filterIdStr = String(filterId);
    const option = selectedOptions.find(opt => opt.filter_id === filterIdStr);
    if (!option) return '';
    const value = option.dynamic_value || option.filter_option_id?.toString() || '';
    return typeof value === 'number' ? value.toString() : (value || '');
  };

  // Resolve groups from either prop name, with a safe fallback
  const resolvedFilters = useMemo(() => {
    if (Array.isArray(category_filters)) return category_filters;
    if (Array.isArray(filters)) return filters;
    return [];
  }, [category_filters, filters]);

  return (
    <div>
      {resolvedFilters.map((filter) => {
        const currentValue = getCurrentValue(filter.id);

        return (
          <div key={filter.id} className="mb-4">
            <label className="block text-gray-700 text-lg mt-2 mb-2">
              {filter.title}
            </label>
            {filter.type === 'DYNAMIC' ? (
              // Render input field for dynamic options
              <input
                type="text"
                value={currentValue}
                className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => handleOptionChange(filter.id.toString(), e.target.value, filter.type)}
              />
            ) : (
              // Render custom select component for static options
              <SelectPrimitive
                value={currentValue}
                onChange={value => {
                  handleOptionChange(filter.id.toString(), value, filter.type);
                }}
                options={[
                  { value: '', label: 'Select Option' },
                  ...(filter.category_filter_options || []).map((option: FilterOptionItem) => ({
                    value: option.id.toString(),
                    label: option.title
                  }))
                ]}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

