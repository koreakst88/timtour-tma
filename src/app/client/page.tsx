import Image from "next/image";
import { Search, MapPin, AlignRight, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full h-full pt-8 px-6 text-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm font-medium">Привет, Анна 👋</span>
          <h1 className="text-2xl font-bold tracking-tight">Куда летим?</h1>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shadow-sm border border-gray-100 flex-shrink-0">
          {/* Avatar placeholder */}
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" alt="User avatar" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-4 text-gray-400 flex items-center pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text" 
          placeholder="Поиск туров..." 
          className="w-full bg-white h-14 pl-12 pr-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-base font-medium placeholder:text-gray-300 outline-none border-transparent focus:border-timtour-primary/20 focus:ring-4 focus:ring-timtour-primary/10 transition-all"
        />
      </div>

      {/* Top Banner section */}
      <div className="flex items-start justify-between mb-6 pr-2">
        <div className="flex flex-col">
          <span className="text-gray-400 font-medium mb-1">Популярные направления</span>
          <h2 className="text-[40px] leading-none font-bold tracking-tighter">74 тура</h2>
        </div>
        
        {/* Decorative Map pin button */}
        <div className="mt-2 w-[52px] h-[52px] rounded-full bg-gradient-to-br from-timtour-primary to-timtour-secondary shadow-[0_10px_30px_rgba(255,107,53,0.3)] flex items-center justify-center flex-shrink-0">
          <MapPin className="text-white w-6 h-6 fill-white stroke-timtour-primary stroke-[1.5px]" />
        </div>
      </div>

      {/* Horizontal Scroll Layout for "Dashboard" cards */}
      <div className="flex gap-6 -mx-6 px-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-4 pb-8">
        
        {/* Left Vertical Categories */}
        <div className="flex flex-col justify-end gap-12 font-medium text-gray-400 text-sm leading-none shrink-0 pr-2 pl-2">
          {['Cycling', 'Mountain', 'Popular'].map((cat, idx) => (
            <span key={cat} className={`-rotate-90 origin-left transform whitespace-nowrap ${cat === 'Popular' ? 'text-black font-bold' : ''}`}>
              {cat}
            </span>
          ))}
        </div>

        {/* Carousel Cards */}
        <div className="flex gap-5 shrink-0 snap-start">
          {/* Card 1 */}
          <div className="relative w-[220px] h-[320px] rounded-[36px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] group cursor-pointer transition-transform hover:-translate-y-2">
            <img 
              src="https://images.unsplash.com/photo-1535139262971-c51845709a48?q=80&w=600&auto=format&fit=crop" 
              alt="Bali" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Dark gradient overlay at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            {/* Orange Tag */}
            <div className="absolute top-0 left-0 bg-timtour-primary px-4 py-3 min-w-[90px] rounded-br-[24px] shadow-lg">
              <span className="text-white font-bold text-lg">$2,100</span>
            </div>

            <div className="absolute bottom-6 left-6 text-white text-left">
              <h3 className="text-2xl font-bold leading-none mb-1 shadow-sm">Бали</h3>
              <p className="text-white/90 text-sm font-medium">Индонезия</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative w-[220px] h-[320px] rounded-[36px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] group cursor-pointer transition-transform hover:-translate-y-2">
            <img 
              src="https://images.unsplash.com/photo-1540306141386-8fa0646067b4?q=80&w=600&auto=format&fit=crop" 
              alt="Seoul" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            {/* Green Tag */}
            <div className="absolute top-0 left-0 bg-[#0BB48A] px-4 py-3 min-w-[90px] rounded-br-[24px] shadow-lg">
              <span className="text-white font-bold text-lg">$1,300</span>
            </div>

            <div className="absolute bottom-6 left-6 text-white text-left">
              <h3 className="text-2xl font-bold leading-none mb-1 shadow-sm">Сеул</h3>
              <p className="text-white/90 text-sm font-medium">Южная Корея</p>
            </div>
          </div>

        </div>
      </div>

      {/* Connect With People Going */}
      <div className="mt-2 mb-8">
        <h3 className="text-gray-400 text-sm font-medium mb-4">Люди с которыми вы летите</h3>
        <div className="flex text-lg items-center relative gap-[18px]">
          {/* Circular Avatars with slightly offset overlapping styling */}
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden border-2 border-timtour-bg shadow-sm bg-pink-100 flex-shrink-0">
             <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" alt="avatar" />
          </div>
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden border-2 border-timtour-bg shadow-sm bg-orange-100 flex-shrink-0">
             <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="avatar" />
          </div>
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden border-2 border-timtour-bg shadow-sm bg-yellow-100 flex-shrink-0">
             <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" alt="avatar" />
          </div>
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden border-2 border-timtour-bg shadow-sm bg-blue-100 flex-shrink-0">
             <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" alt="avatar" />
          </div>
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden border-2 border-timtour-bg shadow-sm bg-green-100 flex-shrink-0 flex items-center justify-center relative cursor-pointer group">
             <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop" className="opacity-60" alt="avatar" />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
             <span className="absolute text-white font-bold text-sm tracking-wider">+12</span>
          </div>
        </div>
      </div>

    </div>
  );
}
