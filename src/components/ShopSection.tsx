import React, { useState } from 'react';
import { Book, CartItem } from '../types';
import { Filter, Star, BookOpen, Download, AlertTriangle, Sparkles, Check, Send, Mail, Phone } from 'lucide-react';

interface ShopProps {
  books: Book[];
  selectedBookForPreview: Book | null;
  setSelectedBookForPreview: (book: Book | null) => void;
}

export default function ShopSection({
  books,
  selectedBookForPreview,
  setSelectedBookForPreview
}: ShopProps) {
  
  // Filtering States
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  
  // Interactive Teacher Bulk Set Calculator States
  const [bulkBookId, setBulkBookId] = useState<string>(books[0]?.id || '');
  const [bulkQty, setBulkQty] = useState<number>(6); // Default to trigger bulk estimation
  const [bulkType, setBulkType] = useState<'Hardcover' | 'Workbook'>('Workbook');

  // Booking Modal States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [selectedBookForBooking, setSelectedBookForBooking] = useState<Book | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'Hardcover' | 'Workbook' | 'eBook'>('Hardcover');
  const [bookingQty, setBookingQty] = useState<number>(1);
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [formError, setFormError] = useState('');

  // Dynamically formatted prices inside UGX 
  const getUGXPriceLabel = (bookId: string, type: 'Hardcover' | 'eBook' | 'Workbook') => {
    const book = books.find(b => b.id === bookId);
    if (!book) return '';
    if (type === 'eBook') {
      return `UGX ${book.ebookPrice.toLocaleString()}`;
    }
    return `UGX ${book.price.toLocaleString()}`;
  };

  // Filtering Logic
  const filteredBooks = books.filter(book => {
    const matchFormat = formatFilter === 'all' || 
                        (formatFilter === 'Hardcover' && book.type === 'Hardcover') ||
                        (formatFilter === 'Workbook' && book.type === 'Workbook') ||
                        (formatFilter === 'eBook');
    const matchLevel = levelFilter === 'all' || book.level === levelFilter;
    return matchFormat && matchLevel;
  });

  // Handle opening booking modal for a specific book & format
  const handleStartBooking = (book: Book, format: 'Hardcover' | 'Workbook' | 'eBook', qty: number = 1) => {
    setSelectedBookForBooking(book);
    setSelectedFormat(format);
    setBookingQty(qty);
    setCustomerMessage('');
    setBookingResult(null);
    setFormError('');
    setBookingModalOpen(true);
  };

  // Submit direct booking through both Database saving & outbox logging
  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setFormError('Please fill in your name, email, and contact number.');
      return;
    }

    if (!selectedBookForBooking) return;

    setBookingLoading(true);
    setFormError('');

    try {
      const response = await fetch('/api/book-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBookForBooking.id,
          bookTitle: selectedBookForBooking.title,
          purchaseType: selectedFormat,
          quantity: bookingQty,
          customerName,
          customerEmail,
          customerPhone,
          message: customerMessage
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setBookingResult(data);
      } else {
        setFormError(data.error || 'Failed to register reservation. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setFormError('Connection error registering booking catalog. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Construct native prefilled mailto parameters
  const getPrefilledMailto = () => {
    if (!selectedBookForBooking) return '';
    const subject = encodeURIComponent(`Textbook Order Reservation: ${selectedBookForBooking.title}`);
    const body = encodeURIComponent(
      `Hello Alan Ayesigamukama,\n\n` +
      `I would like to place an order/booking for your pedagogical textbook: "${selectedBookForBooking.title}".\n\n` +
      `Inquiry Details:\n` +
      `- Student copies requested: ${bookingQty}\n` +
      `- Format Selection: ${selectedFormat} Edition\n` +
      `- Requestor Name: ${customerName}\n` +
      `- Primary Email: ${customerEmail}\n` +
      `- Call/WhatsApp Mobile: ${customerPhone}\n\n` +
      `Notes/School Delivery Coordinates:\n` +
      `"${customerMessage || 'None provided'}"\n\n` +
      `Please contact me directly to negotiate bulk pricing, safe classroom delivery coordinates, and mobile payments.\n\n` +
      `Warm regards,\n` +
      `${customerName}`
    );
    return `mailto:alanayesigamukama@gmail.com?subject=${subject}&body=${body}`;
  };

  // Construct native prefilled wa.me parameters
  const getPrefilledWhatsApp = () => {
    if (!selectedBookForBooking) return '';
    const text = encodeURIComponent(
      `Hello Mr. Alan Ayesigamukama, this is ${customerName}. ` +
      `I have submitted an Art Studio booking coordinate for your textbook "${selectedBookForBooking.title}" (${selectedFormat} Edition, ${bookingQty} copies). ` +
      `Let me know when we can arrange delivery! Email: ${customerEmail}, Phone: ${customerPhone}.`
    );
    return `https://wa.me/256700866521?text=${text}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 animate-fade-in space-y-12" id="shop-scroll-view">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-tan/50 pb-6 gap-6">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-terracotta font-bold">
            EDUCATIONAL HANDBOOKS
          </span>
          <h1 className="font-serif text-2.5xl sm:text-4xl md:text-5.5xl text-brand-charcoal font-semibold">
            Studio Curriculum Bookshop
          </h1>
          <p className="text-brand-charcoal/65 text-sm md:text-base max-w-xl">
            Acquire class sets, student revisions workbooks, or high-resolution eBooks. Direct inquiries with local school delivery support.
          </p>
        </div>

        {/* Dynamic Booking Guide Notification Bar */}
        <div className="bg-brand-tan/15 border border-brand-tan/40 rounded-xl px-5 py-3 flex items-center gap-3 max-w-sm md:max-w-md">
          <div className="p-2 bg-[#7d8c7c]/10 text-[#7d8c7c] rounded-full">
            <Sparkles className="w-4 h-4 text-brand-sage" />
          </div>
          <div>
            <h4 className="font-serif text-xs font-semibold text-brand-charcoal">Competency Revised Guides</h4>
            <p className="text-[11px] text-brand-charcoal/70 mt-0.5">
              Submit your school request below. Alan will communicate within 24 hours via Call/WhatsApp to complete your delivery order safely. No credit cards required!
            </p>
          </div>
        </div>
      </div>

      {/* FILTER CONTROL PANEL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-brand-tan/10 border border-brand-tan/40 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-sage" />
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-charcoal">Filter Books</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Format selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono text-brand-charcoal/50">Format:</span>
            <select 
              value={formatFilter} 
              onChange={(e) => setFormatFilter(e.target.value)}
              className="bg-white border border-brand-tan text-xs font-semibold px-2.5 py-1.5 rounded outline-none"
            >
              <option value="all">All Formats</option>
              <option value="Hardcover">Printed Hardcover</option>
              <option value="Workbook">Revision Workbook</option>
              <option value="eBook">Digital eBooks</option>
            </select>
          </div>

          {/* Curriculum Level selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono text-brand-charcoal/50">Level:</span>
            <select 
              value={levelFilter} 
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-white border border-brand-tan text-xs font-semibold px-2.5 py-1.5 rounded outline-none"
            >
              <option value="all">All Levels</option>
              <option value="O-Level">O-Level Only</option>
              <option value="A-Level">A-Level Only</option>
              <option value="O & A Level">Both Levels</option>
            </select>
          </div>
        </div>
      </div>

      {/* TEXTBOOK LIST SECTIONS */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-brand-tan rounded-xl">
          <AlertTriangle className="w-10 h-10 text-brand-terracotta mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-brand-charcoal">No Textbooks Match Criteria</h3>
          <p className="text-xs text-brand-charcoal/60 mt-1">Adjust filters to inspect textbook editions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => {
            const isSelectedForPreview = selectedBookForPreview?.id === book.id;
            
            return (
              <div 
                key={book.id} 
                id={`book-card-${book.id}`}
                className="group bg-white border border-brand-tan p-6 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-xl"
              >
                <div className="space-y-4">
                  <div className="relative bg-[#faf7f2] border border-brand-tan/40 p-6 flex justify-center aspect-[5/6] overflow-hidden rounded-lg">
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="max-h-full object-contain rounded-none border border-brand-charcoal/5 transition-transform duration-500 group-hover:scale-102 shadow-md shadow-brand-charcoal/5"
                    />
                    <span className="absolute top-4 right-4 bg-[#fdfaf6] font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 border border-brand-tan text-brand-sage-dark font-bold shadow-xs">
                      {book.level}
                    </span>
                  </div>

                  {/* Textbook description and outline details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] bg-brand-sage/12 text-brand-sage-dark font-extrabold uppercase py-0.5 px-2 rounded">
                        {book.type}
                      </span>
                      <span className="font-mono text-[9px] text-brand-charcoal/50">
                        ISBN: {book.isbn} • {book.pages} pages
                      </span>
                    </div>

                    <h3 className="font-serif text-lg md:text-xl font-bold text-brand-charcoal leading-snug tracking-tight">
                      {book.title}
                    </h3>

                    <p className="text-brand-charcoal/70 text-[11px] md:text-xs leading-relaxed line-clamp-3">
                      {book.shortDescription}
                    </p>
                  </div>

                  {/* Rating parameters */}
                  <div className="flex items-center gap-1">
                    <div className="flex text-[#c46c4d]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="font-mono text-[8px] text-[#5f6d5e] uppercase font-bold">
                      {book.rating} / {book.reviewsCount} School Reviews
                    </span>
                  </div>
                </div>

                {/* Direct Action triggers */}
                <div className="border-t border-brand-tan mt-5 pt-4 space-y-4">
                  
                  {/* Prices display */}
                  <div className="flex items-center justify-between bg-[#fdfaf6] p-3 rounded border border-brand-tan/30">
                    <div>
                      <p className="text-[9px] text-[#5f6d5e] uppercase font-mono tracking-wider font-bold">Printed A5 Copy</p>
                      <p className="font-sans text-xs sm:text-sm font-bold text-brand-charcoal leading-tight pt-0.5">
                        {getUGXPriceLabel(book.id, 'Hardcover')}
                      </p>
                      <span className="font-mono text-[8.5px] font-semibold text-brand-charcoal/50 block mt-1">
                        {book.stock > 0 ? `${book.stock} left in print` : 'Restocking (eBook available!)'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-[#5f6d5e] uppercase font-mono tracking-wider font-bold">eBook Guide</p>
                      <p className="font-sans text-xs sm:text-sm font-bold text-brand-sage-dark leading-tight pt-0.5">
                        {getUGXPriceLabel(book.id, 'eBook')}
                      </p>
                      <span className="font-mono text-[8.5px] font-bold text-emerald-600 block mt-1">
                        Immediate Delivery
                      </span>
                    </div>
                  </div>

                  {/* Dual Action buttons (Book Book or Lookup inside) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStartBooking(book, 'Hardcover')}
                      className="w-full py-2.5 text-center bg-brand-charcoal text-brand-cream hover:bg-brand-terracotta border border-brand-charcoal font-bold rounded text-[11px] uppercase tracking-wider cursor-pointer font-sans transition-all"
                    >
                      Book / Buy Copy
                    </button>

                    <button 
                      onClick={() => setSelectedBookForPreview(book)}
                      className={`py-2.5 border flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold uppercase rounded cursor-pointer ${
                        isSelectedForPreview 
                          ? 'bg-[#7d8c7c] text-white border-[#7d8c7c]'
                          : 'border-brand-tan text-brand-charcoal hover:bg-brand-cream/40'
                      }`}
                      title="Inspect syllabus sample outline look inside visual guide"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Book Preview
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CAROUSEL DRAWER PREVIEW BLUEPRINT LOOK INSIDE */}
      {selectedBookForPreview && (
        <div className="bg-brand-tan/15 border border-brand-tan/50 p-6 md:p-8 rounded-2xl animate-fade-in space-y-6" id="preview-segment">
          <div className="flex items-center justify-between border-b border-brand-tan pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-terracotta" />
              <h3 className="font-serif text-lg md:text-xl font-semibold text-brand-charcoal">
                Syllabus Pages: {selectedBookForPreview.title}
              </h3>
            </div>
            <button 
              onClick={() => setSelectedBookForPreview(null)}
              className="text-[10px] font-mono px-3 py-1.5 border border-brand-tan uppercase text-brand-charcoal hover:bg-brand-tan font-bold rounded"
            >
              Close Live Look
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 space-y-4">
              <span className="font-mono text-[9px] bg-brand-sage/20 font-bold uppercase py-1 px-2.5 rounded text-[#5f6d5e]">
                Sample Chapters Available
              </span>
              <p className="text-xs text-brand-charcoal/80 leading-relaxed font-light">
                Inspecting structural assessments, organic pigment formulas, and East African textbook lesson revisions. Sized in highly portable, school-friendly <b>A5 format containing {selectedBookForPreview.pages} pages</b>.
              </p>
              
              <div className="pt-2">
                <a 
                  href={selectedBookForPreview.downloadUrl}
                  download
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Starting download simulation: ${selectedBookForPreview.title.split(':')[0]}_curriculum_sampler.pdf`);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-terracotta hover:text-brand-terracotta-dark font-semibold tracking-wide"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save Syllabus Primer (PDF)
                </a>
              </div>
            </div>

            <div className="md:col-span-8">
              <p className="text-[10px] font-mono text-brand-charcoal/50 mb-2 uppercase tracking-wide">
                Touch or drag visual sample sheets below (A5 Curriculum Layout)
              </p>
              
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {selectedBookForPreview.lookInside.map((img, i) => (
                  <div 
                    key={i} 
                    className="flex-none w-[180px] md:w-[240px] snap-center bg-white p-3 rounded-lg border border-brand-tan/40"
                  >
                    <div className="aspect-square rounded overflow-hidden relative shadow-inner bg-brand-cream/50 flex items-center justify-center">
                      <img 
                        src={img} 
                        alt={`${selectedBookForPreview.title} plate ${i + 1}`} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-brand-charcoal/70 text-brand-cream text-[9px] font-mono px-2 py-0.5 rounded">
                        Page {i === 0 ? 'Foundation' : i === 1 ? 'Pigment' : 'Review'}
                      </span>
                    </div>
                    <p className="text-[10px] text-center italic text-brand-charcoal/60 mt-1.5">
                      Plate {i + 1} - Syllabus Exercise Visual
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDUCATOR BULK SET BUDGET ESTIMATOR */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-brand-tan p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-brand-sage animate-spin-slow" />
          <h3 className="font-serif text-lg md:text-xl font-semibold text-brand-charcoal">
            Teacher Bulk Order Budget Estimator
          </h3>
        </div>
        <p className="text-xs text-brand-charcoal/75 max-w-2xl leading-relaxed mb-6">
          Planning copies for your classroom? If ordering <span className="font-bold text-brand-terracotta">6 or more copies</span> of any syllabus textbook, secure an automatic <span className="font-bold text-brand-sage-dark">20% class discount</span> from Alan and personalized author signatures for students! Calculate below, then click "Inquire Booking" to pre-fill your order coordinates!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mb-6">
          {/* Select book title */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wide text-brand-charcoal/50 font-bold">Textbook Title</label>
            <select 
              value={bulkBookId} 
              onChange={(e) => setBulkBookId(e.target.value)}
              className="w-full bg-white p-3 rounded border border-brand-tan text-xs font-semibold outline-none"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.title.split(':')[0]}</option>
              ))}
            </select>
          </div>

          {/* Select book version */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wide text-brand-charcoal/50 font-bold">School Format</label>
            <select 
              value={bulkType} 
              onChange={(e) => setBulkType(e.target.value as any)}
              className="w-full bg-white p-3 rounded border border-brand-tan text-xs font-semibold outline-none"
            >
              <option value="Hardcover">Printed Hardcover Edition</option>
              <option value="Workbook">Revision Workbook Edition</option>
            </select>
          </div>

          {/* Quantity entry */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wide text-brand-charcoal/50 font-bold">Estimated Copies</label>
            <input 
              type="number" 
              min="1"
              max="250"
              value={bulkQty}
              onChange={(e) => setBulkQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-white p-2.5 text-xs font-semibold rounded border border-brand-tan text-center outline-none"
            />
          </div>
        </div>

        {/* Dynamic estimated evaluation container */}
        {(() => {
          const selectedB = books.find(b => b.id === bulkBookId) || books[0];
          const unitPrice = selectedB.price;
          const normalSubtotal = unitPrice * bulkQty;
          const isDiscounted = bulkQty >= 6;
          const finalSubtotal = isDiscounted ? normalSubtotal * 0.8 : normalSubtotal;
          const discountDiff = normalSubtotal - finalSubtotal;

          return (
            <div className="bg-white border border-brand-tan/60 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-inner">
              <div className="text-center sm:text-left space-y-1">
                <p className="font-sans text-xs font-semibold text-brand-charcoal">
                  Estimated Booking Request: {bulkQty}x physical {bulkType} copies
                </p>
                <div className="font-mono text-[11px] text-brand-charcoal/60">
                  {isDiscounted ? (
                    <div>
                      Unit Price: <span className="line-through text-brand-charcoal/40">UGX {unitPrice.toLocaleString()}</span> <span className="text-brand-terracotta font-extrabold">UGX {(unitPrice * 0.8).toLocaleString()}</span> (<b>20% Teacher discount active</b>)
                    </div>
                  ) : (
                    `Unit price: UGX ${unitPrice.toLocaleString()} (Add 6+ copies to trigger 20% discount estimating)`
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:items-end items-center gap-2">
                <div className="text-center sm:text-right">
                  {isDiscounted && (
                    <span className="text-[10px] bg-brand-sage/15 text-brand-sage-dark px-2.5 py-0.5 rounded font-extrabold uppercase font-mono">
                      Estimated Saving: UGX {discountDiff.toLocaleString()}
                    </span>
                  )}
                  <p className="font-sans text-xl font-black text-brand-charcoal pt-1">
                    UGX {finalSubtotal.toLocaleString()}
                  </p>
                </div>

                <button 
                  onClick={() => handleStartBooking(selectedB, bulkType, bulkQty)}
                  className="text-xs bg-brand-sage text-white hover:bg-brand-sage-dark font-sans px-5 py-2 uppercase font-extrabold rounded select-none tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Send className="w-3 h-3" /> Inquire Bulk Order Bookings
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* DIRECT INQUIRY & BOOKING MODAL */}
      {bookingModalOpen && selectedBookForBooking && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 border border-brand-tan relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-brand-tan/50 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg md:text-xl font-bold text-brand-charcoal">
                  Direct Textbook Booking Form
                </h3>
                <p className="text-[10px] uppercase font-mono text-brand-charcoal/40 font-bold">Mail & SMS direct delivery dispatcher</p>
              </div>
              <button 
                onClick={() => {
                  setBookingModalOpen(false);
                  setBookingResult(null);
                  setFormError('');
                }}
                className="font-mono text-[10px] hover:bg-neutral-100 rounded px-2.5 py-1.5 uppercase font-bold text-brand-charcoal/60 hover:text-brand-charcoal border border-neutral-200"
              >
                Cancel
              </button>
            </div>

            {!bookingResult ? (
              // General order form inquiry
              <form onSubmit={handleCompleteBooking} className="space-y-4">
                <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                  Provide your educational delivery guidelines or contact coordinates. Mr. Alan Ayesigamukama will contact you on call or WhatsApp within 24 hours to arrange secure classroom shipping.
                </p>

                {formError && (
                  <div className="bg-brand-terracotta/10 border border-brand-terracotta/20 text-brand-terracotta text-xs p-3 rounded">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Selected Book Title (read only preview) */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-wide text-brand-charcoal/50 font-bold">Book Target</label>
                    <input 
                      type="text" 
                      readOnly
                      value={selectedBookForBooking.title.split(':')[0]}
                      className="w-full bg-brand-cream/80 p-2.5 rounded border border-brand-tan/40 text-xs font-semibold outline-none text-brand-charcoal/60"
                    />
                  </div>

                  {/* Format Selector */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-wide text-brand-charcoal/50 font-bold">Select Format</label>
                    <select 
                      value={selectedFormat}
                      onChange={(e: any) => setSelectedFormat(e.target.value)}
                      className="w-full bg-white p-2.5 rounded border border-brand-tan text-xs font-semibold outline-none"
                    >
                      <option value="Hardcover">Printed Hardcover</option>
                      <option value="Workbook">Printed Workbook</option>
                      <option value="eBook">Digital PDF eBook</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Quantity requested */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-wide text-[#5f6d5e] font-bold">Copies Count</label>
                    <input 
                      type="number" 
                      min="1"
                      required
                      value={bookingQty}
                      onChange={(e) => setBookingQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white p-2 text-xs font-bold rounded border border-brand-tan text-center outline-none"
                    />
                  </div>

                  {/* Pricing dynamic calculation overlay */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-wide text-brand-charcoal/50 font-bold">Booking Price Guide</label>
                    <div className="bg-brand-tan/15 p-2 rounded text-center font-bold text-xs text-brand-charcoal">
                      UGX {((selectedFormat === 'eBook' ? selectedBookForBooking.ebookPrice : selectedBookForBooking.price) * bookingQty * (bookingQty >= 6 ? 0.8 : 1)).toLocaleString()}
                      {bookingQty >= 6 && <span className="text-[8px] text-brand-sage-dark block font-mono uppercase font-black">20% Bulk Applied!</span>}
                    </div>
                  </div>
                </div>

                <hr className="border-brand-tan/30 my-2" />

                {/* Customer Details input fields */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wide text-brand-charcoal/50 font-bold">Your Name / Headteacher</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Headteacher Mukama Blaise"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-brand-cream/45 p-2.5 rounded border border-brand-tan text-xs outline-none focus:border-brand-sage"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wide text-brand-charcoal/50 font-bold">Contact Email address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. schoolname@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-brand-cream/45 p-2.5 rounded border border-brand-tan text-xs outline-none focus:border-brand-sage"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wide text-brand-charcoal/50 font-bold">Contact Phone Number (Call / WhatsApp)</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. +256 700 866 521"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-brand-cream/45 p-2.5 rounded border border-brand-tan text-xs outline-none focus:border-brand-sage font-mono"
                  />
                  <p className="text-[9px] text-brand-charcoal/40 font-mono">Used by Mr. Alan to direct call back or chat for coordination.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wide text-brand-charcoal/50 font-bold">Delivery Notes or Special Requirements</label>
                  <textarea 
                    rows={2}
                    placeholder="Provide school name, special curriculum hours, or delivery destination instructions..."
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    className="w-full bg-brand-cream/45 p-2 rounded border border-brand-tan text-xs outline-none focus:border-brand-sage resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3 bg-brand-charcoal text-brand-cream hover:bg-brand-sage hover:text-white transition-all rounded text-xs uppercase tracking-wider font-semibold shadow flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {bookingLoading ? 'Submitting to database...' : 'Send booking inquiry to Alan'}
                </button>
              </form>
            ) : (
              // Succession state
              <div className="space-y-5 animate-fade-in text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                
                <div>
                  <h4 className="font-serif text-xl font-bold text-brand-charcoal">Booking Recorded!</h4>
                  <p className="text-xs text-brand-charcoal/70 leading-relaxed max-w-sm mx-auto mt-1">
                    Excellent choice, <b>{customerName}</b>! Your curriculum booking request is securely registered in Alan's database. An auto-confirmation email from Gemini has been logged below.
                  </p>
                </div>

                {/* Gemini AI response display box */}
                <div className="bg-brand-tan/15 border border-brand-tan p-4 rounded-xl text-left space-y-2 max-h-[160px] overflow-y-auto">
                  <h5 className="font-mono text-[9px] uppercase tracking-wider text-brand-sage-dark font-black flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Confirmation Response (SMTP Dispatched):
                  </h5>
                  <p className="text-[11px] text-brand-charcoal/80 leading-relaxed font-light whitespace-pre-wrap">
                    {bookingResult.message}
                  </p>
                </div>

                <hr className="border-brand-tan/40" />

                <div className="space-y-3">
                  <p className="text-[11px] text-brand-charcoal/60">
                    To make absolutely sure, you are highly encouraged to <b>mail or chat</b> Mr. Alan directly using these instant quick-links:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Mailto deep link */}
                    <a 
                      href={getPrefilledMailto()}
                      className="flex items-center justify-center gap-2 py-2.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white rounded font-sans text-xs uppercase font-extrabold shadow"
                    >
                      <Mail className="w-4 h-4" /> ✉️ Email to Alan
                    </a>

                    {/* WhatsApp deep link */}
                    <a 
                      href={getPrefilledWhatsApp()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded font-sans text-xs uppercase font-extrabold shadow"
                    >
                      <Phone className="w-4 h-4" /> 💬 Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <p className="text-[10px] text-brand-charcoal/40 font-mono">
                  Tip: Go to the live <b className="text-brand-sage-dark">"Studio Office"</b> tab at the top right to verify simulated SMTP outbox files and database records!
                </p>

                <button
                  onClick={() => {
                    setBookingModalOpen(false);
                    setBookingResult(null);
                  }}
                  className="w-full mt-2 py-2.5 bg-brand-charcoal text-white rounded text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Return to Bookshop
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
