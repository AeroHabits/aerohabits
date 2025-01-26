import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
        <p>We collect information you provide directly to us when using AREOHABITS, including:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Account information (email, name)</li>
          <li>Habit tracking data</li>
          <li>Goals and progress information</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Provide and maintain the Service</li>
          <li>Send notifications about your habits</li>
          <li>Improve our services</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal information.</p>

        <div className="mt-8">
          <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}