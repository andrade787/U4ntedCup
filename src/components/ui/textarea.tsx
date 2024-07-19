import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: string;
  maxLength?: number;
  value?: string; // Adicionei a prop value
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, minHeight = "min-h-[80px]", maxLength, value, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const handleInput = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // Reset the height
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set the height based on the scroll height
      }
    };

    React.useEffect(() => {
      if (textareaRef.current) {
        handleInput(); // Adjust height on initial render
      }
    }, []);

    React.useEffect(() => {
      if (textareaRef.current) {
        handleInput(); // Adjust height when the value changes
      }
    }, [value]);

    return (
      <textarea
        className={cn(
          `flex w-full rounded-md border overflow-hidden border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${minHeight}`,
          className
        )}
        ref={(el) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(el);
            } else {
              (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
            }
          }
          textareaRef.current = el;
        }}
        onInput={handleInput}
        maxLength={maxLength}
        value={value}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
