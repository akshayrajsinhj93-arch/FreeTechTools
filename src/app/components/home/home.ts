import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ToolCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  tools: ToolCard[] = [
    {
      title: 'Text to PDF',
      description:
        'Convert your text documents to PDF format quickly and easily. No registration required.',
      icon: '📄',
      route: '/text-to-pdf',
      color: 'primary',
    },
    // Removed other tools as they're not in the routes
  ];

  scrollToElement($element: HTMLElement): void {
    $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
