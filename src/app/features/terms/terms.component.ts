import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  template: `
    <div class="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-14">
      <div class="container-app text-center">
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3">Terms of Service</h1>
        <p class="text-slate-300 text-lg max-w-md mx-auto">Last updated: May 2026</p>
      </div>
    </div>

    <div class="container-app max-w-3xl py-14">
      <div class="space-y-10 text-slate-700 dark:text-slate-300">

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
          <p class="leading-relaxed">
            By accessing or using ApnaConverter at <strong>apnaconverter.com</strong> (the "Service"),
            you agree to be bound by these Terms of Service. If you do not agree to these terms,
            please do not use the Service. These terms apply to all visitors, users, and others
            who access or use the Service.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Description of Service</h2>
          <p class="leading-relaxed">
            ApnaConverter provides free online file conversion tools including PDF conversion,
            image conversion, document processing, compression, and related utilities. The Service
            is provided "as is" for personal and professional use. We reserve the right to modify,
            suspend, or discontinue any part of the Service at any time without notice.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Acceptable Use</h2>
          <p class="leading-relaxed mb-3">You agree to use the Service only for lawful purposes. You must NOT:</p>
          <ul class="list-disc pl-6 space-y-2 leading-relaxed">
            <li>Upload files that contain malware, viruses, or malicious code</li>
            <li>Upload files that infringe any copyright, patent, trademark, or other intellectual property right</li>
            <li>Upload files containing illegal content, including child sexual abuse material</li>
            <li>Attempt to reverse-engineer, hack, or disrupt the Service</li>
            <li>Use automated scripts or bots to overload our servers</li>
            <li>Use the Service to process files you do not have the right to access or convert</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">4. File Uploads and Privacy</h2>
          <p class="leading-relaxed">
            By uploading a file, you confirm that you have the legal right to process that file.
            Uploaded files are processed solely to perform the requested conversion and are
            automatically deleted within 2 hours. We do not claim ownership of any files you upload.
            See our <a routerLink="/privacy-policy" class="text-primary-600 dark:text-primary-400 underline">Privacy Policy</a>
            for details on how we handle your data.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Intellectual Property</h2>
          <p class="leading-relaxed">
            The Service, including its design, code, logos, and content (excluding user-uploaded files),
            is owned by ApnaConverter and protected by intellectual property laws. You may not copy,
            reproduce, or distribute any part of the Service without our written permission.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Disclaimer of Warranties</h2>
          <p class="leading-relaxed">
            The Service is provided "as is" and "as available" without any warranties of any kind,
            either express or implied. We do not warrant that the Service will be uninterrupted,
            error-free, or that conversion results will be perfect. Use the Service at your own risk.
            Always keep a backup of your original files before converting them.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Limitation of Liability</h2>
          <p class="leading-relaxed">
            To the fullest extent permitted by law, ApnaConverter shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages arising from your use
            of the Service. Our total liability for any claims arising from use of the Service shall
            not exceed the amount you paid us (if any) in the past 12 months.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">8. Advertising</h2>
          <p class="leading-relaxed">
            The Service is supported by advertising provided through Google AdSense. By using the
            Service, you agree that ads may be displayed. We do not endorse any products or services
            advertised on the Service. Ad personalisation is managed by Google; see our
            <a routerLink="/privacy-policy" class="text-primary-600 dark:text-primary-400 underline">Privacy Policy</a>
            for details.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">9. Governing Law</h2>
          <p class="leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of India,
            without regard to its conflict of law provisions. Any disputes arising under these
            Terms shall be subject to the exclusive jurisdiction of the courts of India.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">10. Changes to Terms</h2>
          <p class="leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes take effect when
            posted to this page. Continued use of the Service after changes constitutes your
            acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">11. Contact</h2>
          <p class="leading-relaxed">
            For questions about these Terms, contact us at
            <a href="mailto:support@apnaconverter.com"
               class="text-primary-600 dark:text-primary-400 underline">support&#64;apnaconverter.com</a>.
          </p>
        </section>

      </div>
    </div>
  `,
})
export class TermsComponent {}
