
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Home,
  Info,
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
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);
  
  // Check if current path is a dashboard path to hide footer
  useEffect(() => {
    const isDashboardPath = location.pathname.includes('/dashboard');
    setShowFooter(!isDashboardPath);
  }, [location.pathname]);
  
  // Don't render the footer on dashboard pages
  if (!showFooter) return null;

  return (
    <footer className="bg-gray-100 text-gray-800 py-12 mt-12 border-t-4 border-red-600 shadow-inner">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <RouterLink
              to="/"
              className="flex items-center mb-4 cursor-pointer"
            >
              <GraduationCap className="text-red-600 mr-2" size={24} />
              <h2 className="text-2xl font-bold">
                <span className="text-red-600">HU-</span>
                Tech Train
              </h2>
            </RouterLink>
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
              {/* "How It Works" link removed as requested */}
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
                to="/login/department-head"
              />
              <FooterLink
                icon={<UserPlus size={16} />}
                text="Register as Company"
                to="/verify"
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
                <a 
                  href="mailto:contact@hutechtrain.edu.jo"
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  contact@hutechtrain.edu.jo
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <a 
                  href="tel:+96253903333"
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  +962 5 3903333
                </a>
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
const FooterLink = ({ icon, text, to }) => {
  return (
    <li>
      <RouterLink
        to={to}
        className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
      >
        <span className="mr-2">{icon}</span>
        {text}
      </RouterLink>
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