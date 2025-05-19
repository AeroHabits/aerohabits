
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Points() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container max-w-4xl mx-auto px-4 py-8 pt-safe">
        <div className="mt-safe"></div> {/* Safe area spacer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
            Feature Removed
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            The badges and points system has been removed from the application.
          </p>
          
          <Button 
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
