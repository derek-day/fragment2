"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

const PARTICLE_COUNT = 40;

export default function TermsOfService() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 presto-text">Terms of Service</h1>
          <p className="text-gray-400 text-sm mb-8">Last Updated: February 2, 2026</p>

          <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">1. Acceptance of Terms</h2>
              <p>
                Welcome to The Gatebreaker Protocol. By accessing or using our interactive fiction game platform ("Service"), you agree 
                to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. 
                These Terms constitute a legally binding agreement between you and Gatebreaker Studios LLC ("we," "us," or "our").
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">2. Eligibility</h2>
              <p className="mb-3">
                You must be at least 13 years old to use this Service. By using the Service, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You are at least 13 years of age</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will comply with all applicable laws and regulations</li>
                <li>All information you provide is accurate and current</li>
              </ul>
              <p className="mt-3">
                If you are under 18, you should review these Terms with a parent or guardian to ensure you understand them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">3. User Accounts</h2>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Account Creation</h3>
              <p className="mb-3">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account at any time, with or without notice, for conduct 
                that violates these Terms, is harmful to other users, or is otherwise deemed inappropriate.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">4. Acceptable Use</h2>
              <p className="mb-3">You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems (bots, scripts) to access the Service</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Collect or harvest information about other users</li>
                <li>Impersonate any person or entity</li>
                <li>Upload or transmit viruses or malicious code</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Engage in any form of cheating or exploitation of game mechanics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">5. Intellectual Property Rights</h2>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Our Content</h3>
              <p className="mb-3">
                All content, features, and functionality of the Service, including but not limited to text, graphics, logos, 
                images, game mechanics, storylines, characters, and software, are owned by Gatebreaker Studios LLC and are protected 
                by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Limited License</h3>
              <p className="mb-3">
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service 
                for personal, non-commercial purposes. This license does not include any rights to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Modify, copy, or create derivative works</li>
                <li>Distribute, sell, or transfer any part of the Service</li>
                <li>Publicly display or perform the content</li>
                <li>Use the Service for commercial purposes</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">User Content</h3>
              <p>
                Your game progress, character data, and choices remain your personal data. However, by using the Service, 
                you grant us the right to store and process this data as necessary to provide the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">6. Service Availability</h2>
              <p className="mb-3">
                We strive to provide reliable service, but we do not guarantee that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>The Service will be uninterrupted or error-free</li>
                <li>Defects will be corrected immediately</li>
                <li>The Service will be available at all times</li>
                <li>Your data will never be lost (though we use reasonable backup measures)</li>
              </ul>
              <p className="mt-3">
                We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, 
                with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">7. Fees and Payment</h2>
              <p>
                Currently, The Gatebreaker Protocol is provided free of charge. We reserve the right to introduce paid features, 
                subscriptions, or in-game purchases in the future. If we do so, we will provide clear notice and updated 
                terms before any charges apply to your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">8. Disclaimer of Warranties</h2>
              <p className="mb-3">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties that the Service will be error-free or secure</li>
                <li>Warranties regarding accuracy or reliability of content</li>
              </ul>
              <p className="mt-3">
                Your use of the Service is at your sole risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">9. Limitation of Liability</h2>
              <p className="mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, GATEBREAKER STUDIOS LLC SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, use, or goodwill</li>
                <li>Service interruptions or data loss</li>
                <li>Any damages arising from your use or inability to use the Service</li>
              </ul>
              <p className="mt-3">
                Our total liability shall not exceed $100 USD or the amount you paid us in the past 12 months (if any), 
                whichever is greater.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">10. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Gatebreaker Studios LLC, its officers, directors, employees, and 
                agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-3">
                <li>Your violation of these Terms</li>
                <li>Your use of the Service</li>
                <li>Your violation of any rights of another party</li>
                <li>Your violation of any applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">11. Content and Conduct</h2>
              <p className="mb-3">
                Our game contains fictional content including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Fantasy violence and combat scenarios</li>
                <li>Mature themes appropriate for ages 13+</li>
                <li>Fictional depictions of characters and events</li>
              </ul>
              <p className="mt-3">
                All content is fictional and should not be interpreted as endorsing real-world violence or illegal activities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">12. Third-Party Services</h2>
              <p>
                Our Service uses Firebase (Google) for authentication and data storage. Your use of these services is subject 
                to their respective terms of service and privacy policies. We are not responsible for third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">13. Dispute Resolution</h2>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Informal Resolution</h3>
              <p>
                Before filing a claim, please contact us at gatebreakerllc@gmail.com to attempt to resolve the dispute informally.
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Governing Law</h3>
              <p>
                These Terms shall be governed by the laws of the United States and the state where Gatebreaker Studios LLC is registered, 
                without regard to conflict of law provisions.
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Arbitration</h3>
              <p>
                Any dispute not resolved informally shall be resolved through binding arbitration in accordance with the rules 
                of the American Arbitration Association. You waive your right to a jury trial.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting 
                the updated Terms with a new "Last Updated" date. Continued use of the Service after changes constitutes 
                acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">15. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or 
                eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">16. Entire Agreement</h2>
              <p>
                These Terms, along with our Privacy Policy, constitute the entire agreement between you and Gatebreaker Studios LLC 
                regarding the Service and supersede all prior agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 presto-text">17. Contact Information</h2>
              <p className="mb-3">
                For questions about these Terms or to report violations, please contact us:
              </p>
              <div className="bg-gray-800/50 border border-gray-700 p-4 mt-3">
                <p className="font-semibold text-white">Gatebreaker Studios LLC</p>
                <p>Email: <a href="mailto:gatebreakerllc@gmail.com" className="text-blue-400 hover:text-blue-300 underline">gatebreakerllc@gmail.com</a></p>
              </div>
            </section>

            <section className="pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-xs">
                By creating an account or using The Gatebreaker Protocol, you acknowledge that you have read, understood, and agree to be 
                bound by these Terms of Service.
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