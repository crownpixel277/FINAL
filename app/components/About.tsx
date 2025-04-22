"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export default function About() {
  return (
    <div className="py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
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
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl mb-8">About the Project</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-muted-foreground mb-6">
              We use advanced AI (powered by TensorFlow) to detect manipulated images, fraudulent emails, and other
              cyber threats, empowering you to stay safe online.
            </p>
            <p className="text-lg text-muted-foreground">
              Our final-year computer science project combines cutting-edge machine learning techniques with practical
              cybersecurity applications to create a comprehensive defense against digital deception.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="stat-card flex items-start p-6"
          >
            <div className="mr-4 mt-1">
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Cyber Stat</h3>
              <p className="text-3xl font-bold text-primary mb-2">90%+</p>
              <p className="text-muted-foreground">
                Over 90% of cyberattacks start with phishing emails. Our technology helps you identify and avoid these
                threats before they can cause harm.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
