
import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> & {
    className?: string;
    mobileRatio?: number;
  }
>(({ className, mobileRatio, ratio = 16 / 9, ...props }, ref) => {
  const isMobile = window.innerWidth < 768;
  
  return (
    <AspectRatioPrimitive.Root
      ref={ref}
      ratio={isMobile && mobileRatio ? mobileRatio : ratio}
      className={cn("overflow-hidden", className)}
      {...props}
    />
  );
});

AspectRatio.displayName = "AspectRatio";

export { AspectRatio }
