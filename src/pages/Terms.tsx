
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-500 mb-6">Last updated: June 15, 2024</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
        <p>By downloading, accessing, or using the AeroHabits mobile application ("App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our App.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Company Information</h2>
        <p>AEROHABITS<br />
        1101 Parc Central Dr<br />
        Festus, MO 63028<br />
        United States<br />
        Email: Support@AeroHabits.com</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Description of Service</h2>
        <p>AeroHabits is a habit tracking application designed to help users build and maintain positive habits through personalized tracking, challenges, and goal setting.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. User Accounts</h2>
        <p>To use certain features of the App, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate information when registering.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Subscription Terms</h2>
        <p>AeroHabits offers the following subscription option:</p>
        <ul className="list-disc ml-6 my-4">
          <li><strong>Premium Subscription:</strong> $9.99 per month, with a 3-day free trial for new users.</li>
        </ul>
        <p>Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.</p>
        <p>The 3-day free trial automatically converts to a paid subscription unless canceled at least 24 hours before the trial period ends.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">6. Privacy</h2>
        <p>Your privacy is important to us. Please review our <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>, which explains how we collect, use, and share information about you.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">7. License and Restrictions</h2>
        <p>Subject to these Terms, we grant you a limited, non-exclusive, non-transferable license to download and use the App for your personal, non-commercial purposes. You may not:</p>
        <ul className="list-disc ml-6 my-4">
          <li>Copy, modify, or create derivative works of the App</li>
          <li>Reverse engineer, decompile, or disassemble the App</li>
          <li>Rent, lease, or lend the App to others</li>
          <li>Use the App for any illegal purpose</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">8. Modifications to Service</h2>
        <p>We reserve the right to modify, suspend, or discontinue the App or any part of it at any time, with or without notice. We shall not be liable to you or any third party for any such modification, suspension, or discontinuation.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">9. Termination</h2>
        <p>We may terminate or suspend your access to the App immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">10. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, in no event shall AeroHabits be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the App.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">11. Disclaimers</h2>
        <p>The App is provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">12. Governing Law</h2>
        <p>These Terms shall be governed by the laws of the State of Missouri, without regard to its conflict of law provisions.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">13. Changes to Terms</h2>
        <p>We may update these Terms from time to time. If we make material changes, we will notify you by email or through the App. Your continued use of the App after such notice constitutes your acceptance of the revised Terms.</p>

        <div className="mt-8">
          <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
