
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 mb-6">Last Updated: July 5, 2024</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Agreement to Terms</h2>
        <p>By accessing or using AEROHABITS, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this app.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Company Information</h2>
        <p>AEROHABITS<br />
        1101 Parc Central Dr<br />
        Festus, MO 63028<br />
        United States<br />
        Email: Support@AeroHabits.com</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4" id="subscription-terms">3. Subscription Terms</h2>
        <p>AeroHabits offers subscription services that provide access to premium features. The following terms apply to all subscriptions:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Subscriptions are billed on a monthly basis at the rate of $9.99 per month.</li>
          <li>Payment will be charged to your Apple ID account at the confirmation of purchase.</li>
          <li>Your subscription will automatically renew unless auto-renew is turned off at least 24 hours before the end of the current billing period.</li>
          <li>Your account will be charged for renewal within 24 hours prior to the end of the current period.</li>
          <li>You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.</li>
          <li>No refunds will be provided for the unused portion of any subscription period.</li>
          <li>We reserve the right to change subscription fees. Any price changes will be communicated to you in advance and will apply to the next billing cycle.</li>
          <li>By subscribing, you authorize us to charge the payment method associated with your Apple ID account.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. User Accounts</h2>
        <p>Users must register for an Account and maintain accurate information. You are responsible for maintaining the security of your Account and for all activities that occur under your account.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Acceptable Use</h2>
        <p>You agree not to use the App for any purpose that is unlawful or prohibited by these Terms. You may not:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the App in any way that could disable, overburden, or impair the App</li>
          <li>Attempt to gain unauthorized access to any part of the App</li>
          <li>Use the App to harass, abuse, or harm another person or group</li>
          <li>Use any robot, spider, or other automatic device to access the App</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">6. Privacy</h2>
        <p>Your privacy is important to us. Please review our <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>, which explains how we collect, use, and share information about you.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">7. Modifications to Service</h2>
        <p>We reserve the right to modify or discontinue the Service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">8. Limitation of Liability</h2>
        <p>In no event shall AEROHABITS, its officers, directors, employees, or agents, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">9. Governing Law</h2>
        <p>These Terms shall be governed by and defined following the laws of the United States. AEROHABITS and yourself irrevocably consent that the courts of Missouri shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">10. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at Support@AeroHabits.com.</p>

        <div className="mt-8">
          <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
