import { useState, useEffect } from 'react';
import { PartnershipLead } from '../types';
import { Database, Mail, Layers, Sparkles, RefreshCw, AlertTriangle, Check, ShieldAlert, Plus, Minus } from 'lucide-react';

interface AdminProps {
  leads: PartnershipLead[];
  leadsLoading: boolean;
  refreshLeads: () => void;
  inventory: Record<string, number>;
  updateStock: (bookId: string, quantity: number) => void;
  emails: any[];
  refreshEmails: () => void;
  artworkOrders?: any[];
}

export default function AdminPortal({
  leads,
  leadsLoading,
  refreshLeads,
  inventory,
  updateStock,
  emails,
  refreshEmails,
  artworkOrders = []
}: AdminProps) {

  const [activePane, setActivePane] = useState<'leads' | 'stock' | 'emails' | 'artwork' | 'books'>('leads');
  const [successMsg, setSuccessMsg] = useState('');
  const [bookBookings, setBookBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const fetchBookBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch("/api/book-bookings");
      if (res.ok) {
        const data = await res.json();
        setBookBookings(data);
      }
    } catch (err) {
      console.error("Failed to load book bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    refreshLeads();
    refreshEmails();
    fetchBookBookings();
  }, [activePane]);

  const handleStockAdjust = (bookId: string, currentVal: number, change: number) => {
    const newVal = Math.max(0, currentVal + change);
    updateStock(bookId, newVal);
    setSuccessMsg(`Inventory Stock updated for ${bookId}: ${newVal} units.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 animate-fade-in space-y-8" id="admin-view">
      
      {/* HEADER AND SWITCHES */}
      <div className="bg-brand-charcoal text-brand-cream border border-brand-charcoal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-brand-sage/20 border border-brand-sage/40 rounded-full px-3 py-1 font-mono text-[10px] uppercase text-brand-tan tracking-wider">
            <ShieldAlert className="w-4.5 h-4.5 text-brand-sage animate-pulse" />
            <span>Art Shop Secure Office</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Studio Admin Portal</h1>
          <p className="text-xs text-brand-cream/70 max-w-lg leading-relaxed font-light">
            Review CRM Hot-Leads databases, alter workbook inventory balances to trigger out-of-stock AI warnings, and inspect the simulated SMTP digital outbox.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActivePane('leads')}
            className={`px-4 py-2.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
              activePane === 'leads'
                ? 'bg-brand-sage text-white border-brand-sage shadow-xs'
                : 'bg-white/5 border-white/10 text-brand-cream/80 hover:bg-white/10'
            }`}
          >
            Leads CRM Queue ({leads.length})
          </button>
          
          <button
            onClick={() => setActivePane('stock')}
            className={`px-4 py-2.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
              activePane === 'stock'
                ? 'bg-brand-sage text-white border-brand-sage shadow-xs'
                : 'bg-white/5 border-white/10 text-brand-cream/80 hover:bg-white/10'
            }`}
          >
            Inventory Stocks
          </button>

          <button
            onClick={() => setActivePane('emails')}
            className={`px-4 py-2.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
              activePane === 'emails'
                ? 'bg-brand-sage text-white border-brand-sage shadow-xs'
                : 'bg-white/5 border-white/10 text-brand-cream/80 hover:bg-white/10'
            }`}
          >
            Digital Outbox ({emails.length})
          </button>

          <button
            onClick={() => setActivePane('artwork')}
            className={`px-4 py-2.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
              activePane === 'artwork'
                ? 'bg-brand-[#c46c4d] hover:bg-[#b05c3e] bg-[#c46c4d] text-white border-[#c46c4d] shadow-xs'
                : 'bg-white/5 border-white/10 text-brand-cream/80 hover:bg-white/10'
            }`}
          >
            Art Bookings ({artworkOrders.length})
          </button>

          <button
            onClick={() => setActivePane('books')}
            className={`px-4 py-2.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
              activePane === 'books'
                ? 'bg-brand-sage text-white border-brand-sage shadow-xs'
                : 'bg-white/5 border-white/10 text-brand-cream/80 hover:bg-white/10'
            }`}
          >
            Textbook Bookings ({bookBookings.length})
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs p-3.5 rounded-lg flex items-center gap-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}


      {/* PANE 1: CRM LEADS QUEUE */}
      {activePane === 'leads' && (
        <div className="bg-white rounded-2xl border border-brand-tan/60 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-brand-tan/40 pb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-sage" />
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">Synced CRM Hot Leads</h3>
                <p className="text-[11px] font-mono text-brand-charcoal/50 uppercase mt-0.5">Dual-channel connection status active</p>
              </div>
            </div>

            <button 
              onClick={refreshLeads}
              disabled={leadsLoading}
              className="p-2 border border-brand-tan hover:bg-brand-tan rounded transition-all text-brand-charcoal/70"
              title="Refresh leads database queue"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${leadsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-12 text-brand-charcoal/50 italic text-xs">
              No registered partnership leads currently inside database. Submit data on Partnerships page to record items here.
            </div>
          ) : (
            <div className="space-y-5">
              {leads.map((lead) => (
                <div 
                  key={lead.id}
                  id={`lead-record-${lead.id}`}
                  className="bg-brand-cream p-5 rounded-xl border border-brand-tan/50 space-y-3 shadow-xs relative"
                >
                  {/* Lead headers tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="font-serif font-bold text-sm text-brand-charcoal">{lead.name}</h4>
                      <p className="font-mono text-[10px] text-brand-charcoal/50 lowercase">
                        {lead.email} • <b>{lead.organization}</b>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider bg-brand-terracotta/10 text-brand-terracotta px-2.5 py-0.5 rounded border border-brand-terracotta/20">
                        🔥 Hot Lead
                      </span>
                      {lead.priority && (
                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2.5 py-0.5 rounded border border-red-200">
                          🚨 Priority (.edu)
                        </span>
                      )}
                      <span className="font-mono text-[9px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200">
                        {lead.crmStatus}
                      </span>
                    </div>
                  </div>

                  {/* Body message */}
                  <p className="text-xs text-brand-charcoal/80 leading-relaxed font-light whitespace-pre-wrap pl-2.5 border-l-2 border-brand-sage/50">
                    {lead.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-brand-charcoal/40 pt-2 border-t border-brand-tan/30">
                    <span>Inquiry Tier ID: <b>{lead.tierId}</b></span>
                    <span>Logs timestamp: {new Date(lead.submittedAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* PANE 2: INVENTORY STOCKS */}
      {activePane === 'stock' && (
        <div className="bg-white rounded-2xl border border-brand-tan/60 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-brand-tan/40 pb-4">
            <Layers className="w-5 h-5 text-brand-sage animate-spin-slow" />
            <div>
              <h3 className="font-serif text-lg font-bold text-brand-charcoal">Studio Textbook Settle Indexes</h3>
              <p className="text-[11px] font-mono text-brand-charcoal/50 uppercase mt-0.5">Control print stockpiles to toggle Gemini checkout decline rules</p>
            </div>
          </div>

          <div className="bg-brand-tan/20 border border-brand-tan rounded-lg p-4 text-xs font-light text-brand-charcoal/80 space-y-2">
            <p className="font-semibold text-brand-charcoal flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-brand-terracotta inline" /> 
              Fulfillment & Decline Testing Rule:
            </p>
            <p>
              Under classroom publishing guidelines, any print textbook whose quantity is <b>0 or lower</b> is labeled "Out of Stock". If a catalog buyer attempts checkout under these circumstances, the <b>Gemini checkout handler auto-declines</b> the transaction and crafts a polite personal apology email in real-time.
            </p>
            <p>
              Use the +/- controllers below to increase or set stock levels back to 0 (and test both successful and declined routes!).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(inventory).map((bookId) => {
              const qty = inventory[bookId];
              return (
                <div key={bookId} className="bg-brand-cream border border-brand-tan p-5 rounded-xl flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono uppercase text-brand-charcoal/40 tracking-wider font-semibold">Book Unique ID</p>
                    <h4 className="font-serif font-bold text-brand-charcoal">{bookId.replace(/-/g, " ")}</h4>
                  </div>

                  <div className="flex items-center justify-between border-t border-brand-tan/40 mt-4 pt-4">
                    <div>
                      <p className="text-[9px] font-mono text-brand-charcoal/40 uppercase">Stock Level</p>
                      <p className={`font-mono font-bold text-xl ${qty > 0 ? 'text-brand-sage-dark' : 'text-brand-terracotta'}`}>
                        {qty} copy{qty !== 1 ? 'ies' : ''}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-white p-1 rounded border border-brand-tan shadow-xs">
                      <button 
                        onClick={() => handleStockAdjust(bookId, qty, -1)}
                        className="p-1 rounded bg-brand-cream hover:bg-brand-tan border border-brand-tan transition cursor-pointer"
                        title="Reduce stock copies"
                      >
                        <Minus className="w-3.5 h-3.5 text-brand-charcoal" />
                      </button>
                      <button 
                        onClick={() => handleStockAdjust(bookId, qty, +1)}
                        className="p-1 rounded bg-brand-cream hover:bg-brand-tan border border-brand-tan transition cursor-pointer"
                        title="Increase stock copies"
                      >
                        <Plus className="w-3.5 h-3.5 text-brand-charcoal" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* PANE 3: DIGITAL OUTBOX LOGS */}
      {activePane === 'emails' && (
        <div className="bg-white rounded-2xl border border-brand-tan/60 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-brand-tan/40 pb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-sage" />
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">Simulated SMTP Outbox Logs</h3>
                <p className="text-[11px] font-mono text-brand-charcoal/50 uppercase mt-0.5">Review instantaneous eBook download tokens and lead materials dispatched</p>
              </div>
            </div>

            <button 
              onClick={refreshEmails}
              className="p-2 border border-brand-tan hover:bg-brand-tan rounded transition-all text-brand-charcoal/70"
              title="Refresh outbox email streams"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {emails.length === 0 ? (
            <div className="text-center py-16 text-brand-charcoal/50 italic text-xs">
              Mailing servers quiet. Purchase of e-copies or partnerships submissions will dispatch items to this log immediately.
            </div>
          ) : (
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1">
              {emails.map((mail) => (
                <div key={mail.id} className="border border-brand-tan rounded-xl overflow-hidden shadow-xs">
                  {/* Email header list section */}
                  <div className="bg-brand-cream border-b border-brand-tan p-3.5 flex flex-wrap items-center justify-between text-xs gap-3">
                    <div className="space-y-1">
                      <p className="text-brand-charcoal/60">
                        To: <span className="font-semibold text-brand-charcoal font-mono">{mail.to}</span>
                      </p>
                      <h4 className="font-serif font-bold text-sm text-brand-charcoal">{mail.subject}</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-brand-charcoal/40">{new Date(mail.sentAt).toLocaleString()}</p>
                      <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        SMTP SENT OK
                      </span>
                    </div>
                  </div>

                  {/* Body preview box */}
                  <div className="p-5 font-sans text-xs text-brand-charcoal/85 leading-relaxed whitespace-pre-wrap bg-white">
                    {mail.body}
                  </div>

                  {/* Attachments panel */}
                  {mail.attachments && mail.attachments.length > 0 && (
                    <div className="bg-brand-cream/40 border-t border-brand-tan p-2.5 flex items-center gap-2 text-xs">
                      <span className="text-[10px] font-mono text-brand-charcoal/40">File Attached:</span>
                      {mail.attachments.map((at: string, idx: number) => (
                        <div key={idx} className="bg-white px-2.5 py-1 text-[11px] hover:border-brand-terracotta rounded border border-brand-tan flex items-center gap-1">
                          <span className="font-sans text-brand-charcoal font-semibold">{at}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PANE 4: ORIGINAL ARTWORK BOOKINGS QUEUE */}
      {activePane === 'artwork' && (
        <div className="bg-white rounded-2xl border border-brand-tan/60 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-brand-tan/40 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-terracotta" />
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">Original Painting Reservations</h3>
                <p className="text-[11px] font-mono text-brand-charcoal/50 uppercase mt-0.5">Track secure order requests generated via the Fine Art Portfolio lightviews</p>
              </div>
            </div>

            <button 
              onClick={refreshLeads}
              className="p-2 border border-brand-tan hover:bg-brand-tan rounded transition-all text-brand-charcoal/70"
              title="Refresh artwork reservation queue"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {artworkOrders.length === 0 ? (
            <div className="text-center py-16 text-brand-charcoal/50 italic text-xs">
              No painting reservations logged yet. Go to Fine Art Canvas Grid to place a reservation under any available artwork.
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {[...artworkOrders].reverse().map((order, idx) => (
                <div key={order.orderId || idx} className="border border-brand-tan p-5 rounded-xl bg-[#fdfaf6] hover:bg-white transition flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] font-bold text-white bg-brand-terracotta px-2 py-0.5 uppercase">
                        Reservation Ref: #{order.orderId?.slice(-6) || 'N/A'}
                      </span>
                      <span className="font-mono text-[9px] text-[#7d8c7c] bg-[#eef3ee] px-2 py-0.5 font-bold uppercase border border-[#d6e3d6]">
                        Reserved Match
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-brand-charcoal pt-1">
                      Painting: "{order.artworkTitle}"
                    </h4>

                    <p className="text-xs text-brand-charcoal/70 font-light font-sans">
                      Acquirer: <span className="font-bold text-brand-charcoal">{order.customerName}</span> (
                      <a href={`mailto:${order.customerEmail}`} className="text-[#c46c4d] border-b border-[#c46c4d]/30 hover:border-[#c46c4d] font-mono text-xs">{order.customerEmail}</a>)
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5 min-w-[140px]">
                    <span className="font-mono text-[10px] text-[#7d8c7c] block">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                    <span className="font-serif text-base italic font-bold text-[#c46c4d]">
                      UGX {Number(order.artworkPrice)?.toLocaleString() || order.artworkPrice}
                    </span>
                    <div className="flex gap-2">
                      <a 
                        href={`https://wa.me/256700866521?text=Hello%20Alan%20Ayesigamukama,%20this%20is%20${encodeURIComponent(order.customerName)}%20inquiring%20about%20my%20reservation%20for%20original%20painting%2520"${encodeURIComponent(order.artworkTitle)}"`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-250 text-[10px] px-2.5 py-1 uppercase tracking-wide font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        💬 Confirm via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PANE 5: TEXTBOOKS BOOKINGS INQUIRIES */}
      {activePane === 'books' && (
        <div className="bg-white rounded-2xl border border-brand-tan/60 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-brand-tan/40 pb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-sage animate-pulse" />
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">Textbook Bookings Database</h3>
                <p className="text-[11px] font-mono text-brand-charcoal/50 uppercase mt-0.5">Dual-channel school reservation coordinates</p>
              </div>
            </div>

            <button 
              onClick={fetchBookBookings}
              disabled={bookingsLoading}
              className="p-2 border border-brand-tan hover:bg-brand-tan rounded transition-all text-brand-charcoal/70 cursor-pointer"
              title="Refresh textbook bookings queue"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${bookingsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {bookBookings.length === 0 ? (
            <div className="text-center py-16 text-brand-charcoal/50 italic text-xs">
              No textbook inquiries logged yet. Place orders inside Book Shop section to record textbook reservations here.
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {[...bookBookings].map((booking, idx) => (
                <div key={booking.id || idx} className="border border-brand-tan p-5 rounded-xl bg-[#fdfaf6] hover:bg-white transition flex flex-col md:flex-row md:items-center justify-between gap-5 animate-fade-in">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] font-bold text-white bg-brand-charcoal px-2 py-0.5 uppercase">
                        Book Booking Ref: #{booking.id?.slice(-6) || 'N/A'}
                      </span>
                      <span className="font-mono text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {booking.purchaseType} Format
                      </span>
                      <span className="font-mono text-[9px] bg-brand-sage/12 text-brand-sage-dark font-extrabold uppercase py-0.5 px-2 rounded">
                        Qty: {booking.quantity}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-brand-charcoal pt-1">
                      Textbook: "{booking.bookTitle}"
                    </h4>

                    <p className="text-xs text-brand-charcoal/70 font-light font-sans">
                      School Booker: <span className="font-bold text-brand-charcoal">{booking.customerName}</span> (
                      <a href={`mailto:${booking.customerEmail}`} className="text-[#c46c4d] border-b border-[#c46c4d]/30 hover:border-[#c46c4d] font-mono text-xs">{booking.customerEmail}</a>)
                    </p>

                    <p className="text-xs text-brand-charcoal/70 font-light font-sans">
                      Phone Contact: <span className="font-mono text-brand-charcoal font-bold">{booking.customerPhone}</span>
                    </p>

                    {booking.message && (
                      <p className="text-[11px] text-brand-charcoal/65 italic border-l-2 border-brand-tan pl-2 mt-2 whitespace-pre-wrap">
                        "{booking.message}"
                      </p>
                    )}
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5 min-w-[140px]">
                    <span className="font-mono text-[10px] text-[#7d8c7c] block">
                      {new Date(booking.bookedAt).toLocaleString()}
                    </span>
                    <div className="flex flex-col gap-1">
                      <a 
                        href={`https://wa.me/${booking.customerPhone.replace(/[^0-9]/g, '') || '256700866521'}?text=Hello%20${encodeURIComponent(booking.customerName)},%20this%20is%20Alan%20Ayesigamukama%20replying%20to%20your%20textbook%20booking%20of%20"${encodeURIComponent(booking.bookTitle)}"`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-250 text-[10px] px-2.5 py-1 uppercase tracking-wide font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        💬 Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
