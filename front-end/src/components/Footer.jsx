export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12 mt-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* Left */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-lime-300">CropCast</h2>
          <p className="text-gray-300">
            Smart weather-based crop guidance for every farmer.
            Accurate predictions, trusted insights.
          </p>
        </div>

        {/* Middle */}
        <div>
          <h3 className="text-xl mb-4 font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#home" className="hover:text-lime-300">Home</a></li>
            <li><a href="#about" className="hover:text-lime-300">About</a></li>
            <li><a href="#services" className="hover:text-lime-300">Services</a></li>
            <li><a href="#contact" className="hover:text-lime-300">Contact</a></li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <h3 className="text-xl mb-4 font-semibold">Contact</h3>
          <p className="text-gray-300">📍 Kerala, India</p>
          <p className="text-gray-300">✉ cropcast@gmail.com</p>
          <p className="text-gray-300">📞 +91 98765 43210</p>
        </div>
      </div>

      <p className="text-center text-gray-400 mt-8">
        © {new Date().getFullYear()} CropCast. All Rights Reserved.
      </p>
    </footer>
  );
}
