import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | Trailblazer',
  description: 'Terms and conditions for using Trailblazer',
}

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Trailblazer ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you do not agree to these Terms, please do not use the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Trailblazer is a trip planning application that allows users to create, organize, and manage travel itineraries. 
              The Service includes features such as:
            </p>
            <ul>
              <li>Creating and managing multiple trips</li>
              <li>Adding activities, flights, hotels, and other travel-related items</li>
              <li>AI-powered suggestions for destinations and activities</li>
              <li>Offline-first functionality with cloud sync</li>
              <li>Drag and drop organization tools</li>
            </ul>

            <h2>3. User Accounts</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h3>3.2 Account Termination</h3>
            <p>
              You may delete your account at any time through your profile settings. We reserve the right to suspend 
              or terminate accounts that violate these Terms.
            </p>

            <h2>4. User Content</h2>
            <h3>4.1 Your Content</h3>
            <p>
              You retain all rights to the content you create on Trailblazer, including trip itineraries, notes, and personal information. 
              By using the Service, you grant us a limited license to store and display your content solely for the purpose of providing the Service.
            </p>

            <h3>4.2 Content Responsibility</h3>
            <p>
              You are solely responsible for the content you create and share. You agree not to post content that:
            </p>
            <ul>
              <li>Violates any law or regulation</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains malicious code or viruses</li>
              <li>Harasses or harms others</li>
            </ul>

            <h2>5. AI Features</h2>
            <p>
              Trailblazer uses AI-powered features to provide travel suggestions and recommendations. These suggestions are:
            </p>
            <ul>
              <li>Provided "as is" without warranties</li>
              <li>Not professional travel advice</li>
              <li>Subject to change and improvement</li>
              <li>Based on publicly available information</li>
            </ul>
            <p>
              You should verify all AI-generated suggestions independently before making travel decisions.
            </p>

            <h2>6. Acceptable Use</h2>
            <p>
              You agree not to:
            </p>
            <ul>
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Scrape or copy content using automated means</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Upload or transmit viruses or malicious code</li>
            </ul>

            <h2>7. Intellectual Property</h2>
            <p>
              The Service, including its original content, features, and functionality, is owned by Trailblazer and is 
              protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>8. Third-Party Services</h2>
            <p>
              The Service may contain links to third-party websites or services, including:
            </p>
            <ul>
              <li>Booking platforms (hotels, flights, activities)</li>
              <li>Mapping services</li>
              <li>Payment processors</li>
            </ul>
            <p>
              We are not responsible for the content, privacy practices, or availability of third-party services.
            </p>

            <h2>9. Disclaimers</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
              INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that:
            </p>
            <ul>
              <li>The Service will be uninterrupted or error-free</li>
              <li>Defects will be corrected</li>
              <li>The Service is free of viruses or harmful components</li>
              <li>Results obtained from the Service will be accurate or reliable</li>
            </ul>

            <h2>10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRIPPER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, 
              OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by 
              email or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>

            <h2>12. Data and Privacy</h2>
            <p>
              Your use of the Service is also governed by our{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Privacy Policy
              </Link>
              , which explains how we collect, use, and protect your information.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 
              Trailblazer operates, without regard to its conflict of law provisions.
            </p>

            <h2>14. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:support@trailblazer.app" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                support@trailblazer.app
              </a>
            </p>

            <h2>15. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited 
              or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

