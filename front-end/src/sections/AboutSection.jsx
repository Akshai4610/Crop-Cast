import { motion } from "framer-motion";

/*
  AboutSection Component
  - Describes the project and objectives
  - Animated fade-in on scroll
*/
const AboutSection = () => {
  return (
    <section
      id="about"
      className="min-h-screen bg-white py-16 px-6"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold text-green-800 mb-6">About CropCast</h2>
        <p className="text-green-700 text-lg">
          CropCast is a weather-based crop recommendation system designed to help farmers
          select the most suitable crops for cultivation. Using real-time weather data and
          predictive analytics, CropCast provides actionable insights for better yield.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
