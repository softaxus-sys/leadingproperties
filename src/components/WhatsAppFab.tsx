import { MessageCircle } from "lucide-react";
import { site } from "@/lib/content";
import { whatsappLink } from "@/lib/format";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(site.contact.whatsapp, "Hello Leading Properties, I'd like some help finding a property.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-[#25D366] p-4 text-white shadow-lg transition hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
