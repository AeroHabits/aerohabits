
import { useCallback, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const isMobile = useIsMobile();
  const [touchStartY, setTouchStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const PULL_THRESHOLD = 100;
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setTouchStartY(e.touches[0].clientY);
    }
  }, []);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartY === 0) return;
    const currentY = e.touches[0].clientY;
    const newPullDistance = currentY - touchStartY;
    
    if (newPullDistance > 0 && newPullDistance < PULL_THRESHOLD) {
      e.preventDefault();
      setPullDistance(newPullDistance);
      const element = e.currentTarget as HTMLDivElement;
      element.style.transform = `translateY(${newPullDistance}px)`;
    }
  }, [touchStartY, PULL_THRESHOLD]);
  
  const handleTouchEnd = useCallback(async (e: React.TouchEvent) => {
    if (pullDistance > PULL_THRESHOLD / 2) {
      await onRefresh();
    }
    
    const element = e.currentTarget as HTMLDivElement;
    element.style.transform = '';
    setTouchStartY(0);
    setPullDistance(0);
  }, [pullDistance, PULL_THRESHOLD, onRefresh]);

  // Only apply touch handlers if on mobile
  const touchProps = isMobile ? {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  } : {};

  return (
    <div {...touchProps}>
      {children}
    </div>
  );
}
