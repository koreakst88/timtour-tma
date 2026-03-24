-- ЗАДАЧА 1: Добавить Малайзию в страны
INSERT INTO countries (name, flag_emoji, cover_url, is_priority, "order", is_active)
VALUES ('Малайзия', '🇲🇾', '', true, 1, true)
ON CONFLICT (name) DO NOTHING;

-- ЗАДАЧА 2: Обновить приоритетные страны
-- Убираем Корею из приоритетных
UPDATE countries SET is_priority = false 
WHERE name = 'Корея';

-- Обновляем порядок приоритетных стран
UPDATE countries SET "order" = 1 
WHERE name = 'Малайзия';
UPDATE countries SET "order" = 2 
WHERE name = 'Вьетнам';
UPDATE countries SET "order" = 3 
WHERE name = 'Таиланд';
UPDATE countries SET "order" = 4 
WHERE name = 'Филиппины';

-- Остальные не приоритетные
UPDATE countries SET is_priority = false 
WHERE name IN ('Дубай', 'Китай', 'Узбекистан');

-- ЗАДАЧА 3: Добавить категорию weekend в туры
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS category 
text DEFAULT 'international' 
CHECK (category IN ('weekend', 'international'));

-- Корейские туры помечаем как weekend
UPDATE tours SET category = 'weekend'
WHERE country_id = (
  SELECT id FROM countries WHERE name = 'Корея'
);

-- Все остальные туры — international
UPDATE tours SET category = 'international'
WHERE country_id != (
  SELECT id FROM countries WHERE name = 'Корея'
);

-- ЗАДАЧА 4: Добавить тестовые туры выходного дня
INSERT INTO tours 
(country_id, title, description, price, duration_days, type, category, is_active)
VALUES 
(
  (SELECT id FROM countries WHERE name = 'Корея'),
  'Сеул за 1 день',
  'Однодневный тур по главным достопримечательностям Сеула. Дворец Кёнбоккун, рынок Кванджан, район Инсадон.',
  '₩89,000',
  1,
  'group',
  'weekend',
  true
),
(
  (SELECT id FROM countries WHERE name = 'Корея'),
  'Остров Чеджу — выходные',
  'Тур выходного дня на самый красивый остров Кореи. Водопад Чонбан, гора Халласан, деревня Сонып.',
  '₩195,000',
  2,
  'group',
  'weekend',
  true
),
(
  (SELECT id FROM countries WHERE name = 'Корея'),
  'Пусан за 1 день',
  'Морской город за один день. Храм Хэдонняндан, рыбный рынок Чагальчи, пляж Хэундэ.',
  '₩75,000',
  1,
  'group',
  'weekend',
  true
),
(
  (SELECT id FROM countries WHERE name = 'Корея'),
  'Сувон и крепость Хвасон',
  'Историческая крепость ЮНЕСКО в часе от Сеула. Обед с корейским барбекю включён.',
  '₩65,000',
  1,
  'group',
  'weekend',
  true
);

-- ЗАДАЧА 5: Добавить фото для Малайзии и новых туров
UPDATE countries 
SET cover_url = 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80'
WHERE name = 'Малайзия';

-- Фото для туров выходного дня
-- Так как туры новые, нам нужно вставить записи в tour_media, а не просто обновить их
INSERT INTO tour_media (tour_id, url, type, "order")
SELECT id, 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80', 'photo', 1
FROM tours WHERE title = 'Сеул за 1 день'
ON CONFLICT DO NOTHING;

INSERT INTO tour_media (tour_id, url, type, "order")
SELECT id, 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800&q=80', 'photo', 1
FROM tours WHERE title = 'Остров Чеджу — выходные'
ON CONFLICT DO NOTHING;

INSERT INTO tour_media (tour_id, url, type, "order")
SELECT id, 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80', 'photo', 1
FROM tours WHERE title = 'Пусан за 1 день'
ON CONFLICT DO NOTHING;

INSERT INTO tour_media (tour_id, url, type, "order")
SELECT id, 'https://images.unsplash.com/photo-1538669715515-5c3758c07e0c?w=800&q=80', 'photo', 1
FROM tours WHERE title = 'Сувон и крепость Хвасон'
ON CONFLICT DO NOTHING;
