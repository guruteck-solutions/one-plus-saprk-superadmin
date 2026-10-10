import React from "react";
import { MessageCircle } from "lucide-react";
import "../../css/painter/PainterWhatsAppSupport.css";

const PainterWhatsAppSupport = () => {
  const handleOpenWhatsApp = () => {
    window.open("https://wa.me/911234567890", "_blank");
  };

  return (
    <div className="painter-whatsapp-support-page">
      <div className="painter-whatsapp-support-header">
        <h1>WhatsApp Support</h1>
        <p>Oneplus Spark PAINTS • Painter experience</p>
      </div>

      <div className="painter-whatsapp-support-card">
        <div className="painter-whatsapp-support-icon">
          <MessageCircle size={24} />
        </div>

        <h2>WhatsApp Support</h2>

        <p className="painter-whatsapp-support-text">
          Chat with our support team
        </p>

        <button
          type="button"
          className="painter-whatsapp-open-button"
          onClick={handleOpenWhatsApp}
        >
          <MessageCircle size={15} />
          <span>Open WhatsApp</span>
        </button>

        <p className="painter-whatsapp-response-time">
          Typical response time: within 10 minutes
        </p>
      </div>
    </div>
  );
};

export default PainterWhatsAppSupport;