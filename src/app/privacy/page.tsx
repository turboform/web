import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | TurboForm',
  description: 'Privacy policy for TurboForm - how we handle your data and protect your privacy',
}

export default function PrivacyPage() {
  return (
    <div className="flex justify-center py-16 px-4 bg-muted/30">
      <div className="max-w-3xl bg-background rounded-xl shadow-sm p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8 text-center">Last Updated: March 31, 2025</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4 leading-relaxed">
            At TurboForm ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal
            data. This privacy policy will inform you about how we look after your personal data when you visit our
            website and tell you about your privacy rights and how the law protects you.
          </p>
          <p className="mb-4 leading-relaxed">
            This privacy policy applies to all users of TurboForm. Please read it carefully to understand our practices
            regarding your personal data.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data We Collect</h2>
          <p className="mb-4 leading-relaxed">
            We collect and process the following information when you use TurboForm:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2 leading-relaxed">
            <li>Account information: email address and authentication information when you register</li>
            <li>Form content: the descriptions and form structures you create</li>
            <li>Usage data: information about how you interact with our service</li>
            <li>
              Technical data: your IP address, browser type and version, time zone setting, browser plug-in types and
              versions, operating system, and other technology on the devices you use to access our website
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            We do not use third-party cookies for tracking or advertising purposes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
          <p className="mb-4 leading-relaxed">We use your personal data for the following purposes:</p>
          <ul className="list-disc pl-8 mb-4 space-y-2 leading-relaxed">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features when you choose to do so</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Service Providers</h2>
          <p className="mb-4 leading-relaxed">
            We use OpenAI's services to generate form structures based on your descriptions. When you use our form
            generation feature, your form descriptions are sent to OpenAI. This data transfer is necessary for the core
            functionality of our service. OpenAI's use of this data is governed by their privacy policy, available at{' '}
            <a href="https://openai.com/privacy" className="text-primary hover:underline">
              https://openai.com/privacy
            </a>
            .
          </p>
          <p className="mb-4 leading-relaxed">We may also use other service providers for the following reasons:</p>
          <ul className="list-disc pl-8 mb-4 space-y-2 leading-relaxed">
            <li>To host our service</li>
            <li>To provide authentication services</li>
            <li>To process payments (if applicable)</li>
          </ul>
          <p className="mb-4 leading-relaxed">
            These service providers have access to your personal data only to perform these tasks on our behalf and are
            obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4 leading-relaxed">
            The security of your data is important to us. We strive to use commercially acceptable means to protect your
            personal data, but remember that no method of transmission over the Internet or method of electronic storage
            is 100% secure.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Data Protection Rights</h2>
          <p className="mb-4 leading-relaxed">You have the following data protection rights:</p>
          <ul className="list-disc pl-8 mb-4 space-y-2 leading-relaxed">
            <li>The right to access, update, or delete the information we have on you</li>
            <li>
              The right of rectification - the right to have your information corrected if it is inaccurate or
              incomplete
            </li>
            <li>The right to object to our processing of your personal data</li>
            <li>
              The right of restriction - the right to request that we restrict the processing of your personal data
            </li>
            <li>
              The right to data portability - the right to receive a copy of your personal data in a structured,
              machine-readable format
            </li>
            <li>
              The right to withdraw consent at any time where we relied on your consent to process your personal data
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            To exercise any of these rights, please contact us using the information in the "Contact Us" section.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
          <p className="mb-4 leading-relaxed">
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new
            privacy policy on this page and updating the "Last Updated" date at the top.
          </p>
          <p className="mb-4 leading-relaxed">
            You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy
            are effective when they are posted on this page.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4 leading-relaxed">
            If you have any questions about this privacy policy, please contact us:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2 leading-relaxed">
            <li>
              By email:{' '}
              <a href="mailto:privacy@turboform.ai" className="text-secondary underline">
                privacy@turboform.ai
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
