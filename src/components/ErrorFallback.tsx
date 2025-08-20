import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/corporate/CorporateComponents';
import { CorporateCard, CorporateButton, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <CorporateCard className="max-w-md w-full">
        <CorporateCardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CorporateCardTitle className="text-xl text-red-900">Something went wrong</CorporateCardTitle>
        </CorporateCardHeader>
        
        <CorporateCardContent className="space-y-4">
          <p className="text-center text-gray-600">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          
          <CorporateButton onClick={resetErrorBoundary} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </CorporateButton>

          <details className="mt-4">
            <summary className="cursor-pointer space-y-6-label">
              Error Details
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        </CorporateCardContent>
      </CorporateCard>
    </div>
  );
}
