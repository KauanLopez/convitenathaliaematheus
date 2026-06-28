-- Seed data for Nathália & Matheus Wedding

-- Insert initial site settings
insert into public.site_settings (
  bride, groom, wedding_date, music, countdown, verse, 
  hero_image, cover_image, footer_image
) values (
  'Nathália', 'Matheus', '2026-11-07 17:00:00-03', 'Perfect - Ed Sheeran', true, 
  'Assim eles já não são dois, mas sim uma só carne. Portanto o que Deus uniu, ninguém separa. (Mateus 19:6)',
  '/images/4.webp', '/envelope.png', '/images/3.webp'
);

-- Insert example locations
insert into public.locations (type, title, address, google_maps) values 
('Cerimônia', 'Igreja Matriz', 'Rua Exemplo, 123, Centro', 'https://maps.app.goo.gl/weLTHrbkUdTUFtXh8'),
('Recepção', 'Salão de Festas Elegance', 'Av. das Flores, 456, Jardim Botânico', 'https://maps.app.goo.gl/5feuM3kFojq25agL6');

-- Insert example groups and guests
insert into public.groups (name, type, status, allow_new_confirmation) values
('Família Montanholi', 'Família da Noiva', 'pending', false),
('Família Mogi', 'Família do Noivo', 'pending', false);

-- Insert example gifts
insert into public.gifts (title, description, price, status, image) values
('Cotas de Lua de Mel', 'Ajude-nos a curtir a nossa viagem dos sonhos!', 500.00, 'available', 'https://example.com/honeymoon.jpg'),
('Micro-ondas', 'Para esquentar nossos jantares.', 650.00, 'available', 'https://example.com/microwave.jpg'),
('Jogo de Jantar', 'Para recebermos vocês em nossa casa.', 300.00, 'available', 'https://example.com/dinnerware.jpg');

-- Insert PIX settings
insert into public.pix_settings (owner_name, pix_key, pix_type, enabled) values
('Matheus Mogi', '123.456.789-00', 'CPF', true);
