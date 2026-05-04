import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  template: `
    <div class="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-14">
      <div class="container-app text-center">
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3">Privacy Policy</h1>
        <p class="text-slate-300 text-lg max-w-md mx-auto">Last updated: May 2026</p>
      </div>
    </div>

    <div class="container-app max-w-3xl py-14">
      <div class="prose prose-slate dark:prose-invert max-w-none space-y-10 text-slate-700 dark:text-slate-300">

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Introduction</h2>
          <p class="leading-relaxed">
            ApnaConverter ("we", "our", or "us") operates the website
            <strong>apnaconverter.com</strong> (the "Service"). This Privacy Policy explains how we
            collect, use, and protect information when you use our file conversion tools. We are
            committed to protecting your privacy and handling your data with care.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Information We Collect</h2>
          <p class="leading-relaxed mb-3"><strong>Files you upload:</strong> When you use our conversion tools, you upload files to our servers for processing. These files are used solely for the purpose of performing the requested conversion and are automatically and permanently deleted from our servers within <strong>2 hours</strong> of upload.</p>
          <p class="leading-relaxed mb-3"><strong>Usage data:</strong> We collect anonymous usage data such as which tools are used most frequently, browser type, and general geographic region. This data is aggregated and cannot be used to identify individual users.</p>
          <p class="leading-relaxed"><strong>Account data (if registered):</strong> If you create an account, we collect your email address and a securely hashed password. We do not store payment information.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">3. How We Use Your Information</h2>
          <ul class="list-disc pl-6 space-y-2 leading-relaxed">
            <li>To process and return the results of your file conversions</li>
            <li>To improve our tools and user experience based on aggregate usage patterns</li>
            <li>To send service-related communications if you have an account</li>
            <li>To display relevant advertising through Google AdSense (see Section 5)</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">4. File Security and Retention</h2>
          <p class="leading-relaxed mb-3">We take the security of your files seriously:</p>
          <ul class="list-disc pl-6 space-y-2 leading-relaxed">
            <li>All file transfers use HTTPS/TLS encryption</li>
            <li>Uploaded files are stored only temporarily for processing</li>
            <li>Files are <strong>automatically deleted within 2 hours</strong> of upload — no exceptions</li>
            <li>We do not read, analyse, share, or sell the content of your files</li>
            <li>We do not retain copies of converted output files after download</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Google AdSense and Cookies</h2>
          <p class="leading-relaxed mb-3">
            We use Google AdSense to display advertisements. Google may use cookies and web beacons
            to serve ads based on your prior visits to our website and other websites. Google's use
            of advertising cookies enables it and its partners to serve ads based on your visits to
            our site and/or other sites on the Internet.
          </p>
          <p class="leading-relaxed">
            You can opt out of personalised advertising by visiting
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
               class="text-primary-600 dark:text-primary-400 underline">Google Ads Settings</a>.
            You can also opt out of a third-party vendor's use of cookies for personalised
            advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer"
               class="text-primary-600 dark:text-primary-400 underline">aboutads.info</a>.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Third-Party Services</h2>
          <p class="leading-relaxed">
            We may use third-party services including Google Analytics (usage analytics) and Google
            AdSense (advertising). These services have their own privacy policies and may set their
            own cookies. We do not sell your personal data to any third parties.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Your Rights</h2>
          <p class="leading-relaxed mb-3">Depending on your location, you may have the right to:</p>
          <ul class="list-disc pl-6 space-y-2 leading-relaxed">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate personal data</li>
            <li>Request deletion of your personal data (for account holders)</li>
            <li>Object to or restrict the processing of your data</li>
          </ul>
          <p class="leading-relaxed mt-3">
            To exercise any of these rights, contact us at
            <a href="mailto:support@apnaconverter.com"
               class="text-primary-600 dark:text-primary-400 underline">support&#64;apnaconverter.com</a>.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">8. Children's Privacy</h2>
          <p class="leading-relaxed">
            Our Service is not directed to children under the age of 13. We do not knowingly collect
            personal information from children under 13. If you believe a child has provided us with
            personal information, please contact us and we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">9. Changes to This Policy</h2>
          <p class="leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by updating the "Last updated" date at the top of this page. Continued use of
            the Service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">10. Contact Us</h2>
          <p class="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at
            <a href="mailto:support@apnaconverter.com"
               class="text-primary-600 dark:text-primary-400 underline">support&#64;apnaconverter.com</a>
            or through <a href="https://apnainsights.com/" target="_blank" rel="noopener noreferrer"
               class="text-primary-600 dark:text-primary-400 underline">ApnaInsights</a>.
          </p>
        </section>

      </div>
    </div>
  `,
})
export class PrivacyPolicyComponent {}
