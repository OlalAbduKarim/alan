import React, { useState } from 'react';
import { PartnershipTier } from '../types';
import { PARTNERSHIP_TIERS } from '../data';
import { ShieldCheck, Sparkles, AlertCircle, FileText, Mail, Send, Check } from 'lucide-react';

interface PartnershipProps {
  tiers: PartnershipTier[];
  leadSubmitted: any;
  leadLoading: boolean;
  submitLead: (formData: {
    name: string;
    email: string;
    organization: string;
    tierId: string;
    message: string;
  }) => void;
  resetLeadState: () => void;
}

export default function PartnershipSection({
  tiers = PARTNERSHIP_TIERS,
  leadSubmitted,
  leadLoading,
  submitLead,
  resetLeadState
}: PartnershipProps) {

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [tierId, setTierId] = useState(tiers[0]?.id || 'licensing');
  const [message, setMessage] = useState('');
  const [errorText, setErrorText] = useState('');

  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !organization.trim() || !message.trim()) {
      setErrorText('Please complete all fields to submit your partnership application.');
      return;
    }
    setErrorText('');
    submitLead({ name, email, organization, tierId, message });
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setOrganization('');
    setTierId(tiers[0]?.id || 'licensing');
    setMessage('');
    resetLeadState();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 animate-fade-in space-y-16" id="partnership-view">
      
      {/* HEADER SEGMENT */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-terracotta font-bold">
          INSTITUTIONAL CURRICULAE
        </span>
        <h1 className="font-serif text-3.5xl md:text-5.5xl text-brand-charcoal font-semibold tracking-tight">
          Educational Collaborations
        </h1>
        <p className="text-sm text-brand-charcoal/70 leading-relaxed font-light">
          Partnering with public and private departments, standard museum academies, and certified gallery houses to foster organic creative instruction models globally.
        </p>
        <div className="w-16 h-1 bg-brand-sage mx-auto rounded-full mt-4" />
      </div>


      {/* 3 TIERS CARDS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="partnership-tiers">
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            onMouseEnter={() => setHoveredTier(tier.id)}
            onMouseLeave={() => setHoveredTier(null)}
            className={`bg-white border p-8 flex flex-col justify-between transition-all duration-350 ${
              hoveredTier === tier.id 
                ? 'border-brand-terracotta shadow-xl -translate-y-1' 
                : 'border-brand-tan/80 shadow-xs'
            }`}
          >
            <div className="space-y-5">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-brand-tan/40 text-brand-sage-dark py-1 px-3 border border-brand-tan">
                {tier.badge}
              </span>

              <h3 className="font-serif text-xl font-bold text-brand-charcoal">
                {tier.title}
              </h3>

              <p className="text-brand-charcoal/70 text-xs md:text-[13px] leading-relaxed font-light">
                {tier.description}
              </p>

              {/* Bullet Features */}
              <ul className="space-y-2.5 pt-2">
                {tier.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-brand-charcoal/85">
                    <span className="w-1.5 h-1.5 bg-brand-terracotta mt-1.5 flex-none" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-tan">
              <button 
                onClick={() => {
                  setTierId(tier.id);
                  document.getElementById('lead-form-scroll-view')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[11px] text-brand-charcoal hover:text-[#c46c4d] font-bold uppercase tracking-wider group flex items-center gap-1.5"
              >
                Apply Under This Tier 
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* FORM AND SUCCESS DIALOGUE WRAPPER */}
      <div className="bg-[#fdfaf6] border border-brand-tan p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start" id="lead-form-scroll-view">
        
        {/* Left instructions block */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-1.5 text-brand-sage-dark font-mono text-xs font-bold">
            <ShieldCheck className="w-5 h-5 text-brand-sage" />
            <span>CRM Hot-Lead Router</span>
          </div>

          <h2 className="font-serif text-2xl md:text-3.5xl font-semibold text-brand-charcoal leading-tight">
            Initiate Contact Invitation
          </h2>

          <p className="text-xs md:text-sm text-brand-charcoal/80 font-light leading-relaxed">
            All curriculum submissions are transmitted directly to our secure studio cloud-database (Airtable / Google Sheets configuration) and tagged as <b>"Hot Lead"</b> to assure prompt reviews.
          </p>

          <div className="bg-white/80 border border-brand-tan rounded-lg p-3.5 space-y-2.5">
            <h4 className="font-mono text-[9px] uppercase tracking-wider text-brand-sage-dark font-extrabold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-terracotta animate-pulse" /> School Priority Routing:
            </h4>
            <p className="text-[11px] text-brand-charcoal/70 leading-relaxed font-light">
              Registration submissions made with verified academic <span className="font-bold underline text-brand-terracotta">.edu</span> email extensions are flagged as <b>"Priority"</b> instantly inside our office console.
            </p>
          </div>
        </div>

        {/* Right form block / Success alert dashboard - Sharp corners and Immersive UI palette */}
        <div className="lg:col-span-7 bg-white border border-brand-tan p-6 md:p-8 shadow-sm">
          {!leadSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorText && (
                <div className="bg-[#c46c4d]/10 border border-[#c46c4d]/20 text-[#c46c4d] text-xs p-3 rounded-none flex items-center gap-2 font-mono uppercase tracking-wide">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorText}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Alan Ayesigamukama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brand-cream p-3 border border-brand-tan text-xs outline-none rounded-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Organization */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Organization / Institution</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Westside Public Schools"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-brand-cream p-3 border border-brand-tan text-xs outline-none rounded-none focus:border-brand-charcoal"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Email Address (Supports .edu Priority)</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. jvance@academy.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-cream p-3 border border-brand-tan text-xs outline-none rounded-none focus:border-brand-charcoal"
                />
              </div>

              {/* Tier Selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Partnership Program Tier Desired</label>
                <select 
                  value={tierId}
                  onChange={(e) => setTierId(e.target.value)}
                  className="w-full bg-brand-cream p-3 border border-brand-tan text-xs font-semibold outline-none cursor-pointer rounded-none focus:border-brand-charcoal"
                >
                  {tiers.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Describe Your Co-op Vision / Inquiry Context</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Tell us about your student headcount, standard calendar curriculum requirements, schedule targets, or gallery space details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-brand-cream p-3 border border-brand-tan text-xs outline-none resize-none rounded-none focus:border-brand-charcoal"
                />
              </div>

              <button
                type="submit"
                disabled={leadLoading}
                className="w-full mt-2 py-4 bg-brand-charcoal text-white hover:bg-[#7d8c7c] transition-colors rounded-none text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{leadLoading ? 'Processing Lead Routing...' : 'Submit Partnership Registration'}</span>
              </button>
            </form>
          ) : (
            // LEAD SUBMISSION CO-OP SUCCESS BLOCK
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 border-b border-brand-tan/50 pb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-brand-charcoal">Partnership Application Dispatched</h4>
                  <p className="text-[11px] text-brand-charcoal/50 font-mono">Synced to Live Google Sheets / Airtable API</p>
                </div>
              </div>

              {/* Lead metadata indicators */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-brand-tan/30 p-2.5 rounded border border-brand-tan">
                  <span className="text-[9px] text-brand-charcoal/40 uppercase block font-mono">CRM Database Tag</span>
                  <span className="font-bold text-brand-terracotta">🔥 Hot Lead</span>
                </div>

                <div className={`p-2.5 rounded border ${
                  leadSubmitted.lead?.priority 
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-brand-cream text-brand-charcoal/60 border-brand-tan'
                }`}>
                  <span className="text-[9px] text-brand-charcoal/40 uppercase block font-mono">Office Priority</span>
                  <span className="font-bold">
                    {leadSubmitted.lead?.priority ? '🚨 Priority (.edu)' : 'Regular Standard'}
                  </span>
                </div>
              </div>

              {/* Gemini responder preview outbox simulator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-brand-sage-dark font-extrabold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-brand-terracotta" /> Automated digital responder outbox:
                  </span>
                  <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    PDF Attached
                  </span>
                </div>

                <div className="bg-brand-tan/15 border border-brand-tan rounded-lg p-5 text-[11px] leading-relaxed relative whitespace-pre-wrap text-brand-charcoal/85 max-h-[170px] overflow-y-auto">
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-brand-sage/20 rounded font-mono text-[8px] font-bold text-brand-sage-dark">
                    <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Gemini AI Letter Template
                  </div>

                  {leadSubmitted.autoResponseSummary}
                </div>

                <div className="flex items-center gap-2 bg-brand-cream p-2 rounded-md border border-brand-tan/40">
                  <FileText className="w-4 h-4 text-brand-terracotta" />
                  <span className="font-sans text-[10px] text-brand-charcoal/70">Attached: <b className="font-semibold text-brand-charcoal">Ayesiga_Gallery_Partnership_Kit_2026.pdf</b></span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 bg-brand-charcoal hover:bg-brand-sage text-white rounded text-xs transition-colors duration-200 uppercase tracking-wider font-semibold"
                >
                  Submit Another Lead
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
