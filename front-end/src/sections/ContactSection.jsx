import { motion } from "framer-motion";

/*
  ContactSection Component
  - Contact form for users to reach out
  - Animated fade-in of form on scroll
*/
const ContactSection = () => {
  return (
    <section
      id="contact"
      className="min-h-screen bg-green-100 py-16 px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">
          Contact Us
        </h2>
        <form className="bg-white p-8 rounded shadow-md flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-green-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border border-green-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <textarea
            placeholder="Your Message"
            className="border border-green-300 rounded px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-green-600"
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default ContactSection;
