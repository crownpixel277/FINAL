"use client"

import { motion } from "framer-motion"
import { Upload, Search, CheckCircle } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Content",
      description: "After logging in, upload the content you want to analyze (image, email, audio, URL, or text).",
      color: "bg-blue-500",
    },
    {
      icon: Search,
      title: "AI Analysis",
      description:
        "Our advanced AI, powered by TensorFlow, analyzes the content using deep learning algorithms to detect manipulation or deception.",
      color: "bg-purple-500",
    },
    {
      icon: CheckCircle,
      title: "Get Results",
      description:
        "Receive detailed results showing whether the content is authentic or potentially deceptive, with an explanation of the findings.",
      color: "bg-green-500",
    },
  ]

  return (
    <div className="py-24 bg-background relative overflow-hidden" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI analyzes content using deep learning to spot fakes and protect you from digital deception
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`${step.color} h-12 w-12 rounded-full flex items-center justify-center text-white mb-6 z-10`}
                  >
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">{step.title}</h3>
                  <p className="text-muted-foreground text-center">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 p-6 border border-border rounded-lg bg-blue-50 dark:bg-blue-900/20"
          >
            <h3 className="text-xl font-bold mb-4">Our Technology</h3>
            <p className="text-muted-foreground">
              We use state-of-the-art deep learning models trained on thousands of examples of authentic and manipulated
              content. Our algorithms analyze patterns, metadata, and content characteristics that are invisible to the
              human eye but reveal signs of manipulation.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
