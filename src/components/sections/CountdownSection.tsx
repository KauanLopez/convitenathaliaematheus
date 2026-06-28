import Countdown, { type CountdownRenderProps } from 'react-countdown';
import { Section } from '../ui/Section';

const EVENT_DATE = new Date("2026-11-07T17:00:00-03:00");

export const CountdownSection = () => {
  const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return <div className="text-2xl font-heading text-text-main">Chegou o grande dia!</div>;
    }

    const timeBlocks = [
      { label: 'Dias', value: days },
      { label: 'Horas', value: hours },
      { label: 'Minutos', value: minutes },
      { label: 'Segundos', value: seconds },
    ];

    return (
      <div className="flex gap-4 md:gap-12 justify-center">
        {timeBlocks.map((block, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="font-heading text-3xl md:text-5xl text-text-main mb-2">
              {String(block.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-xs tracking-widest uppercase text-text-muted">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Section id="countdown" className="text-center py-16">
      <h3 className="font-heading text-2xl text-text-main italic mb-10">Faltam...</h3>
      <Countdown date={EVENT_DATE} renderer={renderer} />
    </Section>
  );
};
