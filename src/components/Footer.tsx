import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link 
              to="/" 
              className="group inline-flex items-center"
            >
              <span className="bg-gradient-to-r from-[#a100ff] to-[#8000ff] bg-clip-text text-transparent text-3xl font-bold">
                ORentit
              </span>
              <ArrowUpRight className="h-5 w-5 text-[#a100ff] opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" />
            </Link>
            <p className="mt-6 text-gray-600 text-sm leading-relaxed">
              Your trusted platform for renting anything, anywhere. Join our community of renters and owners today.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-semibold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/about" 
                  className="group text-gray-600 hover:text-[#a100ff] transition-colors inline-flex items-center"
                >
                  <span className="relative">
                    About Us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a100ff] group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/how-it-works" 
                  className="group text-gray-600 hover:text-[#a100ff] transition-colors inline-flex items-center"
                >
                  <span className="relative">
                    How It Works
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a100ff] group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/list-item" 
                  className="group text-gray-600 hover:text-[#a100ff] transition-colors inline-flex items-center"
                >
                  <span className="relative">
                    List Your Item
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a100ff] group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="group text-gray-600 hover:text-[#a100ff] transition-colors inline-flex items-center"
                >
                  <span className="relative">
                    Contact Us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a100ff] group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-semibold mb-6 text-lg">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/terms" 
                  className="group text-gray-600 hover:text-[#a100ff] transition-colors inline-flex items-center"
                >
                  <span className="relative">
                    Terms of Service
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a100ff] group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="group text-gray-600 hover:text-[#a100ff] transition-colors inline-flex items-center"
                >
                  <span className="relative">
                    Privacy Policy
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a100ff] group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className="group text-gray-600 hover:text-[#a100ff] transition-colors inline-flex items-center"
                >
                  <span className="relative">
                    Cookie Policy
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a100ff] group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/safety" 
                  className="group text-gray-600 hover:text-[#a100ff] transition-colors inline-flex items-center"
                >
                  <span className="relative">
                    Safety Guidelines
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a100ff] group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-semibold mb-6 text-lg">Connect With Us</h3>
            <div className="flex space-x-5 mb-8">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gray-50 p-3 rounded-full hover:bg-[#a100ff]/5 transition-colors duration-300"
              >
                <Facebook className="h-5 w-5 text-gray-600 group-hover:text-[#a100ff] transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gray-50 p-3 rounded-full hover:bg-[#a100ff]/5 transition-colors duration-300"
              >
                <Instagram className="h-5 w-5 text-gray-600 group-hover:text-[#a100ff] transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gray-50 p-3 rounded-full hover:bg-[#a100ff]/5 transition-colors duration-300"
              >
                <Twitter className="h-5 w-5 text-gray-600 group-hover:text-[#a100ff] transition-colors" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gray-50 p-3 rounded-full hover:bg-[#a100ff]/5 transition-colors duration-300"
              >
                <Youtube className="h-5 w-5 text-gray-600 group-hover:text-[#a100ff] transition-colors" />
              </a>
            </div>
            <div className="group bg-gray-50 rounded-2xl p-4 hover:bg-[#a100ff]/5 transition-all duration-300">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5 group-hover:text-[#a100ff] transition-colors" />
                <a 
                  href="mailto:contact@orentit.com" 
                  className="group-hover:text-[#a100ff] transition-colors text-sm"
                >
                  contact@orentit.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} ORentit. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0">
              <select
                className="bg-gray-50 border-0 rounded-xl text-gray-600 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a100ff] focus:ring-opacity-50 hover:bg-[#a100ff]/5 transition-colors cursor-pointer"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 