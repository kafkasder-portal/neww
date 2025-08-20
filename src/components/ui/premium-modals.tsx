import React from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle, Maximize2, Minimize2 } from 'lucide-react'

// Modal Context
interface ModalContextType {
  closeModal: () => void
}

const ModalContext = React.createContext<ModalContextType | null>(null)

export const useModal = () => {
  const context = React.useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a Modal component')
  }
  return context
}

// Base Modal Component
interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  variant?: 'default' | 'glass' | 'minimal'
  closable?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  className?: string
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  variant = 'glass',
  closable = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-none w-screen h-screen'
  }

  const variantClasses = {
    default: 'bg-background border border-border shadow-xl',
    glass: 'glass-card',
    minimal: 'bg-background/95 backdrop-blur-xl border border-border/50'
  }

  React.useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, closeOnEscape])

  if (!isOpen) return null

  const modalContent = (
    <div className="modal-premium">
      <div 
        className="flex items-center justify-center min-h-full p-4"
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <div 
          className={clsx(
            'modal-content w-full',
            isFullscreen ? 'max-w-none w-screen h-screen' : sizeClasses[size],
            variantClasses[variant],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalContext.Provider value={{ closeModal: onClose }}>
            {/* Modal Controls */}
            {closable && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Maximize2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            )}
            
            {children}
          </ModalContext.Provider>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// Modal Header
interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className }) => {
  return (
    <div className={clsx('px-6 py-4 border-b border-border', className)}>
      {children}
    </div>
  )
}

// Modal Body
interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return (
    <div className={clsx('px-6 py-6', className)}>
      {children}
    </div>
  )
}

// Modal Footer
interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div className={clsx('px-6 py-4 border-t border-border flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  )
}

// Alert Modal
interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'danger'
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'Tamam',
  cancelText = 'İptal',
  onConfirm,
  onCancel
}) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    danger: AlertCircle
  }

  const colors = {
    info: 'text-semantic-info',
    success: 'text-semantic-success',
    warning: 'text-semantic-warning',
    danger: 'text-semantic-danger'
  }

  const bgColors = {
    info: 'bg-semantic-info/10',
    success: 'bg-semantic-success/10',
    warning: 'bg-semantic-warning/10',
    danger: 'bg-semantic-danger/10'
  }

  const Icon = icons[type]

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} size="sm" closable={false}>
      <ModalBody>
        <div className="text-center space-y-4">
          <div className={clsx('mx-auto w-16 h-16 rounded-full flex items-center justify-center', bgColors[type])}>
            <Icon className={clsx('h-8 w-8', colors[type])} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      </ModalBody>
      
      <ModalFooter>
        {onCancel && (
          <button onClick={handleCancel} className="btn-ghost">
            {cancelText}
          </button>
        )}
        <button onClick={handleConfirm} className="btn-primary">
          {confirmText}
        </button>
      </ModalFooter>
    </PremiumModal>
  )
}

// Confirmation Modal
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  loading?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  variant = 'warning',
  onConfirm,
  loading = false
}) => {
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  const buttonVariants = {
    danger: 'bg-semantic-danger hover:bg-semantic-danger/90',
    warning: 'bg-semantic-warning hover:bg-semantic-warning/90',
    info: 'btn-primary'
  }

  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </ModalHeader>
      
      <ModalBody>
        <p className="text-sm text-muted-foreground">{message}</p>
      </ModalBody>
      
      <ModalFooter>
        <button onClick={onClose} className="btn-ghost" disabled={loading}>
          {cancelText}
        </button>
        <button 
          onClick={handleConfirm} 
          className={clsx('btn-premium text-white', buttonVariants[variant])}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Yükleniyor...
            </div>
          ) : (
            confirmText
          )}
        </button>
      </ModalFooter>
    </PremiumModal>
  )
}

// Toast Notification System
interface ToastProps {
  id: string
  title?: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'danger'
  duration?: number
  onClose: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = React.useState(false)

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    danger: AlertCircle
  }

  const colors = {
    info: 'border-semantic-info/30 bg-semantic-info/10',
    success: 'border-semantic-success/30 bg-semantic-success/10',
    warning: 'border-semantic-warning/30 bg-semantic-warning/10',
    danger: 'border-semantic-danger/30 bg-semantic-danger/10'
  }

  const iconColors = {
    info: 'text-semantic-info',
    success: 'text-semantic-success',
    warning: 'text-semantic-warning',
    danger: 'text-semantic-danger'
  }

  const Icon = icons[type]

  React.useEffect(() => {
    setIsVisible(true)
    
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div
      className={clsx(
        'glass-card p-4 border-l-4 shadow-lg max-w-sm w-full',
        'transform transition-all duration-300 ease-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        colors[type]
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={clsx('h-5 w-5 flex-shrink-0 mt-0.5', iconColors[type])} />
        
        <div className="flex-1 space-y-1">
          {title && (
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          )}
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        
        <button
          onClick={() => onClose(id)}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

// Toast Container
interface ToastContainerProps {
  toasts: Array<Omit<ToastProps, 'onClose'>>
  onRemove: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'top-right'
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }

  if (toasts.length === 0) return null

  const container = (
    <div className={clsx('fixed z-50 space-y-3', positionClasses[position])}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  )

  return createPortal(container, document.body)
}

// Tooltip Component
interface TooltipProps {
  children: React.ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 500,
  className
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setIsVisible(false)
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div
          className={clsx(
            'absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap',
            'animate-fade-in',
            positionClasses[position],
            className
          )}
        >
          {content}
          
          {/* Arrow */}
          <div
            className={clsx(
              'absolute w-2 h-2 bg-gray-900 transform rotate-45',
              position === 'top' && 'top-full left-1/2 -translate-x-1/2 -mt-1',
              position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
              position === 'left' && 'left-full top-1/2 -translate-y-1/2 -ml-1',
              position === 'right' && 'right-full top-1/2 -translate-y-1/2 -mr-1'
            )}
          />
        </div>
      )}
    </div>
  )
}

// Popover Component
interface PopoverProps {
  children: React.ReactNode
  content: React.ReactNode
  trigger?: 'click' | 'hover'
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  trigger = 'click',
  position = 'bottom',
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const popoverRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const positionClasses = {
    top: 'bottom-full left-0 mb-2',
    bottom: 'top-full left-0 mt-2',
    left: 'right-full top-0 mr-2',
    right: 'left-full top-0 ml-2'
  }

  const handleTrigger = () => {
    if (trigger === 'click') {
      setIsOpen(!isOpen)
    }
  }

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsOpen(false)
    }
  }

  return (
    <div 
      ref={popoverRef}
      className="relative inline-block"
      onClick={handleTrigger}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 min-w-64 glass-card p-4 shadow-xl animate-scale-in',
            positionClasses[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
