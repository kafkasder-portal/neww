import { supabase } from '@/lib/supabase'
import type { InventoryItem, StockMovement, InventoryCategory, WarehouseLocation } from '@/types/inventory'

export interface InventoryReportData {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  categoryDistribution: CategoryDistribution[]
  locationDistribution: LocationDistribution[]
  stockMovementTrends: StockMovementTrend[]
  topValueItems: TopValueItem[]
  stockTurnoverRate: StockTurnoverData[]
  expiryAlerts: ExpiryAlert[]
  monthlyStockValue: MonthlyStockValue[]
  supplierPerformance: SupplierPerformance[]
}

export interface CategoryDistribution {
  category: string
  count: number
  value: number
  percentage: number
  color: string
}

export interface LocationDistribution {
  location: string
  count: number
  value: number
  percentage: number
  color: string
}

export interface StockMovementTrend {
  date: string
  inbound: number
  outbound: number
  net: number
}

export interface TopValueItem {
  id: string
  name: string
  category: string
  quantity: number
  unitPrice: number
  totalValue: number
}

export interface StockTurnoverData {
  category: string
  turnoverRate: number
  averageDaysInStock: number
  totalMovements: number
}

export interface ExpiryAlert {
  id: string
  name: string
  category: string
  expiryDate?: string // Made optional since expiry_date is not in InventoryItem interface
  daysUntilExpiry: number
  quantity: number
  severity: 'critical' | 'warning' | 'info'
}

export interface MonthlyStockValue {
  month: string
  totalValue: number
  itemCount: number
  averageValue: number
}

export interface SupplierPerformance {
  supplier: string
  totalOrders: number
  totalValue: number
  averageDeliveryTime: number
  qualityRating: number
  onTimeDeliveryRate: number
}

export interface ReportFilters {
  startDate?: string
  endDate?: string
  categoryIds?: string[]
  locationIds?: string[]
  supplierId?: string
  includeInactive?: boolean
}

class InventoryReportService {
  private static instance: InventoryReportService
  private readonly colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ]

  static getInstance(): InventoryReportService {
    if (!InventoryReportService.instance) {
      InventoryReportService.instance = new InventoryReportService()
    }
    return InventoryReportService.instance
  }

  async generateInventoryReport(filters: ReportFilters = {}): Promise<InventoryReportData> {
    try {
      const [
        items,
        movements,
        categories,
        locations
      ] = await Promise.all([
        this.getFilteredItems(filters),
        this.getFilteredMovements(filters),
        this.getCategories(),
        this.getLocations()
      ])

      const reportData: InventoryReportData = {
        totalItems: items.length,
        totalValue: this.calculateTotalValue(items),
        lowStockItems: this.countLowStockItems(items),
        outOfStockItems: this.countOutOfStockItems(items),
        categoryDistribution: this.calculateCategoryDistribution(items, categories),
        locationDistribution: this.calculateLocationDistribution(items),
        stockMovementTrends: this.calculateStockMovementTrends(movements),
        topValueItems: this.getTopValueItems(items),
        stockTurnoverRate: this.calculateStockTurnoverRate(items, movements),
        expiryAlerts: this.generateExpiryAlerts(items),
        monthlyStockValue: this.calculateMonthlyStockValue(items, movements),
        supplierPerformance: this.calculateSupplierPerformance(items, movements)
      }

      return reportData
    } catch (error) {
      console.error('Error generating inventory report:', error)
      throw new Error('Envanter raporu oluşturulurken hata oluştu')
    }
  }

  private async getFilteredItems(filters: ReportFilters): Promise<InventoryItem[]> {
    let query = supabase
      .from('inventory_items')
      .select(`
        *,
        category:inventory_categories(id, name),
        location:inventory_locations(id, name),
        supplier:inventory_suppliers(id, name)
      `)

    if (!filters.includeInactive) {
      query = query.eq('is_active', true)
    }

    if (filters.categoryIds?.length) {
      query = query.in('category_id', filters.categoryIds)
    }

    if (filters.locationIds?.length) {
      query = query.in('location_id', filters.locationIds)
    }

    if (filters.supplierId) {
      query = query.eq('supplier_id', filters.supplierId)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  private async getFilteredMovements(filters: ReportFilters): Promise<StockMovement[]> {
    let query = supabase
      .from('stock_movements')
      .select(`
        *,
        item:inventory_items(id, name, category_id)
      `)
      .order('created_at', { ascending: false })

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  private async getCategories(): Promise<InventoryCategory[]> {
    const { data, error } = await supabase
      .from('inventory_categories')
      .select('*')
      .eq('is_active', true)

    if (error) throw error
    return data || []
  }

  private async getLocations(): Promise<WarehouseLocation[]> {
    const { data, error } = await supabase
      .from('inventory_locations')
      .select('*')
      .eq('is_active', true)

    if (error) throw error
    return data || []
  }

  private calculateTotalValue(items: InventoryItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.currentStock * item.unitPrice)
    }, 0)
  }

  private countLowStockItems(items: InventoryItem[]): number {
    return items.filter(item => 
      item.currentStock <= item.minimumStock
    ).length
  }

  private countOutOfStockItems(items: InventoryItem[]): number {
    return items.filter(item => item.currentStock === 0).length
  }

  private calculateCategoryDistribution(
    items: InventoryItem[], 
    categories: InventoryCategory[]
  ): CategoryDistribution[] {
    const categoryMap = new Map<string, { count: number; value: number }>()
    const totalValue = this.calculateTotalValue(items)

    items.forEach(item => {
      const categoryName = item.category?.name || 'Kategorisiz'
      const itemValue = item.currentStock * item.unitPrice
      
      if (categoryMap.has(categoryName)) {
        const existing = categoryMap.get(categoryName)!
        categoryMap.set(categoryName, {
          count: existing.count + 1,
          value: existing.value + itemValue
        })
      } else {
        categoryMap.set(categoryName, { count: 1, value: itemValue })
      }
    })

    return Array.from(categoryMap.entries()).map(([category, data], index) => ({
      category,
      count: data.count,
      value: data.value,
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
      color: this.colors[index % this.colors.length]
    }))
  }

  private calculateLocationDistribution(
    items: InventoryItem[]
  ): LocationDistribution[] {
    const locationMap = new Map<string, { count: number; value: number }>()
    const totalValue = this.calculateTotalValue(items)

    items.forEach(item => {
      const locationName = item.location?.name || 'Lokasyon Belirtilmemiş'
      const itemValue = item.currentStock * item.unitPrice
      
      if (locationMap.has(locationName)) {
        const existing = locationMap.get(locationName)!
        locationMap.set(locationName, {
          count: existing.count + 1,
          value: existing.value + itemValue
        })
      } else {
        locationMap.set(locationName, { count: 1, value: itemValue })
      }
    })

    return Array.from(locationMap.entries()).map(([location, data], index) => ({
      location,
      count: data.count,
      value: data.value,
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
      color: this.colors[index % this.colors.length]
    }))
  }

  private calculateStockMovementTrends(movements: StockMovement[]): StockMovementTrend[] {
    const trendMap = new Map<string, { inbound: number; outbound: number }>()

    movements.forEach(movement => {
      const date = new Date(movement.performedAt).toISOString().split('T')[0]
      
      if (!trendMap.has(date)) {
        trendMap.set(date, { inbound: 0, outbound: 0 })
      }

      const trend = trendMap.get(date)!
      if (movement.movementType === 'in') {
        trend.inbound += movement.quantity
      } else {
        trend.outbound += movement.quantity
      }
    })

    return Array.from(trendMap.entries())
      .map(([date, data]) => ({
        date,
        inbound: data.inbound,
        outbound: data.outbound,
        net: data.inbound - data.outbound
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30) // Son 30 gün
  }

  private getTopValueItems(items: InventoryItem[]): TopValueItem[] {
    return items
      .map(item => ({
        id: item.id,
        name: item.name,
        category: item.category?.name || 'Kategorisiz',
        quantity: item.currentStock,
        unitPrice: item.unitPrice,
        totalValue: item.currentStock * item.unitPrice
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10)
  }

  private calculateStockTurnoverRate(
    items: InventoryItem[], 
    movements: StockMovement[]
  ): StockTurnoverData[] {
    const categoryTurnover = new Map<string, {
      totalMovements: number
      averageStock: number
      items: InventoryItem[]
    }>()

    // Kategori bazında stok devir hızı hesapla
    items.forEach(item => {
      const categoryName = item.category?.name || 'Kategorisiz'
      
      if (!categoryTurnover.has(categoryName)) {
        categoryTurnover.set(categoryName, {
          totalMovements: 0,
          averageStock: 0,
          items: []
        })
      }

      const category = categoryTurnover.get(categoryName)!
      category.items.push(item)
      category.averageStock += item.currentStock
    })

    // Hareket verilerini ekle
    movements.forEach(movement => {
      const categoryName = movement.item?.category?.name || 'Kategorisiz'
      if (categoryTurnover.has(categoryName)) {
        categoryTurnover.get(categoryName)!.totalMovements += movement.quantity
      }
    })

    return Array.from(categoryTurnover.entries()).map(([category, data]) => {
      const averageStock = data.averageStock / data.items.length
      const turnoverRate = averageStock > 0 ? data.totalMovements / averageStock : 0
      
      return {
        category,
        turnoverRate: Math.round(turnoverRate * 100) / 100,
        averageDaysInStock: turnoverRate > 0 ? Math.round(365 / turnoverRate) : 0,
        totalMovements: data.totalMovements
      }
    })
  }

  private generateExpiryAlerts(items: InventoryItem[]): ExpiryAlert[] {
    const alerts: ExpiryAlert[] = []

    // Note: expiry_date is not part of the InventoryItem interface
    // This would need to be added to the database schema and type definition
    // For now, we'll skip expiry alerts until the schema is updated
    // items.forEach(item => {
    //   if (item.expiry_date) {
    //     const now = new Date()
    //     const expiryDate = new Date(item.expiry_date)
    //     const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    //     if (daysUntilExpiry <= 30) { // 30 gün içinde sona erecekler
    //       let severity: 'critical' | 'warning' | 'info' = 'info'
          
    //       if (daysUntilExpiry <= 7) {
    //         severity = 'critical'
    //       } else if (daysUntilExpiry <= 14) {
    //         severity = 'warning'
    //       }

    //       alerts.push({
    //         id: item.id,
    //         name: item.name,
    //         category: item.category?.name || 'Kategorisiz',
    //         expiryDate: item.expiry_date,
    //         daysUntilExpiry,
    //         quantity: item.currentStock,
    //         severity
    //       })
    //     }
    //   }
    // })

    return alerts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
  }

  private calculateMonthlyStockValue(
    items: InventoryItem[], 
    movements: StockMovement[]
  ): MonthlyStockValue[] {
    const monthlyData = new Map<string, { totalValue: number; itemCount: number }>()
    
    // Son 12 ayın verilerini hesapla
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM format
      
      monthlyData.set(monthKey, { totalValue: 0, itemCount: 0 })
    }

    // Mevcut stok değerini hesapla (basitleştirilmiş)
    const currentTotalValue = this.calculateTotalValue(items)
    const currentMonth = new Date().toISOString().slice(0, 7)
    
    if (monthlyData.has(currentMonth)) {
      monthlyData.set(currentMonth, {
        totalValue: currentTotalValue,
        itemCount: items.length
      })
    }

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'short' 
      }),
      totalValue: data.totalValue,
      itemCount: data.itemCount,
      averageValue: data.itemCount > 0 ? data.totalValue / data.itemCount : 0
    }))
  }

  private calculateSupplierPerformance(
    items: InventoryItem[], 
    movements: StockMovement[]
  ): SupplierPerformance[] {
    const supplierMap = new Map<string, {
      totalOrders: number
      totalValue: number
      deliveryTimes: number[]
      qualityRatings: number[]
      onTimeDeliveries: number
      totalDeliveries: number
    }>()

    items.forEach(item => {
      const supplierName = item.supplier?.name || 'Tedarikçi Belirtilmemiş'
      
      if (!supplierMap.has(supplierName)) {
        supplierMap.set(supplierName, {
          totalOrders: 0,
          totalValue: 0,
          deliveryTimes: [],
          qualityRatings: [],
          onTimeDeliveries: 0,
          totalDeliveries: 0
        })
      }

      const supplier = supplierMap.get(supplierName)!
      supplier.totalOrders += 1
      supplier.totalValue += item.currentStock * item.unitPrice
      
      // Simulated data for demo purposes
      supplier.deliveryTimes.push(Math.floor(Math.random() * 10) + 1)
      supplier.qualityRatings.push(Math.random() * 2 + 3) // 3-5 arası
      supplier.onTimeDeliveries += Math.random() > 0.2 ? 1 : 0
      supplier.totalDeliveries += 1
    })

    return Array.from(supplierMap.entries()).map(([supplier, data]) => ({
      supplier,
      totalOrders: data.totalOrders,
      totalValue: data.totalValue,
      averageDeliveryTime: data.deliveryTimes.length > 0 
        ? data.deliveryTimes.reduce((a, b) => a + b, 0) / data.deliveryTimes.length 
        : 0,
      qualityRating: data.qualityRatings.length > 0
        ? data.qualityRatings.reduce((a, b) => a + b, 0) / data.qualityRatings.length
        : 0,
      onTimeDeliveryRate: data.totalDeliveries > 0
        ? (data.onTimeDeliveries / data.totalDeliveries) * 100
        : 0
    }))
  }

  async exportReportData(reportData: InventoryReportData, format: 'csv' | 'json' = 'csv'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(reportData, null, 2)
    }

    // CSV export için basit bir implementasyon
    const csvData = [
      ['Rapor Özeti'],
      ['Toplam Ürün Sayısı', reportData.totalItems.toString()],
      ['Toplam Değer', reportData.totalValue.toString()],
      ['Düşük Stok Ürünleri', reportData.lowStockItems.toString()],
      ['Tükenen Ürünler', reportData.outOfStockItems.toString()],
      [''],
      ['Kategori Dağılımı'],
      ['Kategori', 'Adet', 'Değer', 'Yüzde'],
      ...reportData.categoryDistribution.map(cat => [
        cat.category,
        cat.count.toString(),
        cat.value.toString(),
        cat.percentage.toFixed(2) + '%'
      ])
    ]

    return csvData.map(row => row.join(',')).join('\n')
  }
}

export const inventoryReportService = InventoryReportService.getInstance()