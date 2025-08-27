"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Pill,
  Bell,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  Heart,
  Shield,
  Star,
  Zap,
  Calendar,
  TrendingUp,
  HelpCircle,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AnimatedHeading from "../components/AnimatedHeading"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className="p-6 sm:p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
  >
    <motion.div
      className="w-12 h-12 sm:w-16 sm:h-16 bg-[#F97316]/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#F97316]/20 transition-colors duration-300"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ duration: 0.3 }}
    >
      <Icon size={24} className="sm:w-8 sm:h-8 text-[#F97316]" strokeWidth={1.5} />
    </motion.div>
    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#1A1A1A]">{title}</h3>
    <p className="text-sm sm:text-base text-[#555555] leading-relaxed">{description}</p>
  </motion.div>
)

const StatCard = ({ number, label, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
    className="text-center p-6 sm:p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
  >
    <motion.div
      className="w-12 h-12 sm:w-16 sm:h-16 bg-[#F97316]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#F97316]/20 transition-colors duration-300"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon size={20} className="sm:w-6 sm:h-6 text-[#F97316]" />
    </motion.div>
    <div className="text-2xl sm:text-3xl font-bold text-[#F97316] mb-1 sm:mb-2">{number}</div>
    <div className="text-sm sm:text-base text-[#555555] font-medium">{label}</div>
  </motion.div>
)

const BenefitItem = ({ icon: Icon, text, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ x: 5, transition: { duration: 0.2 } }}
    className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-xl bg-white/80 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md group"
  >
    <motion.div
      className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center group-hover:bg-[#F97316]/20 transition-colors duration-300"
      whileHover={{ scale: 1.2 }}
      transition={{ duration: 0.2 }}
    >
      <Icon size={14} className="sm:w-4 sm:h-4 text-[#F97316]" />
    </motion.div>
    <span className="text-sm sm:text-base text-[#1A1A1A] font-medium">{text}</span>
  </motion.div>
)

const TestimonialCard = ({ quote, author, role, rating, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -5, transition: { duration: 0.3 } }}
    className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center mb-3 sm:mb-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: delay + i * 0.1 }}
        >
          <Star
            size={14}
            className={`sm:w-4 sm:h-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
          />
        </motion.div>
      ))}
    </div>
    <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic">"{quote}"</p>
    <div>
      <div className="text-sm sm:text-base font-semibold text-gray-900">{author}</div>
      <div className="text-xs sm:text-sm text-gray-600">{role}</div>
    </div>
  </motion.div>
)

const FAQItem = ({ question, answer, delay = 0 }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-[#F97316]/20"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 sm:px-8 sm:py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-[#F97316]/5 hover:to-transparent transition-all duration-300 group"
      >
        <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] pr-4 group-hover:text-[#F97316] transition-colors duration-300">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-8 h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center group-hover:bg-[#F97316]/20 transition-colors duration-300"
        >
          <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-gradient-to-r from-[#F97316]/5 to-transparent"
          >
            <div className="px-6 pb-4 sm:px-8 sm:pb-6 border-l-4 border-[#F97316] ml-6 sm:ml-8">
              <p className="text-sm sm:text-base text-[#555555] leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const LandingPage = () => {
  return (
    <div className="min-h-screen font-['Inter'] bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://res.cloudinary.com/kr1shna23/image/upload/v1753254878/pexels-unseop-kang-83500562-8855516_kvcz8p.jpg"
            alt="Healthcare professional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center bg-[#F97316]/20 text-[#F97316] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm"
              >
                <Pill size={14} className="sm:w-4 sm:h-4 mr-2" />
                Smart Medication Management
              </motion.div>

              <div className="mb-6 sm:mb-8">
                <AnimatedHeading />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-base sm:text-lg text-gray-200 leading-relaxed mb-6 sm:mb-8 max-w-lg"
              >
                Smart medication tracking with WhatsApp & email reminders. Perfect for all patients, chronic conditions,
                and caregivers who want peace of mind.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12"
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center bg-[#F97316] text-white px-5 sm:px-6 py-3 rounded-xl hover:bg-[#F97316]/90 transition-all duration-300 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl group"
                >
                  Get Started Free
                  <ArrowRight
                    size={16}
                    className="sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center bg-white/10 text-white px-5 sm:px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm sm:text-base font-semibold backdrop-blur-sm border border-white/20"
                >
                  Sign In
                </Link>
              </motion.div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <BenefitItem icon={CheckCircle} text="Easy Setup" delay={1.0} />
                <BenefitItem icon={Bell} text="Smart Reminders" delay={1.1} />
                <BenefitItem icon={Heart} text="Health Focused" delay={1.2} />
                <BenefitItem icon={Shield} text="Secure & Private" delay={1.3} />
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 gap-4 sm:gap-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle size={16} className="sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">95%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Adherence Rate</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users size={16} className="sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">15k+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Active Users</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TrendingUp size={16} className="sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">28</div>
                    <div className="text-xs sm:text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock size={16} className="sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-xs sm:text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-3 sm:mb-4">Trusted by Thousands</h2>
            <p className="text-lg sm:text-xl text-[#555555]">
              Join the community improving medication adherence worldwide
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            <StatCard number="15k+" label="Active Users" icon={Users} delay={0.1} />
            <StatCard number="95%" label="Adherence Rate" icon={BarChart3} delay={0.2} />
            <StatCard number="24/7" label="Support Available" icon={Clock} delay={0.3} />
            <StatCard number="99.9%" label="Uptime" icon={Shield} delay={0.4} />
          </div>
        </div>
      </section>

      {/* "Everything You Need" Section */}
      <section id="features" className="py-12 sm:py-20 bg-[#F97316]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Everything You Need</h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
              Comprehensive medication management designed for patients, caregivers, and healthcare providers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <FeatureCard
              icon={Pill}
              title="Smart Tracking"
              description="Organize all medications with dosages, frequencies, and intelligent scheduling in one secure place."
              delay={0.1}
            />
            <FeatureCard
              icon={Bell}
              title="Multi-Channel Alerts"
              description="Get timely WhatsApp, email, and push notifications with customizable reminder settings."
              delay={0.2}
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Analytics"
              description="Track your medication consistency with detailed charts, streaks, and adherence insights."
              delay={0.3}
            />
            <FeatureCard
              icon={Users}
              title="Family Care"
              description="Perfect for all ages with caregiver access and simplified interfaces designed for seniors."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* "Refill Management" & "Health Insights" Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-20">
          {/* Feature Showcase */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4 sm:mb-6">
                Refill Management Made Simple
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 sm:space-x-4"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar size={14} className="sm:w-4 sm:h-4 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1 sm:mb-2">
                      Automatic Tracking
                    </h4>
                    <p className="text-sm sm:text-base text-[#555555]">
                      Never run out of medications with intelligent refill date tracking and low stock alerts.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 sm:space-x-4"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap size={14} className="sm:w-4 sm:h-4 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1 sm:mb-2">
                      Smart Notifications
                    </h4>
                    <p className="text-sm sm:text-base text-[#555555]">
                      Get reminded before you run out, with direct links to reorder from your preferred pharmacy.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 sm:space-x-4"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield size={14} className="sm:w-4 sm:h-4 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1 sm:mb-2">
                      Insurance Integration
                    </h4>
                    <p className="text-sm sm:text-base text-[#555555]">
                      Seamlessly manage prescriptions with insurance information and cost tracking.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src="https://res.cloudinary.com/kr1shna23/image/upload/v1753254878/pexels-towfiqu-barbhuiya-3440682-9131993_lfbb2q.jpg"
                alt="Medication management and pills"
                className="w-full h-[300px] sm:h-[400px] object-cover rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Health Insights Section */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src="https://res.cloudinary.com/kr1shna23/image/upload/v1753254878/pexels-polina-tankilevitch-3873209_leht0a.jpg"
                alt="Healthcare consultation and patient care"
                className="w-full h-[300px] sm:h-[400px] object-cover rounded-3xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4 sm:mb-6">
                Personalized Health Insights
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 sm:space-x-4"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <BarChart3 size={14} className="sm:w-4 sm:h-4 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1 sm:mb-2">
                      Adherence Analytics
                    </h4>
                    <p className="text-sm sm:text-base text-[#555555]">
                      Track your medication consistency with visual charts, streak counters, and detailed progress
                      reports.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 sm:space-x-4"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart size={14} className="sm:w-4 sm:h-4 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1 sm:mb-2">Health Reports</h4>
                    <p className="text-sm sm:text-base text-[#555555]">
                      Generate comprehensive reports to share with your healthcare providers and family members.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 sm:space-x-4"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle size={14} className="sm:w-4 sm:h-4 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1 sm:mb-2">Goal Setting</h4>
                    <p className="text-sm sm:text-base text-[#555555]">
                      Set personal adherence goals and celebrate milestones with achievement badges and streaks.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-20 bg-[#FFF7ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-3 sm:mb-4">What Our Users Say</h2>
            <p className="text-lg sm:text-xl text-[#555555]">
              Real stories from people who transformed their health with MedTrack
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <TestimonialCard
              quote="MedTrack has been a lifesaver for managing my mother's medications. The WhatsApp reminders are perfect and she never misses a dose now."
              author="Sarah Johnson"
              role="Caregiver"
              rating={5}
              delay={0.1}
            />
            <TestimonialCard
              quote="As a diabetes patient, consistency is crucial. This app helps me maintain perfect adherence and my doctor loves the detailed reports."
              author="Michael Chen"
              role="Patient"
              rating={5}
              delay={0.2}
            />
            <TestimonialCard
              quote="The analytics help me understand my patients' adherence patterns better than ever before. It's revolutionized my practice."
              author="Dr. Emily Rodriguez"
              role="Healthcare Provider"
              rating={5}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center bg-[#F97316]/10 text-[#F97316] px-4 py-2 rounded-full text-sm font-medium mb-4">
              <HelpCircle size={16} className="mr-2" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-3 sm:mb-4">Everything You Need to Know</h2>
            <p className="text-lg sm:text-xl text-[#555555]">Get answers to common questions about MedTrack</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  question: "How does MedTrack help me remember to take my medications?",
                  answer:
                    "MedTrack sends you personalized reminders through WhatsApp, email, and push notifications. You can customize reminder times, frequencies, and methods to match your schedule and preferences.",
                },
                {
                  question: "Is my health information secure and private?",
                  answer:
                    "Absolutely. We use bank-level encryption to protect your data and are fully HIPAA compliant. Your health information is never shared without your explicit consent, and you have full control over your privacy settings.",
                },
                {
                  question: "Can family members or caregivers access my medication information?",
                  answer:
                    "Yes, you can grant access to trusted family members or caregivers. They can help monitor your medication adherence and receive notifications if you miss doses, making it perfect for elderly care or chronic condition management.",
                },
                {
                  question: "What happens if I miss a dose?",
                  answer:
                    "MedTrack will send follow-up reminders and log the missed dose in your adherence tracking. You'll receive guidance on what to do next, and your healthcare provider can be notified if you choose to enable that feature.",
                },
                {
                  question: "Does MedTrack work with my pharmacy or insurance?",
                  answer:
                    "MedTrack integrates with major pharmacies and insurance providers to help track refills and costs. We can remind you when it's time to refill prescriptions and help you find the best prices for your medications.",
                },
                {
                  question: "Is MedTrack free to use?",
                  answer:
                    "Yes! MedTrack offers a comprehensive free plan that includes medication tracking, reminders, and basic analytics. We also offer premium features for advanced reporting and family sharing at affordable rates.",
                },
                {
                  question: "Can I use MedTrack for vitamins and supplements?",
                  answer:
                    "MedTrack supports all types of medications, vitamins, supplements, and even health routines like blood pressure monitoring. You can track everything in one convenient place.",
                },
                {
                  question: "How do I get started with MedTrack?",
                  answer:
                    "Getting started is simple! Sign up for free, add your medications with dosages and schedules, set your reminder preferences, and you're ready to go. The entire setup takes less than 5 minutes.",
                },
              ].map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} delay={index * 0.1} />
              ))}
            </div>
          </div>

          {/* FAQ CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-16"
          >
            <div className="bg-gradient-to-r from-[#F97316] to-[#FB923C] rounded-2xl p-6 sm:p-8 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Still have questions?</h3>
              <p className="text-white/90 mb-4 sm:mb-6">Our support team is here to help you 24/7</p>
              <Link
                to="/contact"
                className="inline-flex items-center bg-white text-[#F97316] px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
              >
                Contact Support
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-12 sm:py-20 bg-[#FFF7ED] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/3 via-transparent to-[#FB923C]/3"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FB923C]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center bg-[#F97316]/10 text-[#F97316] px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart size={16} className="mr-2" />
              About MedTrack
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-3 sm:mb-4">Empowering Better Health</h2>
            <p className="text-lg sm:text-xl text-[#555555] max-w-3xl mx-auto">
              Dedicated to making medication management simple, secure, and accessible for everyone
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4 sm:mb-6 relative">Our Mission</h3>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-[#F97316]/10">
                <p className="text-base sm:text-lg text-[#555555] mb-4 sm:mb-6 leading-relaxed">
                  At MedTrack, we believe that medication adherence shouldn't be complicated. Our mission is to make
                  healthcare more accessible and manageable for everyone, from young adults managing their first
                  prescriptions to seniors with complex medication regimens.
                </p>
                <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
                  We're dedicated to reducing medication errors, improving health outcomes, and giving peace of mind to
                  patients and their families through innovative technology and compassionate design.
                </p>
                
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-[#F97316]/10 to-[#FB923C]/10 rounded-3xl"></div>
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src="https://res.cloudinary.com/kr1shna23/image/upload/v1753462448/pexels-polina-tankilevitch-3873137_i7kj9p.jpg"
                alt="Healthcare team collaboration"
                className="w-full h-[300px] sm:h-[400px] object-cover rounded-3xl shadow-2xl relative z-10"
              />
            </motion.div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#F97316]/10 hover:border-[#F97316]/20 group"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#F97316]/20 to-[#FB923C]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:from-[#F97316]/30 group-hover:to-[#FB923C]/30 transition-all duration-300">
                <Heart size={24} className="sm:w-8 sm:h-8 text-[#F97316]" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-2 sm:mb-3">Patient-Centered</h4>
              <p className="text-sm sm:text-base text-[#555555]">
                Every feature is designed with patients and caregivers in mind, prioritizing ease of use and
                accessibility.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#F97316]/10 hover:border-[#F97316]/20 group"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#F97316]/20 to-[#FB923C]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:from-[#F97316]/30 group-hover:to-[#FB923C]/30 transition-all duration-300">
                <Shield size={24} className="sm:w-8 sm:h-8 text-[#F97316]" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-2 sm:mb-3">Privacy First</h4>
              <p className="text-sm sm:text-base text-[#555555]">
                Your health data is encrypted, secure, and never shared without your explicit permission.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#F97316]/10 hover:border-[#F97316]/20 group"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#F97316]/20 to-[#FB923C]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:from-[#F97316]/30 group-hover:to-[#FB923C]/30 transition-all duration-300">
                <Users size={24} className="sm:w-8 sm:h-8 text-[#F97316]" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-2 sm:mb-3">Community Driven</h4>
              <p className="text-sm sm:text-base text-[#555555]">
                Built with feedback from patients, caregivers, and healthcare professionals worldwide.
              </p>
            </motion.div>
          </div>

          {/* Team/Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/5 to-[#FB923C]/5 rounded-3xl"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-12 shadow-xl border border-[#F97316]/10">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4 sm:mb-6">Trusted Worldwide</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <div className="group">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                    15,000+
                  </div>
                  <div className="text-sm sm:text-base text-[#555555]">Active Users</div>
                </div>
                <div className="group">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                    50+
                  </div>
                  <div className="text-sm sm:text-base text-[#555555]">Countries</div>
                </div>
                <div className="group">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                    95%
                  </div>
                  <div className="text-sm sm:text-base text-[#555555]">Adherence Rate</div>
                </div>
                <div className="group">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                    24/7
                  </div>
                  <div className="text-sm sm:text-base text-[#555555]">Support</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 sm:py-20 bg-gradient-to-r from-[#F97316] to-[#FB923C] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-white"
          >
            Ready to transform your health?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-white/90 text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto"
          >
            Join thousands of patients and caregivers who trust MedTrack for better medication adherence and improved
            health outcomes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center bg-white text-[#F97316] px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl group"
            >
              Start Free Today
              <ArrowRight
                size={18}
                className="sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center bg-transparent text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white/10 transition-all duration-300 text-base sm:text-lg font-semibold border-2 border-white/30 hover:border-white/60"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}

export default LandingPage
