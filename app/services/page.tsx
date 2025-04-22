'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const services = [
  {
    id: "image-detection",
    title: "Image Detection",
    description: "Advanced image analysis and deepfake detection using state-of-the-art ML models",
    icon: "🖼️",
    color: "bg-blue-500/10",
  },
  {
    id: "email-detection",
    title: "Email Detection",
    description: "Analyze emails for potential threats and phishing attempts",
    icon: "📧",
    color: "bg-green-500/10",
  },
  {
    id: "voice-detection",
    title: "Voice Detection",
    description: "Detect synthetic voices and audio deepfakes",
    icon: "🎤",
    color: "bg-purple-500/10",
  },
  {
    id: "video-detection",
    title: "Video Detection",
    description: "Comprehensive video analysis for deepfake detection",
    icon: "🎥",
    color: "bg-red-500/10",
  },
];

export default function ServicesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Service</h1>
        <p className="text-muted-foreground">
          Select the type of detection service you need
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`hover:shadow-lg transition-shadow ${service.color}`}>
              <CardHeader>
                <div className="text-4xl mb-4">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => router.push(`/services/${service.id}`)}
                >
                  Select Service
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 