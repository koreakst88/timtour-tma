import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const updates = [
  { p: '₩1,400,000', t: 'Сеул: город контрастов' },
  { p: '₩1,000,000', t: 'Пусан: море и горы' },
  { p: '₩1,200,000', t: 'Вьетнамская классика' },
  { p: '₩900,000', t: 'Релакс на Фукуоке' },
  { p: '₩1,500,000', t: 'Сокровища Таиланда' },
  { p: '₩1,100,000', t: 'Пхукет: райский остров' },
  { p: '₩1,700,000', t: 'Острова Филиппин' },
  { p: '₩1,300,000', t: 'Боракай романтика' },
  { p: '₩2,200,000', t: 'Дубай: город будущего' },
  { p: '₩900,000', t: 'Сафари и пески' },
  { p: '₩1,800,000', t: 'Великая стена' },
  { p: '₩1,200,000', t: 'Шанхайский экспресс' },
  { p: '₩1,000,000', t: 'Древний Самарканд' },
  { p: '₩600,000', t: 'Ташкентские каникулы' },
];

async function run() {
  let hasErrors = false;
  for (const item of updates) {
    console.log(`Updating "${item.t}" to ${item.p}...`);
    const { error } = await supabase
      .from('tours')
      .update({ price: item.p })
      .eq('title', item.t);
      
    if (error) {
      console.error('Error for ' + item.t + ':', error.message);
      hasErrors = true;
    } else {
      console.log('Success for: ' + item.t);
    }
  }
  
  if (hasErrors) {
    process.exit(1);
  }
}

run();
