import React from 'react';
import { X, HeadphonesIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SupportInfoModalProps {
  topic: 'about' | 'contact' | 'terms' | 'privacy' | 'help' | null;
  onClose: () => void;
}

export function SupportInfoModal({ topic, onClose }: SupportInfoModalProps) {
  const { lang, t } = useLanguage();
  if (!topic) return null;

  const titles: Record<NonNullable<SupportInfoModalProps['topic']>, string> = {
    about: t.footer.about,
    contact: t.footer.contact,
    terms: t.footer.terms,
    privacy: t.footer.privacy,
    help: t.footer.help,
  };

  const contentMr: Record<NonNullable<SupportInfoModalProps['topic']>, string> = {
    about:
      'FarmRent हे महाराष्ट्रातील शेतकऱ्यांना जवळच्या गावातील ट्रॅक्टर, रोटाव्हेटर, हार्वेस्टर व इतर शेतीची यंत्रे परवडणाऱ्या दरात भाड्याने मिळावीत यासाठी तयार केलेले प्लॅटफॉर्म आहे.',
    contact:
      'शेतकरी आणि यंत्र मालक सहाय्यासाठी: support@farmrent.example (डेमो प्रिव्ह्यू संपर्क). प्रत्यक्ष बुकिंगसाठी संबंधित यंत्र मालकाच्या प्रोफाइलवरील कॉल किंवा WhatsApp बटनाचा वापर करा.',
    terms:
      'यंत्र मालकाने बुकिंग स्वीकारल्यानंतरच बुकिंग निश्चित होते. कामापूर्वी इंधन, ऑपरेटर आणि भाड्याच्या अटींची खात्री करावी.',
    privacy:
      'तुमचे गाव, नाव आणि संपर्क माहिती केवळ बुकिंग समन्वयासाठी संबंधित शेतकरी किंवा यंत्र मालकासोबत शेअर केली जाते.',
    help:
      '१) यंत्र बाजारात जाऊन तुमचे गाव निवडा. २) योग्य दर व अंतर पाहून बुकिंग विनंती पाठवा. ३) मालकाची मंजुरी मिळाल्यावर शेतात काम पूर्ण करा.',
  };

  const contentEn: Record<NonNullable<SupportInfoModalProps['topic']>, string> = {
    about:
      'FarmRent connects farmers across Maharashtra with nearby tractor and agricultural machinery owners for transparent hourly, daily, and per-acre rentals.',
    contact:
      'Farmer & Owner Support Desk: support@farmrent.example (Demo preview desk). For booking coordination, use the Call or WhatsApp links on equipment pages.',
    terms:
      'Booking requests remain Pending until explicitly accepted by the equipment owner. Farmers and owners may cancel upcoming bookings prior to the scheduled start date.',
    privacy:
      'Location data is used solely to calculate distance to nearby agricultural equipment. Personal contact information is shared only for active booking coordination.',
    help:
      'Step 1: Choose your taluka or district. Step 2: Filter machines by price, distance, and date. Step 3: Submit a booking request and track status under Bookings.',
  };

  const body = lang === 'en' ? contentEn[topic] : contentMr[topic];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8DF] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#14532D]">
            <HeadphonesIcon className="w-5 h-5" />
            <h3 className="text-lg font-bold">{titles[topic]}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#5A655C] hover:bg-[#EFF4EC] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#374139] leading-relaxed">{body}</p>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[44px] rounded-xl bg-[#14532D] text-white text-sm font-semibold cursor-pointer"
        >
          {t.common.close}
        </button>
      </div>
    </div>
  );
}
