import { Component } from '@angular/core';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';
import { HeroComponent } from './sections/hero/hero.component';
import { ProductsSectionComponent } from './sections/products-section/products-section.component';
import { PopularToolsComponent } from './sections/popular-tools/popular-tools.component';
import { WhyChooseComponent } from './sections/why-choose/why-choose.component';
import { ResumeShowcaseComponent } from './sections/resume-showcase/resume-showcase.component';
import { PortfolioShowcaseComponent } from './sections/portfolio-showcase/portfolio-showcase.component';
import { AiFeaturesComponent } from './sections/ai-features/ai-features.component';
import { StatsComponent } from './sections/stats/stats.component';
import { TestimonialsComponent } from './sections/testimonials/testimonials.component';
import { FaqComponent } from './sections/faq/faq.component';
import { FinalCtaComponent } from './sections/final-cta/final-cta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AdBannerComponent,
    HeroComponent,
    ProductsSectionComponent,
    PopularToolsComponent,
    WhyChooseComponent,
    ResumeShowcaseComponent,
    PortfolioShowcaseComponent,
    AiFeaturesComponent,
    StatsComponent,
    TestimonialsComponent,
    FaqComponent,
    FinalCtaComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
