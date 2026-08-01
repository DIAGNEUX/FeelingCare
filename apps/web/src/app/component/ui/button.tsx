import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-feelingcare-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-feelingcare-dark-bg dark:focus-visible:ring-feelingcare-primary-dark",
  {
    variants: {
      variant: {
        default:
          "bg-feelingcare-primary text-feelingcare-light-text shadow-[0_12px_30px_rgba(221,242,65,0.35)] hover:bg-feelingcare-primary/90 dark:bg-feelingcare-primary-dark dark:text-feelingcare-dark-bg dark:hover:bg-feelingcare-primary-dark/80",
        destructive:
          "bg-[#FF755F] text-white shadow-[0_12px_30px_rgba(255,117,95,0.22)] hover:bg-[#F26650]",
        outline:
          "border border-feelingcare-light-border bg-white text-feelingcare-light-text hover:border-feelingcare-primary hover:bg-feelingcare-primary/10 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary dark:text-feelingcare-dark-text dark:hover:bg-feelingcare-primary-dark/10",
        secondary:
          "bg-feelingcare-accent-rose-light text-feelingcare-light-text hover:bg-feelingcare-accent-rose dark:bg-feelingcare-primary-dark/10 dark:text-feelingcare-dark-text dark:hover:bg-feelingcare-primary-dark/15",
        ghost:
          "text-feelingcare-light-text-secondary hover:bg-feelingcare-primary/10 hover:text-feelingcare-light-text dark:text-feelingcare-dark-text-secondary dark:hover:bg-feelingcare-primary-dark/10 dark:hover:text-feelingcare-dark-text",
        link: "text-feelingcare-primary underline-offset-4 hover:underline dark:text-feelingcare-primary-dark",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-xl px-3 text-xs",
        lg: "h-12 rounded-2xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
