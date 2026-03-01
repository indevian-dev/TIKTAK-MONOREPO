"use client"

import {
    useState,
    useEffect,
    useRef,
    useMemo,
} from "react"

// ─── Types ───────────────────────────────────────────────────────
interface DatePickerPrimitiveProps {
    value?: string              // ISO date: "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm"
    onChange: (value: string) => void
    placeholder?: string
    includeTime?: boolean       // show hour / minute selectors
    minDate?: string            // ISO date, disable before
    maxDate?: string            // ISO date, disable after
    disabled?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
}

/** 0 = Monday … 6 = Sunday (ISO weekday) */
function startDayOfMonth(year: number, month: number): number {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
}

function pad(n: number): string {
    return n.toString().padStart(2, "0")
}

function formatDisplay(date: Date, includeTime: boolean): string {
    const d = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    if (!includeTime) return d
    return `${d} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function toISO(date: Date, includeTime: boolean): string {
    const d = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    if (!includeTime) return d
    return `${d}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function parseValue(value?: string): Date | null {
    if (!value) return null
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

// ─── Component ───────────────────────────────────────────────────
export function DatePickerPrimitive({
    value,
    onChange,
    placeholder = "Select date…",
    includeTime = false,
    minDate,
    maxDate,
    disabled = false,
}: DatePickerPrimitiveProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const parsed = useMemo(() => parseValue(value), [value])
    const minD = useMemo(() => parseValue(minDate), [minDate])
    const maxD = useMemo(() => parseValue(maxDate), [maxDate])

    // Calendar view state
    const [viewYear, setViewYear] = useState(() => parsed?.getFullYear() ?? new Date().getFullYear())
    const [viewMonth, setViewMonth] = useState(() => parsed?.getMonth() ?? new Date().getMonth())

    // Time state
    const [hour, setHour] = useState(() => parsed?.getHours() ?? 0)
    const [minute, setMinute] = useState(() => parsed?.getMinutes() ?? 0)

    // Sync calendar view when value changes externally
    useEffect(() => {
        if (parsed) {
            setViewYear(parsed.getFullYear())
            setViewMonth(parsed.getMonth())
            setHour(parsed.getHours())
            setMinute(parsed.getMinutes())
        }
    }, [parsed])

    // Click-outside close (same pattern as SelectPrimitive)
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    // ─── Navigation ──────────────────────────────────────────────
    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
        else setViewMonth(m => m - 1)
    }
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
        else setViewMonth(m => m + 1)
    }

    // ─── Day grid ────────────────────────────────────────────────
    const totalDays = daysInMonth(viewYear, viewMonth)
    const startDay = startDayOfMonth(viewYear, viewMonth)

    const isDisabled = (day: number): boolean => {
        const date = new Date(viewYear, viewMonth, day)
        if (minD && date < new Date(minD.getFullYear(), minD.getMonth(), minD.getDate())) return true
        if (maxD && date > new Date(maxD.getFullYear(), maxD.getMonth(), maxD.getDate())) return true
        return false
    }

    const isSelected = (day: number): boolean => {
        if (!parsed) return false
        return parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === day
    }

    const isToday = (day: number): boolean => {
        const today = new Date()
        return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day
    }

    // ─── Handlers ────────────────────────────────────────────────
    const selectDay = (day: number) => {
        const date = new Date(viewYear, viewMonth, day, hour, minute)
        onChange(toISO(date, includeTime))
        if (!includeTime) setIsOpen(false)
    }

    const handleTimeChange = (h: number, m: number) => {
        setHour(h)
        setMinute(m)
        if (parsed) {
            const date = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), h, m)
            onChange(toISO(date, true))
        }
    }

    // ─── Display ─────────────────────────────────────────────────
    const displayValue = parsed ? formatDisplay(parsed, includeTime) : placeholder

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Trigger */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    w-full px-4 py-2 border rounded bg-white dark:bg-white/5
                    dark:border-white/10 dark:text-white
                    cursor-pointer flex justify-between items-center text-left text-sm
                    transition-colors duration-200
                    ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-black/20 dark:hover:border-white/20"}
                    ${!parsed ? "text-gray-400 dark:text-white/40" : "text-app-dark-blue dark:text-white"}
                `}
            >
                <span className="truncate">{displayValue}</span>
                <svg
                    className={`w-4 h-4 shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-72 bg-white dark:bg-app-dark-purple border border-black/10 dark:border-white/10 rounded-app shadow-lg overflow-hidden">

                    {/* Month / Year header */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-black/5 dark:border-white/5">
                        <button type="button" onClick={prevMonth}
                            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                            <svg className="w-4 h-4 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-semibold text-app-dark-blue dark:text-white">
                            {MONTHS[viewMonth]} {viewYear}
                        </span>
                        <button type="button" onClick={nextMonth}
                            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                            <svg className="w-4 h-4 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Day-of-week labels */}
                    <div className="grid grid-cols-7 px-2 pt-2">
                        {DAYS.map(d => (
                            <div key={d} className="text-center text-xs font-medium text-gray-400 dark:text-white/40 py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 px-2 pb-2">
                        {/* Empty cells for offset */}
                        {Array.from({ length: startDay }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {Array.from({ length: totalDays }).map((_, i) => {
                            const day = i + 1
                            const off = isDisabled(day)
                            const sel = isSelected(day)
                            const tod = isToday(day)

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    disabled={off}
                                    onClick={() => selectDay(day)}
                                    className={`
                                        aspect-square flex items-center justify-center text-sm rounded-app transition-all duration-150
                                        ${off
                                            ? "text-gray-300 dark:text-white/20 cursor-not-allowed"
                                            : sel
                                                ? "bg-app-bright-purple text-white font-bold shadow-sm"
                                                : tod
                                                    ? "bg-app-bright-purple/15 text-app-bright-purple dark:text-app-bright-purple font-semibold hover:bg-app-bright-purple/25"
                                                    : "text-app-dark-blue dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                                        }
                                    `}
                                >
                                    {day}
                                </button>
                            )
                        })}
                    </div>

                    {/* Time selector */}
                    {includeTime && (
                        <div className="flex items-center justify-center gap-2 px-3 py-2 border-t border-black/5 dark:border-white/5">
                            <span className="text-xs font-medium text-gray-500 dark:text-white/50">Time:</span>
                            <select
                                value={hour}
                                onChange={e => handleTimeChange(Number(e.target.value), minute)}
                                className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded px-2 py-1 text-sm text-app-dark-blue dark:text-white focus:outline-none focus:ring-1 focus:ring-app-bright-purple"
                            >
                                {Array.from({ length: 24 }).map((_, h) => (
                                    <option key={h} value={h}>{pad(h)}</option>
                                ))}
                            </select>
                            <span className="text-app-dark-blue dark:text-white font-bold">:</span>
                            <select
                                value={minute}
                                onChange={e => handleTimeChange(hour, Number(e.target.value))}
                                className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded px-2 py-1 text-sm text-app-dark-blue dark:text-white focus:outline-none focus:ring-1 focus:ring-app-bright-purple"
                            >
                                {Array.from({ length: 60 }).map((_, m) => (
                                    <option key={m} value={m}>{pad(m)}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Today shortcut */}
                    <div className="px-3 py-2 border-t border-black/5 dark:border-white/5">
                        <button
                            type="button"
                            onClick={() => {
                                const now = new Date()
                                setViewYear(now.getFullYear())
                                setViewMonth(now.getMonth())
                                setHour(now.getHours())
                                setMinute(now.getMinutes())
                                onChange(toISO(now, includeTime))
                                if (!includeTime) setIsOpen(false)
                            }}
                            className="w-full text-center text-xs font-semibold text-app-bright-purple hover:text-app-bright-purple/80 transition-colors py-1"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
