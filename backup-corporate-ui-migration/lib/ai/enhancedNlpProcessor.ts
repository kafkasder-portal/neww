import { nlpProcessor, type NLPResult } from './nlpProcessor'

// Türkçe rakam ve sayı kelimelerini sayıya çeviren fonksiyon
const TURKISH_NUMBERS: Record<string, number> = {
  'sıfır': 0, 'bir': 1, 'iki': 2, 'üç': 3, 'dört': 4, 'beş': 5,
  'altı': 6, 'yedi': 7, 'sekiz': 8, 'dokuz': 9, 'on': 10,
  'onbir': 11, 'oniki': 12, 'onüç': 13, 'ondört': 14, 'onbeş': 15,
  'onaltı': 16, 'onyedi': 17, 'onsekiz': 18, 'ondokuz': 19,
  'yirmi': 20, 'otuz': 30, 'kırk': 40, 'elli': 50, 'altmış': 60,
  'yetmiş': 70, 'seksen': 80, 'doksan': 90, 'yüz': 100,
  'bin': 1000, 'milyon': 1000000, 'milyar': 1000000000
}

// Gelişmiş entity tanıma desenleri
const ENHANCED_ENTITY_PATTERNS = {
  // Para birimleri ve miktarlar
  MONEY: {
    patterns: [
      /(\d+(?:\.\d+)?)\s*(?:TL|₺|lira|türk\s*lirası)/gi,
      /(\d+(?:\.\d+)?)\s*(?:USD|\$|dolar|amerikan\s*doları)/gi,
      /(\d+(?:\.\d+)?)\s*(?:EUR|€|euro|avrupa\s*para\s*birimi)/gi,
      /(bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on)\s*(?:bin|milyon|milyar)?\s*(?:TL|lira|dolar|euro)/gi
    ],
    extract: (match: string) => {
      const amount = extractTurkishNumber(match)
      const currency = match.includes('₺') || match.includes('TL') || match.includes('lira') ? 'TRY' :
                      match.includes('$') || match.includes('dolar') ? 'USD' :
                      match.includes('€') || match.includes('euro') ? 'EUR' : 'TRY'
      return { amount, currency }
    }
  },

  // Tarih ve zaman
  DATE_TIME: {
    patterns: [
      /(?:bugün|dün|yarın|öbür\s*gün|ertesi\s*gün)/gi,
      /(?:bu\s*(?:hafta|ay|yıl)|geçen\s*(?:hafta|ay|yıl)|gelecek\s*(?:hafta|ay|yıl))/gi,
      /(\d{1,2})\s*(?:ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\s*(\d{4})?/gi,
      /(\d{1,2})[:.](\d{2})\s*(?:de|da)?/gi,
      /(?:sabah|öğle|akşam|gece)\s*(\d{1,2})(?:[:.](\d{2}))?/gi
    ],
    extract: (match: string) => {
      return parseRelativeDate(match)
    }
  },

  // Kişi isimleri (Türkçe isim kalıpları)
  PERSON: {
    patterns: [
      /(?:bay|bayan|sayın|dr|doktor|prof|profesör|mühendis)\s+([A-ZÇĞŞÜÖ][a-zçğşüöı]+(?:\s+[A-ZÇĞŞÜÖ][a-zçğşüöı]+)*)/gi,
      /([A-ZÇĞŞÜÖ][a-zçğşüöı]+)\s+([A-ZÇĞŞÜÖ][a-zçğşüöı]+)(?:\s+(?:bey|hanım))?/gi
    ],
    extract: (match: string) => {
      const cleaned = match.replace(/(?:bay|bayan|sayın|dr|doktor|prof|profesör|mühendis|bey|hanım)/gi, '').trim()
      const parts = cleaned.split(/\s+/)
      return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' '),
        fullName: cleaned
      }
    }
  },

  // Telefon numaraları
  PHONE: {
    patterns: [
      /(?:\+90\s*)?(?:\(\d{3}\)\s*)?\d{3}\s*\d{3}\s*\d{2}\s*\d{2}/g,
      /(?:0)?(\d{3})\s*(\d{3})\s*(\d{2})\s*(\d{2})/g
    ],
    extract: (match: string) => {
      return match.replace(/\D/g, '')
    }
  },

  // Email adresleri
  EMAIL: {
    patterns: [
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    ],
    extract: (match: string) => match.toLowerCase()
  },

  // Adres bilgileri
  ADDRESS: {
    patterns: [
      /(?:mahalle|mah|sokak|sk|cadde|cad|bulvar|blv|apt|apartman|no|numara)\s*[:\s]*([^,\n]+)/gi,
      /([\w\s]+)\s*(?:mahallesi|mah\.?)\s*([\w\s]+)\s*(?:sokağı|sk\.?)/gi
    ],
    extract: (match: string) => match.trim()
  },

  // Durum/öncelik ifadeleri
  PRIORITY: {
    patterns: [
      /(?:acil|çok\s*acil|ivedi|derhal|hemen)/gi,
      /(?:yüksek\s*öncelik|öncelikli|önemli)/gi,
      /(?:düşük\s*öncelik|normal|standart)/gi
    ],
    extract: (match: string) => {
      const text = match.toLowerCase()
      if (/acil|ivedi|derhal|hemen/.test(text)) return 'high'
      if (/yüksek|öncelik|önemli/.test(text)) return 'medium'
      return 'low'
    }
  }
}

// Gelişmiş intent tanıma
const ENHANCED_INTENT_PATTERNS = {
  // CRUD işlemleri
  CREATE: {
    keywords: ['ekle', 'oluştur', 'kaydet', 'yeni', 'başlat', 'kur', 'tanımla', 'açıl'],
    phrases: ['yeni.*ekle', 'kayıt.*oluştur', '.*tanımla.*', 'başlat.*'],
    confidence: 0.9
  },
  
  READ: {
    keywords: ['göster', 'listele', 'bul', 'ara', 'getir', 'oku', 'incele'],
    phrases: ['.*listele.*', 'göster.*', 'bul.*', 'neler.*var', 'hangi.*'],
    confidence: 0.85
  },
  
  UPDATE: {
    keywords: ['güncelle', 'değiştir', 'düzenle', 'revize', 'tadil'],
    phrases: ['güncelle.*', 'değiştir.*', '.*düzenle.*'],
    confidence: 0.9
  },
  
  DELETE: {
    keywords: ['sil', 'kaldır', 'iptal', 'sonlandır'],
    phrases: ['sil.*', 'kaldır.*', 'iptal.*et'],
    confidence: 0.95
  },

  // İş mantığı işlemleri
  APPROVE: {
    keywords: ['onayla', 'kabul', 'evet', 'onay', 'uygun'],
    phrases: ['onayla.*', 'kabul.*et.*', '.*onay.*ver.*'],
    confidence: 0.8
  },
  
  REJECT: {
    keywords: ['reddet', 'geri çevir', 'hayır', 'ret'],
    phrases: ['reddet.*', 'geri.*çevir.*', '.*reddedildi'],
    confidence: 0.8
  },
  
  REPORT: {
    keywords: ['rapor', 'analiz', 'istatistik', 'özet', 'durum'],
    phrases: ['rapor.*al.*', '.*analiz.*yap.*', 'durum.*nedir'],
    confidence: 0.7
  },

  // Navigasyon
  NAVIGATE: {
    keywords: ['git', 'yönlendir', 'aç', 'geç', 'sayfa'],
    phrases: ['.*sayfası.*aç', 'git.*', '.*modül.*'],
    confidence: 0.6
  },

  // Yardım ve bilgi
  HELP: {
    keywords: ['yardım', 'nasıl', 'ne yapabilirim', 'komutlar', 'öğren'],
    phrases: ['yardım.*', 'nasıl.*', 'ne.*yapabilirim', 'komut.*neler'],
    confidence: 0.5
  }
}

// Bağlam analizi için gelişmiş desenler
const CONTEXT_PATTERNS = {
  urgency: {
    high: ['acil', 'derhal', 'hemen', 'çok önemli', 'kritik'],
    medium: ['mümkün olduğunca', 'yakında', 'kısa sürede'],
    low: ['boş vakitte', 'fırsat bulduğunda', 'zamanında']
  },
  emotion: {
    positive: ['memnun', 'mutlu', 'başarılı', 'harika', 'süper'],
    negative: ['sıkıntı', 'problem', 'sorun', 'kötü', 'başarısız'],
    neutral: ['normal', 'standart', 'rutin']
  },
  formality: {
    formal: ['sayın', 'değerli', 'saygıdeğer', 'takdir ederim'],
    informal: ['selam', 'merhaba', 'teşekkür ederim', 'teşekkürler']
  }
}

function extractTurkishNumber(text: string): number {
  // Önce rakamları kontrol et
  const numberMatch = text.match(/\d+(?:\.\d+)?/)
  if (numberMatch) {
    return parseFloat(numberMatch[0])
  }

  // Türkçe sayı kelimelerini çevir
  let result = 0
  const words = text.toLowerCase().split(/\s+/)
  
  for (const word of words) {
    if (TURKISH_NUMBERS[word]) {
      result += TURKISH_NUMBERS[word]
    }
  }

  return result || 0
}

function parseRelativeDate(text: string): Date {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  if (/bugün/.test(text)) return today
  if (/dün/.test(text)) return new Date(today.getTime() - 24 * 60 * 60 * 1000)
  if (/yarın/.test(text)) return new Date(today.getTime() + 24 * 60 * 60 * 1000)
  
  if (/bu hafta/.test(text)) return today
  if (/geçen hafta/.test(text)) return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  if (/gelecek hafta/.test(text)) return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  return today
}

export interface EnhancedNLPResult extends NLPResult {
  originalText: string
  structuredEntities: {
    money?: Array<{ amount: number; currency: string }>
    persons?: Array<{ firstName: string; lastName: string; fullName: string }>
    phones?: string[]
    emails?: string[]
    addresses?: string[]
    dates?: Date[]
    priorities?: string[]
  }
  contextAnalysis: {
    urgency: 'low' | 'medium' | 'high'
    emotion: 'positive' | 'negative' | 'neutral'
    formality: 'formal' | 'informal' | 'neutral'
    complexity: 'simple' | 'medium' | 'complex'
  }
  suggestions: string[]
  confidence: number
}

export class EnhancedNLPProcessor {
  private static instance: EnhancedNLPProcessor

  static getInstance(): EnhancedNLPProcessor {
    if (!EnhancedNLPProcessor.instance) {
      EnhancedNLPProcessor.instance = new EnhancedNLPProcessor()
    }
    return EnhancedNLPProcessor.instance
  }

  process(text: string): EnhancedNLPResult {
    // Temel NLP analizi
    const baseResult = nlpProcessor.process(text)
    
    // Gelişmiş entity çıkarımı
    const structuredEntities = this.extractStructuredEntities(text)
    
    // Gelişmiş intent tanıma
    const enhancedIntent = this.enhancedIntentRecognition(text)
    
    // Bağlam analizi
    const contextAnalysis = this.analyzeContext(text)
    
    // Öneri oluşturma
    const suggestions = this.generateSuggestions(text, enhancedIntent, structuredEntities)
    
    // Genel güven skoru hesaplama
    const confidence = this.calculateConfidence(text, enhancedIntent, structuredEntities)

    return {
      ...baseResult,
      originalText: text,
      intent: enhancedIntent,
      structuredEntities,
      contextAnalysis,
      suggestions,
      confidence
    }
  }

  private extractStructuredEntities(text: string) {
    const entities: any = {
      money: [],
      persons: [],
      phones: [],
      emails: [],
      addresses: [],
      dates: [],
      priorities: []
    }

    Object.entries(ENHANCED_ENTITY_PATTERNS).forEach(([type, config]) => {
      config.patterns.forEach(pattern => {
        const matches = Array.from(text.matchAll(pattern))
        matches.forEach(match => {
          const extracted = config.extract(match[0])
          
          switch (type) {
            case 'MONEY':
              entities.money.push(extracted)
              break
            case 'PERSON':
              entities.persons.push(extracted)
              break
            case 'PHONE':
              entities.phones.push(extracted)
              break
            case 'EMAIL':
              entities.emails.push(extracted)
              break
            case 'ADDRESS':
              entities.addresses.push(extracted)
              break
            case 'DATE_TIME':
              entities.dates.push(extracted)
              break
            case 'PRIORITY':
              entities.priorities.push(extracted)
              break
          }
        })
      })
    })

    return entities
  }

  private enhancedIntentRecognition(text: string): {
    primary: string
    confidence: number
    alternatives: Array<{ intent: string; confidence: number }>
  } {
    const lowerText = text.toLowerCase()
    const intentScores = new Map<string, number>()

    Object.entries(ENHANCED_INTENT_PATTERNS).forEach(([intent, config]) => {
      let score = 0

      // Anahtar kelime eşleşmeleri
      config.keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          score += 0.3
        }
      })

      // Phrase pattern eşleşmeleri
      config.phrases.forEach(phrase => {
        const regex = new RegExp(phrase, 'i')
        if (regex.test(text)) {
          score += 0.5
        }
      })

      // Temel güven skoruyla çarp
      score *= config.confidence

      if (score > 0) {
        intentScores.set(intent, score)
      }
    })

    if (intentScores.size === 0) {
      return {
        primary: 'UNKNOWN',
        confidence: 0.1,
        alternatives: []
      }
    }

    const sortedIntents = Array.from(intentScores.entries())
      .sort((a, b) => b[1] - a[1])

    return {
      primary: sortedIntents[0][0],
      confidence: Math.min(sortedIntents[0][1], 1),
      alternatives: sortedIntents.slice(1).map(([intent, confidence]) => ({
        intent,
        confidence: Math.min(confidence, 1)
      }))
    }
  }

  private analyzeContext(text: string): {
    urgency: 'low' | 'medium' | 'high'
    emotion: 'positive' | 'negative' | 'neutral'
    formality: 'formal' | 'informal' | 'neutral'
    complexity: 'simple' | 'medium' | 'complex'
  } {
    const lowerText = text.toLowerCase()
    
    // Aciliyet analizi
    let urgency: 'low' | 'medium' | 'high' = 'low'
    if (CONTEXT_PATTERNS.urgency.high.some(word => lowerText.includes(word))) {
      urgency = 'high'
    } else if (CONTEXT_PATTERNS.urgency.medium.some(word => lowerText.includes(word))) {
      urgency = 'medium'
    }

    // Duygu analizi
    let emotion: 'positive' | 'negative' | 'neutral' = 'neutral'
    const positiveScore = CONTEXT_PATTERNS.emotion.positive.filter(word => lowerText.includes(word)).length
    const negativeScore = CONTEXT_PATTERNS.emotion.negative.filter(word => lowerText.includes(word)).length
    
    if (positiveScore > negativeScore) emotion = 'positive'
    else if (negativeScore > positiveScore) emotion = 'negative'

    // Formallik analizi
    let formality: 'formal' | 'informal' | 'neutral' = 'neutral'
    if (CONTEXT_PATTERNS.formality.formal.some(word => lowerText.includes(word))) {
      formality = 'formal'
    } else if (CONTEXT_PATTERNS.formality.informal.some(word => lowerText.includes(word))) {
      formality = 'informal'
    }

    // Karmaşıklık analizi
    const words = text.split(/\s+/).length
    const sentences = text.split(/[.!?]+/).length
    let complexity: 'simple' | 'medium' | 'complex' = 'simple'
    
    if (words > 20 || sentences > 3) complexity = 'complex'
    else if (words > 10 || sentences > 1) complexity = 'medium'

    return { urgency, emotion, formality, complexity }
  }

  private generateSuggestions(
    _text: string, 
    intent: { primary: string; confidence: number }, 
    entities: any
  ): string[] {
    const suggestions: string[] = []

    // Intent tabanlı öneriler
    switch (intent.primary) {
      case 'CREATE':
        if (entities.persons.length > 0) {
          suggestions.push(`${entities.persons[0].fullName} için kayıt oluştur`)
        }
        if (entities.money.length > 0) {
          suggestions.push(`${entities.money[0].amount} ${entities.money[0].currency} bağış ekle`)
        }
        suggestions.push('Yeni kayıt formu aç', 'Gerekli alanları doldur')
        break

      case 'READ':
        suggestions.push('Tümünü listele', 'Filtreleme uygula', 'Arama yap')
        break

      case 'UPDATE':
        suggestions.push('Kaydı bul ve düzenle', 'Değişiklikleri kaydet')
        break

      case 'REPORT':
        suggestions.push('Aylık rapor al', 'Excel olarak dışa aktar', 'Grafik göster')
        break

      case 'HELP':
        suggestions.push(
          'Mevcut komutları listele',
          'Örnek komutları göster',
          'Modül yardımını aç'
        )
        break
    }

    // Entity tabanlı öneriler
    if (entities.phones.length > 0) {
      suggestions.push('SMS gönder', 'Telefon numarasını kaydet')
    }
    if (entities.emails.length > 0) {
      suggestions.push('Email gönder', 'Email adresini kaydet')
    }

    return suggestions.slice(0, 5) // Maksimum 5 öneri
  }

  private calculateConfidence(
    text: string, 
    intent: { primary: string; confidence: number }, 
    entities: any
  ): number {
    let confidence = intent.confidence

    // Entity varlığı güveni artırır
    const entityCount = Object.values(entities).reduce((sum: number, arr: any) => 
      sum + (Array.isArray(arr) ? arr.length : 0), 0
    )
    confidence += entityCount * 0.1

    // Text uzunluğu ve açıklığı
    const words = text.split(/\s+/).length
    if (words >= 3 && words <= 15) confidence += 0.1
    if (words > 15) confidence -= 0.1

    // Özel karakterler ve noktalama
    if (/[.!?]/.test(text)) confidence += 0.05

    return Math.min(confidence, 1)
  }

  // Komut önerisi oluşturma
  generateCommandSuggestions(partialText: string): string[] {
    const suggestions: string[] = []
    const lowerText = partialText.toLowerCase()

    // Modül bazlı öneriler
    const moduleCommands = {
      'hak sahibi': [
        'Hak sahibi listele',
        'Yeni hak sahibi ekle',
        'Hak sahibi ara: [isim]',
        'Hak sahibi raporu al'
      ],
      'bağış': [
        'Bağış listele',
        'Yeni bağış ekle: [miktar] TL',
        'Bağış raporu al',
        'Aylık bağış özeti'
      ],
      'toplantı': [
        'Toplantı listele',
        'Yeni toplantı oluştur',
        'Bugünün toplantıları',
        'Toplantı ajandası'
      ],
      'görev': [
        'Görev listele',
        'Yeni görev oluştur',
        'Benim görevlerim',
        'Geciken görevler'
      ]
    }

    // Kısmi eşleşmeler
    Object.entries(moduleCommands).forEach(([module, commands]) => {
      if (lowerText.includes(module) || module.includes(lowerText)) {
        suggestions.push(...commands)
      }
    })

    // Genel komutlar
    if (lowerText.includes('rapor') || lowerText.includes('analiz')) {
      suggestions.push(
        'Bu ay raporu al',
        'Yıllık analiz raporu',
        'Performans raporu'
      )
    }

    if (lowerText.includes('durum') || lowerText.includes('özet')) {
      suggestions.push(
        'Sistem durumu göster',
        'Günlük özet',
        'Genel durum raporu'
      )
    }

    return suggestions.slice(0, 8)
  }
}

export const enhancedNlpProcessor = EnhancedNLPProcessor.getInstance()
