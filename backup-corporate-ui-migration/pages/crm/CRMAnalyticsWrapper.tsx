import CRMAnalytics from './CRMAnalytics'

export default function CRMAnalyticsWrapper() {
  const handleRefresh = () => {
    // Handle refresh logic
    console.log('Refreshing analytics')
  }

  return (
    <CRMAnalytics onRefresh={handleRefresh} />
  )
}
