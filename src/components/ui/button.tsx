import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[opacity,transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-chili text-surface hover:bg-chili-dark shadow-soft",
        secondary:
          "bg-surface text-ink border border-line hover:bg-surface-2",
        ghost: "bg-transparent text-ink hover:bg-chili-soft",
        danger: "bg-danger text-surface hover:opacity-90",
        leaf: "bg-leaf text-surface hover:opacity-90",
      },
      size: {
        md: "h-11 min-h-11 px-4 text-sm rounded-[12px]",
        lg: "h-14 min-h-14 px-5 text-base rounded-[16px]",
        xl: "h-16 min-h-16 px-6 text-lg rounded-[20px]",
        icon: "size-11 rounded-[12px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
