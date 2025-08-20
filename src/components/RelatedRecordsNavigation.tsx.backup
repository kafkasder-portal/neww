import { useState } from 'react'
import { 
  CreditCard, 
  FileText, 
  Camera, 
  Users, 
  UserCheck, 
  Heart, 
  MessageSquare, 
  Calendar,
  HelpingHand,
  Shield,
  BarChart3
} from 'lucide-react'

interface RelatedRecord {
  id: string
  label: string
  icon: React.ReactNode
  value?: string
  title?: string
  count?: number
  isActive?: boolean
}

interface RelatedRecordsNavigationProps {
  onRecordTypeChange?: (recordType: string) => void
  activeRecordType?: string
}

export default function RelatedRecordsNavigation({ 
  onRecordTypeChange, 
  activeRecordType 
}: RelatedRecordsNavigationProps) {
  const [activeType, setActiveType] = useState(activeRecordType || '')

  const recordTypes: RelatedRecord[][] = [
    // First row
    [
      {
        id: 'bank-accounts',
        label: 'Banka Hesapları',
        icon: <CreditCard className="h-4 w-4" />
      },
      {
        id: 'documents',
        label: 'Dokümanlar',
        icon: <FileText className="h-4 w-4" />,
        value: '6',
        count: 6,
        isActive: true
      },
      {
        id: 'photos',
        label: 'Fotoğraflar',
        icon: <Camera className="h-4 w-4" />
      }
    ],
    // Second row
    [
      {
        id: 'orphans',
        label: 'Baktığı Yetimler',
        icon: <Users className="h-4 w-4" />,
        title: 'Bakmakla yükümlü olduğu yetimler'
      },
      {
        id: 'dependents',
        label: 'Baktığı Kişiler',
        icon: <UserCheck className="h-4 w-4" />,
        value: '4',
        title: 'Bakmakla yükümlü olduğu diğer kişiler',
        count: 4,
        isActive: true
      },
      {
        id: 'sponsors',
        label: 'Sponsorlar',
        icon: <Heart className="h-4 w-4" />
      }
    ],
    // Third row
    [
      {
        id: 'references',
        label: 'Referanslar',
        icon: <MessageSquare className="h-4 w-4" />
      },
      {
        id: 'meeting-records',
        label: 'Görüşme Kayıtları',
        icon: <MessageSquare className="h-4 w-4" />
      },
      {
        id: 'session-tracking',
        label: 'Görüşme Seans Takibi',
        icon: <Calendar className="h-4 w-4" />
      }
    ],
    // Fourth row
    [
      {
        id: 'aid-requests',
        label: 'Yardım Talepleri',
        icon: <HelpingHand className="h-4 w-4" />,
        value: '1',
        count: 1,
        isActive: true
      },
      {
        id: 'aid-provided',
        label: 'Yapılan Yardımlar',
        icon: <HelpingHand className="h-4 w-4" />
      },
      {
        id: 'consent-statements',
        label: 'Rıza Beyanları',
        icon: <Shield className="h-4 w-4" />,
        value: '1',
        count: 1,
        isActive: true
      }
    ],
    // Fifth row
    [
      {
        id: 'social-cards',
        label: 'Sosyal Kartlar',
        icon: <CreditCard className="h-4 w-4" />
      },
      {
        id: 'card-summary',
        label: 'Kart Özeti',
        icon: <BarChart3 className="h-4 w-4" />
      }
    ]
  ]

  const handleRecordClick = (recordId: string) => {
    setActiveType(recordId)
    onRecordTypeChange?.(recordId)
  }

  const getButtonStyles = (record: RelatedRecord) => {
    const baseStyles = `
      relative inline-flex items-center justify-center
      w-19 h-15 px-2 py-1 mb-1 mr-1
      text-xs text-center leading-tight
      border border-gray-300 rounded
      bg-white hover:bg-gray-50
      transition-all duration-150 ease-in-out
      cursor-pointer
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
    `
    
    const activeStyles = record.isActive || activeType === record.id 
      ? 'bg-blue-50 border-blue-300 text-blue-700' 
      : 'bg-white border-gray-300 text-gray-700'

    return `${baseStyles} ${activeStyles}`
  }

  return (
    <article className="bg-white border border-gray-200 rounded shadow-sm p-3 h-full w-full">
      <header className="text-gray-800 font-medium text-sm mb-3">
        Bağlantılı Kayıtlar
      </header>
      
      <nav className="space-y-1">
        {recordTypes.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex flex-wrap">
            {row.map((record) => (
              <button
                key={record.id}
                value={record.value}
                title={record.title}
                onClick={() => handleRecordClick(record.id)}
                className={getButtonStyles(record)}
              >
                <div className="flex flex-col items-center gap-1">
                  {record.icon}
                  <span className="text-xs leading-tight break-words max-w-full">
                    {record.label}
                  </span>
                  {record.count && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {record.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ))}
      </nav>
    </article>
  )
}

// Export additional interfaces for type safety
export type { RelatedRecord, RelatedRecordsNavigationProps }
