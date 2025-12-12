// src/sections/ContactSection.jsx
/*
  Contact Section
  - Properly aligned form
  - Modern inputs
*/

import { Element } from "react-scroll";

const ContactSection = () => {
  return (
    <Element name="contact">
      <section className="py-24 bg-gray-900 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Contact Us</h2>

          <form className="grid md:grid-cols-2 gap-6 bg-gray-800 p-8 rounded-2xl shadow-lg">
            <input
              type="text"
              placeholder="Your Name"
              className="p-4 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="p-4 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            <textarea
              placeholder="Your Message"
              rows="4"
              className="md:col-span-2 p-4 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            <button
              type="submit"
              className="md:col-span-2 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-semibold hover:scale-105 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </Element>
  );
};

export default ContactSection;
