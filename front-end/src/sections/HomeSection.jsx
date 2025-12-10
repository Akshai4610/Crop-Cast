import { motion } from "framer-motion";

/*
  HomeSection Component
  - Hero section for landing page
  - Animated welcome text
  - Background and CTA buttons
*/
const HomeSection = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center bg-linear-to-r from-green-100 to-green-200"
    >
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold text-green-800 mb-6 text-center"
      >
        Welcome to CropCast
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-xl text-green-700 mb-6 text-center"
      >
        Smart Weather-Based Crop Recommendation System
      </motion.p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition-all duration-300"
      >
        Explore
      </motion.button>
    </section>
  );
};

export default HomeSection;
