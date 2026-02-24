
import React, { useState } from 'react';
import { Home, Heart, Star, Package, Smile, ChevronDown } from 'lucide-react';
import homeNPlayLogo from '../assets/HomeNPlay.png';

type Lang = 'en' | 'hi';

export const AboutUs: React.FC = () => {
    const [lang, setLang] = useState<Lang>('en');

    return (
        <div className="min-h-screen bg-slate-50 pb-24 animate-in fade-in duration-700">

            {/* ── Hero ─────────────────────────────────── */}
            <section className="relative overflow-hidden bg-slate-900 py-24 px-6">
                {/* decorative blobs */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* logo badge */}
                    <div className="inline-flex items-center justify-center bg-white rounded-2xl px-5 py-3 mb-8 shadow-2xl shadow-black/30">
                        <img src={homeNPlayLogo} alt="HomeNPlay" className="h-24 w-auto object-contain" />
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
                        {lang === 'en' ? (
                            <>About <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">HomeNPlay</span></>
                        ) : (
                            <>हमारे बारे में <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">HomeNPlay</span></>
                        )}
                    </h1>

                    <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                        {lang === 'en'
                            ? 'More than just a store — a brand built around family, warmth, and togetherness.'
                            : 'सिर्फ एक स्टोर नहीं — परिवार, अपनापन और खुशियों के एहसास पर आधारित एक ब्रांड।'}
                    </p>

                    {/* Language toggle */}
                    <div className="inline-flex items-center bg-white/10 border border-white/20 backdrop-blur-sm rounded-full p-1">
                        <button
                            onClick={() => setLang('en')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow' : 'text-white hover:bg-white/10'}`}
                        >
                            🇺🇸 English
                        </button>
                        <button
                            onClick={() => setLang('hi')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${lang === 'hi' ? 'bg-white text-slate-900 shadow' : 'text-white hover:bg-white/10'}`}
                        >
                            🇮🇳 हिन्दी
                        </button>
                    </div>
                </div>

                {/* scroll cue */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
                    <ChevronDown className="h-6 w-6" />
                </div>
            </section>

            {/* ── Story card ───────────────────────────── */}
            <section className="max-w-4xl mx-auto px-6 -mt-10 relative z-10">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 p-10 sm:p-14 border border-slate-100">

                    {lang === 'en' ? (
                        <EnglishContent />
                    ) : (
                        <HindiContent />
                    )}
                </div>
            </section>

            {/* ── Values grid ─────────────────────────── */}
            <section className="max-w-5xl mx-auto px-6 mt-16">
                <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12">
                    {lang === 'en' ? 'What We Stand For' : 'हम किसके लिए खड़े हैं'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values(lang).map((v, i) => (
                        <div
                            key={i}
                            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
                        >
                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${v.bg} group-hover:scale-110 transition-transform`}>
                                {v.icon}
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">{v.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Tagline banner ──────────────────────── */}
            <section className="max-w-5xl mx-auto px-6 mt-16">
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-12 text-center text-white">
                    <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-amber-400/10 rounded-full blur-2xl" />
                    <Home className="h-10 w-10 mx-auto mb-5 text-amber-400 relative z-10" />
                    <p className="text-2xl sm:text-3xl font-extrabold relative z-10 leading-snug max-w-2xl mx-auto">
                        {lang === 'en'
                            ? '"Everything your home needs should feel like family."'
                            : '"घर की हर चीज़ परिवार जैसी लगनी चाहिए।"'}
                    </p>
                    <p className="mt-4 text-indigo-200 text-sm font-semibold tracking-widest uppercase relative z-10">— HomeNPlay</p>
                </div>
            </section>
        </div>
    );
};

/* ── English body ────────────────────────────── */
const EnglishContent: React.FC = () => (
    <div className="space-y-8 text-slate-700 text-lg leading-relaxed">
        <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">🏠</span>
            <h2 className="text-2xl font-extrabold text-slate-900">About Us</h2>
        </div>

        <p>
            <span className="font-bold text-slate-900">HomeNPlay is more than just a store</span> — it's a brand built
            around the idea of <span className="text-indigo-600 font-semibold">family, warmth, and togetherness</span>.
        </p>

        <p>
            We believe a home is not just a place; it's where <em>memories are created, laughter is shared, and families
                grow closer every day.</em> Our goal is to make everyday living easier, happier, and more meaningful by offering
            thoughtfully selected products that truly add value to your life.
        </p>

        <p>
            From practical <span className="font-semibold text-slate-900">home essentials and décor</span> to smart
            <span className="font-semibold text-slate-900"> kitchen solutions</span> and
            <span className="font-semibold text-slate-900"> engaging toys for kids</span>, every product at HomeNPlay
            is chosen with care, keeping modern families in mind. We focus on
            <span className="text-indigo-600 font-semibold"> quality, usefulness, and affordability</span> so that you
            can shop with confidence and bring home products that feel right.
        </p>

        <blockquote className="border-l-4 border-amber-400 pl-6 py-2 bg-amber-50 rounded-r-2xl">
            <p className="text-amber-800 font-semibold italic">
                "At HomeNPlay, we don't just deliver products — we deliver comfort, convenience, and a feeling of belonging."
            </p>
        </blockquote>

        <p className="font-medium text-slate-800">
            Because we believe <span className="text-indigo-600 font-bold">everything your home needs should feel like family.</span>
        </p>
    </div>
);

/* ── Hindi body ──────────────────────────────── */
const HindiContent: React.FC = () => (
    <div className="space-y-8 text-slate-700 text-lg leading-relaxed" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
        <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">💛</span>
            <h2 className="text-2xl font-extrabold text-slate-900">हमारे बारे में</h2>
        </div>

        <p>
            <span className="font-bold text-slate-900">HomeNPlay सिर्फ एक स्टोर नहीं है</span> — यह एक ऐसा ब्रांड है जो
            <span className="text-indigo-600 font-semibold"> परिवार, अपनापन और खुशियों के एहसास</span> पर आधारित है।
        </p>

        <p>
            हम मानते हैं कि घर सिर्फ रहने की जगह नहीं होता, बल्कि वह जगह होती है जहाँ
            <em> यादें बनती हैं, हँसी गूँजती है और परिवार और करीब आता है।</em> हमारा उद्देश्य ऐसे प्रोडक्ट्स
            उपलब्ध कराना है जो आपकी रोज़मर्रा की ज़िंदगी को आसान, खुशहाल और बेहतर बनाएं।
        </p>

        <p>
            होम एसेंशियल्स और डेकोर से लेकर
            <span className="font-semibold text-slate-900"> किचन सॉल्यूशंस </span>और
            <span className="font-semibold text-slate-900"> बच्चों के लिए मजेदार व लर्निंग प्रोडक्ट्स</span> तक —
            HomeNPlay का हर प्रोडक्ट सोच-समझकर चुना जाता है, ताकि वह आपके परिवार की जरूरतों और भरोसे पर खरा उतरे।
            हम <span className="text-indigo-600 font-semibold">गुणवत्ता, उपयोगिता और सही कीमत</span> पर ध्यान देते
            हैं ताकि आप बिना चिंता के खरीदारी कर सकें।
        </p>

        <blockquote className="border-l-4 border-amber-400 pl-6 py-2 bg-amber-50 rounded-r-2xl">
            <p className="text-amber-800 font-semibold italic">
                "HomeNPlay सिर्फ प्रोडक्ट्स नहीं देता — हम आराम, सुविधा और अपनेपन का एहसास पहुँचाते हैं।"
            </p>
        </blockquote>

        <p className="font-medium text-slate-800">
            क्योंकि हमारा मानना है कि{' '}
            <span className="text-indigo-600 font-bold">घर की हर चीज़ परिवार जैसी लगनी चाहिए।</span>
        </p>
    </div>
);

/* ── Values data ─────────────────────────────── */
const values = (lang: Lang) => [
    {
        icon: <Heart className="h-7 w-7 text-rose-600" />,
        bg: 'bg-rose-50',
        title: lang === 'en' ? 'Family First' : 'परिवार पहले',
        desc: lang === 'en' ? 'Every decision we make starts with your family in mind.' : 'हर फैसला आपके परिवार को ध्यान में रखकर लिया जाता है।',
    },
    {
        icon: <Star className="h-7 w-7 text-amber-500" />,
        bg: 'bg-amber-50',
        title: lang === 'en' ? 'Quality You Trust' : 'भरोसेमंद गुणवत्ता',
        desc: lang === 'en' ? 'Only handpicked products that meet our quality standard.' : 'सिर्फ वो प्रोडक्ट जो हमारे गुणवत्ता मानक पर खरे उतरते हैं।',
    },
    {
        icon: <Package className="h-7 w-7 text-indigo-600" />,
        bg: 'bg-indigo-50',
        title: lang === 'en' ? 'Smart Value' : 'सही कीमत',
        desc: lang === 'en' ? 'Great products at prices that make sense for every home.' : 'हर घर के लिए सही दाम पर बेहतरीन प्रोडक्ट।',
    },
    {
        icon: <Smile className="h-7 w-7 text-emerald-600" />,
        bg: 'bg-emerald-50',
        title: lang === 'en' ? 'Happy Homes' : 'खुशहाल घर',
        desc: lang === 'en' ? 'We succeed when your home feels lively and complete.' : 'जब आपका घर खुशहाल हो, तभी हम सफल हैं।',
    },
];
