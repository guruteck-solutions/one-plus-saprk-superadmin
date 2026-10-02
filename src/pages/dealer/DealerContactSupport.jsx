import React from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";
import "../../css/dealer/DealerContactSupport.css";

const SUPPORT_PHONE = "+919529624837";
const DISPLAY_PHONE = "+91 95296 24837";
const SUPPORT_EMAIL = "swarup1salunke@gmail.com";

const DealerContactSupport = () => {
  const handleCall = () => {
    window.location.href = `tel:${SUPPORT_PHONE}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${SUPPORT_PHONE}`, "_blank");
  };

  const handleEmail = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}`;
  };

  return (
    <div className="dealer-contact-support-page">
      <div className="dealer-contact-support-header">
        <h1>Contact Support</h1>
        <p>Get in touch with our support team</p>
      </div>

      <div className="dealer-support-grid">
        <div className="dealer-support-card">
          <div className="dealer-support-icon whatsapp-icon">
            <MessageCircle size={25} />
          </div>

          <div className="dealer-support-content">
            <h3>WhatsApp</h3>
            <p>{DISPLAY_PHONE}</p>
            <button
              type="button"
              className="dealer-support-btn whatsapp-btn"
              onClick={handleWhatsApp}
            >
              <MessageCircle size={17} />
              Chat on WhatsApp
            </button>
          </div>
        </div>

        <div className="dealer-support-card">
          <div className="dealer-support-icon phone-icon">
            <Phone size={25} />
          </div>

          <div className="dealer-support-content">
            <h3>Phone</h3>
            <p>{DISPLAY_PHONE}</p>
            <button
              type="button"
              className="dealer-support-btn phone-btn"
              onClick={handleCall}
            >
              <Phone size={17} />
              Call Support
            </button>
          </div>
        </div>

        <div className="dealer-support-card">
          <div className="dealer-support-icon email-icon">
            <Mail size={25} />
          </div>

          <div className="dealer-support-content">
            <h3>Email</h3>
            <p>{SUPPORT_EMAIL}</p>
            <button
              type="button"
              className="dealer-support-btn email-btn"
              onClick={handleEmail}
            >
              <Mail size={17} />
              Email Support
            </button>
          </div>
        </div>

        <div className="dealer-support-card dealer-address-card">
          <div className="dealer-support-icon address-icon">
            <MapPin size={25} />
          </div>

          <div className="dealer-support-content">
            <h3>Office Address</h3>
            <p>Office address will be available here.</p>

            <button
              type="button"
              className="dealer-support-btn address-btn"
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/XN5qpcvxKop6fW1w5",
                  "_blank"
                )
              }
            >
              <ExternalLink size={17} />
              View Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerContactSupport;