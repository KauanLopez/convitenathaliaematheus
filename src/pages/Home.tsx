import { motion } from 'framer-motion';
import { Image } from '../components/ui/Image';
import { OrnamentalDivider } from '../components/ui/OrnamentalDivider';
import Countdown, { type CountdownRenderProps } from 'react-countdown';
import { MapPin, Wine, Search } from 'lucide-react';
import { RSVPSearch } from '../components/RSVPSearch';

const EVENT_DATE = new Date("2026-11-07T17:00:00-03:00");

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2 } }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: { repeat: Infinity, duration: 4 }
};

export const Home = () => {

  const renderCountdown = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) return <div className="text-xl font-heading text-text-main text-center">Chegou o grande dia!</div>;

    return (
      <div className="flex justify-center gap-6 md:gap-12 w-full max-w-sm mx-auto">
        {[
          { label: 'Dias', value: days },
          { label: 'Horas', value: hours },
          { label: 'Min', value: minutes },
          { label: 'Seg', value: seconds },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="font-heading text-3xl text-text-main">{String(item.value).padStart(2, '0')}</span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen bg-bg-primary overflow-x-clip pb-0 flex flex-col items-center w-full max-w-[600px] mx-auto relative shadow-2xl"
    >
      {/* Decorative elements from elements folder */}
      <div className="absolute top-[58vh] right-[-50px] w-28 md:w-36 opacity-[0.35] rotate-[90deg] pointer-events-none select-none z-0">
        <motion.img 
          src="/elements/3.png" 
          alt="" 
          className="w-full"
          animate={floatAnimation}
        />
      </div>
      <div className="absolute top-[105vh] left-[-50px] w-32 md:w-40 opacity-[0.35] rotate-[45deg] pointer-events-none select-none z-0">
        <motion.img 
          src="/elements/4.png" 
          alt="" 
          className="w-full"
          animate={floatAnimation}
        />
      </div>

      {/* TopFadedImage */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, scale: 1.05 },
          visible: { opacity: 1, scale: 1, transition: { duration: 1.5 } }
        }}
        className="w-full relative h-[45vh] md:h-[55vh] overflow-hidden mask-image-gradient-bottom -mt-[8vh] md:-mt-[12vh]"
      >
        <Image 
          src="/images/4.webp" 
          alt="Capa"
          fallbackText="Foto Casal Capa"
          containerClassName="w-full h-full"
          className="object-top"
        />
      </motion.div>

      {/* Section_Quote */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
        className="text-center px-6 mt-[-10vh] md:mt-[-15vh] relative z-10 space-y-4 max-w-2xl"
      >
        <p className="font-subheading text-lg md:text-xl italic text-accent leading-relaxed">
          "Assim eles já não são dois, mas sim uma só carne. Portanto o que Deus uniu, ninguém separa."
        </p>
        <p className="font-subheading text-xs tracking-[0.3em] uppercase text-accent">
          Mateus 19:6
        </p>
      </motion.section>

      {/* Section_Names */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="text-center px-6 py-16"
      >
        <motion.h1 variants={fadeInUp} className="font-heading text-6xl md:text-8xl text-accent leading-none">
          Nathália
        </motion.h1>
        <motion.div variants={fadeInUp} className="font-heading text-4xl md:text-6xl text-text-muted italic my-4">&amp;</motion.div>
        <motion.h1 variants={fadeInUp} className="font-heading text-6xl md:text-8xl text-accent leading-none">
          Matheus
        </motion.h1>
      </motion.section>

      {/* Section_Parents */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
        className="text-center px-6 w-full max-w-3xl space-y-8"
      >
        <p className="font-subheading text-xs uppercase tracking-[0.2em] text-accent font-semibold">
          Com a bênção de seus pais
        </p>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm font-subheading tracking-widest text-accent font-semibold">
          <div className="space-y-2">
            <p>Cristiane Montanholi</p>
            <p>Edson Montanholi</p>
          </div>
          <div className="space-y-2">
            <p>Marilena Mogi</p>
            <p>Pedro Mogi</p>
          </div>
        </div>
      </motion.section>

      {/* Section_Invitation */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeIn}
        className="text-center px-6 py-12 w-full"
      >
        <OrnamentalDivider />
        <p className="font-subheading text-sm uppercase tracking-[0.2em] text-text-muted mt-8">
          Convidam para a celebração do seu casamento
        </p>
      </motion.section>

      {/* MiddleFadedImage */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, scale: 1.05 },
          visible: { opacity: 1, scale: 1, transition: { duration: 1.5 } }
        }}
        className="w-full relative h-[40vh] md:h-[60vh] overflow-hidden my-8 mask-image-gradient-both"
      >
        <Image 
          src="/images/2.webp" 
          alt="Divisor"
          fallbackText="Foto Meio"
          containerClassName="w-full h-full object-cover"
        />
      </motion.div>

      {/* Section_Date */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scaleUp}
        className="text-center px-6 py-8 relative z-20 w-full"
      >
        <p className="font-subheading text-sm uppercase tracking-[0.3em] text-text-muted mb-6">Novembro</p>
        <div className="relative inline-block my-4">
          <div className="absolute inset-0 bg-bg-secondary/30 rounded-full scale-150 -z-10 blur-md"></div>
          <h2 className="font-heading text-7xl md:text-9xl text-accent">07</h2>
        </div>
        <p className="font-subheading text-sm uppercase tracking-[0.3em] text-text-muted mt-6 mb-4">2026</p>
        <div className="relative w-full flex justify-center items-center">
          <p className="font-subheading text-xl italic text-accent font-semibold relative z-10">às 17h</p>
          <div className="absolute top-1/2 right-[-50px] w-32 md:w-40 opacity-[0.35] -translate-y-1/2 -rotate-[15deg] pointer-events-none select-none z-0">
            <motion.img 
              src="/elements/5.png" 
              alt="" 
              className="w-full"
              animate={floatAnimation}
            />
          </div>
        </div>
      </motion.section>

      <OrnamentalDivider />

      {/* Section_Countdown */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
        className="text-center px-6 py-12 w-full"
      >
        <p className="font-subheading text-xs uppercase tracking-[0.2em] mb-10" style={{ color: '#D4AF37' }}>
          Contagem Regressiva
        </p>
        <Countdown date={EVENT_DATE} renderer={renderCountdown} />
      </motion.section>

      {/* Section_ActionGrid */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="px-6 py-16 w-full max-w-xl mx-auto space-y-6 relative z-10"
      >
        <div className="grid grid-cols-2 gap-4">
          <motion.a 
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="https://maps.app.goo.gl/weLTHrbkUdTUFtXh8" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center p-4 border border-border-light hover:bg-bg-secondary transition-colors rounded-sm group text-center bg-bg-primary shadow-sm hover:shadow-md"
          >
            <MapPin className="w-6 h-6 text-text-muted mb-3 group-hover:text-text-main transition-colors" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-widest text-text-main font-semibold">Cerimônia</span>
          </motion.a>
          <motion.a 
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="https://maps.app.goo.gl/5feuM3kFojq25agL6" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center p-4 border border-border-light hover:bg-bg-secondary transition-colors rounded-sm group text-center bg-bg-primary shadow-sm hover:shadow-md"
          >
            <Wine className="w-6 h-6 text-text-muted mb-3 group-hover:text-text-main transition-colors" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-widest text-text-main font-semibold">Recepção</span>
          </motion.a>
        </div>

        <motion.div variants={fadeInUp} className="pt-8 flex flex-col items-center w-full max-w-sm mx-auto space-y-4">
          <h3 className="font-subheading text-xs uppercase tracking-[0.2em] text-text-muted text-center font-semibold mb-4">
            Confirmar Presença
          </h3>
          <RSVPSearch />
          <a 
            href="https://wa.me/5544998030529?text=Ol%C3%A1!%20Recebi%20o%20convite%20e%20gostaria%20de%20confirmar%20minha%20presen%C3%A7a%20no%20casamento%20da%20Nathalia%20e%20do%20Matheus."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] uppercase tracking-widest text-text-muted hover:text-text-main underline underline-offset-4 transition-colors pt-4"
          >
            Ou confirme pelo whatsapp
          </a>
        </motion.div>
      </motion.section>

      {/* FooterImage */}
      <motion.footer 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, scale: 1.05 },
          visible: { opacity: 1, scale: 1, transition: { duration: 1.5 } }
        }}
        className="w-full relative h-[50vh] overflow-hidden mt-12 mask-image-gradient-top"
      >
        <Image 
          src="/images/3.webp" 
          alt="Footer"
          fallbackText="Foto Rodapé"
          containerClassName="w-full h-full object-cover object-top"
        />
      </motion.footer>

    </motion.div>
  );
};
