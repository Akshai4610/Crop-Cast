import { Link, useLocation } from "react-router-dom";
import { animateScroll as scroll, scroller } from "react-scroll";

/*
  Navbar Component
  - Fixed at top
  - Links: Home, Services, About, Contact, Login, Signup
  - Smooth scrolls to sections when on HomePage
  - Highlights current section
*/
const Navbar = () => {
  const location = useLocation();

  // Function to scroll to a section by id
  const scrollToSection = (id) => {
    if (location.pathname === "/") {
      scroller.scrollTo(id, {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
      });
    } else {
      // If not on home page, go to home page first
      window.location.href = `/#${id}`;
    }
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-600 cursor-pointer">
          CropCast
        </div>
        <ul className="flex space-x-6">
          <li>
            <button
              onClick={() => scrollToSection("home")}
              className="hover:text-green-800 transition-colors duration-300"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("services")}
              className="hover:text-green-800 transition-colors duration-300"
            >
              Services
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-green-800 transition-colors duration-300"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-green-800 transition-colors duration-300"
            >
              Contact
            </button>
          </li>
          <li>
            <Link
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="bg-white border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-100 transition-colors duration-300"
            >
              Signup
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
