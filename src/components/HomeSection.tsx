import { ArrowRight, BookOpen, Star, Sparkles, Quote } from 'lucide-react';
import { Book, Artwork, Testimonial } from '../types';

interface HomeProps {
  books: Book[];
  artworks: Artwork[];
  testimonials: Testimonial[];
  setCurrentTab: (tab: string) => void;
  setSelectedBookForPreview: (book: Book | null) => void;
  addToCart: (book: Book, type: 'Hardcover' | 'eBook' | 'Workbook') => void;
}

export default function HomeSection({
  books,
  artworks,
  testimonials,
  setCurrentTab,
  setSelectedBookForPreview,
  addToCart
}: HomeProps) {
  
  // Best-seller is watercolor book
  const bestSeller = books.find(b => b.id === 'art-of-watercolor') || books[0];

  const handlePreview = (book: Book) => {
    setSelectedBookForPreview(book);
    setCurrentTab('shop');
    // Scroll smoothly to shop preview segment
    setTimeout(() => {
      document.getElementById('shop-scroll-view')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="space-y-20 pb-20 animate-fade-in" id="home-view">
      
      {/* 1. HERO SECTION WITH LOOPING VIDEO */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-brand-charcoal" id="hero-section">
        {/* HTML5 Looping Art Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover opacity-50 select-none scale-102"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-artist-painting-with-watercolor-on-a-sketchbook-43187-large.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>

        {/* Dynamic Soft Acrylic Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent" />
        <div className="absolute inset-0 bg-brand-charcoal/20" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl h-full px-6 flex flex-col justify-center items-center text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 bg-brand-sage/25 backdrop-blur-md px-4 py-1.5 border border-brand-sage/30">
            <Sparkles className="w-4 h-4 text-[#e5e0d8]" />
            <span className="font-mono text-[10px] tracking-widest text-[#e5e0d8] uppercase font-bold">Alan Art Vision</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl italic font-bold tracking-tight leading-tight max-w-4xl" id="hero-headline">
            Teach. Create. Collaborate.
          </h1>

          <p className="font-sans text-sm md:text-base text-brand-cream/90 max-w-2xl leading-relaxed tracking-wide font-light">
            Empowering classroom educators and independent fine artists through structured textbook curricula, hands-on watercolor guides, and striking botanical masterpieces.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              id="hero-shop-cta"
              onClick={() => setCurrentTab('shop')}
              className="px-8 py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg outline-none"
            >
              Explore Educational Books
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="hero-portfolio-cta"
              onClick={() => setCurrentTab('portfolio')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-[#e5e0d8]/30 text-white font-bold tracking-widest uppercase transition-colors text-xs cursor-pointer outline-none"
            >
              View Fine Art Canvas
            </button>
          </div>
        </div>
      </section>


      {/* 2. FEATURED BEST-SELLING BOOK */}
      {bestSeller && (
        <section className="max-w-7xl mx-auto px-6 md:px-8" id="featured-book-section">
          <div className="text-center space-y-2.5 mb-12">
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-brand-terracotta">
              THE BEST-SELLER TEXTBOOK
            </span>
            <h2 className="font-serif text-3xl md:text-4.5xl text-brand-charcoal font-semibold">
              Curriculum Highlight
            </h2>
            <div className="w-16 h-1 bg-brand-sage mx-auto rounded-full" />
          </div>

          <div className="bg-[#fdfaf6] border border-brand-tan p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center shadow-xl">
            
            {/* Textbook art-house margins book cover display with Immersive UI shadow styling */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                className="group relative bg-white p-6 border border-brand-tan max-w-[290px] md:max-w-[340px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                onClick={() => handlePreview(bestSeller)}
                title="Click to Preview Book"
              >
                <div className="aspect-[3/4] overflow-hidden bg-brand-cream border border-brand-tan/40">
                  <img
                    src={bestSeller.coverImage}
                    alt={bestSeller.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                </div>
                <div className="absolute top-8 right-8 bg-[#c46c4d] text-white text-[9px] font-mono tracking-widest font-bold uppercase px-3 py-1 shadow-sm">
                  Top Seller
                </div>
                {/* Accent studio footer layout */}
                <p className="text-center font-serif text-[11px] italic text-[#7d8c7c] mt-4 tracking-wide">
                  2026 Print Edition • Includes Worksheet Manual
                </p>
              </div>
            </div>

            {/* Book Details and checkout triggers with clear typographic line heights */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-brand-sage/10 px-3 py-1 border border-brand-sage/20 text-[#7d8c7c]">
                <span className="font-mono text-[10px] tracking-widest font-bold uppercase">Classroom Verified (4.9 rating)</span>
              </div>

              <h3 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal leading-tight">
                {bestSeller.title}
              </h3>

              <p className="text-brand-charcoal/80 text-sm md:text-base leading-relaxed font-light">
                {bestSeller.description}
              </p>

              {/* Quick Spec Metrics tags - sharp-cornered grid cells */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                <div className="bg-[#fdfaf6] p-4 border border-brand-tan text-center">
                  <p className="text-[9px] text-[#7d8c7c] uppercase font-mono tracking-widest font-bold">Skill Level</p>
                  <p className="font-serif text-sm italic font-bold text-brand-charcoal mt-1">{bestSeller.level}</p>
                </div>
                <div className="bg-[#fdfaf6] p-4 border border-brand-tan text-center">
                  <p className="text-[9px] text-[#7d8c7c] uppercase font-mono tracking-widest font-bold">Format</p>
                  <p className="font-serif text-sm italic font-bold text-brand-charcoal mt-1">{bestSeller.type}</p>
                </div>
                <div className="bg-[#fdfaf6] p-4 border border-brand-tan text-center">
                  <p className="text-[9px] text-[#7d8c7c] uppercase font-mono tracking-widest font-bold">Pages</p>
                  <p className="font-serif text-sm italic font-bold text-brand-charcoal mt-1">{bestSeller.pages} pp.</p>
                </div>
                <div className="bg-[#fdfaf6] p-4 border border-brand-tan text-center">
                  <p className="text-[9px] text-[#7d8c7c] uppercase font-mono tracking-widest font-bold">Inventory</p>
                  <p className="font-serif text-sm italic font-bold text-[#c46c4d] mt-1">
                    {bestSeller.stock > 0 ? `In Stock` : 'Backordered'}
                  </p>
                </div>
              </div>

              {/* Buying Options and Actions - Sharp clean outlines */}
              <div className="pt-4 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="flex-1 flex max-sm:flex-col gap-2 bg-[#fdfaf6] p-2 border border-brand-tan">
                  <button
                    onClick={() => {
                      addToCart(bestSeller, 'Workbook');
                    }}
                    className="flex-1 px-4 py-3 bg-brand-charcoal text-white text-[11px] font-bold tracking-widest uppercase hover:bg-brand-terracotta transition-colors cursor-pointer"
                  >
                    Workbook • ${bestSeller.price}
                  </button>
                  <button
                    onClick={() => {
                      addToCart(bestSeller, 'eBook');
                    }}
                    className="flex-1 px-4 py-3 bg-brand-cream text-brand-charcoal border border-brand-tan text-[11px] font-bold tracking-widest uppercase hover:bg-brand-charcoal hover:text-white transition-colors cursor-pointer"
                  >
                    eBook • ${bestSeller.ebookPrice}
                  </button>
                </div>

                <button
                  onClick={() => handlePreview(bestSeller)}
                  className="px-6 py-4.5 border border-brand-charcoal text-brand-charcoal tracking-widest text-[11px] uppercase font-bold hover:bg-brand-charcoal hover:text-white transition-colors cursor-pointer"
                >
                  Look Inside Book
                </button>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* 3. MINI-GALLERY (3 ARTWORK PIECES) */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 bg-[#fdfaf6] border border-brand-tan py-16" id="mini-gallery-section">
        <div className="text-center space-y-3 mb-14">
          <span className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#7d8c7c]">
            Fine Art Portfolio
          </span>
          <h2 className="font-serif text-3xl md:text-5xl italic font-bold text-brand-charcoal">
            Selected Works
          </h2>
          <p className="text-brand-charcoal/70 text-xs md:text-sm max-w-xl mx-auto tracking-wide font-light">
            Each composition is drafted meticulously on heavyweight archival cotton rag, building on classic watercolor washes and rich landscape textures.
          </p>
          <div className="w-12 h-[1px] bg-brand-terracotta mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artworks.slice(0, 3).map((art) => (
            <div 
              key={art.id}
              className="bg-white border border-brand-tan p-5 flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              onClick={() => setCurrentTab('portfolio')}
            >
              {/* Artwork displays with high-contrast sharp drop shadow and white gallery border */}
              <div className="bg-brand-cream border border-brand-tan p-3 overflow-hidden relative shadow-inner aspect-square">
                <img
                  src={art.image}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-101"
                />
                
                {/* Status Overlay - clean badge format */}
                <span className="absolute top-6 left-6 font-mono text-[8px] tracking-widest font-bold uppercase px-3 py-1 bg-[#fdfaf6] text-brand-charcoal border border-brand-tan shadow-xs">
                  {art.status === 'available' ? 'Available' : 'Collected'}
                </span>
              </div>

              <div className="mt-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-charcoal tracking-tight group-hover:text-[#c46c4d] transition-colors">
                    {art.title}
                  </h3>
                  <p className="font-serif text-xs italic text-[#7d8c7c] mt-1">
                    {art.medium}
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-brand-tan mt-5 pt-3">
                  <span className="font-mono text-[10px] uppercase font-bold text-brand-charcoal/50 pr-2">{art.dimensions}</span>
                  <span className="font-serif text-sm font-bold italic text-[#c46c4d]">
                    {art.status === 'available' ? `$${art.price.toLocaleString()}` : 'Archived'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setCurrentTab('portfolio')}
            className="px-8 py-4 border border-brand-charcoal text-brand-charcoal text-[11px] tracking-widest font-bold uppercase hover:bg-brand-charcoal hover:text-white transition-all cursor-pointer rounded-none"
          >
            Explore Complete Portfolio Grid
          </button>
        </div>
      </section>


      {/* 4. BECOME A PARTNER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-6 md:px-8" id="home-partnership-cta">
        <div className="relative bg-brand-charcoal p-8 md:p-16 text-brand-cream border border-[#7d8c7c]/30 shadow-2xl">
          {/* Subtle painterly details */}
          <div className="absolute inset-0 bg-[#7d8c7c]/5 pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#c46c4d]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#7d8c7c] font-bold">
              Institutional Cooperation
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
              Bring Professional Curricula to Your Department
            </h2>
            <p className="text-brand-cream/80 text-xs md:text-sm leading-relaxed font-light tracking-wide">
              We collaborate closely with public school districts, art bureaus, and metropolitan galleries. Request licensed curriculum blueprints, bulk hardcover sets, or list a live studio workshop series.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                id="cta-licensing-btn"
                onClick={() => setCurrentTab('partnership')}
                className="px-6 py-4 bg-[#7d8c7c] hover:bg-[#5f6d5e] text-white text-[11px] tracking-widest font-bold uppercase transition-colors cursor-pointer"
              >
                Apply for School Licensing
              </button>
              <button
                id="cta-consultation-btn"
                onClick={() => setCurrentTab('partnership')}
                className="px-6 py-4 bg-white/10 hover:bg-white/15 border border-white/25 text-white text-[11px] tracking-widest font-bold uppercase transition-colors cursor-pointer"
              >
                Book Workshop Consultation
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* 5. SOCIAL PROOF & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 md:px-8" id="testimonials-section">
        <div className="text-center space-y-3 mb-14">
          <span className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#c46c4d]">
            Community Trust
          </span>
          <h2 className="font-serif text-3xl md:text-5xl italic font-bold text-brand-charcoal">
            Teacher Reviews
          </h2>
          <div className="w-12 h-[1px] bg-[#7d8c7c] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div 
              key={test.id} 
              className="bg-white border border-brand-tan p-8 flex flex-col justify-between relative shadow-sm"
            >
              <div className="space-y-4">
                {/* Visual quotes mark */}
                <div className="font-serif text-5xl text-brand-sage/20 h-4 leading-none select-none">“</div>
                <p className="text-brand-charcoal/85 text-xs md:text-sm italic font-light leading-relaxed">
                  {test.quote}
                </p>
                <div className="font-serif text-5xl text-brand-sage/20 h-4 leading-none select-none text-right">”</div>
              </div>

              <div className="border-t border-brand-tan mt-6 pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                    {test.name}
                  </h4>
                  <p className="font-mono text-[9px] text-[#5f6d5e] mt-1 uppercase font-bold tracking-widest">
                    {test.role} / <span className="font-extrabold">{test.institution}</span>
                  </p>
                </div>
                <div className="flex items-center text-[#c46c4d]">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
