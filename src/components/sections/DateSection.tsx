import { Section } from '../ui/Section';

export const DateSection = () => {
  return (
    <Section id="date" className="text-center bg-bg-secondary/30">
      <div className="max-w-xl mx-auto py-12 border-y border-border-light">
        <h2 className="font-heading text-4xl md:text-5xl text-text-main mb-6">
          07 de Novembro de 2026
        </h2>
        <span className="text-xs tracking-[0.3em] text-text-muted block mb-6 italic">
          às
        </span>
        <h3 className="font-heading text-5xl md:text-6xl text-text-main">
          17h
        </h3>
      </div>
    </Section>
  );
};
