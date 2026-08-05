import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  inject,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.component.html',
})
export class FaqComponent implements OnInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly renderer  = inject(Renderer2);
  private readonly document  = inject(DOCUMENT);
  private faqSchemaScript?: HTMLScriptElement;

  readonly faqs = [
    { q: 'Is ApnaConverter completely free?', a: 'Yes! Core features including Resume Builder, ATS Checker, Biodata Maker, and 13 free resume templates are 100% free. No credit card required. Premium plans start at ₹99/month for advanced features like the Cover Letter Builder, Portfolio, and 12 premium templates.' },
    { q: 'Will my resume pass ATS (Applicant Tracking Systems)?', a: 'Absolutely. All templates are tested against modern ATS systems used by Naukri, LinkedIn, and top Indian companies. Each template shows an ATS score so you know exactly how well your resume will perform before you download.' },
    { q: 'What is the difference between free and premium templates?', a: 'Free templates cover all standard resume formats with clean, professional designs. Premium templates include executive layouts, photo-enabled designs, government resume formats with declaration sections, and specialized templates for specific industries.' },
    { q: 'Can I create a government job resume on ApnaConverter?', a: 'Yes! Our Government Resume Builder includes a dedicated template with passport photo upload, declaration section, formal layout, and print-ready A4 format, covering everything required for Indian government job applications.' },
    { q: 'How do I create a resume with no work experience?', a: "Use our Fresher Resume Builder, optimized for students and fresh graduates. It emphasizes education, projects, skills, and achievements over work experience, helping you create a compelling resume even with zero job history." },
    { q: 'Can I create a marriage biodata on ApnaConverter?', a: 'Yes! Our Biodata Maker offers multiple marriage biodata templates with family details, horoscope sections, and photo support. All biodata templates are completely free to download.' },
  ];

  openFaqIdx: number | null = null;
  toggleFaq(idx: number): void { this.openFaqIdx = this.openFaqIdx === idx ? null : idx; }

  ngOnInit(): void {
    if (this.isBrowser) this._injectFaqSchema();
  }

  ngOnDestroy(): void {
    if (this.faqSchemaScript) {
      this.renderer.removeChild(this.document.head, this.faqSchemaScript);
    }
  }

  private _injectFaqSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    };
    const script = this.renderer.createElement('script') as HTMLScriptElement;
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    this.renderer.setProperty(script, 'text', JSON.stringify(schema));
    this.renderer.appendChild(this.document.head, script);
    this.faqSchemaScript = script;
  }
}
