// Export all constants
export * from './api';
export * from './app';
export * from './colors';
export * from './languages';
export * from './navigation';
export * from './onboardingSteps';
export * from './permissions';
export * from './routes';
export * from './ui';
export * from './validation';

// Export new design system as primary
export * from './design-system';
export { default as DesignSystem } from './design-system';

// Re-export specific items to avoid conflicts
export { StatusType } from './colors';
export { LANGUAGES } from './languages';
