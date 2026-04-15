import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { TOOLS, Tool } from '../../core/models/tool.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ToolCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly tools: Tool[] = TOOLS;

  readonly stats = [
    { value: '10M+', label: 'Files Converted' },
    { value: '50MB',  label: 'Max File Size' },
    { value: '100%',  label: 'Free to Use' },
    { value: 'SSL',   label: 'Secure & Private' },
  ];

  readonly features = [
    { icon: '⚡', title: 'Lightning Fast',   desc: 'Optimised processing pipeline — results in seconds.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Files are deleted automatically after 2 hours.' },
    { icon: '📱', title: 'Works Everywhere', desc: 'Fully responsive — desktop, tablet, and mobile.' },
    { icon: '🎯', title: 'Easy to Use',      desc: 'Drag, drop, convert, download. That\'s it.' },
  ];
}
