
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageSquare, Phone, Send, ExternalLink, Sparkles, History } from 'lucide-react';
import { api } from '../services/api';
import { BUSINESS_PHONE } from '../constants';

interface ContactSupportProps {
  onOpenChat?: () => void;
}

export const ContactSupport: React.FC<ContactSupportProps> = ({ onOpenChat }) => {
  const navigate = useNavigate();
  const currentUser = api.getCurrentUser();

  const handleWhatsAppClick = (subject: string = "General Inquiry") => {
    const message = `*Support Request - HomeNPlay*\n\n*Subject:* ${subject}\n*Customer:* ${currentUser?.name || 'Guest'}\n*Mobile:* ${currentUser?.mobile || 'Not logged in'}\n\nHow can you help me today?`;
    const waUrl = `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Need Assistance?</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          We're here to help you with your home essentials. Get in touch with our team instantly via WhatsApp or Email.
        </p>

        {currentUser && (
          <button
            onClick={() => navigate('/my-orders')}
            className="mt-8 inline-flex items-center px-6 py-3 bg-indigo-50 text-indigo-600 rounded-full font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
          >
            <History className="h-4 w-4 mr-2" /> Check Order Status
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Chat on WhatsApp</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">Get instant replies from our experts. Perfect for quick product questions or order help.</p>
          <button
            onClick={() => handleWhatsAppClick()}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-50 hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            Start Chatting <Send className="h-4 w-4 ml-2" />
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
            <Mail className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Email Support</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">Prefer the traditional way? Drop us a line and we'll reply within 1 business day.</p>
          <a
            href="mailto:homenplayco@gmail.com"
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center"
          >
            Email Us <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group lg:col-span-1 md:col-span-2 lg:col-start-auto">
          <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-100 group-hover:scale-110 transition-transform">
            <Phone className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Call Helpline</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">Available Mon-Sat, 10am to 7pm for urgent issues or bulk business orders.</p>
          <a
            // href="tel:+1800QUICKSTORE"
            className="w-full py-4 border-2 border-slate-100 text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center"
          >
            Call
          </a>
        </div>
      </div>

      <div className="mt-20 p-10 bg-indigo-50 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 text-indigo-900">
          <Sparkles className="h-64 w-64" />
        </div>
        <div className="max-w-xl text-center md:text-left relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Quick Solutions via AI</h2>
          <p className="text-slate-600 mb-0">Our virtual assistant can help you browse products, find your favorites, and answer FAQs in real-time.</p>
        </div>
        <button
          onClick={onOpenChat}
          className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-50 transition-all flex items-center whitespace-nowrap relative z-10"
        >
          Open AI Assistant <Sparkles className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};
