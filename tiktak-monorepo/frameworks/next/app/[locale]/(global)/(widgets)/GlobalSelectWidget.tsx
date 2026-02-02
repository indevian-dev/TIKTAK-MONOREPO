"use client"

import {
    useState,
    useEffect,
    useRef
} from "react";

interface SelectOption {
    value: string | number;
    label: string;
}

interface GlobalSelectWidgetProps {
    options: SelectOption[];
    placeholder?: string;
    isMulti?: boolean;
    onChange: (value: any) => void;
    value?: any;
}

export function GlobalSelectWidget({
    options,
    placeholder = "Select...",
    isMulti = false,
    onChange,
    value,
}: GlobalSelectWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSingle, setSelectedSingle] = useState<any>(value || "")
    const [selectedMulti, setSelectedMulti] = useState<any[]>(Array.isArray(value) ? value : [])
    const dropdownRef = useRef<HTMLDivElement>(null)

    const selected = isMulti ? selectedMulti : selectedSingle

    useEffect(() => {
        if (isMulti) {
            setSelectedMulti(Array.isArray(value) ? value : [])
        } else {
            setSelectedSingle(value as string | number || "")
        }
    }, [value, isMulti])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])


    const filteredOptions = options?.filter((option: SelectOption) =>
        option?.label?.toLowerCase()?.includes(searchTerm.toLowerCase())
    ) || []

    const handleSelect = (option: SelectOption) => {
        if (isMulti) {
            const newValue = selectedMulti.includes(option.value)
                ? selectedMulti.filter((item) => item !== option.value)
                : [...selectedMulti, option.value];
            setSelectedMulti(newValue);
            onChange(newValue);
        } else {
            // For single selection, just set the new value directly
            setSelectedSingle(option.value);
            onChange(option.value);
            setIsOpen(false);
        }
    };


    const getDisplayValue = () => {
        if (isMulti) {
            if (selectedMulti.length === 0) {
                return placeholder
            }
            return selectedMulti
                .map((value: string | number) => options.find((option) => option.value === value)?.label)
                .filter(Boolean)
                .join(", ")
        } else {
            if (!selectedSingle) {
                return placeholder
            }
            const selectedOption = options.find((option) => option.value === selectedSingle)
            return selectedOption?.label || placeholder
        }
    }

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                className="w-full px-4 py-2 border rounded bg-white cursor-pointer flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="truncate">
                    {getDisplayValue()}
                </div>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {isOpen && (
                <div key={`dropdown-${value}`} className="absolute w-full mt-1 bg-white border rounded shadow-lg z-10 max-h-60 overflow-auto">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border-b"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />

                    {filteredOptions.map((option: SelectOption) => (
                        <div
                            key={option.value}
                            className={`px-4 py-2 cursor-pointer hover:bg-dark/5 flex items-center gap-2
                    ${isMulti
                                    ? selectedMulti.includes(option.value) ? "bg-dark/10" : ""
                                    : selectedSingle === option.value ? "bg-brand text-white" : ""
                                }`}
                            onClick={() => handleSelect(option)}
                        >
                            {isMulti && (
                                <div className="w-4 h-4 border rounded flex items-center justify-center">
                                    {selectedMulti.includes(option.value) && (
                                        <div className="w-2 h-2 bg-brand rounded" />
                                    )}
                                </div>
                            )}
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
