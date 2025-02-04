import { Link } from "react-router-dom";
import { UserMenu } from "../UserMenu";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg border border-white/20"
    >
      <nav className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="ghost" className="text-white hover:text-white/80">
            Home
          </Button>
        </Link>
        <Link to="/challenges">
          <Button variant="ghost" className="text-white hover:text-white/80">
            Challenges
          </Button>
        </Link>
        <Link to="/pricing">
          <Button variant="ghost" className="text-white hover:text-white/80">
            Pricing
          </Button>
        </Link>
      </nav>
      <UserMenu />
    </motion.header>
  );
}