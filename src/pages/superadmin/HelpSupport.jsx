import React, { useState } from "react";
import {
  ChevronDown,
  Mail,
  Phone,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

import "../../css/helpsupport.css";

const faqData = [
  {
    question: "How do I log in to the CRM?",
    answer:
      "Use your registered login credentials to sign in to the CRM. If you are unable to log in, contact the support team.",
  },
  {
    question: "How can I update my profile information?",
    answer:
      "Open your profile or account settings and update the available information. Save the changes after editing.",
  },
  {
    question: "How can I change my password?",
    answer:
      "Go to your account or profile settings and use the password change option to update your password.",
  },
  {
    question: "How can I upload or change my profile photo?",
    answer:
      "Open your profile settings, select the profile photo option, choose an image from your device, and save the changes.",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "Use the available password recovery option on the login page. If you still cannot access your account, contact support.",
  },
  {
    question: "Why can't I access a particular feature or page?",
    answer:
      "Access to some features may depend on your user role and permissions. If you believe you should have access, contact your administrator or support team.",
  },
  {
    question: "What should I do if I find an error in the system?",
    answer:
      "Note the problem and, if possible, take a screenshot of the error. Contact the support team with the details so they can assist you.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can contact the support team through email, phone, or WhatsApp using the contact options provided below.",
  },
];

const HelpSupport = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const handleFaqClick = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="help-support-page">
      {/* PAGE HEADER */}
      <div className="help-support-header">
        <div className="help-support-title">
          <div className="help-support-title-icon">
            <HelpCircle size={22} />
          </div>

          <div>
            <h1>Help & Support</h1>
            <p>
              Find answers to common questions or contact our support team.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <section className="help-support-section">
        <div className="help-support-section-header">
          <div>
            <h2>Frequently Asked Questions</h2>
            <p>
              Find quick answers to commonly asked questions.
            </p>
          </div>
        </div>

        <div className="faq-list">
          {faqData.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                className={`faq-item ${isOpen ? "faq-item-open" : ""
                  }`}
                key={index}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => handleFaqClick(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`faq-chevron ${isOpen ? "faq-chevron-open" : ""
                      }`}
                  />
                </button>

                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT SUPPORT SECTION */}
      <section className="help-support-section support-contact-section">
        <div className="help-support-section-header">
          <div>
            <h2>Contact Support</h2>
            <p>
              Need further assistance? Get in touch with our support team.
            </p>
          </div>
        </div>

        <div className="support-contact-grid">
          {/* EMAIL */}
          <a
            href="mailto:support@oneplusspark.com"
            className="support-contact-card"
          >
            <div className="support-contact-icon">
              <Mail size={21} />
            </div>

            <div className="support-contact-content">
              <span className="support-contact-label">
                Email Support
              </span>

              <strong>
                support@oneplusspark.com
              </strong>

              <span className="support-contact-action">
                Send Email
              </span>
            </div>
          </a>

          {/* PHONE */}
          <a
            href="tel:+911234567890"
            className="support-contact-card"
          >
            <div className="support-contact-icon">
              <Phone size={21} />
            </div>

            <div className="support-contact-content">
              <span className="support-contact-label">
                Phone Support
              </span>

              <strong>
                +91 12345 67890
              </strong>

              <span className="support-contact-action">
                Call Support
              </span>
            </div>
          </a>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/911234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="support-contact-card"
          >
            <div className="support-contact-icon">
              <MessageCircle size={21} />
            </div>

            <div className="support-contact-content">
              <span className="support-contact-label">
                WhatsApp Support
              </span>

              <strong>
                +91 12345 67890
              </strong>

              <span className="support-contact-action">
                Chat on WhatsApp
              </span>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
};

export default HelpSupport;