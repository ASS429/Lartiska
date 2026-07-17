import { useSettings } from '@/hooks/useApi';
import { whatsappLink } from '@/utils/format';

export function WhatsAppButton() {
  const { data: settings } = useSettings();
  const number = settings?.['contact.whatsapp'] || import.meta.env.VITE_WHATSAPP_NUMBER || '221773468681';
  const href = whatsappLink(number, 'Bonjour Lartiska, je souhaite échanger sur un projet.');

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="
        fixed z-40 bg-[#25D366] text-white
        bottom-4 right-4 sm:bottom-6 sm:right-6
        w-12 h-12 sm:w-auto sm:h-auto
        sm:flex sm:items-center sm:gap-3 sm:pl-3 sm:pr-5 sm:py-3
        grid place-items-center rounded-full
        shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)]
        transition-all duration-500 ease-cinema
        hover:scale-[1.06] hover:shadow-[0_15px_40px_-12px_rgba(37,211,102,0.75)]
      "
    >
      <span className="grid place-items-center w-7 h-7 sm:w-9 sm:h-9 rounded-full sm:bg-white/15 sm:backdrop-blur">
        <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
          <path d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.7 5.4 2 7.7L0 32l8.5-2.2c2.2 1.2 4.7 1.8 7.5 1.8h.0c8.6 0 15.6-7 15.6-15.6S24.6.4 16 .4zm9 22.4c-.4 1.1-2 2-2.9 2.1-.7.1-1.6.1-2.6-.2-3.6-1.1-6-4.7-6.2-5-.2-.2-1.5-2-1.5-3.8 0-1.8.9-2.7 1.3-3.1.3-.4.7-.4 1-.4l.7 0c.2 0 .5-.1.8.6.3.7 1 2.4 1.1 2.6.1.2.1.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.5-.6.7-.2.2-.4.4-.2.7.2.4.9 1.5 2 2.4 1.4 1.2 2.5 1.5 2.9 1.7.4.2.6.1.8-.1.2-.2.9-1 1.1-1.4.2-.4.4-.3.7-.2.3.1 2 .9 2.3 1.1.3.2.6.2.7.4.1.2.1 1-.3 2z" />
        </svg>
      </span>
      <span className="hidden sm:inline text-sm font-semibold">WhatsApp</span>
    </a>
  );
}
