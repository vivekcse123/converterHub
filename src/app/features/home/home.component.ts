import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { TOOLS, Tool, ToolCategory } from '../../core/models/tool.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ToolCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly allTools: Tool[] = TOOLS;

  activeCategory: string = 'all';

  readonly categories = [
    { id: 'all',      label: 'All Tools' },
    { id: 'pdf',      label: '📄 PDF' },
    { id: 'image',    label: '🖼️ Image' },
    { id: 'document', label: '📝 Document' },
    { id: 'archive',  label: '🗜️ Archive' },
  ];

  get filteredTools(): Tool[] {
    if (this.activeCategory === 'all') return this.allTools;
    return this.allTools.filter(t => t.category === this.activeCategory);
  }

  readonly stats = [
    { value: '10M+',  label: 'Files Converted' },
    { value: '30+',   label: 'Tools Available' },
    { value: '100MB', label: 'Max File Size' },
    { value: 'SSL',   label: 'Secure & Private' },
  ];

  readonly features = [
    { icon: '⚡', title: 'Lightning Fast',     desc: 'Optimised processing pipeline — results in seconds.' },
    { icon: '🔒', title: 'Secure & Private',   desc: 'Files are auto-deleted. Zero data retention.' },
    { icon: '🌐', title: '35+ Formats',        desc: 'PDF, Word, Excel, images, archives and more.' },
    { icon: '🎯', title: 'Easy to Use',        desc: 'Drag, drop, convert, download. No sign-up needed.' },
  ];
}

