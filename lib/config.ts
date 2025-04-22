export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // ML model endpoints
  PROCESS_IMAGE: `${API_BASE_URL}/api/process-image`,
  MODEL_STATUS: `${API_BASE_URL}/api/model-status`,
  
  // Add more endpoints as needed
};

export const ML_CONFIG = {
  supportedFormats: ['image/jpeg', 'image/png'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
}; 