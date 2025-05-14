
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile();
  
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted", 
        isMobile ? "scale-95" : "", 
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
