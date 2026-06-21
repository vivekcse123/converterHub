import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-refund-policy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-14">
      <div class="container-app text-center">
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3">Refund Policy</h1>
        <p class="text-slate-300 text-lg max-w-md mx-auto">Last updated: June 2026</p>
      </div>
    </div>

    <div class="container-app max-w-3xl py-14">
      <div class="prose prose-slate dark:prose-invert max-w-none space-y-10 text-slate-700 dark:text-slate-300">

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Overview</h2>
          <p class="leading-relaxed">
            ApnaConverter ("we", "our", or "us") offers both free tools and paid features including Pro subscription plans and individual premium resume template purchases. This Refund Policy explains our approach to refund requests for all paid products. We want every customer to be satisfied with their purchase, and we review all refund requests on a case-by-case basis.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Free Features</h2>
          <p class="leading-relaxed">
            All file conversion tools, the basic Resume Builder, the Biodata Maker, and the ATS Checker are free to use with no payment required. Refund requests do not apply to free features.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Pro Subscription Plans</h2>
          <p class="leading-relaxed mb-4">
            ApnaConverter Pro is available as a monthly, annual, or lifetime subscription. Pro unlocks all premium resume templates, removes download limits, and grants access to cover letter and portfolio features.
          </p>

          <h3 class="text-base font-semibold text-slate-800 dark:text-white mb-2">Eligibility for Refund</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Monthly plan:</strong> Refund requests submitted within <strong>7 days</strong> of the initial purchase or renewal date are eligible for a full refund, provided you have not downloaded more than 3 Pro-exclusive resources during that period.</li>
            <li><strong>Annual plan:</strong> Refund requests submitted within <strong>14 days</strong> of purchase are eligible for a full refund, provided Pro features have not been used extensively (fewer than 5 premium template downloads).</li>
            <li><strong>Lifetime plan:</strong> Refund requests submitted within <strong>30 days</strong> of purchase are eligible for a full refund if you have not substantially used Pro features.</li>
          </ul>

          <h3 class="text-base font-semibold text-slate-800 dark:text-white mb-2">Non-Refundable Circumstances</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Refund requests made after the eligibility window has passed.</li>
            <li>Subscriptions that have been used to download 5 or more premium templates or generate 5 or more cover letters.</li>
            <li>Subscription renewals where we sent a renewal reminder email at least 7 days before the charge.</li>
            <li>Accounts found to be in violation of our <a routerLink="/terms" class="text-violet-600 hover:text-violet-700 underline">Terms of Service</a>.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Individual Template Purchases</h2>
          <p class="leading-relaxed mb-4">
            Individual premium resume templates can be purchased separately (one-time payment per template). Because these are digital goods that are immediately accessible upon purchase, refunds are generally not provided once the template has been accessed or downloaded.
          </p>
          <p class="leading-relaxed">
            <strong>Exception:</strong> If a technical issue prevents you from downloading or using a template you purchased, we will either resolve the issue or provide a full refund. Contact us within 7 days of purchase with details of the problem.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Digital Goods Policy</h2>
          <p class="leading-relaxed">
            All purchases on ApnaConverter are for digital products and services. Under the Consumer Protection (E-Commerce) Rules, 2020, and general digital goods principles, once a digital product has been delivered and accessed, it is generally considered consumed. We apply this principle while still honoring reasonable refund requests within the windows described above.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">6. How to Request a Refund</h2>
          <p class="leading-relaxed mb-4">To request a refund, please contact us using one of the following methods:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Email: <strong>support&#64;apnaconverter.com</strong></li>
            <li>Contact form: <a routerLink="/contact" class="text-violet-600 hover:text-violet-700 underline">apnaconverter.com/contact</a></li>
          </ul>
          <p class="leading-relaxed mt-4">
            Please include the following in your refund request:
          </p>
          <ul class="list-disc pl-5 space-y-2 mt-2">
            <li>The email address associated with your ApnaConverter account</li>
            <li>The date of purchase and the plan or template purchased</li>
            <li>The reason for your refund request</li>
            <li>Your payment reference or transaction ID (if available)</li>
          </ul>
          <p class="leading-relaxed mt-4">
            We aim to respond to all refund requests within <strong>2 business days</strong>. Approved refunds are processed back to the original payment method within <strong>5-10 business days</strong>, depending on your bank or payment provider.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Chargebacks</h2>
          <p class="leading-relaxed">
            If you initiate a chargeback with your bank or card provider without first contacting us, we reserve the right to suspend your account pending investigation. We encourage you to reach out to us directly first — we are happy to resolve any payment issues quickly and fairly.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">8. Changes to This Policy</h2>
          <p class="leading-relaxed">
            We may update this Refund Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of ApnaConverter paid features after a policy update constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">9. Contact</h2>
          <p class="leading-relaxed">
            If you have questions about this Refund Policy or a specific purchase, please reach out via our <a routerLink="/contact" class="text-violet-600 hover:text-violet-700 underline">Contact page</a> or email <strong>support&#64;apnaconverter.com</strong>. We are committed to resolving all concerns promptly and fairly.
          </p>
        </section>

      </div>
    </div>
  `,
})
export class RefundPolicyComponent {}
