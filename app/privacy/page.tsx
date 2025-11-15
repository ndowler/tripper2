import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Trailblazer',
  description: 'How Trailblazer collects, uses, and protects your data',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 sm:p-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Trailblazer ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our trip planning service.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <p>We collect information you voluntarily provide when using our Service:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, password</li>
              <li><strong>Profile Information:</strong> Optional profile photo, preferences</li>
              <li><strong>Trip Data:</strong> Destinations, dates, activities, notes, and other travel information</li>
              <li><strong>Payment Information:</strong> Billing details (processed securely by third-party payment processors)</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>We automatically collect certain information when you use the Service:</p>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, clicks</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
              <li><strong>Log Data:</strong> IP address, timestamps, error logs</li>
              <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
            </ul>

            <h3>2.3 AI Feature Data</h3>
            <p>When you use AI-powered features:</p>
            <ul>
              <li>We send your travel preferences and destination to OpenAI's API</li>
              <li>OpenAI processes this data to generate suggestions</li>
              <li>OpenAI's data usage is governed by their privacy policy</li>
              <li>We do not train AI models on your personal data</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li><strong>Provide the Service:</strong> Create and manage your trips, sync across devices</li>
              <li><strong>Improve the Service:</strong> Analyze usage patterns, fix bugs, develop new features</li>
              <li><strong>Communicate:</strong> Send account notifications, updates, and support responses</li>
              <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security threats</li>
              <li><strong>Legal Compliance:</strong> Comply with legal obligations and enforce our Terms</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            
            <h3>4.1 We DO NOT Sell Your Data</h3>
            <p>We will never sell your personal information to third parties.</p>

            <h3>4.2 Service Providers</h3>
            <p>We share data with trusted service providers who help us operate the Service:</p>
            <ul>
              <li><strong>Supabase:</strong> Database hosting and authentication</li>
              <li><strong>Vercel:</strong> Hosting and deployment</li>
              <li><strong>OpenAI:</strong> AI-powered suggestions</li>
              <li><strong>Stripe:</strong> Payment processing (if applicable)</li>
              <li><strong>Email Service:</strong> Transactional emails and notifications</li>
            </ul>
            <p>These providers are contractually obligated to protect your data and use it only for specified purposes.</p>

            <h3>4.3 Legal Requirements</h3>
            <p>We may disclose your information if required by law or in response to:</p>
            <ul>
              <li>Valid legal process (subpoena, court order)</li>
              <li>Requests from law enforcement or government authorities</li>
              <li>Protection of our rights, property, or safety</li>
              <li>Prevention of fraud or illegal activity</li>
            </ul>

            <h3>4.4 Business Transfers</h3>
            <p>
              If Trailblazer is involved in a merger, acquisition, or sale of assets, your information may be transferred. 
              We will provide notice before your data is transferred and becomes subject to a different privacy policy.
            </p>

            <h2>5. Data Retention</h2>
            <p>We retain your information for as long as:</p>
            <ul>
              <li>Your account is active</li>
              <li>Needed to provide you the Service</li>
              <li>Required for legal obligations</li>
              <li>Necessary for legitimate business purposes</li>
            </ul>
            <p>
              When you delete your account, we will delete your personal data within 30 days, except for data we are 
              legally required to retain (e.g., financial records, security logs).
            </p>

            <h2>6. Data Security</h2>
            <p>We implement security measures to protect your information:</p>
            <ul>
              <li><strong>Encryption:</strong> Data encrypted in transit (HTTPS/TLS) and at rest</li>
              <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
              <li><strong>Authentication:</strong> Secure password hashing, optional two-factor authentication</li>
              <li><strong>Monitoring:</strong> Regular security audits and vulnerability assessments</li>
            </ul>
            <p>
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your 
              information, we cannot guarantee absolute security.
            </p>

            <h2>7. Your Privacy Rights</h2>
            
            <h3>7.1 Access and Portability</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Export your data in a portable format (JSON)</li>
            </ul>

            <h3>7.2 Correction and Deletion</h3>
            <p>You can:</p>
            <ul>
              <li>Update your account information in your profile settings</li>
              <li>Delete your account and all associated data</li>
            </ul>

            <h3>7.3 GDPR Rights (EU Users)</h3>
            <p>If you are in the European Union, you have additional rights:</p>
            <ul>
              <li><strong>Right to be forgotten:</strong> Request deletion of your data</li>
              <li><strong>Right to restrict processing:</strong> Limit how we use your data</li>
              <li><strong>Right to object:</strong> Object to certain processing activities</li>
              <li><strong>Right to lodge a complaint:</strong> Contact your local data protection authority</li>
            </ul>

            <h3>7.4 CCPA Rights (California Users)</h3>
            <p>If you are a California resident, you have the right to:</p>
            <ul>
              <li>Know what personal information we collect</li>
              <li>Know if we sell or disclose your personal information (we don't sell)</li>
              <li>Opt-out of the sale of personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Non-discrimination for exercising your rights</li>
            </ul>

            <h2>8. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies for:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Authentication, security, basic functionality</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Understand how users interact with the Service</li>
            </ul>
            <p>You can control cookies through your browser settings, but this may affect functionality.</p>

            <h2>9. Children's Privacy</h2>
            <p>
              Trailblazer is not intended for children under 13 (or 16 in the EU). We do not knowingly collect information 
              from children. If we learn that we have collected personal information from a child, we will delete it immediately.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure that 
              appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by:
            </p>
            <ul>
              <li>Posting the new policy on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending you an email notification (for material changes)</li>
            </ul>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <p>
              Email: <a href="mailto:privacy@trailblazer.app" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                privacy@trailblazer.app
              </a>
            </p>
            <p>
              For GDPR-related inquiries, contact our Data Protection Officer at:{' '}
              <a href="mailto:dpo@trailblazer.app" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                dpo@trailblazer.app
              </a>
            </p>

            <h2>13. Third-Party Services</h2>
            <p>Our use of third-party services is governed by their respective privacy policies:</p>
            <ul>
              <li><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">Supabase Privacy Policy</a></li>
              <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">Vercel Privacy Policy</a></li>
              <li><a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">OpenAI Privacy Policy</a></li>
              <li><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">Stripe Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

