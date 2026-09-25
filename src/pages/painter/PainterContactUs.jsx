import React from "react";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import "../../css/painter/PainterContactUs.css";

const PainterContactUs = () => {
  const handleCall = () => {
    window.location.href = "tel:+911234567890";
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/911234567890", "_blank");
  };

  const handleEmail = () => {
    window.location.href = "mailto:support@oneplusspark.in";
  };

  return (
    <div className="painter-contact-us-page">
      <div className="painter-contact-us-header">
        <h1>Contact Us</h1>
        <p>Oneplus Spark PAINTS • Painter experience</p>
      </div>

      <div className="painter-contact-us-card">
        <h2>Contact Us</h2>

        <div className="painter-contact-us-grid">

          <div className="painter-contact-item">
            <div className="painter-contact-icon painter-phone-icon">
              <Phone size={15} />
            </div>

            <div className="painter-contact-info">
              <h3>Phone Support</h3>
              <p>+91 12345 67890</p>
            </div>

            <button
              type="button"
              className="painter-contact-button painter-phone-button"
              onClick={handleCall}
            >
              Contact
            </button>
          </div>

          <div className="painter-contact-item">
            <div className="painter-contact-icon painter-whatsapp-icon">
              <MessageCircle size={15} />
            </div>

            <div className="painter-contact-info">
              <h3>WhatsApp</h3>
              <p>+91 12345 67890</p>
            </div>

            <button
              type="button"
              className="painter-contact-button painter-whatsapp-button"
              onClick={handleWhatsApp}
            >
              Contact
            </button>
          </div>

          <div className="painter-contact-item">
            <div className="painter-contact-icon painter-email-icon">
              <Mail size={15} />
            </div>

            <div className="painter-contact-info">
              <h3>Email</h3>
              <p>support@oneplusspark.in</p>
            </div>

            <button
              type="button"
              className="painter-contact-button painter-email-button"
              onClick={handleEmail}
            >
              Contact
            </button>
          </div>

          <div className="painter-contact-item">
            <div className="painter-contact-icon painter-office-icon">
              <MapPin size={15} />
            </div>

            <div className="painter-contact-info">
              <h3>Office</h3>
              <p>Latur, Maharashtra</p>
            </div>

            <button
              type="button"
              className="painter-contact-button painter-office-button"
            >
              Contact
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PainterContactUs;