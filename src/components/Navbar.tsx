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
    <header className="sticky top-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-tan px-4 md:px-10 h-20 flex items-center">
      <div className="w-full mx-auto flex items-center justify-between">
        
        {/* Brand / Logo with clean Immersive UI accent circle */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setCurrentTab('home')}
          id="nav-logo"
        >
          <div className="w-8 h-8 bg-brand-terracotta rounded-full flex-none shadow-xs"></div>
          <div className="flex flex-col">
            <span className="font-serif text-xl md:text-2xl italic tracking-tight font-bold text-brand-charcoal">
              Alan Art Vision
            </span>
            <span className="font-mono text-[8.5px] uppercase tracking-wide text-[#7d8c7c] font-bold leading-none">
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
        <div className="flex items-center space-x-3">
          
          {/* Studio Admin Portal Toggle */}
          <button
            onClick={() => setCurrentTab('admin')}
            id="nav-admin-toggle"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-medium border transition-all ${
              currentTab === 'admin'
                ? 'bg-brand-sage text-white border-brand-sage'
                : 'bg-brand-tan/40 text-brand-sage-dark border-brand-sage/30 hover:bg-brand-tan'
            }`}
            title="Inspect Live CRM Database, Server Stock, and Digital Outbox"
          >
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
            <span>Studio Office</span>
          </button>

          {/* Shopping Cart button */}
          <button
            id="nav-cart-btn"
            onClick={openCart}
            className="relative p-2.5 rounded-full bg-brand-charcoal text-brand-cream hover:bg-brand-terracotta transition-all cursor-pointer shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-terracotta text-brand-cream font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-cream">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Subbar */}
      <div className="flex md:hidden items-center justify-around border-t border-brand-tan/40 mt-2.5 pt-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
                isActive ? 'text-brand-terracotta' : 'text-brand-charcoal/60'
              }`}
            >
              <item.icon className="w-4.5 h-4.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
