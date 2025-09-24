import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private baseUrl = 'https://freetechtools.com';
  private defaultImage = '/assets/images/og-image.jpg';

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router
  ) {
    this.setupRouteChangeTracking();
  }

  private setupRouteChangeTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Reset meta tags on route change
      this.updateBaseTags();
    });
  }

  private updateBaseTags(): void {
    this.meta.updateTag({ property: 'og:site_name', content: 'FreeTechTools' });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@FreeTechTools' });
  }

  updateSeoData(data: SeoData): void {
    const url = data.url || this.router.url;
    const fullUrl = `${this.baseUrl}${url}`;
    const image = data.image || this.defaultImage;
    const type = data.type || 'website';

    // Update title
    const title = data.title ? `${data.title} | FreeTechTools` : 'FreeTechTools';
    this.title.setTitle(title);

    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: data.description });
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Open Graph / Facebook
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:url', content: fullUrl });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:image', content: image });

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: fullUrl }, 'rel="canonical"');
  }

  generateLdJson(data: any): void {
    // Remove existing schema
    this.removeSchema();
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      ...data
    });
    script.id = 'structured-data';
    document.head.appendChild(script);
  }

  private removeSchema(): void {
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      document.head.removeChild(existingScript);
    }
  }
}
