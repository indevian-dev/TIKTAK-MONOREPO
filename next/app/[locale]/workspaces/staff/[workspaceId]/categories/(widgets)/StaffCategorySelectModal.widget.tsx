"use client";

import { BlockPrimitive } from '@/app/primitives/Block.primitive';

interface Option {
  id: string;
  label: string;
}

interface StaffCategorySelectModalWidgetProps {
  isOpen: boolean;
  options: Option[];
  onSelect: (id: string | null) => void;
  onClose: () => void;
}

export function StaffCategorySelectModalWidget({ isOpen, options, onSelect, onClose }: StaffCategorySelectModalWidgetProps) {
  if (!isOpen) return null;

  return (
    <BlockPrimitive variant="modal">
      <BlockPrimitive variant="default">
        <h2 className="text-lg font-semibold mb-4">Select Parent Category</h2>
        <ul className="max-h-80 overflow-auto text-md">
          <li
            key={99999999}
            className="p-2 hover:bg-gray-100 cursor-pointer border-2 rounded-lg mr-2 text-slate-950 font-bold"
            onClick={() => onSelect(null)}
          >
            Ana Kategoriya kimi
          </li>
          {options.map((option) => (
            <li
              key={option.id}
              className="p-2 hover:bg-gray-100 cursor-pointer border-2 rounded-lg mr-2 text-slate-950 font-bold"
              onClick={() => onSelect(option.id)}
            >
              {option.label}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={onClose}
        >
          Close
        </button>
      </BlockPrimitive>
    </BlockPrimitive>
  );
}
