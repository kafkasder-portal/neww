import React from 'react'
import { clsx } from 'clsx'
import { Search, Eye, EyeOff, ChevronDown, Check, X, AlertTriangle } from 'lucide-react'

// Premium Input Component
interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  icon?: React.ComponentType<any>
  endIcon?: React.ComponentType<any>
  variant?: 'default' | 'search' | 'password'
  size?: 'sm' | 'md' | 'lg'
}

export const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ 
    className, 
    label, 
    error, 
    success, 
    icon: Icon, 
    endIcon: EndIcon,
    variant = 'default',
    size = 'md',
    type = 'text',
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    
    const isPassword = variant === 'password' || type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-5 py-4 text-base'
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        
        <div className="relative group">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-brand-primary-500 transition-colors" />
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={clsx(
              'input-premium w-full rounded-xl transition-all duration-300 ease-out',
              sizeClasses[size],
              Icon && 'pl-10',
              (isPassword || EndIcon) && 'pr-10',
              error && 'border-semantic-danger focus:border-semantic-danger focus:ring-semantic-danger/20',
              success && 'border-semantic-success focus:border-semantic-success focus:ring-semantic-success/20',
              isFocused && 'scale-[1.02]',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
          
          {EndIcon && !isPassword && (
            <EndIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          )}
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-semantic-danger text-sm animate-slide-up">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 text-semantic-success text-sm animate-slide-up">
            <Check className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}
      </div>
    )
  }
)

PremiumInput.displayName = 'PremiumInput'

// Premium Textarea Component
interface PremiumTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: string
  resize?: boolean
}

export const PremiumTextarea = React.forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  ({ className, label, error, success, resize = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        
        <div className="relative group">
          <textarea
            ref={ref}
            className={clsx(
              'input-premium w-full px-4 py-3 text-sm rounded-xl transition-all duration-300 ease-out min-h-[100px]',
              !resize && 'resize-none',
              error && 'border-semantic-danger focus:border-semantic-danger focus:ring-semantic-danger/20',
              success && 'border-semantic-success focus:border-semantic-success focus:ring-semantic-success/20',
              isFocused && 'scale-[1.02]',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-semantic-danger text-sm animate-slide-up">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 text-semantic-success text-sm animate-slide-up">
            <Check className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}
      </div>
    )
  }
)

PremiumTextarea.displayName = 'PremiumTextarea'

// Premium Select Component
interface PremiumSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  success?: string
  placeholder?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
}

export const PremiumSelect = React.forwardRef<HTMLSelectElement, PremiumSelectProps>(
  ({ className, label, error, success, placeholder, options, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        
        <div className="relative group">
          <select
            ref={ref}
            className={clsx(
              'input-premium w-full px-4 py-3 text-sm rounded-xl transition-all duration-300 ease-out appearance-none cursor-pointer',
              error && 'border-semantic-danger focus:border-semantic-danger focus:ring-semantic-danger/20',
              success && 'border-semantic-success focus:border-semantic-success focus:ring-semantic-success/20',
              isFocused && 'scale-[1.02]',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none group-focus-within:text-brand-primary-500 transition-colors" />
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-semantic-danger text-sm animate-slide-up">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 text-semantic-success text-sm animate-slide-up">
            <Check className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}
      </div>
    )
  }
)

PremiumSelect.displayName = 'PremiumSelect'

// Premium Checkbox Component
interface PremiumCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
}

export const PremiumCheckbox = React.forwardRef<HTMLInputElement, PremiumCheckboxProps>(
  ({ className, label, description, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className={clsx(
                'peer h-5 w-5 rounded-lg border-2 border-border bg-transparent transition-all duration-200',
                'checked:bg-gradient-to-br checked:from-brand-primary-500 checked:to-brand-primary-600',
                'checked:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/20',
                'hover:border-brand-primary-400 cursor-pointer',
                error && 'border-semantic-danger',
                className
              )}
              {...props}
            />
            <Check className="absolute inset-0 h-5 w-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none p-0.5" />
          </div>
          
          <div className="space-y-1">
            {label && (
              <label className="text-sm font-medium text-foreground cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-semantic-danger text-sm animate-slide-up">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  }
)

PremiumCheckbox.displayName = 'PremiumCheckbox'

// Premium Radio Group Component
interface PremiumRadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface PremiumRadioGroupProps {
  name: string
  label?: string
  options: PremiumRadioOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  orientation?: 'vertical' | 'horizontal'
}

export const PremiumRadioGroup: React.FC<PremiumRadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error,
  orientation = 'vertical'
}) => {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-foreground">
          {label}
        </label>
      )}
      
      <div className={clsx(
        'space-y-3',
        orientation === 'horizontal' && 'flex space-x-6 space-y-0'
      )}>
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-3">
            <div className="relative">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={option.disabled}
                className={clsx(
                  'peer h-5 w-5 rounded-full border-2 border-border bg-transparent transition-all duration-200',
                  'checked:bg-gradient-to-br checked:from-brand-primary-500 checked:to-brand-primary-600',
                  'checked:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/20',
                  'hover:border-brand-primary-400 cursor-pointer',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  error && 'border-semantic-danger'
                )}
              />
              <div className="absolute inset-0 h-5 w-5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none scale-50 peer-checked:scale-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground cursor-pointer">
                {option.label}
              </label>
              {option.description && (
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-semantic-danger text-sm animate-slide-up">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// Premium Form Group Component
interface PremiumFormGroupProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export const PremiumFormGroup: React.FC<PremiumFormGroupProps> = ({
  children,
  title,
  description,
  className
}) => {
  return (
    <div className={clsx('glass-card p-6 space-y-6', className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

// Premium Search Input Component
interface PremiumSearchProps extends Omit<PremiumInputProps, 'variant' | 'icon'> {
  onSearch?: (value: string) => void
  clearable?: boolean
}

export const PremiumSearch = React.forwardRef<HTMLInputElement, PremiumSearchProps>(
  ({ onSearch, clearable = true, value, onChange, ...props }, ref) => {
    const [searchValue, setSearchValue] = React.useState(value || '')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setSearchValue(newValue)
      onChange?.(e)
      onSearch?.(newValue)
    }

    const handleClear = () => {
      setSearchValue('')
      const syntheticEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(syntheticEvent)
      onSearch?.('')
    }

    return (
      <PremiumInput
        ref={ref}
        value={searchValue}
        onChange={handleChange}
        icon={Search}
        endIcon={clearable && searchValue ? X : undefined}
        placeholder="Arama..."
        {...props}
        className={clsx('cursor-text', props.className)}
        onClick={clearable && searchValue ? handleClear : undefined}
      />
    )
  }
)

PremiumSearch.displayName = 'PremiumSearch'
