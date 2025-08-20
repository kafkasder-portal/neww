import { ProcessedCommand } from './commandProcessor'

// Türkçe stop words
const TURKISH_STOP_WORDS = new Set([
  've', 'veya', 'ile', 'için', 'bu', 'şu', 'o', 'bir', 'iki', 'üç', 'dört', 'beş',
  'altı', 'yedi', 'sekiz', 'dokuz', 'on', 'ben', 'sen', 'o', 'biz', 'siz', 'onlar',
  'benim', 'senin', 'onun', 'bizim', 'sizin', 'onların', 'ama', 'fakat', 'lakin',
  'ancak', 'sadece', 'yalnız', 'hem', 'da', 'de', 'den', 'dan', 'gibi', 'kadar',
  'dolayı', 'için', 'üzere', 'göre', 'karşı', 'doğru', 'yanında', 'önünde', 'arkasında',
  'altında', 'üstünde', 'içinde', 'dışında', 'arasında', 'öncesinde', 'sonrasında',
  'sırasında', 'esnasında', 'zamanında', 'vakit', 'saat', 'gün', 'ay', 'yıl',
  'bugün', 'dün', 'yarın', 'şimdi', 'az önce', 'biraz sonra', 'çok', 'az', 'daha',
  'en', 'pek', 'oldukça', 'fazla', 'az', 'küçük', 'büyük', 'uzun', 'kısa', 'geniş',
  'dar', 'yüksek', 'alçak', 'kalın', 'ince', 'ağır', 'hafif', 'sıcak', 'soğuk',
  'sert', 'yumuşak', 'hızlı', 'yavaş', 'erken', 'geç', 'yeni', 'eski', 'temiz',
  'kirli', 'güzel', 'çirkin', 'iyi', 'kötü', 'doğru', 'yanlış', 'kolay', 'zor',
  'basit', 'karmaşık', 'açık', 'kapalı', 'boş', 'dolu', 'tam', 'yarım', 'çeyrek'
])

// Türkçe entity recognition patterns
const ENTITY_PATTERNS = {
  // Para birimleri
  CURRENCY: {
    patterns: [
      /(\d+(?:\.\d+)?)\s*(?:TL|₺|lira|türk\s*lirası)/i,
      /(\d+(?:\.\d+)?)\s*(?:USD|\$|dolar)/i,
      /(\d+(?:\.\d+)?)\s*(?:EUR|€|euro)/i
    ],
    type: 'CURRENCY'
  },
  
  // Tarihler
  DATE: {
    patterns: [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{1,2})-(\d{1,2})-(\d{4})/,
      /(\d{1,2})\s+(?:ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\s+(\d{4})/i,
      /(?:bugün|dün|yarın|bu\s+hafta|geçen\s+hafta|bu\s+ay|geçen\s+ay|bu\s+yıl|geçen\s+yıl)/i
    ],
    type: 'DATE'
  },
  
  // Sayılar
  NUMBER: {
    patterns: [
      /(\d+(?:\.\d+)?)/,
      /(?:bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on|yüz|bin|milyon)/i
    ],
    type: 'NUMBER'
  },
  
  // Modül isimleri
  MODULE: {
    patterns: [
      /(?:yardım|aid|beneficiary|ihtiyaç\s+sahibi)/i,
      /(?:bağış|donation|donation)/i,
      /(?:mesaj|message|sms|email)/i,
      /(?:toplantı|meeting|görüşme)/i,
      /(?:görev|task|iş)/i,
      /(?:rapor|report|analiz)/i,
      /(?:kullanıcı|user|personel)/i,
      /(?:sistem|system|ayar)/i
    ],
    type: 'MODULE'
  },
  
  // İşlem türleri
  ACTION: {
    patterns: [
      /(?:ekle|oluştur|kaydet|create|add)/i,
      /(?:listele|göster|bul|ara|list|show|find)/i,
      /(?:güncelle|değiştir|düzenle|update|edit|modify)/i,
      /(?:sil|kaldır|delete|remove)/i,
      /(?:rapor|analiz|report|analyze)/i,
      /(?:gönder|send|mail|sms)/i,
      /(?:onayla|approve|confirm)/i,
      /(?:reddet|reject|deny)/i
    ],
    type: 'ACTION'
  }
}

// Sentiment analysis için basit kelime listeleri
const SENTIMENT_WORDS = {
  positive: [
    'iyi', 'güzel', 'harika', 'mükemmel', 'süper', 'muhteşem', 'olağanüstü',
    'başarılı', 'başarı', 'olumlu', 'pozitif', 'gelişme', 'artış', 'yükseliş',
    'iyileşme', 'düzelme', 'çözüm', 'çözüldü', 'tamamlandı', 'bitirildi'
  ],
  negative: [
    'kötü', 'kötüleşme', 'düşüş', 'azalma', 'sorun', 'problem', 'hata',
    'hatalı', 'başarısız', 'başarısızlık', 'olumsuz', 'negatif', 'kötüleşme',
    'düşüş', 'azalma', 'sorun', 'problem', 'hata', 'hatalı', 'başarısız'
  ],
  neutral: [
    'normal', 'standart', 'ortalama', 'genel', 'genelde', 'genellikle',
    'çoğunlukla', 'bazen', 'ara sıra', 'nadiren', 'hiç', 'asla', 'her zaman'
  ]
}

export interface NLPResult {
  tokens: string[]
  entities: Array<{
    type: string
    value: string
    start: number
    end: number
    confidence: number
  }>
  sentiment: {
    score: number // -1 to 1
    label: 'positive' | 'negative' | 'neutral'
    confidence: number
  }
  intent: {
    primary: string
    confidence: number
    alternatives: Array<{
      intent: string
      confidence: number
    }>
  }
  context: {
    timeReferences: string[]
    locationReferences: string[]
    personReferences: string[]
    urgency: 'low' | 'medium' | 'high'
  }
}

export class NLPProcessor {
  private static instance: NLPProcessor

  static getInstance(): NLPProcessor {
    if (!NLPProcessor.instance) {
      NLPProcessor.instance = new NLPProcessor()
    }
    return NLPProcessor.instance
  }

  // Tokenization
  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0 && !TURKISH_STOP_WORDS.has(token))
  }

  // Entity Recognition
  extractEntities(text: string): Array<{
    type: string
    value: string
    start: number
    end: number
    confidence: number
  }> {
    const entities: Array<{
      type: string
      value: string
      start: number
      end: number
      confidence: number
    }> = []

    Object.entries(ENTITY_PATTERNS).forEach(([, config]) => {
      config.patterns.forEach(pattern => {
        const matches = text.matchAll(new RegExp(pattern, 'gi'))
        for (const match of matches) {
          entities.push({
            type: config.type,
            value: match[0],
            start: match.index!,
            end: match.index! + match[0].length,
            confidence: 0.8
          })
        }
      })
    })

    return entities
  }

  // Sentiment Analysis
  analyzeSentiment(text: string): {
    score: number
    label: 'positive' | 'negative' | 'neutral'
    confidence: number
  } {
    const tokens = this.tokenize(text)
    let positiveCount = 0
    let negativeCount = 0
    let neutralCount = 0

    tokens.forEach(token => {
      if (SENTIMENT_WORDS.positive.includes(token)) {
        positiveCount++
      } else if (SENTIMENT_WORDS.negative.includes(token)) {
        negativeCount++
      } else if (SENTIMENT_WORDS.neutral.includes(token)) {
        neutralCount++
      }
    })

    const total = positiveCount + negativeCount + neutralCount
    if (total === 0) {
      return { score: 0, label: 'neutral', confidence: 0.5 }
    }

    const score = (positiveCount - negativeCount) / total
    let label: 'positive' | 'negative' | 'neutral'
    let confidence: number

    if (score > 0.1) {
      label = 'positive'
      confidence = Math.abs(score)
    } else if (score < -0.1) {
      label = 'negative'
      confidence = Math.abs(score)
    } else {
      label = 'neutral'
      confidence = 0.5
    }

    return { score, label, confidence }
  }

  // Intent Recognition
  recognizeIntent(text: string): {
    primary: string
    confidence: number
    alternatives: Array<{
      intent: string
      confidence: number
    }>
  } {
    const tokens = this.tokenize(text)
    const intents = new Map<string, number>()

    // Basit keyword-based intent recognition
    if (tokens.some(t => ['ekle', 'oluştur', 'kaydet', 'create', 'add'].includes(t))) {
      intents.set('CREATE', 0.9)
    }
    if (tokens.some(t => ['listele', 'göster', 'bul', 'ara', 'list', 'show', 'find'].includes(t))) {
      intents.set('LIST', 0.85)
    }
    if (tokens.some(t => ['güncelle', 'değiştir', 'düzenle', 'update', 'edit'].includes(t))) {
      intents.set('UPDATE', 0.9)
    }
    if (tokens.some(t => ['sil', 'kaldır', 'delete', 'remove'].includes(t))) {
      intents.set('DELETE', 0.95)
    }
    if (tokens.some(t => ['rapor', 'analiz', 'report', 'analyze'].includes(t))) {
      intents.set('REPORT', 0.8)
    }

    if (intents.size === 0) {
      return {
        primary: 'UNKNOWN',
        confidence: 0.1,
        alternatives: []
      }
    }

    const sortedIntents = Array.from(intents.entries())
      .sort((a, b) => b[1] - a[1])

    return {
      primary: sortedIntents[0][0],
      confidence: sortedIntents[0][1],
      alternatives: sortedIntents.slice(1).map(([intent, confidence]) => ({
        intent,
        confidence
      }))
    }
  }

  // Context Extraction
  extractContext(text: string): {
    timeReferences: string[]
    locationReferences: string[]
    personReferences: string[]
    urgency: 'low' | 'medium' | 'high'
  } {
    const timeRefs: string[] = []
    const locationRefs: string[] = []
    const personRefs: string[] = []
    let urgency: 'low' | 'medium' | 'high' = 'low'

    // Time references
    const timePatterns = [
      /(?:bugün|dün|yarın|bu\s+hafta|geçen\s+hafta|bu\s+ay|geçen\s+ay)/gi,
      /(\d{1,2}):(\d{2})/g,
      /(?:saat|vakit)/gi
    ]

    timePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        timeRefs.push(...matches)
      }
    })

    // Urgency detection
    const urgentWords = ['acil', 'hemen', 'şimdi', 'derhal', 'mümkün olduğunca çabuk']
    const mediumUrgentWords = ['yakında', 'kısa sürede', 'en kısa sürede']
    
    if (urgentWords.some(word => new RegExp(word, 'i').test(text))) {
      urgency = 'high'
    } else if (mediumUrgentWords.some(word => new RegExp(word, 'i').test(text))) {
      urgency = 'medium'
    }

    return {
      timeReferences: timeRefs,
      locationReferences: locationRefs,
      personReferences: personRefs,
      urgency
    }
  }

  // Main NLP processing method
  process(text: string): NLPResult {
    const tokens = this.tokenize(text)
    const entities = this.extractEntities(text)
    const sentiment = this.analyzeSentiment(text)
    const intent = this.recognizeIntent(text)
    const context = this.extractContext(text)

    return {
      tokens,
      entities,
      sentiment,
      intent,
      context
    }
  }

  // Enhanced command processing with NLP
  enhanceCommand(command: ProcessedCommand, nlpResult: NLPResult): ProcessedCommand {
    return {
      ...command,
      confidence: Math.min(command.confidence * nlpResult.intent.confidence, 1),
      metadata: {
        ...command.metadata,
        nlp: {
          sentiment: nlpResult.sentiment,
          entities: nlpResult.entities,
          context: nlpResult.context
        }
      }
    }
  }
}

export const nlpProcessor = NLPProcessor.getInstance()
