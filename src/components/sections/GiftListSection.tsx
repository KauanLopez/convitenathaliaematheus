import {  useState  } from 'react';
import { Section } from '../ui/Section';
import { Image } from '../ui/Image';
import { Button } from '../ui/Button';
import { X, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';

interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  status: 'available' | 'reserved' | 'purchased';
  image: string;
}

const mockGifts: Gift[] = [
  { id: '1', name: 'Jantar Romântico', description: 'Nosso primeiro jantar na lua de mel', price: 250, status: 'available', image: '/images/gifts/01.jpg' },
  { id: '2', name: 'Passeio de Barco', description: 'Um passeio incrível no pôr do sol', price: 500, status: 'available', image: '/images/gifts/02.jpg' },
  { id: '3', name: 'Passagens Aéreas', description: 'Ajude-nos a chegar no paraíso', price: 1500, status: 'available', image: '/images/gifts/03.jpg' },
  { id: '4', name: 'Hospedagem', description: 'Uma diária no resort', price: 800, status: 'purchased', image: '/images/gifts/04.jpg' },
];

export const GiftListSection = () => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [purchased, setPurchased] = useState(false);

  const openModal = (gift: Gift) => {
    if (gift.status === 'available') {
      setSelectedGift(gift);
      setPurchased(false);
    }
  };

  const copyPix = () => {
    navigator.clipboard.writeText("00020101021126580014br.gov.bcb.pix0136CHAVE-PIX-AQUI5204000053039865802BR5911NATHALIA6009SAO PAULO62070503***6304");
    toast.success("Chave PIX copiada!");
  };

  const simulatePayment = () => {
    setPurchased(true);
    toast.success("Pagamento confirmado!");
  };

  return (
    <Section id="gifts" className="bg-bg-secondary/20">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl text-text-main mb-4">Lista de Presentes</h2>
        <p className="text-text-muted text-sm tracking-widest uppercase">Ajude-nos a construir nosso sonho</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {mockGifts.map((gift) => (
          <div 
            key={gift.id} 
            className={`border-thin border-border-light bg-bg-primary p-4 group flex flex-col ${gift.status !== 'available' ? 'opacity-50 grayscale' : 'cursor-pointer hover:border-bg-dark transition-colors'}`}
            onClick={() => openModal(gift)}
          >
            <div className="w-full aspect-square mb-4">
              <Image src={gift.image} alt={gift.name} fallbackText="Presente" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl text-text-main mb-1">{gift.name}</h3>
              <p className="text-xs text-text-muted mb-4">{gift.description}</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
              <span className="font-medium">R$ {gift.price.toFixed(2)}</span>
              <span className="text-[10px] uppercase tracking-wider bg-bg-secondary px-2 py-1 rounded-sm">
                {gift.status === 'available' ? 'Disponível' : gift.status === 'reserved' ? 'Reservado' : 'Presenteado'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 p-4 backdrop-blur-sm">
          <div className="bg-bg-primary border-thin border-border-light p-8 max-w-md w-full relative shadow-subtle flex flex-col items-center text-center">
            <button onClick={() => setSelectedGift(null)} className="absolute top-4 right-4 text-text-muted hover:text-text-main">
              <X className="w-6 h-6" />
            </button>
            
            {!purchased ? (
              <>
                <h3 className="font-heading text-3xl text-text-main mb-2">Presentear</h3>
                <p className="text-sm text-text-muted mb-6">{selectedGift.name} - R$ {selectedGift.price.toFixed(2)}</p>
                
                <div className="bg-white p-4 mb-6 rounded-sm shadow-subtle border-thin border-border-light inline-block">
                  <QRCode value="00020101021126580014br.gov.bcb.pix0136CHAVE-PIX-AQUI5204000053039865802BR5911NATHALIA6009SAO PAULO62070503***6304" size={150} />
                </div>
                
                <p className="text-xs text-text-muted mb-4 uppercase tracking-widest">Escaneie o QR Code ou copie a chave</p>
                
                <div className="flex gap-4 w-full">
                  <Button variant="outline" className="flex-1 gap-2 text-xs px-2" onClick={copyPix}>
                    <Copy className="w-4 h-4" /> Copiar PIX
                  </Button>
                  <Button onClick={simulatePayment} className="flex-1 text-xs px-2">
                    Já paguei
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center">
                <h3 className="font-heading text-4xl text-text-main mb-4 italic">Obrigado!</h3>
                <p className="text-text-muted">Agradecemos imensamente pelo seu presente ❤️</p>
                <Button variant="outline" className="mt-8" onClick={() => setSelectedGift(null)}>Fechar</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
};
