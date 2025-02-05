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
          <span>© {new Date().getFullYear()} AREOHABITS</span>
        </div>
      </div>
    </footer>
  );
}
