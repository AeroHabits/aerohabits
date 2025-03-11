
import { SkeletonCard } from "@/components/ui/skeleton-loader";

export function GoalListLoading() {
  return (
    <div className="space-y-4 py-2">
      <div className="text-center mb-4 text-blue-300/70">
        <div className="inline-block">
          <div className="bg-blue-500/20 px-3 py-1 rounded-full animate-pulse">
            Loading goals...
          </div>
        </div>
      </div>
      
      <div className="grid gap-4">
        <SkeletonCard height={120} className="bg-white/5" />
        <SkeletonCard height={120} className="bg-white/5" />
        <SkeletonCard height={120} className="bg-white/5" />
      </div>
    </div>
  );
}
