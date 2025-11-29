'use client';

import { useState } from 'react';
import { TextReveal } from '@/components/animations/TextReveal';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export const ContactPage = () => {
  const { content } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    partner: '',
    email: '',
    phone: '',
    date: '',
    story: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.submitInquiry({
        name: formData.name,
        partner: formData.partner,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        story: formData.story
      });

      setSubmitted(true);
      setFormData({
        name: '',
        partner: '',
        email: '',
        phone: '',
        date: '',
        story: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-24 min-h-screen bg-[#2c2420] text-white flex items-center">
     <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
           <TextReveal className="text-6xl md:text-8xl font-serif mb-8">{content?.contact?.hero?.title || "Let's Create Magic."}</TextReveal>
           <p className="text-[#e8e0d9] font-light text-xl leading-relaxed max-w-md mb-12">{content?.contact?.hero?.description || 'We take on a limited number of weddings each year to ensure we can give our full heart to every couple.'}</p>
           <div className="space-y-8 border-l border-white/10 pl-8">
              <div className="group interactive cursor-pointer">
                  <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Call Us</p>
                  <p className="text-2xl font-serif group-hover:text-[#a67b5b] transition-colors duration-200">{content?.contact?.details?.phone || '+91 98765 43210'}</p>
              </div>
              <div className="group interactive cursor-pointer">
                  <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Email Us</p>
                  <p className="text-2xl font-serif group-hover:text-[#a67b5b] transition-colors duration-200">{content?.contact?.details?.email || 'hello@elephantproductions.in'}</p>
              </div>
           </div>
        </div>
        <div className="bg-white/5 p-12 backdrop-blur-sm border border-white/10">
           {submitted && (
             <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded text-green-200 text-sm">
               Thank you! We've received your inquiry and will get back to you soon.
             </div>
           )}
           {error && (
             <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
               {error}
             </div>
           )}
           <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2 group">
                   <label className="text-xs text-[#a67b5b] uppercase tracking-widest group-focus-within:text-white transition-colors duration-200">Name *</label>
                   <input 
                     type="text" 
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                     className="w-full bg-transparent border-b border-white/20 py-3 focus:border-[#a67b5b] outline-none transition-colors duration-200 text-lg font-serif" 
                   />
                 </div>
                 <div className="space-y-2 group">
                   <label className="text-xs text-[#a67b5b] uppercase tracking-widest group-focus-within:text-white transition-colors duration-200">Partner</label>
                   <input 
                     type="text" 
                     name="partner"
                     value={formData.partner}
                     onChange={handleChange}
                     className="w-full bg-transparent border-b border-white/20 py-3 focus:border-[#a67b5b] outline-none transition-colors duration-200 text-lg font-serif" 
                   />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2 group">
                   <label className="text-xs text-[#a67b5b] uppercase tracking-widest group-focus-within:text-white transition-colors duration-200">Email *</label>
                   <input 
                     type="email" 
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                     className="w-full bg-transparent border-b border-white/20 py-3 focus:border-[#a67b5b] outline-none transition-colors duration-200 text-lg font-serif" 
                   />
                 </div>
                 <div className="space-y-2 group">
                   <label className="text-xs text-[#a67b5b] uppercase tracking-widest group-focus-within:text-white transition-colors duration-200">Phone</label>
                   <input 
                     type="tel" 
                     name="phone"
                     value={formData.phone}
                     onChange={handleChange}
                     className="w-full bg-transparent border-b border-white/20 py-3 focus:border-[#a67b5b] outline-none transition-colors duration-200 text-lg font-serif" 
                   />
                 </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-xs text-[#a67b5b] uppercase tracking-widest group-focus-within:text-white transition-colors duration-200">Wedding Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 py-3 focus:border-[#a67b5b] outline-none transition-colors duration-200 text-white/70 font-serif" 
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-xs text-[#a67b5b] uppercase tracking-widest group-focus-within:text-white transition-colors duration-200">Your Story *</label>
                <textarea 
                  rows={4} 
                  name="story"
                  value={formData.story}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-3 focus:border-[#a67b5b] outline-none transition-colors duration-200 resize-none font-serif text-lg"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#a67b5b] py-5 uppercase tracking-widest text-xs font-bold hover:bg-[#946b4d] transition-colors duration-200 mt-4 interactive disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Check Availability'
                )}
              </button>
           </form>
        </div>
     </div>
  </div>
  );
};
