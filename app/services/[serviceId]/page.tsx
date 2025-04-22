'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const serviceConfigs = {
  'image-detection': {
    title: 'Image Detection',
    description: 'Upload an image to analyze for potential deepfake content',
    accept: 'image/*',
    endpoint: '/api/process-image',
  },
  'email-detection': {
    title: 'Email Detection',
    description: 'Upload an email or paste its content for analysis',
    accept: '.eml,.txt',
    endpoint: '/api/process-email',
  },
  'voice-detection': {
    title: 'Voice Detection',
    description: 'Upload an audio file to check for synthetic voices',
    accept: 'audio/*',
    endpoint: '/api/process-audio',
  },
  'video-detection': {
    title: 'Video Detection',
    description: 'Upload a video file for comprehensive deepfake analysis',
    accept: 'video/*',
    endpoint: '/api/process-video',
  },
};

export default function ServicePage() {
  const params = useParams();
  const serviceId = params.serviceId as string;
  const service = serviceConfigs[serviceId as keyof typeof serviceConfigs];

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Service not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{service.title}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button variant="outline">
                    Upload File
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">
                    or drag and drop
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Supported formats: {service.accept}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 