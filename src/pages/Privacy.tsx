import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
        <p>We collect information you provide directly to us when you create an account and use our services.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Information Sharing</h2>
        <p>We do not share your personal information with third parties except as described in this policy.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Data Security</h2>
        <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information.</p>

        <div className="mt-8">
          <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}