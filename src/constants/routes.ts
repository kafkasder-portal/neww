// Route constants and navigation helpers

export const ROUTES = {
  // Authentication
  LOGIN: '/login',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Beneficiaries
  BENEFICIARIES: '/beneficiaries',
  BENEFICIARIES_LIST: '/beneficiaries/list',
  BENEFICIARIES_ADD: '/beneficiaries/add',
  BENEFICIARIES_EDIT: '/beneficiaries/edit',
  BENEFICIARIES_VIEW: '/beneficiaries/view',
  BENEFICIARIES_SEARCH: '/beneficiaries/search',
  
  // Applications
  APPLICATIONS: '/applications',
  APPLICATIONS_LIST: '/applications/list',
  APPLICATIONS_ADD: '/applications/add',
  APPLICATIONS_EDIT: '/applications/edit',
  APPLICATIONS_VIEW: '/applications/view',
  APPLICATIONS_APPROVE: '/applications/approve',
  
  // Aid Management
  AID: '/aid',
  AID_RECORDS: '/aid/records',
  AID_RECORDS_LIST: '/aid/records/list',
  AID_RECORDS_ADD: '/aid/records/add',
  AID_RECORDS_EDIT: '/aid/records/edit',
  AID_RECORDS_VIEW: '/aid/records/view',
  
  AID_PAYMENTS: '/aid/payments',
  AID_PAYMENTS_LIST: '/aid/payments/list',
  AID_PAYMENTS_ADD: '/aid/payments/add',
  AID_PAYMENTS_EDIT: '/aid/payments/edit',
  AID_PAYMENTS_VIEW: '/aid/payments/view',
  
  AID_IN_KIND: '/aid/in-kind',
  AID_IN_KIND_LIST: '/aid/in-kind/list',
  AID_IN_KIND_ADD: '/aid/in-kind/add',
  AID_IN_KIND_EDIT: '/aid/in-kind/edit',
  AID_IN_KIND_VIEW: '/aid/in-kind/view',
  
  // Donations
  DONATIONS: '/donations',
  DONATIONS_LIST: '/donations/list',
  DONATIONS_ADD: '/donations/add',
  DONATIONS_EDIT: '/donations/edit',
  DONATIONS_VIEW: '/donations/view',
  
  // Fund Management
  FUND: '/fund',
  FUND_OVERVIEW: '/fund/overview',
  FUND_TRANSACTIONS: '/fund/transactions',
  FUND_BUDGET: '/fund/budget',
  FUND_REPORTS: '/fund/reports',
  
  // Scholarship
  SCHOLARSHIP: '/scholarship',
  SCHOLARSHIP_LIST: '/scholarship/list',
  SCHOLARSHIP_ADD: '/scholarship/add',
  SCHOLARSHIP_EDIT: '/scholarship/edit',
  SCHOLARSHIP_VIEW: '/scholarship/view',
  SCHOLARSHIP_APPLICATIONS: '/scholarship/applications',
  
  // Messages
  MESSAGES: '/messages',
  MESSAGES_INBOX: '/messages/inbox',
  MESSAGES_SENT: '/messages/sent',
  MESSAGES_COMPOSE: '/messages/compose',
  MESSAGES_VIEW: '/messages/view',
  
  // System Management
  SYSTEM: '/system',
  
  // User Management
  USERS: '/system/users',
  USERS_LIST: '/system/users/list',
  USERS_ADD: '/system/users/add',
  USERS_EDIT: '/system/users/edit',
  USERS_VIEW: '/system/users/view',
  USERS_PERMISSIONS: '/system/users/permissions',
  
  // Role Management
  ROLES: '/system/roles',
  ROLES_LIST: '/system/roles/list',
  ROLES_ADD: '/system/roles/add',
  ROLES_EDIT: '/system/roles/edit',
  ROLES_VIEW: '/system/roles/view',
  
  // Settings
  SETTINGS: '/system/settings',
  SETTINGS_GENERAL: '/system/settings/general',
  SETTINGS_SECURITY: '/system/settings/security',
  SETTINGS_NOTIFICATIONS: '/system/settings/notifications',
  SETTINGS_BACKUP: '/system/settings/backup',
  
  // Definitions
  DEFINITIONS: '/definitions',
  DEFINITIONS_AID_TYPES: '/definitions/aid-types',
  DEFINITIONS_CATEGORIES: '/definitions/categories',
  DEFINITIONS_LOCATIONS: '/definitions/locations',
  DEFINITIONS_BANKS: '/definitions/banks',
  
  // Reports
  REPORTS: '/reports',
  REPORTS_BENEFICIARIES: '/reports/beneficiaries',
  REPORTS_APPLICATIONS: '/reports/applications',
  REPORTS_PAYMENTS: '/reports/payments',
  REPORTS_DONATIONS: '/reports/donations',
  REPORTS_FINANCIAL: '/reports/financial',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_SECURITY: '/profile/security',
  PROFILE_PREFERENCES: '/profile/preferences',
  
  // Error pages
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500'
} as const;

export const ROUTE_GROUPS = {
  AUTH: [ROUTES.LOGIN, ROUTES.LOGOUT, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD],
  DASHBOARD: [ROUTES.DASHBOARD],
  BENEFICIARIES: [
    ROUTES.BENEFICIARIES,
    ROUTES.BENEFICIARIES_LIST,
    ROUTES.BENEFICIARIES_ADD,
    ROUTES.BENEFICIARIES_EDIT,
    ROUTES.BENEFICIARIES_VIEW,
    ROUTES.BENEFICIARIES_SEARCH
  ],
  APPLICATIONS: [
    ROUTES.APPLICATIONS,
    ROUTES.APPLICATIONS_LIST,
    ROUTES.APPLICATIONS_ADD,
    ROUTES.APPLICATIONS_EDIT,
    ROUTES.APPLICATIONS_VIEW,
    ROUTES.APPLICATIONS_APPROVE
  ],
  AID: [
    ROUTES.AID,
    ROUTES.AID_RECORDS,
    ROUTES.AID_RECORDS_LIST,
    ROUTES.AID_RECORDS_ADD,
    ROUTES.AID_RECORDS_EDIT,
    ROUTES.AID_RECORDS_VIEW,
    ROUTES.AID_PAYMENTS,
    ROUTES.AID_PAYMENTS_LIST,
    ROUTES.AID_PAYMENTS_ADD,
    ROUTES.AID_PAYMENTS_EDIT,
    ROUTES.AID_PAYMENTS_VIEW,
    ROUTES.AID_IN_KIND,
    ROUTES.AID_IN_KIND_LIST,
    ROUTES.AID_IN_KIND_ADD,
    ROUTES.AID_IN_KIND_EDIT,
    ROUTES.AID_IN_KIND_VIEW
  ],
  DONATIONS: [
    ROUTES.DONATIONS,
    ROUTES.DONATIONS_LIST,
    ROUTES.DONATIONS_ADD,
    ROUTES.DONATIONS_EDIT,
    ROUTES.DONATIONS_VIEW
  ],
  FUND: [
    ROUTES.FUND,
    ROUTES.FUND_OVERVIEW,
    ROUTES.FUND_TRANSACTIONS,
    ROUTES.FUND_BUDGET,
    ROUTES.FUND_REPORTS
  ],
  SCHOLARSHIP: [
    ROUTES.SCHOLARSHIP,
    ROUTES.SCHOLARSHIP_LIST,
    ROUTES.SCHOLARSHIP_ADD,
    ROUTES.SCHOLARSHIP_EDIT,
    ROUTES.SCHOLARSHIP_VIEW,
    ROUTES.SCHOLARSHIP_APPLICATIONS
  ],
  MESSAGES: [
    ROUTES.MESSAGES,
    ROUTES.MESSAGES_INBOX,
    ROUTES.MESSAGES_SENT,
    ROUTES.MESSAGES_COMPOSE,
    ROUTES.MESSAGES_VIEW
  ],
  SYSTEM: [
    ROUTES.SYSTEM,
    ROUTES.USERS,
    ROUTES.USERS_LIST,
    ROUTES.USERS_ADD,
    ROUTES.USERS_EDIT,
    ROUTES.USERS_VIEW,
    ROUTES.USERS_PERMISSIONS,
    ROUTES.ROLES,
    ROUTES.ROLES_LIST,
    ROUTES.ROLES_ADD,
    ROUTES.ROLES_EDIT,
    ROUTES.ROLES_VIEW,
    ROUTES.SETTINGS,
    ROUTES.SETTINGS_GENERAL,
    ROUTES.SETTINGS_SECURITY,
    ROUTES.SETTINGS_NOTIFICATIONS,
    ROUTES.SETTINGS_BACKUP
  ],
  DEFINITIONS: [
    ROUTES.DEFINITIONS,
    ROUTES.DEFINITIONS_AID_TYPES,
    ROUTES.DEFINITIONS_CATEGORIES,
    ROUTES.DEFINITIONS_LOCATIONS,
    ROUTES.DEFINITIONS_BANKS
  ],
  REPORTS: [
    ROUTES.REPORTS,
    ROUTES.REPORTS_BENEFICIARIES,
    ROUTES.REPORTS_APPLICATIONS,
    ROUTES.REPORTS_PAYMENTS,
    ROUTES.REPORTS_DONATIONS,
    ROUTES.REPORTS_FINANCIAL
  ],
  PROFILE: [
    ROUTES.PROFILE,
    ROUTES.PROFILE_EDIT,
    ROUTES.PROFILE_SECURITY,
    ROUTES.PROFILE_PREFERENCES
  ],
  ERRORS: [
    ROUTES.NOT_FOUND,
    ROUTES.UNAUTHORIZED,
    ROUTES.FORBIDDEN,
    ROUTES.SERVER_ERROR
  ]
} as const;

export const ROUTE_TITLES = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.BENEFICIARIES]: 'İhtiyaç Sahipleri',
  [ROUTES.BENEFICIARIES_LIST]: 'İhtiyaç Sahipleri Listesi',
  [ROUTES.BENEFICIARIES_ADD]: 'Yeni İhtiyaç Sahibi',
  [ROUTES.BENEFICIARIES_EDIT]: 'İhtiyaç Sahibi Düzenle',
  [ROUTES.BENEFICIARIES_VIEW]: 'İhtiyaç Sahibi Detayı',
  [ROUTES.BENEFICIARIES_SEARCH]: 'İhtiyaç Sahibi Ara',
  
  [ROUTES.APPLICATIONS]: 'Başvurular',
  [ROUTES.APPLICATIONS_LIST]: 'Başvuru Listesi',
  [ROUTES.APPLICATIONS_ADD]: 'Yeni Başvuru',
  [ROUTES.APPLICATIONS_EDIT]: 'Başvuru Düzenle',
  [ROUTES.APPLICATIONS_VIEW]: 'Başvuru Detayı',
  [ROUTES.APPLICATIONS_APPROVE]: 'Başvuru Onaylama',
  
  [ROUTES.AID]: 'Yardım Yönetimi',
  [ROUTES.AID_RECORDS]: 'Yardım Kayıtları',
  [ROUTES.AID_RECORDS_LIST]: 'Yardım Kayıtları Listesi',
  [ROUTES.AID_RECORDS_ADD]: 'Yeni Yardım Kaydı',
  [ROUTES.AID_RECORDS_EDIT]: 'Yardım Kaydı Düzenle',
  [ROUTES.AID_RECORDS_VIEW]: 'Yardım Kaydı Detayı',
  
  [ROUTES.AID_PAYMENTS]: 'Nakdi Yardımlar',
  [ROUTES.AID_PAYMENTS_LIST]: 'Nakdi Yardım Listesi',
  [ROUTES.AID_PAYMENTS_ADD]: 'Yeni Nakdi Yardım',
  [ROUTES.AID_PAYMENTS_EDIT]: 'Nakdi Yardım Düzenle',
  [ROUTES.AID_PAYMENTS_VIEW]: 'Nakdi Yardım Detayı',
  
  [ROUTES.AID_IN_KIND]: 'Ayni Yardımlar',
  [ROUTES.AID_IN_KIND_LIST]: 'Ayni Yardım Listesi',
  [ROUTES.AID_IN_KIND_ADD]: 'Yeni Ayni Yardım',
  [ROUTES.AID_IN_KIND_EDIT]: 'Ayni Yardım Düzenle',
  [ROUTES.AID_IN_KIND_VIEW]: 'Ayni Yardım Detayı',
  
  [ROUTES.DONATIONS]: 'Bağışlar',
  [ROUTES.DONATIONS_LIST]: 'Bağış Listesi',
  [ROUTES.DONATIONS_ADD]: 'Yeni Bağış',
  [ROUTES.DONATIONS_EDIT]: 'Bağış Düzenle',
  [ROUTES.DONATIONS_VIEW]: 'Bağış Detayı',
  
  [ROUTES.FUND]: 'Fon Yönetimi',
  [ROUTES.FUND_OVERVIEW]: 'Fon Genel Bakış',
  [ROUTES.FUND_TRANSACTIONS]: 'Fon İşlemleri',
  [ROUTES.FUND_BUDGET]: 'Bütçe',
  [ROUTES.FUND_REPORTS]: 'Fon Raporları',
  
  [ROUTES.SCHOLARSHIP]: 'Burs Yönetimi',
  [ROUTES.SCHOLARSHIP_LIST]: 'Burs Listesi',
  [ROUTES.SCHOLARSHIP_ADD]: 'Yeni Burs',
  [ROUTES.SCHOLARSHIP_EDIT]: 'Burs Düzenle',
  [ROUTES.SCHOLARSHIP_VIEW]: 'Burs Detayı',
  [ROUTES.SCHOLARSHIP_APPLICATIONS]: 'Burs Başvuruları',
  
  [ROUTES.MESSAGES]: 'Mesajlar',
  [ROUTES.MESSAGES_INBOX]: 'Gelen Kutusu',
  [ROUTES.MESSAGES_SENT]: 'Gönderilen',
  [ROUTES.MESSAGES_COMPOSE]: 'Yeni Mesaj',
  [ROUTES.MESSAGES_VIEW]: 'Mesaj Detayı',
  
  [ROUTES.SYSTEM]: 'Sistem Yönetimi',
  [ROUTES.USERS]: 'Kullanıcı Yönetimi',
  [ROUTES.USERS_LIST]: 'Kullanıcı Listesi',
  [ROUTES.USERS_ADD]: 'Yeni Kullanıcı',
  [ROUTES.USERS_EDIT]: 'Kullanıcı Düzenle',
  [ROUTES.USERS_VIEW]: 'Kullanıcı Detayı',
  [ROUTES.USERS_PERMISSIONS]: 'Kullanıcı İzinleri',
  
  [ROUTES.ROLES]: 'Rol Yönetimi',
  [ROUTES.ROLES_LIST]: 'Rol Listesi',
  [ROUTES.ROLES_ADD]: 'Yeni Rol',
  [ROUTES.ROLES_EDIT]: 'Rol Düzenle',
  [ROUTES.ROLES_VIEW]: 'Rol Detayı',
  
  [ROUTES.SETTINGS]: 'Sistem Ayarları',
  [ROUTES.SETTINGS_GENERAL]: 'Genel Ayarlar',
  [ROUTES.SETTINGS_SECURITY]: 'Güvenlik Ayarları',
  [ROUTES.SETTINGS_NOTIFICATIONS]: 'Bildirim Ayarları',
  [ROUTES.SETTINGS_BACKUP]: 'Yedekleme Ayarları',
  
  [ROUTES.DEFINITIONS]: 'Tanımlar',
  [ROUTES.DEFINITIONS_AID_TYPES]: 'Yardım Türleri',
  [ROUTES.DEFINITIONS_CATEGORIES]: 'Kategoriler',
  [ROUTES.DEFINITIONS_LOCATIONS]: 'Lokasyonlar',
  [ROUTES.DEFINITIONS_BANKS]: 'Bankalar',
  
  [ROUTES.REPORTS]: 'Raporlar',
  [ROUTES.REPORTS_BENEFICIARIES]: 'İhtiyaç Sahibi Raporları',
  [ROUTES.REPORTS_APPLICATIONS]: 'Başvuru Raporları',
  [ROUTES.REPORTS_PAYMENTS]: 'Ödeme Raporları',
  [ROUTES.REPORTS_DONATIONS]: 'Bağış Raporları',
  [ROUTES.REPORTS_FINANCIAL]: 'Mali Raporlar',
  
  [ROUTES.PROFILE]: 'Profil',
  [ROUTES.PROFILE_EDIT]: 'Profil Düzenle',
  [ROUTES.PROFILE_SECURITY]: 'Güvenlik',
  [ROUTES.PROFILE_PREFERENCES]: 'Tercihler',
  
  [ROUTES.NOT_FOUND]: 'Sayfa Bulunamadı',
  [ROUTES.UNAUTHORIZED]: 'Yetkisiz Erişim',
  [ROUTES.FORBIDDEN]: 'Erişim Engellendi',
  [ROUTES.SERVER_ERROR]: 'Sunucu Hatası'
} as const;

// Navigation helpers
export const getRouteTitle = (route: string): string => {
  return ROUTE_TITLES[route as keyof typeof ROUTE_TITLES] || 'Sayfa';
};

export const isRouteInGroup = (route: string, group: keyof typeof ROUTE_GROUPS): boolean => {
  const routes = ROUTE_GROUPS[group] as readonly string[];
  return routes.includes(route);
};

export const getActiveRouteGroup = (currentRoute: string): keyof typeof ROUTE_GROUPS | null => {
  for (const [groupName, routes] of Object.entries(ROUTE_GROUPS)) {
    if (routes.some(route => currentRoute.startsWith(route))) {
      return groupName as keyof typeof ROUTE_GROUPS;
    }
  }
  return null;
};

// Dynamic route builders
export const buildRoute = {
  beneficiaryView: (id: string) => `${ROUTES.BENEFICIARIES_VIEW}/${id}`,
  beneficiaryEdit: (id: string) => `${ROUTES.BENEFICIARIES_EDIT}/${id}`,
  
  applicationView: (id: string) => `${ROUTES.APPLICATIONS_VIEW}/${id}`,
  applicationEdit: (id: string) => `${ROUTES.APPLICATIONS_EDIT}/${id}`,
  applicationApprove: (id: string) => `${ROUTES.APPLICATIONS_APPROVE}/${id}`,
  
  aidRecordView: (id: string) => `${ROUTES.AID_RECORDS_VIEW}/${id}`,
  aidRecordEdit: (id: string) => `${ROUTES.AID_RECORDS_EDIT}/${id}`,
  
  aidPaymentView: (id: string) => `${ROUTES.AID_PAYMENTS_VIEW}/${id}`,
  aidPaymentEdit: (id: string) => `${ROUTES.AID_PAYMENTS_EDIT}/${id}`,
  
  aidInKindView: (id: string) => `${ROUTES.AID_IN_KIND_VIEW}/${id}`,
  aidInKindEdit: (id: string) => `${ROUTES.AID_IN_KIND_EDIT}/${id}`,
  
  donationView: (id: string) => `${ROUTES.DONATIONS_VIEW}/${id}`,
  donationEdit: (id: string) => `${ROUTES.DONATIONS_EDIT}/${id}`,
  
  scholarshipView: (id: string) => `${ROUTES.SCHOLARSHIP_VIEW}/${id}`,
  scholarshipEdit: (id: string) => `${ROUTES.SCHOLARSHIP_EDIT}/${id}`,
  
  messageView: (id: string) => `${ROUTES.MESSAGES_VIEW}/${id}`,
  
  userView: (id: string) => `${ROUTES.USERS_VIEW}/${id}`,
  userEdit: (id: string) => `${ROUTES.USERS_EDIT}/${id}`,
  
  roleView: (id: string) => `${ROUTES.ROLES_VIEW}/${id}`,
  roleEdit: (id: string) => `${ROUTES.ROLES_EDIT}/${id}`
} as const;