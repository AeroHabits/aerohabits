
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Introduction</h2>
        <p>Last Updated: July 5, 2024</p>
        <p>AeroHabits ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy.</p>
        <p>This policy describes the types of information we may collect from you or that you may provide when you use our AeroHabits application (our "App") and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Information We Collect</h2>
        <p>We collect information directly from you when you provide it to us, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Account information (email address, name, password)</li>
          <li>Profile information (personal goals, habit preferences)</li>
          <li>Habit tracking data</li>
          <li>User-generated content (challenge completions, progress notes)</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">3. How We Use Your Information</h2>
        <p>We use information that we collect about you or that you provide to us:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide, maintain, and improve our App</li>
          <li>To provide personalized habit recommendations</li>
          <li>To process subscriptions and payments</li>
          <li>To send notifications about your account or subscription</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Data Retention and Deletion</h2>
        <p>We retain your personal data for as long as necessary to provide you with our services. You can request deletion of your account and associated data by contacting us at Support@AeroHabits.com.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Data Security</h2>
        <p>We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">6. Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access to your personal data</li>
          <li>Correction of inaccurate data</li>
          <li>Deletion of your data</li>
          <li>Restriction or objection to processing</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">7. Children's Privacy</h2>
        <p>Our App is not intended for children under 13 years of age, and we do not knowingly collect personal information from children under 13.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">8. Changes to Our Privacy Policy</h2>
        <p>We may update our privacy policy from time to time. If we make material changes, we will notify you through the App or by email.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">9. Contact Information</h2>
        <p>AEROHABITS<br />
        1101 Parc Central Dr<br />
        Festus, MO 63028<br />
        United States<br />
        Email: Support@AeroHabits.com</p>

        <div className="mt-8">
          <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
