// Export all constants
export * from './api';
export * from './app';
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

// Export legacy colors with renamed exports to avoid conflicts
export {
    ACTIVITY_COLORS as LEGACY_ACTIVITY_COLORS, CHART_COLORS as LEGACY_CHART_COLORS, CHART_COLORS_HEX as LEGACY_CHART_COLORS_HEX, PERFORMANCE_COLORS as LEGACY_PERFORMANCE_COLORS, SEMANTIC_ACTIVITY_CLASSES as LEGACY_SEMANTIC_ACTIVITY_CLASSES, SEMANTIC_PERFORMANCE_CLASSES as LEGACY_SEMANTIC_PERFORMANCE_CLASSES, SEMANTIC_SEVERITY_CLASSES as LEGACY_SEMANTIC_SEVERITY_CLASSES, SEMANTIC_STATUS_CLASSES as LEGACY_SEMANTIC_STATUS_CLASSES, SEVERITY_COLORS as LEGACY_SEVERITY_COLORS, STATUS_COLORS as LEGACY_STATUS_COLORS, ChartColorHex as LegacyChartColorHex,
    StatusType as LegacyStatusType
} from './colors';

// Re-export specific items to avoid conflicts
export { StatusType as LegacyStatusType } from './colors';
export { StatusType } from './design-system';
export { LANGUAGES } from './languages';

