import { API_ENDPOINTS } from './config';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export async function processImage(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.PROCESS_IMAGE, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new APIError(response.status, await response.text());
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'Failed to process image');
  }
}

export async function checkModelStatus() {
  try {
    const response = await fetch(API_ENDPOINTS.MODEL_STATUS);
    
    if (!response.ok) {
      throw new APIError(response.status, await response.text());
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'Failed to check model status');
  }
} 