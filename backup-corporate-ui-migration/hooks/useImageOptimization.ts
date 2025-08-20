import { useState, useEffect, useCallback } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export const useImageOptimization = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if WebP is supported
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      setIsSupported(webpSupported);
    }
  }, []);

  const optimizeImage = useCallback(async (
    file: File,
    options: ImageOptimizationOptions = {}
  ): Promise<Blob> => {
    const {
      quality = 0.8,
      maxWidth = 800,
      maxHeight = 600,
      format = 'webp'
    } = options;

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            resolve(blob || file);
          },
          isSupported && format === 'webp' ? 'image/webp' : 'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, [isSupported]);

  const createResponsiveImageSrc = useCallback((src: string, width: number) => {
    // For mobile optimization, return smaller images
    if (width <= 480) {
      return `${src}?w=480&q=75`;
    } else if (width <= 768) {
      return `${src}?w=768&q=80`;
    }
    return `${src}?w=1200&q=85`;
  }, []);

  return {
    optimizeImage,
    createResponsiveImageSrc,
    isWebPSupported: isSupported
  };
};