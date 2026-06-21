import { CatalogSection } from "@/components/landing/CatalogSection";
import { DownloadsSection } from "@/components/landing/DownloadsSection";
import { FoundationsSection } from "@/components/landing/FoundationsSection";
import { Hero } from "@/components/landing/Hero";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { TestimonialsMarquee } from "@/components/landing/TestimonialsMarquee";
import { WhyBento } from "@/components/landing/WhyBento";
import { createDefaultMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return createDefaultMetadata(
    "Kikito — Design System, componentes e tutoriais",
    "Componentes copy-paste, tutoriais em vídeo, dicas e novidades para construir interfaces com qualidade de produto."
  );
}

export default function HomePage() {
  return (
    <div className="kk-landing">
      <style>{`
        .kk-landing {
          --kk-font-display: var(--font-tim-sans, var(--font-geist-sans)), "Geist", system-ui, sans-serif;
          --kk-width-max: 1400px;
          --kk-width-content: 900px;
          --kk-accent: var(--ks-primary);
          --kk-section-pad: clamp(4rem, 9vw, 7.5rem);
          --kk-display-size: clamp(2.9rem, 6.4vw, 5.4rem);
          --kk-display-weight: 300;
          --kk-display-line: 1.02;
          --kk-display-track: -0.012em;
          --kk-headline-size: clamp(2rem, 4vw, 3.1rem);
          --kk-ease-out: cubic-bezier(.16, 1, .3, 1);
          --kk-ease-quint: cubic-bezier(.22, 1, .36, 1);
          background: var(--ks-lacquer);
          color: var(--ks-text);
          min-height: 100vh;
        }
        .kk-landing ::selection { background: color-mix(in oklch, var(--kk-accent) 30%, transparent); }

        .kk-container { max-width: var(--kk-width-max); margin: 0 auto; padding-left: clamp(1rem, 4vw, 2.5rem); padding-right: clamp(1rem, 4vw, 2.5rem); }
        .kk-section { padding-top: var(--kk-section-pad); padding-bottom: var(--kk-section-pad); }

        .kk-eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--kk-accent); }
        .kk-display { font-family: var(--kk-font-display); font-size: var(--kk-display-size); font-weight: var(--kk-display-weight); line-height: var(--kk-display-line); letter-spacing: var(--kk-display-track); color: var(--ks-text); }
        .kk-headline { font-family: var(--kk-font-display); font-size: var(--kk-headline-size); font-weight: 400; line-height: 1.06; letter-spacing: -0.01em; color: var(--ks-text); }
        .kk-lead { color: var(--ks-text-muted); font-size: clamp(1rem, 1.4vw, 1.18rem); line-height: 1.7; }

        @media (prefers-reduced-motion: reduce) {
          .kk-landing *, .kk-landing *::before, .kk-landing *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>

      <SiteHeader />

      <main id="main">
        <Hero />
        <TestimonialsMarquee />
        <FoundationsSection />
        <CatalogSection />
        <WhyBento />
        <DownloadsSection />
      </main>

      <SiteFooter />
    </div>
  );
}
