"use client"

import { Shield, Mail, Mic, Share2, Link2 } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    name: "Deep Fake Image Detection",
    description: "Identifies manipulated images created by AI.",
    example: "Spot fake photos in scams.",
    awareness: "Deep fakes can impersonate anyone—verify images.",
    icon: Shield,
  },
  {
    name: "Phishing Email Detection",
    description: "Scans emails for suspicious links and language.",
    example: "Protect your data from fraud.",
    awareness: "1 in 4 users falls for phishing emails.",
    icon: Mail,
  },
  {
    name: "Fake Audio Detection",
    description: "Detects AI-generated or manipulated audio.",
    example: "Avoid voice spoofing scams.",
    awareness: "Fake voices can mimic loved ones.",
    icon: Mic,
  },
  {
    name: "Social Media Misinformation",
    description: "Flags fake news and manipulated posts.",
    example: "Stop the spread of lies.",
    awareness: "Misinformation spreads 6x faster than truth.",
    icon: Share2,
  },
  {
    name: "Malicious URL Detection",
    description: "Identifies harmful links in emails or websites.",
    example: "Stay safe from malware.",
    awareness: "80% of breaches start with a bad link.",
    icon: Link2,
  },
]

export default function Features() {
  return (
    <div className="py-24 bg-background relative overflow-hidden" id="features">
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
        <motion.div
          className="absolute -bottom-1/2 -left-1/4 w-1/2 h-1/2 bg-warning-light rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:text-center">
          <motion.h2
            className="text-base text-primary font-semibold tracking-wide uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Features
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Comprehensive Protection Against Digital Threats
          </motion.p>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Our AI-powered platform offers multiple layers of defense to keep you safe from various forms of digital
            deception.
          </motion.p>
        </div>

        <div className="mt-16">
          <div className="space-y-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="cyber-card rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1 flex flex-col items-center md:items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white mb-4">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2 text-center md:text-left">
                      {feature.name}
                    </h3>
                    <p className="text-base text-muted-foreground text-center md:text-left">{feature.description}</p>
                  </div>
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                        <h4 className="font-medium text-primary mb-2">Example Use Case</h4>
                        <p className="text-muted-foreground">{feature.example}</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                        <h4 className="font-medium text-warning mb-2">Cyber Awareness</h4>
                        <p className="text-muted-foreground">{feature.awareness}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
