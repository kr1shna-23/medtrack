"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "FEATURES", path: "#features", isScroll: true },
    { name: "FAQ", path: "#faq", isScroll: true },
    { name: "ABOUT US", path: "#about", isScroll: true },
  ]

  const handleNavClick = (item) => {
    if (item.isScroll) {
      const elementId = item.path.substring(1) // Remove the # from the path
      const element = document.getElementById(elementId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="MedTrack Logo" className="h-8 sm:h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) =>
              item.isScroll ? (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="text-[#555555] hover:text-[#F97316] transition-all duration-300 text-sm font-medium tracking-wide relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F97316] transition-all duration-300 group-hover:w-full"></span>
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-[#555555] hover:text-[#F97316] transition-all duration-300 text-sm font-medium tracking-wide relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F97316] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ),
            )}
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link
              to="/signup"
              className="text-[#555555] hover:text-[#F97316] transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-[#F97316] text-white px-4 lg:px-5 py-2 lg:py-3 rounded-lg hover:bg-[#F97316]/90 transition-all duration-300 text-sm lg:text-base font-medium"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#1A1A1A] hover:text-[#F97316] transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 px-4 bg-white rounded-lg mt-2 border border-gray-100 shadow-lg">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) =>
                item.isScroll ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className="text-left text-[#555555] hover:text-[#F97316] transition-colors duration-300 text-sm font-medium tracking-wide"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-[#555555] hover:text-[#F97316] transition-colors duration-300 text-sm font-medium tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ),
              )}
              <div className="pt-4 border-t border-gray-100">
                <Link
                  to="/signup"
                  className="block text-[#555555] hover:text-[#F97316] transition-colors duration-300 text-sm font-medium tracking-wide mb-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="block bg-[#F97316] text-white px-5 py-3 rounded-lg hover:bg-[#F97316]/90 transition-all duration-300 text-base font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
