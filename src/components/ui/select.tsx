"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  className?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, value, defaultValue, onChange, name, placeholder, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useImperativeHandle(ref, () => containerRef.current!)

    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    // Extract options from standard React option children
    const options: { value: string; label: string }[] = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<any>
        if (element.type === "option" || (element.type as any).displayName === "option") {
          options.push({
            value: String(element.props.value !== undefined ? element.props.value : element.props.children || ""),
            label: String(element.props.children || ""),
          })
        } else if (element.props.children) {
          React.Children.forEach(element.props.children, (nestedChild) => {
            if (React.isValidElement(nestedChild)) {
              const nestedElement = nestedChild as React.ReactElement<any>
              if (nestedElement.type === "option" || (nestedElement.type as any).displayName === "option") {
                options.push({
                  value: String(nestedElement.props.value !== undefined ? nestedElement.props.value : nestedElement.props.children || ""),
                  label: String(nestedElement.props.children || ""),
                })
              }
            }
          })
        }
      }
    })

    const currentValue = value !== undefined ? String(value) : (defaultValue !== undefined ? String(defaultValue) : "")
    const selectedOption = options.find((opt) => opt.value === currentValue)
    const displayLabel = selectedOption ? selectedOption.label : placeholder || (options[0]?.label || "Select option")

    const handleSelect = (val: string) => {
      if (onChange) {
        onChange({ target: { value: val, name } } as any)
      }
      setIsOpen(false)
    }

    return (
      <div
        className={cn(
          "relative",
          className && className.split(" ").some(c => c.startsWith("w-"))
            ? className.split(" ").filter(c => c.startsWith("w-")).join(" ")
            : "w-full"
        )}
        ref={containerRef}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "font-sans flex items-center justify-between w-full h-9 rounded-lg border px-3 bg-zinc-50/50 text-zinc-900 text-sm font-medium focus:outline-none transition-all cursor-pointer text-left",
            isOpen
              ? "border-blue-500 bg-white ring-4 ring-blue-500/10 shadow-sm"
              : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/20",
            className
          )}
          {...(props as any)}
        >
          <span className="truncate">{displayLabel}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-blue-500 shrink-0 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0 ml-2" />
          )}
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-zinc-200/80 bg-white py-1.5 shadow-lg shadow-zinc-200/40 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-100">
            {options.length === 0 ? (
              <div className="px-4 py-2.5 text-xs font-semibold text-zinc-400 text-center">
                No options available
              </div>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === currentValue
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "font-sans flex items-center justify-between px-3.5 py-2 text-sm cursor-pointer transition-colors font-medium",
                      isSelected
                        ? "bg-blue-50/50 text-blue-600 font-semibold"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-blue-500 stroke-[2.5]" />}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"
