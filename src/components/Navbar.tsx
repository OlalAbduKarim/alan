import { ShoppingCart, Layout, Layers, User, Mail, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, cartCount, openCart }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Layout },
    { id: 'shop', label: 'Book Shop', icon: ShoppingCart },
    { id: 'portfolio', label: 'Art Portfolio', icon: Layers },
    { id: 'partnership', label: 'Partnerships', icon: Mail },
    { id: 'about', label: 'About & Contact', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-cream/95 backdrop-blur-md border-b border-brand-tan/80 w-full transition-all duration-300">
      <div className="w-full mx-auto px-4 md:px-10 h-16 md:h-20 flex items-center justify-between gap-4 max-w-7xl">
        
        {/* Brand / Logo with clean Immersive UI accent circle */}
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer select-none"
          onClick={() => setCurrentTab('home')}
          id="nav-logo"
        >
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden flex-none shadow-xs border border-brand-tan/60 bg-brand-tan/20">
            <img 
              src="/a1.png" 
              alt="Alan" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-base sm:text-lg md:text-2xl italic tracking-tight font-bold text-brand-charcoal truncate">
              Alan Art Vision
            </span>
            <span className="font-mono text-[7px] sm:text-[8px] md:text-[8.5px] uppercase tracking-wide text-[#7d8c7c] font-bold leading-none truncate">
              AYESIGAMUKAMA ALAN • Uganda
            </span>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`font-sans text-xs uppercase tracking-widest font-bold transition-all py-1.5 border-b-2 ${
                  isActive 
                    ? 'text-brand-terracotta border-brand-terracotta' 
                    : 'text-brand-charcoal/70 border-transparent hover:text-[#c46c4d]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Corner Buttons */}
        <div className="flex items-center space-x-2 md:space-x-3 flex-none">
          
          {/* Studio Admin Portal Toggle */}
          <button
            onClick={() => setCurrentTab('admin')}
            id="nav-admin-toggle"
            className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full font-sans text-[10px] md:text-xs font-medium border transition-all ${
              currentTab === 'admin'
                ? 'bg-brand-sage text-white border-brand-sage'
                : 'bg-brand-tan/40 text-brand-sage-dark border-brand-sage/30 hover:bg-brand-tan'
            }`}
            title="Inspect Live CRM Database, Server Stock, and Digital Outbox"
          >
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-brand-terracotta md:text-inherit" />
            <span className="hidden sm:inline">Studio Office</span>
            <span className="inline sm:hidden">Office</span>
          </button>

        </div>
      </div>

      {/* Mobile Nav Subbar */}
      <div className="flex md:hidden items-center justify-around border-t border-brand-tan/40 bg-brand-cream px-1 py-1.5 w-full">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-2 rounded-md text-[9px] font-bold tracking-tight transition-all flex-1 ${
                isActive ? 'text-brand-terracotta bg-brand-tan/25' : 'text-brand-charcoal/65 hover:text-brand-terracotta'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
