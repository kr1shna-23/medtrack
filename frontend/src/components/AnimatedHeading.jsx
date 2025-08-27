import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const AnimatedHeading = () => {
  const quotes = ["Never miss a dose again", "Built for daily care", "Care made smarter"]

  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [quotes.length])

  return (
    <div className="h-20 flex items-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={currentQuote}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            opacity: { duration: 0.6 },
            filter: { duration: 0.6 },
          }}
          className="text-5xl lg:text-6xl font-bold leading-tight text-white"
        >
          {quotes[currentQuote].split(" ").slice(0, -1).join(" ")}{" "}
          <span className="text-[#F97316]">{quotes[currentQuote].split(" ").slice(-1)[0]}</span>
        </motion.h1>
      </AnimatePresence>
    </div>
  )
}

export default AnimatedHeading
