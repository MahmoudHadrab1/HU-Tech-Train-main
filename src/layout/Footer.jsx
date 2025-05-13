import React from "react";
import {
  Home,
  Info,
  HelpCircle,
  GraduationCap,
  Building2,
  Users,
  UserPlus,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

// This would normally use React Router's Link and useNavigate
// For demo purposes, we're using simple components
const Link = ({ to, children, className, onClick }) => (
  <a
    href={to}
    className={className}
    onClick={(e) => {
      e.preventDefault();
      if (onClick) onClick();
    }}
  >
    {children}
  </a>
);

const useNavigate = () => {
  return (page) => {
    console.log(`Navigating to: ${page}`);
  };
};

const Footer = ({ activeTab }) => {
  const navigate = useNavigate();

  // Handle navigation
  const handleNavClick = (page) => {
    // Navigate and scroll to top
    navigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle How It Works scroll with tab selection
  const handleHowItWorksClick = () => {
    // First navigate to home page if not already there
    navigate("/");

    // Then scroll to the How It Works section
    setTimeout(() => {
      const howItWorksSection = document.getElementById("how-it-works");
      if (howItWorksSection) {
        howItWorksSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <footer className="bg-gray-100 text-gray-800 py-12 mt-12 border-t-4 border-red-600 shadow-inner">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div
              className="flex items-center mb-4 cursor-pointer"
              onClick={() => handleNavClick("/")}
            >
              <GraduationCap className="text-red-600 mr-2" size={24} />
              <h2 className="text-2xl font-bold">
                <span className="text-red-600">HU-</span>
                Tech Train
              </h2>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Building bridges between education and industry through quality
              internships and training opportunities.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <SocialButton icon={<Facebook size={20} />} />
              <SocialButton icon={<Instagram size={20} />} />
              <SocialButton icon={<Twitter size={20} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2 text-gray-700 flex items-center">
              <Info className="mr-2 text-red-600" size={18} />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <FooterLink icon={<Home size={16} />} text="Home" to="/" />
              <FooterLink icon={<Info size={16} />} text="About" to="/about" />
              <FooterLink
                icon={<HelpCircle size={16} />}
                text="How It Works"
                isButton
                onClick={handleHowItWorksClick}
              />
            </ul>
          </div>

          {/* For Users */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2 text-gray-700 flex items-center">
              <Users className="mr-2 text-red-600" size={18} />
              For Users
            </h3>
            <ul className="space-y-3">
              <FooterLink
                icon={<GraduationCap size={16} />}
                text="Students"
                to="/login/student"
              />
              <FooterLink
                icon={<Building2 size={16} />}
                text="Companies"
                to="/login/company"
              />
              <FooterLink
                icon={<Users size={16} />}
                text="Department Head"
                to="/login/department"
              />
              <FooterLink
                icon={<UserPlus size={16} />}
                text="Register"
                to="/register"
              />
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2 text-gray-700 flex items-center">
              <Phone className="mr-2 text-red-600" size={18} />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 hover:text-red-600 transition-colors">
                  contact@hutechtrain.edu.jo
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 hover:text-red-600 transition-colors">
                  +962 5 3903333
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} HU-Tech Train. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Component for footer links
const FooterLink = ({ icon, text, to, isButton, onClick }) => {
  if (isButton) {
    return (
      <li>
        <button
          className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
          onClick={onClick}
        >
          <span className="mr-2">{icon}</span>
          {text}
        </button>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={to}
        className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
      >
        <span className="mr-2">{icon}</span>
        {text}
      </Link>
    </li>
  );
};

// Component for social media buttons
const SocialButton = ({ icon }) => (
  <a
    href="#"
    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-600 hover:text-white transition-colors"
  >
    {icon}
  </a>
);

export default Footer;
