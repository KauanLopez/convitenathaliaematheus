import { Section } from '../ui/Section';
import { Image } from '../ui/Image';

export const FooterSection = () => {
  return (
    <footer className="bg-bg-dark text-text-light py-32 relative overflow-hidden">
      <Section className="max-w-2xl mx-auto text-center flex flex-col items-center z-10 relative">
        <div className="w-full max-w-sm aspect-[4/5] mb-16 relative">
          <Image 
            src="/images/couple/footer.jpg" 
            alt="Nathália & Matheus"
            fallbackText="Foto do Casal"
            containerClassName="shadow-subtle"
          />
        </div>
        
        <h2 className="font-heading text-4xl md:text-5xl mb-6">Nathália & Matheus</h2>
        <p className="text-text-light/70 text-sm tracking-[0.2em] uppercase max-w-md mx-auto leading-loose">
          Agradecemos de coração por fazer parte deste momento tão especial em nossas vidas.
        </p>
      </Section>
    </footer>
  );
};
