import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
        // Glassmorphism variants
        glass: "bg-glass-light backdrop-blur-glass border border-white/30 text-foreground hover:bg-glass-dark hover:border-white/40 hover:shadow-glass-hover hover:scale-[1.02] active:scale-[0.98] shadow-glass",
        "glass-primary": "bg-primary/20 backdrop-blur-glass border border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60 hover:shadow-neon-blue hover:scale-[1.02] active:scale-[0.98] shadow-glass",
        "glass-secondary": "bg-secondary/20 backdrop-blur-glass border border-secondary/40 text-foreground hover:bg-secondary/30 hover:border-secondary/60 hover:shadow-glass-hover hover:scale-[1.02] active:scale-[0.98] shadow-glass",
        "glass-accent": "bg-accent/20 backdrop-blur-glass border border-accent/40 text-accent hover:bg-accent/30 hover:border-accent/60 hover:shadow-neon-purple hover:scale-[1.02] active:scale-[0.98] shadow-glass",
        // Neon variants for retro-futuristic look
        neon: "bg-gradient-to-r from-neon-cyan to-neon-purple text-primary-foreground font-semibold hover:shadow-neon-cyan hover:scale-[1.05] active:scale-[0.95] shadow-lg border-2 border-neon-cyan/50",
        "neon-outline": "border-2 border-neon-cyan bg-transparent text-neon-cyan hover:bg-neon-cyan hover:text-primary-foreground hover:shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98] transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
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
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
