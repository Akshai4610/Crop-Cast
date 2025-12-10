import { motion } from "framer-motion";

/*
  DashboardSection Component
  - Displays main user dashboard content
  - Animated on scroll
*/
const DashboardSection = () => {
  return (
    <section
      id="dashboard"
      className="min-h-screen bg-green-50 py-16 px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">
          Dashboard
        </h2>
        <p className="text-green-700 text-center">
          This is your dashboard where you can see your crop recommendations and updates.
        </p>
      </motion.div>
    </section>
  );
};

export default DashboardSection;
