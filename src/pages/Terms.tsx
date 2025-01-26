import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using AREOHABITS, you agree to be bound by these Terms of Service.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Description of Service</h2>
        <p>AREOHABITS is a habit tracking application that helps users build and maintain positive habits.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. User Accounts</h2>
        <p>Users must register for an account and maintain accurate information. You are responsible for maintaining the security of your account.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Privacy</h2>
        <p>Your privacy is important to us. Please review our <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Modifications to Service</h2>
        <p>We reserve the right to modify or discontinue the service at any time.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">6. Limitation of Liability</h2>
        <p>AREOHABITS is provided "as is" without warranties of any kind.</p>

        <div className="mt-8">
          <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}