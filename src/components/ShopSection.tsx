import React, { useState } from 'react';
import { Book, BookType, SkillLevel, CartItem } from '../types';
import { Filter, Star, BookOpen, Download, AlertTriangle, HelpCircle, Sparkles, Check, ShoppingBag, Trash2 } from 'lucide-react';

interface ShopProps {
  books: Book[];
  cart: CartItem[];
  addToCart: (book: Book, type: 'Hardcover' | 'eBook' | 'Workbook') => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  toggleBookplates: (index: number) => void;
  checkoutResult: any;
  checkoutLoading: boolean;
  processCheckout: (customerName: string, customerEmail: string) => void;
  selectedBookForPreview: Book | null;
  setSelectedBookForPreview: (book: Book | null) => void;
}

export default function ShopSection({
  books,
  cart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  toggleBookplates,
  checkoutResult,
  checkoutLoading,
  processCheckout,
  selectedBookForPreview,
  setSelectedBookForPreview
}: ShopProps) {
  
  // Custom Filter State
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  
  // Interactive Teacher Bulk Set Calculator Tool
  const [bulkBookId, setBulkBookId] = useState<string>(books[0]?.id || '');
  const [bulkQty, setBulkQty] = useState<number>(6); // Default to trigger discount
  const [bulkType, setBulkType] = useState<'Hardcover' | 'Workbook'>('Workbook');

  // Checkout modal form state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [formError, setFormError] = useState('');

  // Local UGX Price display mapping
  const getUGXPriceLabel = (bookId: string, type: 'Hardcover' | 'eBook' | 'Workbook') => {
    if (bookId === 'art-of-watercolor') {
      if (type === 'Hardcover') return 'UGX 25,000';
      if (type === 'eBook') return 'UGX 15,000';
      if (type === 'Workbook') return 'UGX 20,000';
    }
    if (bookId === 'composition-sketching') {
      if (type === 'Hardcover') return 'UGX 35,000';
      if (type === 'eBook') return 'UGX 18,000';
      if (type === 'Workbook') return 'UGX 25,000';
    }
    if (bookId === 'artful-classroom') {
      if (type === 'Hardcover') return 'UGX 25,005';
      if (type === 'eBook') return 'UGX 12,000';
      if (type === 'Workbook') return 'UGX 18,000';
    }
    return '';
  };

  // Filtering Logic
  const filteredBooks = books.filter(book => {
    const matchFormat = formatFilter === 'all' || 
                        (formatFilter === 'Hardcover' && book.type === 'Hardcover') ||
                        (formatFilter === 'Workbook' && book.type === 'Workbook') ||
                        (formatFilter === 'eBook'); // eBook price is mapped inside cards, so eBooks are always available
    
    const matchLevel = levelFilter === 'all' || book.level === levelFilter;
    return matchFormat && matchLevel;
  });

  // Calculate cart metrics (live feedback for class sets & bundles)
  const cartSubtotalBeforePromo = cart.reduce((sum, item) => {
    const baseP = item.purchaseType === 'eBook' ? item.book.ebookPrice : item.book.price;
    let cost = baseP * item.quantity;
    if (item.quantity > 5) {
      cost = cost * 0.8; // 20% class discount
    }
    if (item.addBookplates) {
      cost += 10;
    }
    return sum + cost;
  }, 0);

  // Determine if Promo Bundle is met on frontend (3 unique books in cart)
  const uniqueBookIds = Array.from(new Set(cart.map(it => it.book.id)));
  const isEligibleForBundle = uniqueBookIds.length >= 3;
  const bundleDiscountAmount = isEligibleForBundle ? cartSubtotalBeforePromo * 0.15 : 0;
  const finalCartTotal = cartSubtotalBeforePromo - bundleDiscountAmount;

  const handleStartCheckout = () => {
    if (cart.length === 0) return;
    setFormError('');
    setCheckoutModalOpen(true);
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      setFormError('Please complete all fields to secure digital files.');
      return;
    }
    // Simple email format check
    if (!customerEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    processCheckout(customerName, customerEmail);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 animate-fade-in space-y-12" id="shop-scroll-view">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-tan/50 pb-6 gap-6">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-terracotta font-bold">
            EDUCATIONAL DISTRIBUTOR
          </span>
          <h1 className="font-serif text-2.5xl sm:text-4xl md:text-5.5xl text-brand-charcoal font-semibold">
            The Studio Bookshop
          </h1>
          <p className="text-brand-charcoal/65 text-sm md:text-base max-w-xl">
            Acquire classroom workbooks, high-resolution eBooks, or comprehensive physical art instruction guidebooks.
          </p>
        </div>

        {/* Dynamic Bundle deal notification bar */}
        <div className="bg-brand-tan/30 border border-brand-sage/40 rounded-xl px-5 py-3 flex items-center gap-3 max-w-sm md:max-w-md">
          <div className="p-2 bg-brand-sage text-white rounded-full">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-xs font-semibold text-brand-charcoal">Triple Volume Bundle Offer</h4>
            <p className="text-[11px] text-brand-charcoal/70 mt-0.5">
              Acquire any <span className="font-bold text-brand-terracotta">3 unique books</span> to secure an automatic <span className="font-bold">15% discount</span> on your complete checkout total.
            </p>
          </div>
        </div>
      </div>


      {/* MAIN TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT PRODUCT RAIL (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* PRODUCT FILTERS BAR */}
          <div className="bg-brand-tan/20 border border-brand-tan/60 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-sage-dark" />
              <span className="font-sans text-xs font-semibold uppercase text-brand-charcoal/75">Narrow Results:</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Format Filter */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded border border-brand-tan/50 text-xs">
                <span className="text-brand-charcoal/50">Format:</span>
                <select 
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className="font-semibold text-brand-charcoal outline-none bg-transparent cursor-pointer"
                >
                  <option value="all">Any Edition</option>
                  <option value="Hardcover">Hardcover</option>
                  <option value="Workbook">Workbook</option>
                </select>
              </div>

              {/* Skill Level Filter */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded border border-brand-tan/50 text-xs">
                <span className="text-brand-charcoal/50">Level:</span>
                <select 
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="font-semibold text-brand-charcoal outline-none bg-transparent cursor-pointer"
                >
                  <option value="all">Any Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Indicator */}
            {(formatFilter !== 'all' || levelFilter !== 'all') && (
              <button 
                onClick={() => { setFormatFilter('all'); setLevelFilter('all'); }}
                className="font-mono text-[11px] text-brand-terracotta underline font-semibold hover:text-brand-terracotta-dark cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* CATALOG DISPLAY NODES */}
          {filteredBooks.length === 0 ? (
            <div className="bg-white rounded-xl border border-brand-tan/50 py-16 px-6 text-center">
              <AlertTriangle className="w-8 h-8 text-brand-terracotta mx-auto mb-3" />
              <p className="font-serif text-lg font-semibold text-brand-charcoal">No match found</p>
              <p className="text-xs text-brand-charcoal/60 mt-1 max-w-sm mx-auto">
                No publications match your filter selection. Try adjusting your Format or recommended Skill level selector.
              </p>
              <button
                onClick={() => { setFormatFilter('all'); setLevelFilter('all'); }}
                className="mt-4 px-4 py-2 bg-brand-charcoal text-white text-xs rounded hover:bg-brand-sage transition-all"
              >
                Show All Publications
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBooks.map((book) => {
                const isSelectedForPreview = selectedBookForPreview?.id === book.id;
                
                return (
                  <div 
                    key={book.id} 
                    id={`book-card-${book.id}`}
                    className="group bg-white border border-brand-tan p-6 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Visual Art Gallery Border book layout overlay */}
                    <div className="space-y-4">
                      <div className="relative bg-brand-cream border border-brand-tan/40 p-8 flex justify-center aspect-[5/6] overflow-hidden">
                        <img 
                          src={book.coverImage} 
                          alt={book.title}
                          referrerPolicy="no-referrer"
                          className="max-h-full object-contain rounded-none border border-brand-charcoal/5 transition-transform duration-500 group-hover:scale-102 shadow-md shadow-brand-charcoal/5"
                        />
                        <span className="absolute top-4 right-4 bg-[#fdfaf6] font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 border border-brand-tan text-[#7d8c7c] font-bold shadow-xs">
                          {book.level}
                        </span>
                      </div>

                      {/* Info block */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] bg-brand-sage/15 text-brand-sage-dark font-extrabold uppercase py-0.5 px-2">
                            {book.type}
                          </span>
                          <span className="font-mono text-[9px] text-brand-charcoal/50">
                            ISBN: {book.isbn}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl font-bold text-brand-charcoal leading-snug tracking-tight">
                          {book.title}
                        </h3>

                        <p className="text-brand-charcoal/70 text-[12px] leading-relaxed line-clamp-3">
                          {book.shortDescription}
                        </p>
                      </div>

                      {/* Rating details */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <div className="flex text-[#c46c4d]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="font-mono text-[9px] text-[#5f6d5e] uppercase font-bold mt-0.5">
                          {book.rating} / Verified Studio Reviews
                        </span>
                      </div>
                    </div>

                    {/* Button Operations footer */}
                    <div className="border-t border-brand-tan mt-5 pt-4 space-y-4">
                      
                      {/* Pricing display */}
                      <div className="flex items-center justify-between bg-brand-tan/10 p-2.5 rounded border border-brand-tan/30">
                        <div>
                          <p className="text-[9px] text-[#7d8c7c] uppercase font-mono tracking-widest font-bold">Printed A5 Copy</p>
                          <p className="font-sans text-xs md:text-[13px] font-bold text-brand-charcoal flex flex-col leading-tight pt-0.5">
                            <span>{getUGXPriceLabel(book.id, 'Hardcover') || `UGX ${(book.price * 3500).toLocaleString()}`}</span>
                            <span className="font-mono text-[9px] font-normal text-brand-charcoal/50">
                              (~${book.price.toFixed(2)} USD)
                            </span>
                          </p>
                          <span className="font-mono text-[8px] font-normal text-brand-charcoal/40 block mt-0.5">
                            {book.stock > 0 ? `${book.stock} in stock` : 'SOLD OUT'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-[#7d8c7c] uppercase font-mono tracking-widest font-bold">eBook Instant</p>
                          <p className="font-sans text-xs md:text-[13px] font-bold text-brand-sage-dark flex flex-col items-end leading-tight pt-0.5">
                            <span>{getUGXPriceLabel(book.id, 'eBook') || `UGX ${(book.ebookPrice * 3500).toLocaleString()}`}</span>
                            <span className="font-mono text-[9px] font-normal text-brand-charcoal/50">
                              (~${book.ebookPrice.toFixed(2)} USD)
                            </span>
                          </p>
                          <span className="font-mono text-[8.5px] font-bold text-emerald-600 block mt-0.5">
                            Immediate Delivery
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-stretch gap-2.5">
                        <div className="flex-1 dropdown relative">
                          <div className="flex bg-brand-charcoal text-brand-cream border border-brand-charcoal divide-x divide-white/10 select-none overflow-hidden text-[11px] font-semibold">
                            <button
                              onClick={() => addToCart(book, book.type)}
                              className="flex-grow py-2.5 text-center bg-brand-charcoal hover:bg-brand-terracotta hover:text-white transition-all cursor-pointer tracking-wider uppercase font-bold"
                              title={book.stock > 0 || book.type === 'eBook' ? 'Add defaults format to cart' : 'Out of Stock'}
                            >
                              Add {book.type}
                            </button>
                            
                            <select
                              onChange={(e) => {
                                const selectedFormat = e.target.value as 'Hardcover' | 'eBook' | 'Workbook';
                                addToCart(book, selectedFormat);
                              }}
                              className="bg-brand-charcoal text-brand-cream p-2 outline-none border-none text-[11px] font-bold cursor-pointer hover:bg-brand-terracotta"
                              defaultValue={book.type}
                            >
                              <option value="Hardcover">Hardcover</option>
                              <option value="Workbook">Workbook</option>
                              <option value="eBook">eBook Edition</option>
                            </select>
                          </div>
                        </div>

                        <button 
                          onClick={() => setSelectedBookForPreview(book)}
                          className={`px-3.5 border flex items-center justify-center transition-all cursor-pointer ${
                            isSelectedForPreview 
                              ? 'bg-[#7d8c7c] text-white border-[#7d8c7c]'
                              : 'border-brand-tan text-brand-charcoal hover:bg-brand-cream'
                          }`}
                          title="View touch-friendly look inside pages and chapter indexes"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}


          {/* TOUCH FRIENDLY PREVIEW LOOK INSIDE CAROUSEL */}
          {selectedBookForPreview && (
            <div className="bg-brand-tan/25 border border-brand-tan/50 p-6 md:p-8 rounded-2xl animate-fade-in space-y-6" id="preview-segment">
              <div className="flex items-center justify-between border-b border-brand-tan/55 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-terracotta" />
                  <h3 className="font-serif text-lg md:text-xl font-semibold text-brand-charcoal">
                    Look Inside: {selectedBookForPreview.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedBookForPreview(null)}
                  className="text-xs font-mono px-2.5 py-1 border border-brand-tan uppercase text-brand-charcoal hover:bg-brand-tan font-bold rounded"
                >
                  Close Preview
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Simulated chapter guidelines */}
                <div className="md:col-span-4 space-y-4">
                  <span className="font-mono text-[10px] bg-brand-sage/20 font-bold uppercase py-0.5 px-2 rounded text-brand-sage-dark">
                    Chapter Samples Available
                  </span>
                  <p className="text-xs text-brand-charcoal/80 leading-relaxed font-light">
                    Previewing high-resolution visual studies, lesson syllabus scaffolds, and standard outline guidelines from <b>Alan Ayesigamukama's</b> official educational library.
                  </p>
                  
                  <div className="pt-2">
                    <a 
                      href={selectedBookForPreview.downloadUrl}
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Digital companion manual template PDF downloaded mock keys: ${selectedBookForPreview.title}_preview_sampler.pdf`);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-brand-terracotta hover:text-brand-terracotta-dark font-semibold tracking-wide"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Syllabus Sampler (PDF)
                    </a>
                  </div>
                </div>

                {/* Touch friendly Look Inside Carousel Gallery */}
                <div className="md:col-span-8">
                  <p className="text-center md:text-left text-[11px] font-mono text-brand-charcoal/50 mb-2 uppercase tracking-wide">
                    Touch & swipe visual plate blueprints below
                  </p>
                  
                  <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                    {selectedBookForPreview.lookInside.map((img, i) => (
                      <div 
                        key={i} 
                        className="flex-none w-[200px] md:w-[260px] snap-center bg-white p-3 rounded-xl shadow-xs border border-brand-tan/40"
                      >
                        <div className="aspect-square rounded overflow-hidden relative shadow-inner bg-brand-cream flex items-center justify-center">
                          <img 
                            src={img} 
                            alt={`${selectedBookForPreview.title} Inside Page ${i + 1}`} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 right-2 bg-brand-charcoal/70 text-brand-cream text-[9px] font-mono px-2 py-0.5 rounded">
                            Plate {i + 1}
                          </span>
                        </div>
                        <p className="text-[10px] text-center italic text-brand-charcoal/60 mt-2">
                          {i === 0 ? 'Foundation Syllabus Grid' : i === 1 ? 'Pigment Layer Staging' : 'Core Composition Exercises'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* INTERACTIVE CLASS BULK DISCOUNT ESTIMATOR TOOL */}
          <div className="bg-brand-tan/10 rounded-2xl border border-brand-tan p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-sage" />
              <h3 className="font-serif text-lg md:text-xl font-semibold text-brand-charcoal">
                Class Set & Bulk Budget Estimator
              </h3>
            </div>
            <p className="text-xs text-brand-charcoal/70 max-w-2xl leading-relaxed mb-6">
              Educators can calculate discounts instantly below! If buying <span className="font-bold text-brand-terracotta">6 or more copies</span> of any textbook, secure an automatic <span className="font-bold text-brand-sage-dark">20% class set discount</span>, other school licenses apply, and secure signed bookplates for students!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mb-6">
              {/* Select Book */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wide text-brand-charcoal/50">Choose Title</label>
                <select 
                  value={bulkBookId} 
                  onChange={(e) => setBulkBookId(e.target.value)}
                  className="w-full bg-white p-2.5 rounded border border-brand-tan text-xs font-semibold outline-none"
                >
                  {books.map(b => (
                    <option key={b.id} value={b.id}>{b.title.split(':')[0]}</option>
                  ))}
                </select>
              </div>

              {/* Select Format */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wide text-brand-charcoal/50">Edition Format</label>
                <select 
                  value={bulkType} 
                  onChange={(e) => setBulkType(e.target.value as any)}
                  className="w-full bg-white p-2.5 rounded border border-brand-tan text-xs font-semibold outline-none"
                >
                  <option value="Workbook">Workbook Edition</option>
                  <option value="Hardcover">Hardcover Edition</option>
                </select>
              </div>

              {/* Enter Quntity */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wide text-brand-charcoal/50">Enter Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={bulkQty}
                  onChange={(e) => setBulkQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white p-2 text-xs font-semibold rounded border border-brand-tan text-center outline-none"
                />
              </div>
            </div>

            {/* Live calculation feedback block */}
            {(() => {
              const selectedB = books.find(b => b.id === bulkBookId) || books[0];
              const unitP = bulkType === 'Hardcover' ? selectedB.price : selectedB.price - 5; // Sim workbook offset
              const normalTot = unitP * bulkQty;
              const hasDiscount = bulkQty >= 6;
              const actualTot = hasDiscount ? normalTot * 0.8 : normalTot;
              const savedAmount = normalTot - actualTot;

              return (
                <div className="bg-brand-cream/80 border border-brand-tan rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="font-sans text-xs font-medium text-brand-charcoal/70">
                      Estimating {bulkQty}x physical {bulkType} copies
                    </p>
                    <p className="font-mono text-xs text-brand-charcoal/55 mt-0.5">
                      {hasDiscount ? (
                        <>
                          Unit: <span className="line-through">${unitP}</span> <span className="text-brand-terracotta font-bold">${(unitP * 0.8).toFixed(2)}</span> (<b>20% Off Set applied</b>)
                        </>
                      ) : (
                        `Unit: $${unitP} (Select 6+ copies to trigger 20% discount!)`
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-center sm:text-right">
                    {hasDiscount && (
                      <div className="text-xs">
                        <p className="text-brand-sage-dark font-bold">Saved ${savedAmount.toFixed(2)}</p>
                        <p className="text-[10px] text-brand-charcoal/40 font-mono">Teacher Discount</p>
                      </div>
                    )}
                    <div>
                      <p className="font-sans text-xl font-bold text-brand-charcoal">${actualTot.toFixed(2)}</p>
                      <button 
                        onClick={() => {
                          // Add bulk sets
                          for (let i = 0; i < bulkQty; i++) {
                            addToCart(selectedB, bulkType);
                          }
                          alert(`Added ${bulkQty} copies of ${selectedB.title} (${bulkType}) sets to your shopping cart!`);
                        }}
                        className="text-[10px] text-brand-terracotta font-bold tracking-wider uppercase underline hover:text-brand-terracotta-dark"
                      >
                        Push Set to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>


        {/* RIGHT CART COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-6" id="shopping-cart-view">
          
          <div className="bg-brand-charcoal text-brand-cream rounded-2xl border border-brand-charcoal p-6 shadow-lg space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-sage" />
                <h3 className="font-serif text-lg font-medium">Your Cart</h3>
              </div>
              <span className="font-mono text-[10px] bg-brand-sage/20 text-brand-sage font-bold px-2 py-0.5 rounded">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>

            {/* Cart list items */}
            {cart.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <ShoppingBag className="w-8 h-8 text-white/20 mx-auto" />
                <p className="text-xs text-brand-cream/60">Your cart is currently empty.</p>
                <button 
                  onClick={() => {
                    // Quick add bestseller workbook
                    addToCart(books[0], 'Workbook');
                  }}
                  className="text-[11px] text-brand-sage font-bold underline hover:text-brand-tan uppercase"
                >
                  Quick Add Best-Seller
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                {cart.map((item, index) => {
                  const basePrice = item.purchaseType === 'eBook' ? item.book.ebookPrice : item.book.price;
                  const itemDiscount = item.quantity > 5 ? 0.2 : 0;
                  const priceAfterDiscount = basePrice * (1 - itemDiscount);

                  return (
                    <div 
                      key={index}
                      className="text-xs bg-white/5 p-3 rounded-lg border border-white/5 space-y-2 relative"
                    >
                      {/* Delete item */}
                      <button 
                        onClick={() => removeFromCart(index)}
                        className="absolute top-2 right-2 text-white/30 hover:text-brand-terracotta transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div>
                        <h4 className="font-serif font-medium text-brand-cream pr-4 line-clamp-1">
                          {item.book.title.split(':')[0]}
                        </h4>
                        <p className="font-mono text-[10px] text-brand-cream/50 mt-0.5">
                          {item.purchaseType} Edition • Level: {item.book.level}
                        </p>
                      </div>

                      {/* Quantity & interactive plate select */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-brand-cream/50">Qty:</span>
                          <button 
                            onClick={() => updateCartQuantity(index, item.quantity - 1)}
                            className="bg-white/10 hover:bg-white/25 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            -
                          </button>
                          <span className="font-mono w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(index, item.quantity + 1)}
                            className="bg-white/10 hover:bg-white/25 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-mono text-brand-cream/95 font-semibold">
                            ${(priceAfterDiscount * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 5 && (
                            <p className="text-[9px] text-emerald-400 font-bold">
                              Includes 20% Class Discount!
                            </p>
                          )}
                        </div>
                      </div>

                      {/* If quantity > 5 copies of same book, show the signed bookplate prompt */}
                      {item.quantity >= 5 && (
                        <div className="mt-2.5 pt-2 border-t border-white/5 bg-white/5 rounded p-2 flex items-center justify-between">
                          <div>
                            <p className="font-sans text-[10px] font-bold text-white/90">Add Personalized Creator Signed Bookplates?</p>
                            <p className="text-[9px] text-white/50 leading-none">Ships stickers for student book interiors (+$10)</p>
                          </div>
                          <button
                            onClick={() => toggleBookplates(index)}
                            className={`p-1 rounded cursor-pointer ${
                              item.addBookplates ? 'bg-brand-sage text-white' : 'bg-white/10 text-white/40'
                            }`}
                          >
                            <Check className="w-3 h-3 font-extrabold" />
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

            {/* Subtotal blocks */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                
                {/* 3-Book Bundle Promotion status */}
                {isEligibleForBundle ? (
                  <div className="bg-brand-sage/10 text-brand-sage border border-brand-sage/20 rounded p-2.5 flex items-center justify-between text-[11px]">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 inline" /> 15% Bundle Discount Applied!
                    </span>
                    <span className="font-mono">-${bundleDiscountAmount.toFixed(2)}</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-brand-cream/50 italic leading-snug">
                    Tip: Add 3+ unique textbooks to your cart to instantly secure a 15% custom bundle discount!
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-brand-cream/60">Cart Subtotal</span>
                  <span className="font-mono text-brand-cream/80">${cartSubtotalBeforePromo.toFixed(2)}</span>
                </div>

                {isEligibleForBundle && (
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400">Bundle Discount</span>
                    <span className="font-mono text-emerald-400">-${bundleDiscountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-white/13 mt-2 pt-3">
                  <span className="font-serif text-sm font-medium">Grand Total</span>
                  <span className="font-mono text-base font-bold text-brand-cream">${finalCartTotal.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleStartCheckout}
                  className="w-full mt-4 py-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>


      {/* SECURE CHECKOUT / AI INVENTORY DECIDER MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 border border-brand-tan relative shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-brand-tan/50 pb-3">
              <h3 className="font-serif text-lg md:text-xl font-bold text-brand-charcoal">
                Secure SSL Studio Checkout
              </h3>
              <button 
                onClick={() => {
                  setCheckoutModalOpen(false);
                  setFormError('');
                }}
                className="font-mono text-xs uppercase text-brand-charcoal/60 hover:text-brand-charcoal"
              >
                Cancel
              </button>
            </div>

            {/* Standard feedback box */}
            {!checkoutResult ? (
              <form onSubmit={handleCompleteCheckout} className="space-y-4">
                <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                  Provide your educational email details below to complete your checkout and instantly download your materials securely.
                </p>

                {formError && (
                  <div className="bg-brand-terracotta/10 border border-brand-terracotta/20 text-brand-terracotta text-xs p-3 rounded">
                    {formError}
                  </div>
                ) /* error */}

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wide text-brand-charcoal/50">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Alan Ayesigamukama"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-brand-cream p-2.5 rounded border border-brand-tan text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wide text-brand-charcoal/50">Your Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. teacher@school.edu"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-brand-cream p-2.5 rounded border border-brand-tan text-xs outline-none"
                  />
                  <p className="text-[10px] text-brand-charcoal/40 leading-none">Instant digital file downloads are dispatched to this address.</p>
                </div>

                <div className="bg-brand-tan/20 p-3 rounded border border-brand-tan text-xs space-y-2">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-brand-sage-dark font-extrabold">Fulfillment Order Specs:</h4>
                  <ul className="space-y-1 text-brand-charcoal/80 font-light">
                    {cart.map((item, id) => (
                      <li key={id}>• {item.quantity}x {item.book.title.split(':')[0]} ({item.purchaseType} Edition)</li>
                    ))}
                  </ul>
                  <div className="border-t border-brand-tan/40 pt-2 flex justify-between font-bold">
                    <span>Due Now (incl. Bundle discounts):</span>
                    <span className="font-mono text-brand-terracotta">${finalCartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="w-full py-3 bg-brand-charcoal text-brand-cream hover:bg-brand-terracotta transition-colors rounded text-xs uppercase tracking-wider font-semibold shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {checkoutLoading ? 'Encrypting Connection...' : `Pay & Settle $${finalCartTotal.toFixed(2)}`}
                </button>
              </form>
            ) : (
              // Result display
              <div className="space-y-4">
                {checkoutResult.success ? (
                  // Success layout (Immediate PDF access + Outbox simulator visual link)
                  <div className="space-y-4 animate-fade-in text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    
                    <h4 className="font-serif text-xl font-bold text-brand-charcoal">Fulfillment Confirmed!</h4>
                    <p className="text-xs text-brand-charcoal/80 leading-relaxed max-w-sm mx-auto">
                      Congratulations <b>{customerName}</b>! Your transaction has cleared. Digital downloads and receipt tokens are dispatched to <b>{customerEmail}</b> successfully!
                    </p>

                    <div className="bg-brand-tan/30 border border-brand-tan rounded-lg p-4 text-left space-y-3">
                      <h5 className="font-mono text-[9px] uppercase tracking-wider text-brand-sage-dark font-extrabold">Instant Ebook Downloads:</h5>
                      {checkoutResult.downloads && checkoutResult.downloads.length > 0 ? (
                        <div className="space-y-2">
                          {checkoutResult.downloads.map((dl: any, i: number) => (
                            <a 
                              key={i}
                              href={dl.downloadUrl}
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`Simulated starting high-speed stream of eBook PDF: ${dl.bookTitle}.pdf`);
                              }}
                              className="flex items-center justify-between p-2 bg-white rounded border border-brand-tan hover:border-brand-terracotta transition-all text-xs"
                            >
                              <span className="font-serif text-brand-charcoal line-clamp-1">{dl.bookTitle}</span>
                              <span className="text-brand-terracotta font-mono text-[10px] flex items-center gap-1">
                                <Download className="w-3.5 h-3.5" /> Download
                              </span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-brand-charcoal/60 italic">Your order consists strictly of print hardcovers, entering shipping routing.</p>
                      )}
                    </div>

                    <p className="text-[10px] text-brand-charcoal/50 max-w-xs mx-auto">
                      Tip: Navigate to the <b className="text-brand-sage-dark">"Studio Office"</b> tab in the menu bar to review outgoing digital envelopes sent to {customerEmail}!
                    </p>

                    <button
                      onClick={() => {
                        setCheckoutModalOpen(false);
                        setSelectedBookForPreview(null);
                        // Reload stock through callback
                      }}
                      className="w-full mt-4 py-3 bg-brand-charcoal text-white rounded text-xs uppercase tracking-wider font-semibold"
                    >
                      Return to Studio Bookshop
                    </button>
                  </div>
                ) : (
                  // Out of Stock Rejection (Gemini personalized email simulator!)
                  <div className="space-y-4 animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-brand-terracotta">
                      <AlertTriangle className="w-6 h-6 stroke-[2]" />
                    </div>

                    <h4 className="font-serif text-lg font-bold text-center text-brand-charcoal">AI Inventory Rejection Response</h4>
                    
                    <p className="text-xs text-brand-charcoal/65 text-center px-4 leading-relaxed">
                      Our interactive inventory router determined matching out-of-stock elements. Checkout declined strictly to maintain pristine student license catalogs.
                    </p>

                    {/* Gemini Response Container */}
                    <div className="bg-brand-tan/20 border border-brand-tan rounded-lg p-5 font-sans text-xs text-brand-charcoal/85 leading-relaxed relative whitespace-pre-wrap">
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-brand-terracotta/20 rounded font-mono text-[9px] font-bold text-brand-terracotta">
                        <Sparkles className="w-3 h-3 animate-pulse" /> Gemini AI Apology
                      </div>
                      
                      {checkoutResult.message}
                    </div>

                    <button
                      onClick={() => {
                        setCheckoutModalOpen(false);
                      }}
                      className="w-full py-2.5 bg-brand-charcoal hover:bg-brand-sage text-white rounded text-xs transition-all cursor-pointer font-bold"
                    >
                      Adjust Cart Options
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
