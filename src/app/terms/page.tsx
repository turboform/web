import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | TurboForm',
  description: 'Terms and conditions for using TurboForm SaaS platform',
}

export default function TermsPage() {
  return (
    <div className="flex justify-center py-16 px-4 bg-muted/30">
      <div className="max-w-3xl bg-background rounded-xl shadow-sm p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-8 text-center">Last Updated: June 6, 2025</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4 leading-relaxed">
            By accessing or using TurboForm ("Service", "we", "us", or "our"), you agree to be bound by these Terms &
            Conditions. If you do not agree to all the terms, you may not use the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
          <ul className="list-disc pl-8 mb-4 space-y-2 leading-relaxed">
            <li>You must be at least 18 years old or have legal parental or guardian consent to use TurboForm.</li>
            <li>You agree to use the Service only for lawful purposes and in accordance with these Terms.</li>
            <li>You are responsible for maintaining the confidentiality of your account and password.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
          <ul className="list-disc pl-8 mb-4 space-y-2 leading-relaxed">
            <li>You retain ownership of any content you submit, post, or display on or through the Service.</li>
            <li>
              You grant TurboForm a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and
              display such content solely for the purpose of operating and improving the Service.
            </li>
            <li>You are solely responsible for your content and must have all necessary rights to submit it.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Prohibited Activities</h2>
          <ul className="list-disc pl-8 mb-4 space-y-2 leading-relaxed">
            <li>
              Using the Service for any unlawful purpose or to solicit others to perform or participate in unlawful
              acts.
            </li>
            <li>Violating any applicable laws or regulations.</li>
            <li>
              Infringing upon or violating our intellectual property rights or the intellectual property rights of
              others.
            </li>
            <li>Uploading or transmitting viruses or any other type of malicious code.</li>
            <li>
              Attempting to gain unauthorized access to any portion of the Service or any other systems or networks
              connected to the Service.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Subscription & Payment</h2>
          <ul className="list-disc pl-8 mb-4 space-y-2 leading-relaxed">
            <li>
              Some features of TurboForm may require a paid subscription. By subscribing, you agree to pay all
              applicable fees.
            </li>
            <li>All payments are non-refundable unless otherwise stated.</li>
            <li>We reserve the right to change our pricing and billing methods at any time.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
          <p className="mb-4 leading-relaxed">
            We reserve the right to suspend or terminate your access to TurboForm at our sole discretion, without
            notice, for conduct that we believe violates these Terms or is harmful to other users of the Service or us.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
          <p className="mb-4 leading-relaxed">
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties of any kind,
            whether express or implied, including but not limited to the implied warranties of merchantability, fitness
            for a particular purpose, and non-infringement.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4 leading-relaxed">
            To the fullest extent permitted by law, TurboForm shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
            indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use or
            inability to use the Service; (b) any unauthorized access to or use of our servers; or (c) any other matter
            relating to the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
          <p className="mb-4 leading-relaxed">
            We reserve the right to update or change these Terms at any time. We will notify you of any changes by
            posting the new Terms & Conditions on this page and updating the "Last Updated" date at the top.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="mb-4 leading-relaxed">
            If you have any questions about these Terms & Conditions, please contact us:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2 leading-relaxed">
            <li>
              By email:{' '}
              <a href="mailto:support@turboform.ai" className="text-secondary underline">
                support@turboform.ai
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
