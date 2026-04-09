// src/sections/ContactSection.jsx
import { useEffect, useRef, useState } from "react";
import { Element } from "react-scroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, MapPin, Mail, Phone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ── reusable field ── */
function Field({ label, type = "text", rows, name }) {
  const [focused, setFocused] = useState(false);
  const [value,   setValue]   = useState("");
  const Tag = rows ? "textarea" : "input";

  return (
    <div className="relative">
      <Tag
        type={type}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(value.trim() !== "")}
        className="w-full px-4 pt-5 pb-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200 resize-none"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${focused || value ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: focused ? "0 0 0 3px rgba(52,211,153,0.06)" : "none",
          minHeight: rows ? "120px" : undefined,
        }}
      />
      <label
        className="absolute left-4 transition-all duration-200 pointer-events-none"
        style={{
          top: focused || value ? "8px" : "50%",
          transform: (!rows && !focused && !value) ? "translateY(-50%)" : "none",
          fontSize: focused || value ? "10px" : "13px",
          color: focused ? "#34d399" : "rgba(255,255,255,0.35)",
          letterSpacing: focused || value ? "0.06em" : "0",
          fontWeight: focused || value ? 600 : 400,
        }}
      >
        {label}
      </label>
    </div>
  );
}

const ContactSection = () => {
  const sectionRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      gsap.fromTo(".contact-title",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".contact-title", start: "top 88%", once: true } }
      );

      gsap.fromTo(".contact-info",
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".contact-form", start: "top 85%", once: true } }
      );

      gsap.fromTo(".contact-form",
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".contact-form", start: "top 85%", once: true } }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1800);
  };

  return (
    <Element name="contact">
      <section
        ref={sectionRef}
        className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(2,8,7,0.95) 0%, rgba(2,10,8,1) 100%)" }}
      >
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.2), transparent)" }} />

        <div className="max-w-5xl mx-auto">

          {/* ── HEADLINE ── */}
          <div className="contact-title text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
              Get In Touch
            </span>
            <h2
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-white"
              style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}
            >
              Contact <span style={{ color: "#34d399" }}>Us</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">

            {/* ── LEFT: Contact info ── */}
            <div className="contact-info lg:col-span-2 space-y-6">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Have questions about CropCast? Our team is ready to help you get
                the best out of your farming decisions.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <MapPin size={14} />,  label: "Location",  value: "Kerala, India"          },
                  { icon: <Mail size={14} />,    label: "Email",     value: "support@cropcast.ai"    },
                  { icon: <Phone size={14} />,   label: "Phone",     value: "+91 98765 43210"        },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}
                    >
                      {icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">{label}</p>
                      <p className="text-sm text-gray-300">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative box */}
              <div
                className="mt-8 rounded-2xl p-5"
                style={{
                  background: "linear-gradient(135deg, rgba(5,150,105,0.12), rgba(2,8,6,0.5))",
                  border: "1px solid rgba(52,211,153,0.12)",
                }}
              >
                <p className="text-xs font-semibold text-emerald-400 mb-1">Response Time</p>
                <p className="text-2xl font-black text-white" style={{ fontFamily: "serif" }}>≤ 24h</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                  We reply to all inquiries within one business day.
                </p>
              </div>
            </div>

            {/* ── RIGHT: Form ── */}
            <div
              className="contact-form lg:col-span-3 rounded-2xl p-6 sm:p-8"
              style={{
                background: "linear-gradient(145deg, rgba(10,20,14,0.9), rgba(5,12,8,0.9))",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              }}
            >
              {/* Top accent */}
              <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)" }} />

              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }}
                  >
                    <Send size={24} style={{ color: "#34d399" }} />
                  </div>
                  <p className="text-lg font-bold text-white">Message Sent!</p>
                  <p className="text-sm text-gray-500 text-center">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-2 text-xs text-emerald-500 hover:text-emerald-400 underline"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Your Name"  name="name"  />
                    <Field label="Your Email" name="email" type="email" />
                  </div>
                  <Field label="Subject"  name="subject" />
                  <Field label="Your Message" name="message" rows={5} />

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background: sending ? "rgba(52,211,153,0.3)" : "linear-gradient(135deg, #059669, #34d399)",
                      boxShadow: sending ? "none" : "0 8px 24px rgba(52,211,153,0.3)",
                      cursor: sending ? "not-allowed" : "pointer",
                    }}
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Element>
  );
};

export default ContactSection;