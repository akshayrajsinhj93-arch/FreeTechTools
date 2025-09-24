import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.HomeComponent),
    pathMatch: 'full',
    title: 'Free Tech Tools - Home',
    data: {
      seo: {
        title: 'Free Online Tools for Your Daily Needs',
        description: 'Free online tools including Text to PDF converter. Simple, fast, and no registration required.',
        keywords: 'free tools, text to pdf, online converter, pdf tools, web utilities',
        type: 'website'
      }
    }
  },
  {
    path: 'text-to-pdf',
    loadComponent: () => import('./components/text-to-pdf/text-to-pdf').then(m => m.TextToPdfComponent),
    title: 'Text to PDF Converter',
    data: {
      seo: {
        title: 'Text to PDF Converter',
        description: 'Convert your text documents to PDF format quickly and easily. No registration required.',
        keywords: 'text to pdf, pdf converter, document converter, free pdf tool',
        type: 'article'
      }
    }
  },
  { 
    path: '**', 
    redirectTo: '',
    pathMatch: 'full'
  }
];
