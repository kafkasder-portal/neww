import React from 'react'
import { 
  Mail, 
  Send, 
  Users, 
  FileText, 
  MessageSquare, 
  Smartphone,
  Info,
  BarChart3
} from 'lucide-react'

interface NavigationItem {
  title: string
  href: string
  icon: React.ReactNode
  description: string
  isActive?: boolean
}

interface MessageNavigationProps {
  currentPath?: string
}

export default function MessageNavigation({ currentPath = '/messages' }: MessageNavigationProps) {
  const navigationItems: NavigationItem[] = [
    {
      title: "Mesaj Listesi",
      href: "/messages",
      icon: <Mail className="h-4 w-4" />,
      description: "Tüm mesajları görüntüle ve yönet",
      isActive: currentPath === '/messages'
    },
    {
      title: "Toplu Gönderim",
      href: "/messages/bulk-send",
      icon: <Send className="h-4 w-4" />,
      description: "Toplu mesaj gönderimi yap",
      isActive: currentPath === '/messages/bulk-send'
    },
    {
      title: "Gruplar",
      href: "/messages/groups",
      icon: <Users className="h-4 w-4" />,
      description: "Mesaj gruplarını yönet",
      isActive: currentPath === '/messages/groups'
    },
    {
      title: "Şablonlar",
      href: "/messages/templates",
      icon: <FileText className="h-4 w-4" />,
      description: "Mesaj şablonlarını düzenle",
      isActive: currentPath === '/messages/templates'
    },
    {
      title: "SMS Gönderimleri",
      href: "/messages/sms-deliveries",
      icon: <Smartphone className="h-4 w-4" />,
      description: "SMS gönderim geçmişi",
      isActive: currentPath === '/messages/sms-deliveries'
    },
    {
      title: "E-posta Gönderimleri",
      href: "/messages/email-deliveries",
      icon: <MessageSquare className="h-4 w-4" />,
      description: "E-posta gönderim geçmişi",
      isActive: currentPath === '/messages/email-deliveries'
    },
    {
      title: "Analitik",
      href: "/messages/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Mesaj performans raporları",
      isActive: currentPath === '/messages/analytics'
    },
    {
      title: "Modül Bilgileri",
      href: "/messages/info",
      icon: <Info className="h-4 w-4" />,
      description: "Modül hakkında bilgi",
      isActive: currentPath === '/messages/info'
    }
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-brand-primary" />
        <h2 className="text-lg font-semibold text-foreground">Mesaj Yönetimi</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {navigationItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`group p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
              item.isActive
                ? 'border-brand-primary bg-brand-primary/5 shadow-sm ring-1 ring-brand-primary/10'
                : 'border-border hover:border-brand-primary/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg transition-colors ${
                item.isActive
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/10 group-hover:text-foreground'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm ${
                  item.isActive ? 'text-brand-primary' : 'text-foreground'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${
                  item.isActive ? 'text-brand-primary/70' : 'text-muted-foreground'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
