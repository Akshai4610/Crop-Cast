import { motion } from "framer-motion";

/*
  ServicesSection Component
  - Displays main services/features of CropCast
  - Each feature shown as a card with hover animation
*/
const ServicesSection = () => {
  const services = [
    { title: "Weather Forecast", description: "Get accurate weather predictions for your crops." },
    { title: "Crop Recommendation", description: "Find the best crops based on weather & soil data." },
    { title: "Expert Tips", description: "Receive guidance from agricultural experts." },
  ];

  return (
    <section
      id="services"
      className="min-h-screen bg-green-50 py-16 px-6"
    >
      <h2 className="text-4xl font-bold text-center text-green-800 mb-12">
        Our Services
      </h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform duration-300"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">{service.title}</h3>
            <p className="text-green-600">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
