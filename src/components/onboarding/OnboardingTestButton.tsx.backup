// import React from 'react' // JSX için gerekli değil
import { Button } from '../ui/button'
import { RotateCcw, Play } from 'lucide-react'

interface OnboardingTestButtonProps {
  onReset: () => void
  onStart: () => void
}

export function OnboardingTestButton({ onReset, onStart }: OnboardingTestButtonProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="bg-white shadow-lg"
      >
        <RotateCcw className="w-4 h-4 mr-1" />
        Onboarding Sıfırla
      </Button>
      <Button
        size="sm"
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        <Play className="w-4 h-4 mr-1" />
        Onboarding Başlat
      </Button>
    </div>
  )
}
