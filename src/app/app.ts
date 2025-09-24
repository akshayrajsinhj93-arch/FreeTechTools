import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    RouterLink, 
    RouterLinkActive,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container">
      <app-header>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/text-to-pdf" routerLinkActive="active">Text to PDF</a>
        </nav>
      </app-header>
      
      <main class="main-content">
        <div class="ad-container">
          <div class="ad-banner">Advertisement</div>
        </div>
        
        <div class="container">
          <router-outlet (activate)="onActivate($event)"></router-outlet>
        </div>

        <div class="ad-container">
          <div class="ad-banner">Advertisement</div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      padding: 16px 0;
    }

    .section {
      scroll-margin-top: 80px;
      padding: 32px 0;
    }

    .ad-container {
      margin: 16px 0;
      text-align: center;
    }

    .ad-banner {
      background-color: #f5f5f5;
      border: 1px dashed #ccc;
      padding: 20px;
      margin: 0 auto;
      max-width: 100%;
      text-align: center;
      color: #666;
    }

    @media (min-width: 768px) {
      .ad-banner {
        max-width: 728px;
        height: 90px;
        line-height: 90px;
      }
    }
  `]
})
export class App implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    // Handle fragment scrolling and SEO updates on route changes
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // Handle fragment scrolling
      const fragment = this.router.parseUrl(this.router.url).fragment;
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 0);
      } else {
        window.scrollTo(0, 0);
      }

      // Update SEO data
      this.updateSeoData();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onActivate(event: any): void {
    // Update SEO data when component is activated
    this.updateSeoData();
  }

  private updateSeoData(): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      const seoData = data['seo'];
      if (seoData) {
        this.seoService.updateSeoData({
          ...seoData,
          url: this.router.url
        });
      }
    });
  }
}
