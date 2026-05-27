import React, { useState, useEffect } from 'react';
import { Youtube, Instagram, MapPin, Mail, Sparkles, BookOpen, Clock, Heart, Send, Phone } from 'lucide-react';

interface AboutContactProps {
  inquirySubject: string;
  setInquirySubject: (sub: string) => void;
}

export default function AboutContactSection({
  inquirySubject,
  setInquirySubject
}: AboutContactProps) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Discussion');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Sync state if inquiry subject changes from outer triggers
  useEffect(() => {
    if (inquirySubject) {
      if (inquirySubject.includes('Artwork Purchase')) {
        setSubject('Original Artwork Purchase');
      } else if (inquirySubject.includes('Partnership')) {
        setSubject('Business Partnership Inquiry');
      }
      setMsg(`Dear Alan,\n\nI am contacting you regarding your original painting: "${inquirySubject}". I would like to check availability and schedule a consultation.`);
    }
  }, [inquirySubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 animate-fade-in space-y-20 border-b border-brand-tan/10 pb-16" id="about-and-contact-view">
      
      {/* SECTION 1: DETAILED BIOGRAPHY AND TEACHING PHILOSOPHY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Sunlit Studio portrait with dropping shadows */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative bg-[#fdfaf6] p-5 shadow-2xl border border-brand-tan max-w-sm">
            <div className="aspect-[4/5] bg-brand-cream border border-brand-tan/50 overflow-hidden">
              <img 
                src="/a1.png" 
                alt="Alan Ayesigamukama, Art Teacher and Author" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Elegant Caption layout */}
            <p className="text-center font-serif text-base italic font-bold text-brand-charcoal mt-4 tracking-tight">
              Ayesigamukama Alan
            </p>
            <p className="text-center font-mono text-[9px] text-[#7d8c7c] mt-1 uppercase tracking-widest font-extrabold">
              Makerere Studio Base / Kampala, Uganda
            </p>
          </div>
        </div>

        {/* Written bio sheets */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 text-brand-terracotta uppercase font-mono text-[9px] font-bold tracking-widest">
            <Sparkles className="w-4 h-4 text-[#c46c4d]" />
            <span>Ugandan Artist & Educator Profile</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5.5xl font-bold text-brand-charcoal leading-tight tracking-tight animate-fade-in">
            Ayesigamukama Alan
          </h1>

          <p className="font-sans text-[15px] font-light text-brand-charcoal/85 leading-relaxed tracking-wide">
            I am a Ugandan visual artist, art educator, and curriculum writer. My practice explores the social and economic realities of children living in slum and ghetto communities within urban Uganda. Through expressive painting, storytelling, and educational writing, I document the emotional weight of poverty, resilience, family struggle, and the enduring spark of hope.
          </p>

          <p className="font-sans text-[14px] font-light text-brand-charcoal/70 leading-relaxed">
            I hold a <b>Bachelor’s Degree in Industrial and Fine Art</b> and a <b>Post Graduate Diploma in Education</b> from Makerere University. Beyond studio research, I have dedicated years to teaching art and related subjects at leading secondary institutions including: <br />
            <span className="text-[#7d8c7c] font-mono font-bold text-xs"> Kingstone High School Kawempe • Kazo Secondary School • Progressive High School Kasangati </span>
          </p>

          {/* Core Philosophy columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-2.5">
              <h3 className="font-serif text-lg font-bold text-brand-charcoal flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#7d8c7c]" />
                National Curriculum Guides
              </h3>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed font-light">
                As an active contributor to Uganda's Competency-Based Curriculum, my publications (<i>Art and Time</i>, <i>Art Through Ages</i>, <i>Studio Technology</i>) map abstract principles into actionable classroom lessons.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-serif text-lg font-bold text-brand-charcoal flex items-center gap-2">
                <Heart className="w-5 h-5 text-brand-terracotta" />
                Ghetto Child Dynamics
              </h3>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed font-light">
                My canvas works center strictly on high-contrast, expressive washes capturing play, struggles, and optimism, providing an empathetic narrative on youth resilience in disadvantaged communities.
              </p>
            </div>
          </div>

          {/* Social connections & Teaching Demo anchors */}
          <div className="border-t border-brand-tan pt-6 flex flex-wrap items-center gap-6">
            <span className="font-mono text-[9px] text-[#7d8c7c] uppercase tracking-widest font-bold">
              Archival Log feeds:
            </span>

            <div className="flex items-center space-x-5">
              <a 
                href="#teaching-videos"
                onClick={(e) => { e.preventDefault(); console.log('Connecting to educational demo feed...'); }}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition"
              >
                <Youtube className="w-4.5 h-4.5" />
                YouTube Feed
              </a>

              <a 
                href="#studio-logs"
                onClick={(e) => { e.preventDefault(); console.log('Opening Instagram watercolor wash feed...'); }}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-pink-600 hover:text-pink-700 transition"
              >
                <Instagram className="w-4.5 h-4.5" />
                Instagram Daily
              </a>
            </div>
          </div>
        </div>

      </section>


      {/* SECTION 2: CONTACT INQUIRIES ROUTER AND DETAILS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-brand-tan p-6 md:p-12 shadow-sm" id="contact-form-anchor">
        
        {/* Left Side Specs / Coordinates */}
        <div className="lg:col-span-4 space-y-6 lg:border-r lg:border-brand-tan pr-8">
          <div className="space-y-2">
            <span className="font-mono text-[9px] bg-brand-tan/50 text-[#7d8c7c] font-bold uppercase py-1 px-3 border border-brand-tan">
              Coordinates
            </span>
            <h3 className="font-serif text-2xl font-bold text-brand-charcoal">
              Get in Touch
            </h3>
            <p className="text-xs text-brand-charcoal/70 leading-relaxed font-light">
              If you have queries regarding school bookplate shipping, regional gallery exhibitions, or fine art masterclasses, use the form.
            </p>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-brand-tan bg-[#fdfaf6] flex items-center justify-center text-brand-sage-dark flex-none">
                <MapPin className="w-4 h-4 text-[#7d8c7c]" />
              </div>
              <div>
                <p className="text-[9px] text-[#7d8c7c] font-mono uppercase tracking-wider">Studio Base</p>
                <p className="font-semibold text-brand-charcoal">Kampala, Uganda (Makerere Studio Base)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-brand-tan bg-[#fdfaf6] flex items-center justify-center text-brand-sage-dark flex-none">
                <Phone className="w-4 h-4 text-[#7d8c7c]" />
              </div>
              <div>
                <p className="text-[9px] text-[#7d8c7c] font-mono uppercase tracking-wider">Mobile Contact</p>
                <p className="font-semibold text-brand-charcoal">0700866521 / 0761188522</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-green-250 bg-green-50 flex items-center justify-center text-green-700 flex-none rounded-xs">
                <Send className="w-4 h-4 text-green-600 animate-pulse" />
              </div>
              <div>
                <p className="text-[9px] text-green-600 font-mono uppercase tracking-wider">Call or WhatsApp</p>
                <div className="flex flex-col gap-1 mt-0.5">
                  <a 
                    href="https://wa.me/256700866521"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-green-600 hover:text-green-700 hover:underline transition-colors text-xs flex items-center gap-1"
                  >
                    💬 Chat +256700866521
                  </a>
                  <a 
                    href="https://wa.me/256761188522"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-green-600 hover:text-green-700 hover:underline transition-colors text-xs flex items-center gap-1"
                  >
                    💬 Chat +256761188522
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-brand-tan bg-[#fdfaf6] flex items-center justify-center text-brand-sage-dark flex-none">
                <Mail className="w-4 h-4 text-[#7d8c7c]" />
              </div>
              <div>
                <p className="text-[9px] text-[#7d8c7c] font-mono uppercase tracking-wider">Primary Envelope</p>
                <p className="font-semibold select-all text-brand-charcoal text-xs">alanayesigamukama@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-brand-tan bg-[#fdfaf6] flex items-center justify-center text-brand-sage-dark flex-none">
                <Clock className="w-4 h-4 text-[#7d8c7c]" />
              </div>
              <div>
                <p className="text-[9px] text-[#7d8c7c] font-mono uppercase tracking-wider">Studio Hours</p>
                <p className="font-semibold text-brand-charcoal">Mon - Sat, 9:00 AM - 6:00 PM EAT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="lg:col-span-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Dr. Mary Namubiru"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brand-cream p-3 border border-brand-tan text-xs outline-none rounded-none focus:border-brand-charcoal"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Your Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. query@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-cream p-3 border border-brand-tan text-xs outline-none rounded-none focus:border-brand-charcoal"
                  />
                </div>
              </div>

              {/* Subject dropdown including the requested "Business Partnership Inquiry" option */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Inquiry Classification Category</label>
                <select 
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setInquirySubject(''); // clear outer trigger overrides if user updates manually
                  }}
                  className="w-full bg-brand-cream p-3 border border-brand-tan text-xs font-semibold outline-none cursor-pointer rounded-none focus:border-brand-charcoal"
                >
                  <option value="General Discussion">General Discussion / Question</option>
                  <option value="Business Partnership Inquiry">Business Partnership Inquiry</option>
                  <option value="Original Artwork Purchase">Original Artwork Purchase</option>
                  <option value="Book Bulk Order Support">Book Bulk Order Support</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest font-bold text-brand-charcoal/50">Message Body</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Draft your query context here..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full bg-brand-cream p-3 border border-brand-tan text-xs outline-none resize-none rounded-none focus:border-brand-charcoal"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-4 bg-brand-charcoal text-white hover:bg-[#7d8c7c] transition-colors rounded-none text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Inquiry Message</span>
              </button>
            </form>
          ) : (
            // Success Dialogue
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-12 h-12 bg-brand-cream flex items-center justify-center mx-auto text-emerald-600 border border-brand-tan">
                <Heart className="w-6 h-6 fill-emerald-600" />
              </div>
              <h4 className="font-serif text-lg font-bold text-brand-charcoal">Inquiry Transmitted</h4>
              <p className="text-xs text-brand-charcoal/65 max-w-sm mx-auto leading-relaxed">
                Thank you for your message, <b>{name}</b>! Alan Ayesigamukama will review your classification (<i>{subject}</i>) and dispatch a reply to <b>{email}</b> shortly.
              </p>
              <button 
                onClick={() => {
                  setName('');
                  setEmail('');
                  setMsg('');
                  setSubmitted(false);
                }}
                className="px-6 py-3 bg-brand-cream border border-brand-tan text-[11px] font-bold uppercase tracking-widest text-[#7d8c7c] hover:bg-brand-charcoal hover:text-white rounded-none cursor-pointer transition-colors"
              >
                Draft Another Message
              </button>
            </div>
          )}
        </div>

      </section>

    </div>
  );
}
