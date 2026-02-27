"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react"

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Simulate network request
    setTimeout(() => {
      navigate("/app")
    }, 500)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFEDD5] via-white to-[#FED7AA] flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Signup Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 border border-[#F97316]/10">
          {/* Header */}
          <div className="mb-4 sm:mb-6 relative">
            <Link
              to="/"
              className="absolute left-0 top-0 inline-flex items-center text-[#555555] hover:text-[#F97316] transition-colors text-xs"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Home
            </Link>
            <div className="flex flex-col items-center pt-6 sm:pt-0">
              <img src="/logo.png" alt="MedTrack Logo" className="h-8 sm:h-10 w-auto mb-2 sm:mb-3" />
              <h1 className="text-xl sm:text-[22px] font-[700] text-[#1A1A1A] mb-1 sm:mb-2">Create Account</h1>
              <p className="text-[#555555] text-sm text-center">Start your medication tracking journey</p>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Benefits */}
          <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-[#F97316]/5 rounded-lg border border-[#F97316]/10">
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <CheckCircle size={14} className="text-[#F97316] flex-shrink-0" />
              <span className="text-[#555555]">Free forever • No credit card required</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-[#1A1A1A] mb-1 sm:mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555555]" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#1A1A1A] mb-1 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555555]" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-[#1A1A1A] mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555555]" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#555555] hover:text-[#F97316] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm font-medium text-[#1A1A1A] mb-1 sm:mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555555]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#555555] hover:text-[#F97316] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2 sm:space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-3 h-3 sm:w-4 sm:h-4 text-[#F97316] border-gray-300 rounded focus:ring-[#F97316] mt-1 flex-shrink-0"
                required
              />
              <label htmlFor="agreeToTerms" className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                I agree to the{" "}
                <Link to="/terms" className="text-[#F97316] hover:text-[#F97316]/80 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#F97316] hover:text-[#F97316]/80 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!formData.agreeToTerms || loading}
              className="w-full bg-[#F97316] text-white py-2.5 sm:py-3 rounded-lg hover:bg-[#F97316]/90 transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 sm:my-5 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-2 text-xs text-[#555555]">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-[#555555] text-xs sm:text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#F97316] hover:text-[#F97316]/80 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs text-[#555555]">🔒 Your health data is encrypted and secure</p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
