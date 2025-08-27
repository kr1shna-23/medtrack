import { Link } from "react-router-dom"
import { Heart, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#FFEDD5]/50 to-white/70 backdrop-blur-md border-t border-[#F97316]/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-3 sm:mb-4">
              <img src="/logo.png" alt="MedTrack Logo" className="h-8 sm:h-10 w-auto" />
            </div>
            <p className="text-[#555555] mb-3 sm:mb-4 max-w-md text-sm sm:text-base">
              Helping patients and caregivers manage medications with smart reminders, tracking, and insights for better
              health outcomes.
            </p>
            <div className="flex items-center text-[#F97316]">
              <Heart size={14} className="sm:w-4 sm:h-4 mr-2" />
              <span className="text-xs sm:text-sm text-[#555555]">Made with care for your health</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#1A1A1A] mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-[#555555] hover:text-[#F97316] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-[#555555] hover:text-[#F97316] transition-colors text-sm"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-[#555555] hover:text-[#F97316] transition-colors text-sm"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-[#555555] hover:text-[#F97316] transition-colors text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <Link to="/login" className="text-[#555555] hover:text-[#F97316] transition-colors text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-[#555555] hover:text-[#F97316] transition-colors text-sm">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-[#1A1A1A] mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#555555] hover:text-[#F97316] transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-[#555555] hover:text-[#F97316] transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#555555] hover:text-[#F97316] transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-[#555555] hover:text-[#F97316] transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-[#F97316]/10 pt-6 sm:pt-8 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center justify-center sm:justify-start">
              <Mail size={14} className="sm:w-4 sm:h-4 text-[#F97316] mr-2" />
              <span className="text-[#555555] text-xs sm:text-sm">support@medtrack.com</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <Phone size={14} className="sm:w-4 sm:h-4 text-[#F97316] mr-2" />
              <span className="text-[#555555] text-xs sm:text-sm">1-800-MEDTRACK</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <MapPin size={14} className="sm:w-4 sm:h-4 text-[#F97316] mr-2" />
              <span className="text-[#555555] text-xs sm:text-sm">Available Worldwide</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-[#F97316]/10">
          <p className="text-[#555555] text-xs sm:text-sm mb-4 md:mb-0">© 2024 MedTrack. All rights reserved.</p>
          <div className="flex space-x-4 sm:space-x-6">
            <a href="#" className="text-[#555555] hover:text-[#F97316] transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-[#555555] hover:text-[#F97316] transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="#" className="text-[#555555] hover:text-[#F97316] transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
