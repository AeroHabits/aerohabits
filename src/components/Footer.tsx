
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link to="/support" className="hover:text-foreground transition-colors">
            Support
          </Link>
          <span>© {new Date().getFullYear()} AEROHABITS</span>
        </div>
      </div>
    </footer>
  );
}
