import React, { useState } from 'react';
import { Artwork } from '../types';
import { Eye, HelpCircle, Lock, Sparkles, ArrowRight, CheckCircle, Send } from 'lucide-react';

interface PortfolioProps {
  artworks: Artwork[];
  setCurrentTab: (tab: string) => void;
  setContactInquirySubject: (subject: string) => void;
  refreshArtworkOrders?: () => void;
}

export default function PortfolioSection({
  artworks,
  setCurrentTab,
  setContactInquirySubject,
  refreshArtworkOrders
}: PortfolioProps) {
  
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);

  // Fine Art reservation order hooks
  const [isOrdering, setIsOrdering] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleInquire = (art: Artwork) => {
    // Pre-populate contact subject dropdown
    setContactInquirySubject(`Artwork Purchase: ${art.title} (${art.dimensions})`);
    setCurrentTab('about'); // Route to contact form
    // Scroll smoothly to contact form anchor
    setTimeout(() => {
      document.getElementById('contact-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleArtworkOrderSubmit = async (e: React.FormEvent, art: Artwork) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      setOrderError('Please populate both your Name and Email Address');
      return;
    }
    setIsSubmitting(true);
    setOrderError(null);

    try {
      const response = await fetch('/api/artwork-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId: art.id,
          artworkTitle: art.title,
          artworkPrice: art.price,
          customerName,
          customerEmail
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setOrderSuccess(result);
        if (refreshArtworkOrders) {
          refreshArtworkOrders();
        }
      } else {
        setOrderError(result.error || 'Failed to complete order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setOrderError('Could not contact the purchase processing server. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetOrderForm = () => {
    setIsOrdering(false);
    setCustomerName('');
    setCustomerEmail('');
    setOrderSuccess(null);
    setOrderError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 animate-fade-in space-y-12" id="portfolio-view">
      
      {/* SECTION HEADER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-sage-dark font-bold">
          STUDIO ARCHIVES
        </span>
        <h1 className="font-serif text-2.5xl sm:text-4xl md:text-5.5xl text-brand-charcoal font-semibold tracking-tight">
          Fine Art Canvas Grid
        </h1>
        <p className="text-sm text-brand-charcoal/70 leading-relaxed font-light">
          A careful look inside Alan Ayesigamukama’s original studio watercolor plates and textured impasto oils, reflecting standard traditional academic drawing principles and organic botanical aesthetics.
        </p>
        <div className="w-16 h-1 bg-brand-terracotta mx-auto rounded-full mt-4" />
      </div>


      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {artworks.map((art) => (
          <div 
            key={art.id}
            id={`artwork-card-${art.id}`}
            onClick={() => setSelectedArt(art)}
            className="group bg-white border border-brand-tan p-5 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            {/* The physical painting displays with wide white margins around book/artwork files to mimic a gallery layout */}
            <div className="bg-[#fdfaf6] p-4 border border-brand-tan/75 aspect-square overflow-hidden relative flex items-center justify-center">
              <img 
                src={art.image} 
                alt={art.title}
                referrerPolicy="no-referrer"
                className="max-h-full object-contain shadow-sm border border-brand-charcoal/5 transition-transform duration-500 group-hover:scale-102"
              />
              
              {/* Eye hover prompt */}
              <div className="absolute inset-0 bg-brand-charcoal/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-350">
                <span className="bg-[#fdfaf6] text-brand-charcoal font-bold text-[10px] tracking-widest uppercase py-2 px-4 flex items-center gap-1.5 shadow-md">
                  <Eye className="w-4 h-4 text-[#c46c4d]" /> View Specifications
                </span>
              </div>

              {/* Status flag */}
              <div className="absolute top-4 left-4">
                <span className="font-mono text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 bg-[#fdfaf6] border border-brand-tan text-brand-charcoal shadow-xs">
                  {art.status === 'available' ? 'Available' : 'Collected'}
                </span>
              </div>
            </div>

            {/* Typography info card */}
            <div className="mt-5 border-t border-brand-tan pt-4 flex items-end justify-between">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-brand-charcoal leading-tight tracking-tight group-hover:text-[#c46c4d] transition-colors">
                  {art.title}
                </h3>
                <p className="font-serif text-xs italic text-[#7d8c7c]">
                  {art.medium}
                </p>
                <p className="font-mono text-[9px] text-[#5f6d5e] font-bold uppercase tracking-wider">
                  {art.dimensions} • Created in {art.year}
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#7d8c7c] font-bold block mb-0.5">Status</span>
                <span className="font-serif text-xs font-bold text-brand-sage-dark bg-brand-sage/10 px-2 py-0.5 rounded">
                  {art.status === 'available' ? 'Available' : 'Collected'}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>


      {/* HIGH RESOLUTION LIGHTBOX MODAL */}
      {selectedArt && (
        <div 
          className="fixed inset-0 z-50 bg-brand-charcoal/90 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => { setSelectedArt(null); resetOrderForm(); }}
        >
          {/* Container clicks do not trigger close */}
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full p-6 md:p-10 border border-brand-tan relative shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button top right */}
            <button 
              onClick={() => { setSelectedArt(null); resetOrderForm(); }}
              className="absolute top-4 right-4 text-xs font-mono uppercase bg-brand-tan/50 hover:bg-brand-tan border border-brand-tan text-brand-charcoal/60 hover:text-brand-charcoal font-bold px-2.5 py-1 rounded cursor-pointer"
            >
              ✕ Close Gallery View
            </button>

            {/* Left large visual pane */}
            <div className="md:col-span-7 flex flex-col justify-center bg-brand-cream/65 rounded-xl border border-brand-tan/30 p-8 shadow-inner aspect-square md:aspect-auto md:h-[480px]">
              <img 
                src={selectedArt.image} 
                alt={selectedArt.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain shadow-lg border border-brand-charcoal/5 mx-auto"
              />
            </div>

            {/* Right meta data specifications pane */}
            <div className="md:col-span-5 flex flex-col justify-between py-2 space-y-6">
              
              {orderSuccess ? (
                /* SCREEN 1: ORDER CONFIRMED SUCCESS PANEL */
                <div className="space-y-6 animate-fade-in flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-250">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase">Art Order Confirmed</span>
                    </div>

                    <h2 className="font-serif text-2xl md:text-3.5xl font-semibold text-brand-charcoal leading-tight">
                      Reservation Recorded!
                    </h2>

                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs space-y-3 leading-relaxed text-emerald-950 font-light">
                      <p>
                        Thank you <b>{customerName}</b>! Your order for the original painting <b>"{selectedArt.title}"</b> has been registered inside our studio database.
                      </p>
                      <p>
                        A comprehensive verification order email has been dispatched to your mailbox: <b>{customerEmail}</b>. Check your digital logs to view response details!
                      </p>
                    </div>

                    <div className="bg-brand-tan/25 border border-brand-tan/60 p-4 rounded-xl text-xs space-y-2.5">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50 font-bold">Contact Artist Instantly</p>
                      <p className="text-brand-charcoal/80 leading-relaxed font-light">
                        To lock shipping arrangements, secure customs crating, or handle wire details, contact Alan Ayesigamukama immediately on WhatsApp or email:
                      </p>
                      <div className="flex flex-col gap-1.5 pt-1.5 font-sans">
                        <a 
                          href="https://wa.me/256700866521"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-green-600 inline-flex items-center gap-1 hover:underline text-[12px]"
                        >
                          💬 WhatsApp +256700866521
                        </a>
                        <a 
                          href="https://wa.me/256761188522"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-green-600 inline-flex items-center gap-1 hover:underline text-[12px]"
                        >
                          💬 WhatsApp +256761188522
                        </a>
                        <a 
                          href="mailto:alanayesigamukama@gmail.com"
                          className="font-medium text-brand-terracotta hover:text-brand-terracotta-dark hover:underline flex items-center gap-1 text-[11px]"
                        >
                          ✉️ email: alanayesigamukama@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedArt(null);
                      resetOrderForm();
                    }}
                    className="w-full py-3.5 bg-brand-charcoal text-white hover:bg-brand-sage transition-all rounded text-xs uppercase tracking-widest font-bold cursor-pointer"
                  >
                    Return to Gallery Grid
                  </button>
                </div>
              ) : isOrdering ? (
                /* SCREEN 2: RESERVATION / PURCHASE DRAFT FORM */
                <form onSubmit={(e) => handleArtworkOrderSubmit(e, selectedArt)} className="space-y-4 animate-fade-in flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 bg-brand-tan/40 px-3 py-1 rounded-full border border-brand-tan">
                      <Send className="w-3.5 h-3.5 text-brand-terracotta animate-pulse" />
                      <span className="font-mono text-[10px] font-bold text-brand-charcoal/70 uppercase">Acquisition Form</span>
                    </div>

                    <h2 className="font-serif text-xl md:text-2xl font-bold text-brand-charcoal leading-tight">
                      Order Original Artwork
                    </h2>

                    <p className="text-[11px] text-brand-charcoal/65 leading-relaxed font-light">
                      Reserve and inquire about original painting <b>"{selectedArt.title}"</b>. Entering details saves the canvas to the studio logs and alerts the artist instantly.
                    </p>

                    {orderError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-750 font-sans text-xs font-semibold rounded-lg">
                        ⚠️ {orderError}
                      </div>
                    )}

                    <div className="space-y-3 font-sans">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Your Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Dr. Arthur Pendelton"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-brand-cream p-3 border border-brand-tan text-xs outline-none rounded-none focus:border-brand-charcoal focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Your Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="e.g. buyer@gallery.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-brand-cream p-3 border border-brand-tan text-xs outline-none rounded-none focus:border-brand-charcoal focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-brand-terracotta text-white hover:bg-brand-terracotta-dark transition-all rounded text-xs uppercase tracking-widest font-bold shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
                    >
                      {isSubmitting ? 'Recording Order...' : 'Confirm & Place Order'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOrdering(false)}
                      className="w-full py-2.5 text-brand-charcoal/50 hover:text-brand-charcoal transition text-[11px] font-semibold tracking-wider uppercase bg-brand-cream border border-brand-tan duration-200"
                    >
                      ← Back to Details
                    </button>
                  </div>
                </form>
              ) : (
                /* SCREEN 3: SPECIFICATIONS VIEW (DEFAULT) */
                <div className="flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 bg-brand-tan/40 px-3 py-1 rounded-full border border-brand-tan">
                      <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
                      <span className="font-mono text-[10px] font-bold text-brand-charcoal/70 uppercase">Archival Studio Original</span>
                    </div>

                    <h2 className="font-serif text-2xl md:text-3.5xl font-semibold text-brand-charcoal leading-tight">
                      {selectedArt.title}
                    </h2>

                    {/* Vertical table listing */}
                    <div className="border-t border-brand-tan/50 pt-4 space-y-3 font-sans text-xs">
                      <div className="flex justify-between border-b border-brand-tan/30 pb-2">
                        <span className="text-brand-charcoal/50">Medium</span>
                        <span className="font-medium text-brand-charcoal text-right">{selectedArt.medium}</span>
                      </div>
                      <div className="flex justify-between border-b border-brand-tan/30 pb-2">
                        <span className="text-brand-charcoal/50 font-sans">Physical Dimensions</span>
                        <span className="font-mono text-brand-charcoal">{selectedArt.dimensions}</span>
                      </div>
                      <div className="flex justify-between border-b border-brand-tan/30 pb-2">
                        <span className="text-brand-charcoal/50">Year Drafted</span>
                        <span className="font-mono text-brand-charcoal">{selectedArt.year}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-brand-charcoal/50">Acquisition pricing</span>
                        <span className="font-mono text-xs font-bold text-brand-terracotta bg-brand-terracotta/5 px-2 py-0.5 rounded">
                          {selectedArt.status === 'available' ? 'Price Available Upon Request' : 'Sold (Collected)'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-light text-brand-charcoal/65 leading-relaxed bg-brand-tan/20 rounded-lg p-3">
                      {selectedArt.status === 'available' ? (
                        'This canvas is finished with acid-free protective watercolor varnish, framed in a minimalist custom natural oak gallery float frame. Secure, insured worldwide freight delivery is configured by default.'
                      ) : (
                        'This canvas has entered a private collector archive. High precision companion textbook prints are mapped in our Studio store.'
                      )}
                    </div>
                  </div>

                  {/* Order / Inquiry CTAs */}
                  <div className="space-y-2">
                    {selectedArt.status === 'available' ? (
                      <>
                        <button
                          onClick={() => setIsOrdering(true)}
                          className="w-full py-4 bg-brand-terracotta text-white hover:bg-brand-terracotta-dark transition-all rounded text-xs select-none uppercase tracking-widest font-bold shadow flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                        >
                          Secure Inquiry & Reserve Original
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleInquire(selectedArt)}
                          className="w-full py-2 bg-brand-cream border border-brand-tan text-brand-charcoal/60 hover:text-brand-charcoal font-sans text-[10.5px] uppercase tracking-wider font-bold tracking-widest cursor-pointer hover:bg-brand-tan"
                        >
                          ✉️ Inquiry Contact Form Instead
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-brand-tan/40 rounded-lg text-brand-charcoal/50 border border-brand-tan justify-center text-xs font-semibold">
                        <Lock className="w-4 h-4" />
                        <span>Collected Original Painting</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
