-- 0. Добавляем колонку category, если её еще нет
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS category 
text DEFAULT 'international';

-- Обновление или создание ограничения (constraint) для категории
ALTER TABLE tours 
DROP CONSTRAINT IF EXISTS tours_category_check;

ALTER TABLE tours 
ADD CONSTRAINT tours_category_check 
CHECK (category IN ('weekend', 'international', 'english_camp'));

-- 1. Обновляем приоритет стран на главной
-- Малайзия вместо Таиланда в топ-4
UPDATE countries SET is_priority = true, "order" = 1 
WHERE name = 'Малайзия';

UPDATE countries SET is_priority = true, "order" = 2 
WHERE name = 'Вьетнам';

UPDATE countries SET is_priority = true, "order" = 3 
WHERE name = 'Филиппины';

UPDATE countries SET is_priority = true, "order" = 4 
WHERE name = 'Таиланд';

-- Таиланд убираем из приоритетных
-- (он будет в "Все направления")
UPDATE countries SET is_priority = false 
WHERE name = 'Таиланд';

-- 2. Фото для Малайзии в странах
UPDATE countries 
SET cover_url = 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80'
WHERE name = 'Малайзия';

-- 3. Добавляем два обычных тура по Малайзии
INSERT INTO tours 
(country_id, title, description, price, 
  duration_days, type, category, is_active)
VALUES 
(
  (SELECT id FROM countries WHERE name = 'Малайзия'),
  'Куала-Лумпур и острова Лангкави',
  'Незабываемый тур по Малайзии. Башни Петронас, острова Лангкави, колониальный Малакка. Отличное соотношение цены и качества.',
  '₩1,800,000',
  8,
  'group',
  'international',
  true
),
(
  (SELECT id FROM countries WHERE name = 'Малайзия'),
  'Борнео — дикая природа',
  'Индивидуальный тур на остров Борнео. Орангутанги, джунгли, дайвинг на рифах Сипадан.',
  '₩2,200,000',
  10,
  'individual',
  'international',
  true
);

-- 4. Добавляем фото для туров Малайзии
INSERT INTO tour_media (tour_id, url, type, "order")
SELECT id,
  CASE title
    WHEN 'Куала-Лумпур и острова Лангкави' THEN
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80'
    WHEN 'Борнео — дикая природа' THEN
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80'
  END,
  'photo', 1
FROM tours 
WHERE title IN (
  'Куала-Лумпур и острова Лангкави',
  'Борнео — дикая природа'
)
AND id NOT IN (SELECT tour_id FROM tour_media);

-- 5. English Camp туры Малайзии - проверка (SELECT)
SELECT t.title, t.category 
FROM tours t
JOIN countries c ON t.country_id = c.id
WHERE c.name = 'Малайзия';
