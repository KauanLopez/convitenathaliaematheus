import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Navigation, QrCode } from 'lucide-react';

interface EventCardProps {
  title: string;
  time: string;
  locationName: string;
  address: string;
  mapsUrl: string;
}

const EventCard = ({ title, time, locationName, address, mapsUrl }: EventCardProps) => (
  <div className="flex flex-col items-center text-center p-8 border-thin border-border-light bg-bg-primary shadow-subtle group hover:border-bg-dark transition-colors duration-500 max-w-lg mx-auto w-full">
    <h3 className="font-heading text-3xl text-text-main mb-2">{title}</h3>
    <span className="text-xs tracking-[0.2em] text-text-muted uppercase mb-8 block">
      {time}
    </span>
    
    <div className="mb-8 space-y-2">
      <p className="font-semibold tracking-wide text-text-main">{locationName}</p>
      <p className="text-sm text-text-muted max-w-xs mx-auto leading-relaxed">{address}</p>
    </div>

    <div className="flex flex-col gap-4 w-full">
      <a href={mapsUrl} target="_blank" rel="noreferrer" className="w-full">
        <Button variant="outline" className="w-full gap-2">
          <Navigation className="w-4 h-4" />
          Abrir Google Maps
        </Button>
      </a>
      
      <Button variant="ghost" className="gap-2 text-xs">
        <QrCode className="w-4 h-4" />
        Ver QR Code
      </Button>
    </div>
  </div>
);

export const EventsSection = () => {
  return (
    <Section id="events" className="bg-bg-secondary/20">
      <div className="flex flex-col lg:flex-row gap-12 justify-center">
        <EventCard 
          title="Cerimônia"
          time="17:00"
          locationName="Igreja Matriz"
          address="Rua Principal, 123 - Centro, Cidade - Estado"
          mapsUrl="https://maps.google.com"
        />
        <EventCard 
          title="Recepção"
          time="19:00"
          locationName="Espaço das Flores"
          address="Av. das Festas, 456 - Jardim, Cidade - Estado"
          mapsUrl="https://maps.google.com"
        />
      </div>
    </Section>
  );
};
