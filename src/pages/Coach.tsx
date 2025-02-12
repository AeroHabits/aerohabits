
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AiCoach } from "@/components/coach/AiCoach";

export default function Coach() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <AiCoach />
      </div>
    </ProtectedRoute>
  );
}
