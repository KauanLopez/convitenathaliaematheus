import {  useState  } from 'react';
import { cn } from '../../utils';
import { Image as ImageIcon } from 'lucide-react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  containerClassName?: string;
}

export const Image = ({ src, alt, className, containerClassName, fallbackText, ...props }: ImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-bg-secondary flex items-center justify-center", containerClassName)}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-700",
            !isLoaded ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          {...props}
        />
      ) : (
        <div className={cn("flex flex-col items-center justify-center text-text-muted p-4 text-center", className)}>
          <ImageIcon className="w-8 h-8 mb-2 opacity-50" strokeWidth={1} />
          <span className="text-xs uppercase tracking-widest">{fallbackText || "Placeholder"}</span>
        </div>
      )}
    </div>
  );
};
