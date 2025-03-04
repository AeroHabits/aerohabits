
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-500 mb-6">Last updated: June 15, 2024</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Introduction</h2>
        <p>Welcome to AeroHabits ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and share information about you when you use our mobile application ("App").</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Information We Collect</h2>
        <p>We collect information you provide directly to us when you:</p>
        <ul className="list-disc ml-6 my-4">
          <li>Create an account</li>
          <li>Complete our onboarding questionnaire</li>
          <li>Set up habits and goals</li>
          <li>Track your progress</li>
          <li>Participate in challenges</li>
          <li>Purchase a subscription</li>
        </ul>
        <p>This may include your name, email address, habit preferences, and payment information.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc ml-6 my-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices, updates, and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Customize your experience based on your preferences</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Subscription Information</h2>
        <p>AeroHabits offers an auto-renewing subscription to access premium features. Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Data Storage and Security</h2>
        <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">6. Your Rights</h2>
        <p>Depending on your location, you may have rights regarding your personal data, including:</p>
        <ul className="list-disc ml-6 my-4">
          <li>Accessing your data</li>
          <li>Correcting inaccurate data</li>
          <li>Deleting your data</li>
          <li>Restricting processing</li>
          <li>Data portability</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">7. Third-Party Services</h2>
        <p>Our App may use third-party services like Supabase for data storage and Stripe for payment processing. These services have their own privacy policies, and we encourage you to review them.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">8. Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">9. Contact Us</h2>
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
