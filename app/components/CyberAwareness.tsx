"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

const timelineEvents = [
  {
    year: "1990s",
    event: "Early phishing attacks targeting AOL users",
  },
  {
    year: "2000s",
    event: "Sophisticated phishing targeting banks and payment systems",
  },
  {
    year: "2010s",
    event: "Spear phishing targeting specific individuals and organizations",
  },
  {
    year: "2017",
    event: "First deep fake videos appear online",
  },
  {
    year: "2019",
    event: "Voice deep fakes used in financial fraud",
  },
  {
    year: "2020s",
    event: "AI-generated deep fakes become increasingly realistic and accessible",
  },
  {
    year: "Today",
    event: "Combined threats using multiple deception techniques",
  },
]

const tips = [
  "Verify sources before sharing information",
  "Avoid clicking unknown links in emails",
  "Use strong, unique passwords for each account",
  "Enable two-factor authentication when available",
  "Be skeptical of urgent requests for money or information",
  "Check URLs carefully before entering credentials",
]

export default function CyberAwareness() {
  return (
    <div className="py-24 bg-secondary relative overflow-hidden" id="awareness">
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Cyber Awareness</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed about the evolving landscape of digital threats
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-background rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <AlertTriangle className="h-5 w-5 text-warning mr-2" />
                The Evolution of Digital Deception
              </h3>
              <div className="space-y-4">
                {timelineEvents.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 w-16 font-bold text-primary">{item.year}</div>
                    <div className="flex-1 pb-4 border-b border-border">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-background rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Staying Safe Online
              </h3>
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">The Cost of Cybercrime</h3>
              <p className="text-4xl font-bold text-primary mb-2">$6 Trillion</p>
              <p className="text-muted-foreground mb-6">Annual global cost of cybercrime</p>

              <div className="flex items-center">
                <ExternalLink className="h-5 w-5 text-primary mr-2" />
                <Link
                  href="https://www.cisa.gov/topics/cyber-threats-and-advisories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit CISA.gov for more cybersecurity tips
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
