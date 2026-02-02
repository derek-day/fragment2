"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

const PARTICLE_COUNT = 40;

export default function PrivacyPolicy() {
  const router = useRouter();

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const duration = Math.random() * 18 + 14;
      return {
        id: i,
        size: Math.random() * 2.5 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration,
        delay: Math.random() * -duration
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-auth hero">
      <div className="screen-particles">
        {particles.map(p => (
          <span
            key={p.id}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              filter: 'blur(0.8px) saturate(1.1) contrast(1.1)',
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Content Container */}
        <div className="display bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 presto-text">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-8">Last Updated: February 2, 2026</p>

          <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">1. Introduction</h2>
              <p>
                Welcome to The Gatebreaker Protocol ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our interactive fiction game platform. Please read this privacy 
                policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Account Information</h3>
              <p className="mb-3">When you create an account, we collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Email address</li>
                <li>Password (encrypted and stored securely via Firebase Authentication)</li>
                <li>Character name and game progress data</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Game Data</h3>
              <p className="mb-3">During gameplay, we store:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Character statistics and progress</li>
                <li>Story choices and decisions</li>
                <li>Inventory and equipment</li>
                <li>Achievement and milestone tracking</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Technical Information</h3>
              <p className="mb-3">We automatically collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>IP address (for security purposes only)</li>
                <li>Session data and timestamps</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">3. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide, operate, and maintain our game service</li>
                <li>Save and sync your game progress across devices</li>
                <li>Authenticate your account and prevent unauthorized access</li>
                <li>Respond to your comments, questions, and provide customer support</li>
                <li>Improve and personalize your gaming experience</li>
                <li>Monitor and analyze usage patterns to improve our service</li>
                <li>Detect, prevent, and address technical issues or security threats</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">4. Cookies and Tracking</h2>
              <p className="mb-3">
                We use essential cookies only. These are strictly necessary for the operation of our service, 
                specifically for authentication and maintaining your login session. We do NOT use:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Advertising cookies</li>
                <li>Third-party tracking cookies</li>
                <li>Analytics cookies (beyond basic Firebase Analytics for crash reporting)</li>
                <li>Social media cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">5. Data Storage and Security</h2>
              <p className="mb-3">
                Your data is stored securely using Google Firebase, which employs industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Encrypted password storage (never stored in plain text)</li>
                <li>Regular security updates and monitoring</li>
                <li>Restricted access controls</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your 
                personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">6. Data Sharing and Disclosure</h2>
              <p className="mb-3">
                We do NOT sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Service Providers:</strong> With Firebase/Google Cloud for hosting and authentication services</li>
                <li><strong>Legal Requirements:</strong> If required by law, court order, or government request</li>
                <li><strong>Safety:</strong> To protect the rights, property, or safety of The Gatebreaker Protocol, our users, or others</li>
                <li><strong>Business Transfer:</strong> In connection with any merger, sale, or acquisition of all or part of our company</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">7. Data Retention</h2>
              <p>
                We retain your account and game data for as long as your account is active or as needed to provide you services. 
                You may request deletion of your account and all associated data at any time by contacting us at 
                gatebreakerllc@gmail.com. Upon deletion request, we will remove your data within 30 days, except where we are 
                required to retain it by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">8. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Object to processing of your personal information</li>
                <li>Request data portability (receive a copy of your data)</li>
                <li>Withdraw consent for data processing (may limit service functionality)</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at gatebreakerllc@gmail.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">9. Children's Privacy</h2>
              <p>
                Our service is not directed to individuals under the age of 13. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has provided 
                us with personal information, please contact us immediately at gatebreakerllc@gmail.com, and we will 
                delete such information from our systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">10. International Users</h2>
              <p>
                Your information may be transferred to and maintained on servers located outside of your state, province, 
                country, or other governmental jurisdiction. By using our service, you consent to the transfer of information 
                to the United States and other countries where Firebase/Google Cloud operates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy 
                Policy periodically for any changes. Changes are effective when posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">12. Contact Us</h2>
              <p className="mb-3">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-800/50 border border-gray-700 p-4 mt-3">
                <p className="font-semibold text-white">Gatebreaker Studios LLC</p>
                <p>Email: <a href="mailto:gatebreakerllc@gmail.com" className="text-blue-400 hover:text-blue-300 underline">gatebreakerllc@gmail.com</a></p>
              </div>
            </section>

            <section className="pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-xs">
                By using The Gatebreaker Protocol, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
              </p>
            </section>
          </div>
        </div>

        {/* Back Button Bottom */}
        <button
          onClick={() => router.push('/')}
          className="mt-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}