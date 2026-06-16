import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white py-20">
      <div class="container-app text-center max-w-2xl mx-auto">
        <div class="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">✉️</div>
        <h1 class="text-3xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
        <p class="text-primary-100 text-lg leading-relaxed">
          Questions, bug reports, or feedback — we read every message and reply within 1-2 business days.
        </p>
      </div>
    </div>

    <div class="container-app max-w-3xl py-16 space-y-14 text-slate-700 dark:text-slate-300">

      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          @for (channel of channels; track $index) {
          <a [href]="channel.href"
             class="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700
                    hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all">
            <div class="text-2xl shrink-0">{{ channel.icon }}</div>
            <div>
              <h3 class="font-semibold text-slate-800 dark:text-white mb-1">{{ channel.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ channel.desc }}</p>
              <p class="text-sm text-primary-600 dark:text-primary-400 font-medium mt-2">{{ channel.value }}</p>
            </div>
          </a>
          }
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">What to Include in Your Message</h2>
        <p class="leading-relaxed">
          To help us respond quickly, please mention which tool you were using (e.g. "PDF to Word" or
          "Resume Builder"), the device and browser you're on, and — if you ran into an error — a short
          description of what you expected to happen versus what actually happened. Screenshots are always
          welcome and help us reproduce issues faster.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Common Questions Before You Reach Out</h2>
        <div class="space-y-4">
          @for (item of faqs; track $index) {
          <div class="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-1.5">{{ item.q }}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ item.a }}</p>
          </div>
          }
        </div>
      </section>

      <section class="text-center pt-4">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Still Have Questions?</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8">
          Learn more about who we are and how we handle your data.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <a routerLink="/about" class="btn btn-secondary">About ApnaConverter</a>
          <a routerLink="/privacy-policy" class="btn btn-secondary">Privacy Policy</a>
          <a routerLink="/" class="btn btn-primary">Browse All Tools</a>
        </div>
      </section>

    </div>
  `,
})
export class ContactComponent {
  readonly channels = [
    {
      icon: '📧',
      title: 'General Support',
      desc: 'Questions about a tool, your account, or anything else.',
      value: 'support@apnaconverter.com',
      href: 'mailto:support@apnaconverter.com',
    },
    {
      icon: '🐞',
      title: 'Report a Bug',
      desc: 'Found a tool that isn’t working as expected? Let us know so we can fix it fast.',
      value: 'support@apnaconverter.com',
      href: 'mailto:support@apnaconverter.com?subject=Bug%20Report',
    },
    {
      icon: '🔒',
      title: 'Privacy & Data Requests',
      desc: 'Request deletion of your account data or ask how your files are handled.',
      value: 'support@apnaconverter.com',
      href: 'mailto:support@apnaconverter.com?subject=Privacy%20Request',
    },
    {
      icon: '🤝',
      title: 'Business & Partnerships',
      desc: 'Advertising, integrations, or collaboration inquiries — visit ApnaInsights.',
      value: 'apnainsights.com',
      href: 'https://apnainsights.com/',
    },
  ];

  readonly faqs = [
    {
      q: 'Is ApnaConverter really free to use?',
      a: 'Yes. All core conversion tools and the resume builder are free with no hidden limits on basic usage. Optional account features like saving history are also free.',
    },
    {
      q: 'My file failed to convert — what should I do?',
      a: 'First, check that your file is under the size limit shown on the tool page and isn’t password-protected or corrupted. If the problem continues, email us with the file type, size, and a screenshot of the error.',
    },
    {
      q: 'Do you store my uploaded files?',
      a: 'No. Files are processed automatically and deleted from our servers within 2 hours. See our Privacy Policy for full details.',
    },
    {
      q: 'I want to delete my account — how do I do that?',
      a: 'Email support@apnaconverter.com from the address associated with your account and we’ll remove your account and any stored data within a few business days.',
    },
  ];
}
