import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Check, Play, Pause, SkipForward } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Progress } from '../ui/progress'
import { useLanguageContext } from '@/contexts/LanguageContext'

interface OnboardingStep {
  id: string
  title: string
  description: string
  content: React.ReactNode
  video?: string
  interactive?: boolean
  required?: boolean
}

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  steps: OnboardingStep[]
}

export function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
  steps
}: OnboardingModalProps) {
  const { t } = useLanguageContext()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Auto-show skip button after 3 seconds
      const timer = setTimeout(() => setShowSkip(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setCompletedSteps(new Set(steps.map(step => step.id)))
    onComplete()
  }

  const handleSkip = () => {
    if (window.confirm(t('onboarding.skip') + '?')) {
      onComplete()
    }
  }

  const handleClose = () => {
    onClose()
  }

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
  }

  if (!isOpen) return null

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentStep + 1}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t(currentStepData.title)}
              </h2>
              <p className="text-sm text-gray-600">
                {t('common.step')} {currentStep + 1} / {steps.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {showSkip && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                {t('onboarding.skip')}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Video or Interactive Content */}
          {currentStepData.video && (
            <div className="mb-6">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <video
                  className="w-full h-64 object-cover"
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={currentStepData.video} type="video/mp4" />
                  {t('common.videoNotSupported')}
                </video>
                <div className="absolute top-4 right-4">
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white bg-black/50 rounded-full p-1" />
                  ) : (
                    <Play className="w-6 h-6 text-white bg-black/50 rounded-full p-1" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Content */}
          <div className="mb-6">
            {currentStepData.content}
          </div>

          {/* Step Completion */}
          {currentStepData.interactive && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {t('onboarding.stepCompleted')}
                </span>
                <Button
                  size="sm"
                  onClick={() => markStepComplete(currentStepData.id)}
                  disabled={completedSteps.has(currentStepData.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {completedSteps.has(currentStepData.id) ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      {t('onboarding.completed')}
                    </>
                  ) : (
                    t('onboarding.complete')
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t('onboarding.previous')}
          </Button>

          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {currentStep === steps.length - 1 ? (
              t('onboarding.complete')
            ) : (
              <>
                {t('onboarding.next')}
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
