import { Image } from '../ui/Image';
import { Section } from '../ui/Section';

export const Hero = () => {
  return (
    <Section id="hero" className="flex flex-col items-center text-center pt-10">
      <div className="w-full max-w-sm aspect-[3/4] mb-16 relative">
        <Image 
          src="/images/hero/hero.jpg" 
          alt="Nathália & Matheus"
          fallbackText="Foto do Casal"
          containerClassName="rounded-t-arch border-thin"
        />
      </div>

      <div className="max-w-2xl mx-auto space-y-12">
        <div className="space-y-6">
          <p className="font-heading text-lg md:text-xl italic text-text-muted leading-relaxed">
            "Assim eles já não são dois, mas sim uma só carne. Portanto o que Deus uniu, ninguém separa."
          </p>
          <span className="text-xs uppercase tracking-[0.3em] text-text-main">Mateus 19:6</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-20 text-sm tracking-widest uppercase text-text-muted">
          <div className="space-y-2">
            <p>Cristiane Montanholi</p>
            <p>Edson Montanholi</p>
          </div>
          <div className="space-y-2">
            <p>Marilena Mogi</p>
            <p>Pedro Mogi</p>
          </div>
        </div>

        <div className="py-8">
          <h1 className="font-heading text-6xl md:text-8xl lg:text-[100px] text-text-main leading-none">
            Nathália<br />
            <span className="text-4xl md:text-6xl italic text-text-muted font-light">&amp;</span><br />
            Matheus
          </h1>
        </div>

        <p className="text-sm tracking-[0.2em] uppercase text-text-main">
          Convidam para celebração do seu casamento
        </p>
      </div>
    </Section>
  );
};
