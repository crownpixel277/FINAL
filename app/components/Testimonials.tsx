"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Jane Smith",
    role: "Small Business Owner",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "This tool saved me from a sophisticated phishing scam that almost compromised my business accounts. The detection was quick and accurate.",
  },
  {
    name: "Michael Chen",
    role: "IT Security Professional",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "As someone who works in cybersecurity, I'm impressed by the accuracy of the deep fake detection. It's caught manipulated images that would have fooled most people.",
  },
  {
    name: "Sarah Johnson",
    role: "Parent & Educator",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "I use this tool to verify information before sharing it with my students. It's helped us have important conversations about digital literacy and online safety.",
  },
]

export default function Testimonials() {
  return (
    <div className="bg-secondary py-16 sm:py-24 relative overflow-hidden" id="testimonials">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-16 w-32 h-32 bg-primary/10 rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-16 w-24 h-24 bg-warning-light rounded-full"
          animate={{
            y: [0, 30, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Real-world protection</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            See how our technology is helping people stay safe online
          </p>
        </motion.div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-background border border-border shadow-lg rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="px-6 py-8">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                  />
                  <div className="ml-4">
                    <div className="text-lg font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground italic">"{testimonial.quote}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
