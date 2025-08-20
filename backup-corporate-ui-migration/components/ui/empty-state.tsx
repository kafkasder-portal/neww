import React from 'react';
import { cn } from '@lib/utils';
import { FileX, Search, Users, Database, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<any>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'search' | 'error';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileX,
  title,
  description,
  action,
  className,
  variant = 'default'
}) => {
  const variantStyles = {
    default: 'text-gray-500',
    search: 'text-blue-500',
    error: 'text-red-500'
  };

  return (
    <div className={cn('empty-state', className)}>
      <div className={cn('empty-state-icon', variantStyles[variant])}>
        <Icon className="w-full h-full" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

// Predefined Empty States
const NoDataFound: React.FC<{ className?: string }> = ({ className }) => (
  <EmptyState
    icon={Database}
    title="Veri Bulunamadı"
    description="Henüz herhangi bir veri bulunmuyor. Yeni kayıt eklemek için başlayın."
    className={className}
  />
);

const NoSearchResults: React.FC<{ searchTerm?: string; className?: string }> = ({ 
  searchTerm, 
  className 
}) => (
  <EmptyState
    icon={Search}
    title="Arama Sonucu Bulunamadı"
    description={searchTerm 
      ? `"${searchTerm}" için sonuç bulunamadı. Farklı anahtar kelimeler deneyin.`
      : "Arama kriterlerinize uygun sonuç bulunamadı."
    }
    variant="search"
    className={className}
  />
);

const NoUsersFound: React.FC<{ className?: string }> = ({ className }) => (
  <EmptyState
    icon={Users}
    title="Kullanıcı Bulunamadı"
    description="Henüz kayıtlı kullanıcı bulunmuyor."
    className={className}
  />
);

const ErrorState: React.FC<{ 
  title?: string; 
  description?: string; 
  className?: string;
  action?: React.ReactNode;
}> = ({ 
  title = "Bir Hata Oluştu", 
  description = "Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.",
  className,
  action
}) => (
  <EmptyState
    icon={AlertCircle}
    title={title}
    description={description}
    variant="error"
    action={action}
    className={className}
  />
);

export { 
  EmptyState, 
  NoDataFound, 
  NoSearchResults, 
  NoUsersFound, 
  ErrorState 
};