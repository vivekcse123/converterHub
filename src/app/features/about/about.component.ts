import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white py-20">
      <div class="container-app text-center max-w-2xl mx-auto">
        <div class="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🔄</div>
        <h1 class="text-3xl md:text-5xl font-extrabold mb-4">About ApnaConverter</h1>
        <p class="text-primary-100 text-lg leading-relaxed">
          Free, fast, and private file conversion tools — built for everyone.
        </p>
      </div>
    </div>

    <div class="container-app max-w-3xl py-16 space-y-14 text-slate-700 dark:text-slate-300">

      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
        <p class="leading-relaxed text-lg">
          ApnaConverter was created with a simple goal: give everyone access to professional-quality
          file conversion tools — completely free, with no sign-up required and no data stored on our
          servers longer than necessary.
        </p>
        <p class="leading-relaxed mt-4">
          Whether you need to convert a PDF to Word for editing, compress images for a website, or
          extract text from a scanned document, ApnaConverter handles it in seconds without asking
          you to create an account or install software. Every tool is designed to be as fast and
          straightforward as possible, so you can get back to the work that actually matters.
        </p>
        <p class="leading-relaxed mt-4">
          We believe productivity tools should not be locked behind expensive subscriptions or
          cluttered with unnecessary sign-up flows. That is why the overwhelming majority of our
          tools are and always will be free — supported by non-intrusive advertising rather than
          user data.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">What We Offer</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          @for (feature of features; track $index) {
          <div class="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div class="text-2xl shrink-0">{{ feature.icon }}</div>
            <div>
              <h3 class="font-semibold text-slate-800 dark:text-white mb-1">{{ feature.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
          }
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Privacy First</h2>
        <p class="leading-relaxed">
          We take your privacy seriously. Every file you upload is processed on our secure servers
          and <strong>automatically deleted within 2 hours</strong>. We never read, analyse, share,
          or sell the content of your files. No file is ever retained after processing.
        </p>
        <p class="leading-relaxed mt-4">
          Our tools run entirely on server-side processing — your files are never sent to third-party
          conversion services. This means your sensitive documents, such as contracts, medical records,
          or financial statements, never leave our controlled infrastructure. Read our full
          <a routerLink="/privacy-policy" class="text-primary-600 dark:text-primary-400 underline font-medium">Privacy Policy</a>
          for complete details on how we handle your data.
        </p>
        <p class="leading-relaxed mt-4">
          For tools like the Resume Builder, your data stays entirely on your own device — nothing is
          uploaded to our servers at all. Your resume is stored in your browser's local storage and
          only leaves your device when you choose to download it as a PDF.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">How We Keep the Lights On</h2>
        <p class="leading-relaxed">
          ApnaConverter is free to use because we run modest, non-intrusive ads on our pages. We
          deliberately keep ad placement minimal — you will never see pop-ups, auto-playing video ads,
          or ads that obscure the tool you are trying to use. We believe a good user experience and
          sustainable advertising can coexist.
        </p>
        <p class="leading-relaxed mt-4">
          We do not sell your personal data, do not use cookies for cross-site tracking, and do not
          share your information with third parties beyond what is required to serve relevant ads
          through Google AdSense. You can read exactly what data we collect in our
          <a routerLink="/privacy-policy" class="text-primary-600 dark:text-primary-400 underline font-medium">Privacy Policy</a>.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Built by ApnaInsights</h2>
        <p class="leading-relaxed">
          ApnaConverter is a product of
          <a href="https://apnainsights.com/" target="_blank" rel="noopener noreferrer"
             class="text-primary-600 dark:text-primary-400 underline font-medium">ApnaInsights</a>,
          an independent technology team focused on building useful, accessible tools for everyday users.
          We are a small team that genuinely cares about quality — we use ApnaConverter ourselves for
          day-to-day document work, which means when something breaks or feels clunky, we feel it too.
        </p>
        <p class="leading-relaxed mt-4">
          We are continuously adding new conversion tools and improving existing ones based on user
          feedback. If there is a tool you wish we had, or something about an existing tool you find
          frustrating, please
          <a routerLink="/contact" class="text-primary-600 dark:text-primary-400 underline font-medium">reach out to us</a>
          — your feedback directly shapes what we build next.
        </p>
      </section>

      <section class="text-center pt-4">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Start Converting</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8">
          Browse all 37+ tools — no sign-up, no watermarks, completely free.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <a routerLink="/" class="btn btn-primary btn-lg">Browse All Tools</a>
          <a routerLink="/contact" class="btn btn-secondary btn-lg">Contact Us</a>
        </div>
      </section>

    </div>
  `,
})
export class AboutComponent {
  readonly features = [
    { icon: '📄', title: '37+ Conversion Tools',  desc: 'PDF, Word, Excel, images, and more — all in one place.' },
    { icon: '⚡', title: 'Lightning Fast',         desc: 'Optimised processing pipeline delivers results in seconds.' },
    { icon: '🔒', title: 'Secure & Private',       desc: 'Files are auto-deleted within 2 hours. Zero data retention.' },
    { icon: '🆓', title: 'Always Free',            desc: 'Core conversion tools are free forever — no credit card needed.' },
    { icon: '🌐', title: 'Works Everywhere',       desc: 'Any device, any browser — phone, tablet, or desktop.' },
    { icon: '🎯', title: 'No Sign-up Required',   desc: 'Start converting instantly. Account optional.' },
  ];
}
