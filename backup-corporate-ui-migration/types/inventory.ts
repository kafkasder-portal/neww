// =====================================================
// Inventory Management Types
// =====================================================

export interface InventoryItem {
  id: string
  name: string
  description?: string
  sku: string // Stock Keeping Unit
  barcode?: string
  qrCode?: string
  categoryId: string
  category?: InventoryCategory
  supplierId?: string
  supplier?: Supplier
  locationId: string
  location?: WarehouseLocation
  unitOfMeasure: string // adet, kg, litre, metre, vb.
  unitPrice: number
  currentStock: number
  minimumStock: number
  maximumStock?: number
  reorderPoint: number
  status: 'active' | 'inactive' | 'discontinued'
  tags?: string[]
  imageUrl?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  code?: string
  quantity?: number
  unit?: string
  itemCode?: string
  itemName?: string
}

export interface InventoryCategory {
  id: string
  name: string
  description?: string
  parentId?: string
  parent?: InventoryCategory
  children?: InventoryCategory[]
  code: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WarehouseLocation {
  id: string
  name: string
  code: string
  description?: string
  type: 'warehouse' | 'room' | 'shelf' | 'bin' | 'cold_storage' | 'archive'
  parentId?: string
  parent?: WarehouseLocation
  children?: WarehouseLocation[]
  address?: string
  capacity?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  currentOccupancy?: number
  temperatureRange?: string
  qrCode?: string
  barcode?: string
}

export interface Supplier {
  id: string
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  taxNumber?: string
  paymentTerms?: string
  notes?: string
  isActive: boolean
  rating?: number // 1-5 yıldız
  createdAt: string
  updatedAt: string
  code?: string
  type?: string
  category?: string
  creditLimit?: number
  currentDebt?: number
  totalAmount?: number
  lastOrderDate?: string
  totalOrders?: number
}

export interface StockMovement {
  id: string
  itemId: string
  item?: InventoryItem
  movementType: 'in' | 'out' | 'transfer' | 'adjustment'
  quantity: number
  unitPrice?: number
  totalValue?: number
  fromLocationId?: string
  fromLocation?: WarehouseLocation
  toLocationId?: string
  toLocation?: WarehouseLocation
  reason: string
  referenceNumber?: string
  referenceType?: 'purchase' | 'sale' | 'donation' | 'aid' | 'transfer' | 'adjustment' | 'return'
  referenceId?: string
  notes?: string
  performedBy: string
  performedAt: string
  approvedBy?: string
  approvedAt?: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface StockAlert {
  id: string
  itemId: string
  item?: InventoryItem
  itemName: string
  itemCode: string
  locationName: string
  currentStock: number
  threshold: number
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiry_warning'
  alertType: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiry_warning'
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  isRead: boolean
  isResolved: boolean
  isActive: boolean
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
  location?: string
  expiryDate?: string
}

export interface AlertRule {
  id: string
  name: string
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiry_warning'
  threshold: number
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
  category?: string
  notificationMethods?: string[]
  recipients?: string[]
}

export interface StockAlertRule {
  id: string
  name: string
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiry_warning'
  threshold: number
  isActive: boolean
  description?: string
  categoryId?: string
  locationId?: string
  supplierId?: string
  conditions?: Record<string, any>
  createdAt: string
  updatedAt: string
  createdBy: string
  severity?: string
  itemId?: string
  notificationMethods?: string[]
  recipients?: string[]
}

export interface AlertRuleForm {
  name: string
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiry_warning'
  threshold: number
  description?: string
  isActive?: boolean
  category?: string
  notificationMethods?: string[]
  recipients?: string[]
}

export interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierId: string
  supplier?: Supplier
  orderDate: string
  expectedDeliveryDate?: string
  actualDeliveryDate?: string
  status: 'draft' | 'sent' | 'confirmed' | 'partially_received' | 'received' | 'cancelled'
  items: PurchaseOrderItem[]
  subtotal: number
  taxAmount: number
  totalAmount: number
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface PurchaseOrderItem {
  id: string
  purchaseOrderId: string
  itemId: string
  item?: InventoryItem
  quantity: number
  unitPrice: number
  totalPrice: number
  receivedQuantity: number
  notes?: string
}

export interface StockTake {
  id: string
  name: string
  description?: string
  locationId?: string
  location?: WarehouseLocation
  categoryId?: string
  category?: InventoryCategory
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  scheduledDate: string
  startedAt?: string
  completedAt?: string
  performedBy: string[]
  items: StockTakeItem[]
  totalVariance: number
  createdAt: string
  updatedAt: string
}

export interface StockTakeItem {
  id: string
  stockTakeId: string
  itemId: string
  item?: InventoryItem
  systemQuantity: number
  countedQuantity: number
  variance: number
  varianceValue: number
  notes?: string
  countedBy: string
  countedAt: string
}

export interface InventoryReport {
  id: string
  name: string
  type: 'stock_levels' | 'movements' | 'valuation' | 'alerts' | 'abc_analysis' | 'turnover'
  parameters: Record<string, any>
  generatedAt: string
  generatedBy: string
  data: any
}

// Form Types
export interface InventoryItemForm {
  name: string
  description?: string
  sku: string
  barcode?: string
  categoryId: string
  supplierId?: string
  locationId: string
  unitOfMeasure: string
  unitPrice: number
  currentStock: number
  minimumStock: number
  maximumStock?: number
  reorderPoint: number
  status: 'active' | 'inactive' | 'discontinued'
  tags?: string[]
  imageUrl?: string
}

export interface StockMovementForm {
  itemId: string
  movementType: 'in' | 'out' | 'transfer' | 'adjustment'
  quantity: number
  unitPrice?: number
  fromLocationId?: string
  toLocationId?: string
  reason: string
  referenceNumber?: string
  referenceType?: 'purchase' | 'sale' | 'donation' | 'aid' | 'transfer' | 'adjustment' | 'return'
  referenceId?: string
  notes?: string
}

export interface SupplierForm {
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  taxNumber?: string
  paymentTerms?: string
  notes?: string
  isActive: boolean
  rating?: number
  code?: string
  type?: string
  category?: string
  creditLimit?: number
  currentDebt?: number
  totalAmount?: number
  lastOrderDate?: string
  totalOrders?: number
}

export interface WarehouseLocationForm {
  name: string
  code: string
  description?: string
  type: 'warehouse' | 'room' | 'shelf' | 'bin' | 'cold_storage' | 'archive'
  parentId?: string
  address?: string
  capacity?: number
  isActive: boolean
  currentOccupancy?: number
  temperatureRange?: string
  qrCode?: string
  barcode?: string
}

// Filter and Search Types
export interface InventoryFilters {
  search?: string
  categoryId?: string
  supplierId?: string
  locationId?: string
  status?: 'active' | 'inactive' | 'discontinued'
  lowStock?: boolean
  outOfStock?: boolean
  tags?: string[]
}

export interface StockMovementFilters {
  search?: string
  itemId?: string
  movementType?: 'in' | 'out' | 'transfer' | 'adjustment'
  locationId?: string
  dateFrom?: string
  dateTo?: string
  status?: 'pending' | 'approved' | 'rejected'
  performedBy?: string
}

export interface SupplierFilters {
  search?: string
  category?: string
  type?: string
  isActive?: boolean
  rating?: number
}

export interface WarehouseLocationFilters {
  search?: string
  type?: string
  isActive?: boolean
  parentId?: string
}

export interface StockAlertFilters {
  search?: string
  type?: string
  severity?: string
  isResolved?: boolean
  locationId?: string
  categoryId?: string
}

// Dashboard and Analytics Types
export interface InventoryDashboard {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  pendingMovements: number
  recentMovements: StockMovement[]
  topCategories: Array<{
    category: InventoryCategory
    itemCount: number
    totalValue: number
  }>
  stockAlerts: StockAlert[]
  monthlyMovements: Array<{
    month: string
    inbound: number
    outbound: number
    value: number
  }>
}

export interface InventoryAnalytics {
  abcAnalysis: Array<{
    itemId: string
    item: InventoryItem
    category: 'A' | 'B' | 'C'
    annualUsage: number
    annualValue: number
    percentage: number
  }>
  turnoverAnalysis: Array<{
    itemId: string
    item: InventoryItem
    turnoverRate: number
    daysOnHand: number
    category: 'fast' | 'medium' | 'slow' | 'dead'
  }>
  stockValuation: {
    totalValue: number
    byCategory: Array<{
      categoryId: string
      category: InventoryCategory
      value: number
      percentage: number
    }>
    byLocation: Array<{
      locationId: string
      location: WarehouseLocation
      value: number
      percentage: number
    }>
  }
}

// API Response Types
export interface InventoryApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface InventoryListResponse extends InventoryApiResponse<InventoryItem[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Constants
export const INVENTORY_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISCONTINUED: 'discontinued'
} as const

export const MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment'
} as const

export const ALERT_TYPES = {
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  OVERSTOCK: 'overstock',
  EXPIRY_WARNING: 'expiry_warning'
} as const

export const ALERT_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const
