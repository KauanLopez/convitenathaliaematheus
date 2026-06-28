import {  useRef  } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Image } from '../ui/Image';

const images = [
  "/images/gallery/01.jpg",
  "/images/gallery/02.jpg",
  "/images/gallery/03.jpg",
  "/images/gallery/04.jpg",
  "/images/gallery/05.jpg",
];

export const GallerySection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} id="gallery" className="relative h-[200vh] bg-bg-primary">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute top-20 left-6 md:left-12 z-10">
          <h2 className="font-heading text-5xl text-text-main">Nossa História</h2>
        </div>
        
        <motion.div style={{ x }} className="flex gap-8 px-6 md:px-32 items-center">
          {images.map((src, index) => (
            <div 
              key={index} 
              className="w-[70vw] md:w-[40vw] max-w-[500px] aspect-[4/5] flex-shrink-0 relative"
            >
              <Image 
                src={src} 
                alt={`Galeria ${index + 1}`}
                fallbackText={`Foto ${index + 1}`}
                containerClassName="shadow-subtle rounded-sm"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
