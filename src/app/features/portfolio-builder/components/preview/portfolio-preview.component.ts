import { Component, computed, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { PortfolioData } from '../../models/portfolio.model';
import { getPortfolioTemplateMeta } from '../../data/portfolio-templates.data';

@Component({
  selector: 'app-portfolio-preview',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="templateComponent(); inputs: { portfolio: portfolio() }" />`,
})
export class PortfolioPreviewComponent {
  readonly portfolio = input.required<PortfolioData>();
  readonly templateComponent = computed(() => getPortfolioTemplateMeta(this.portfolio().theme.templateId).component);
}
