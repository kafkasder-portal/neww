import { useMemo } from 'react'
import {
  createSafeHtml,
  textToSafeHtml,
  urlsToSafeLinks,
  sanitizeEmailContent,
  sanitizeUserComment,
  simpleMarkdownToSafeHtml
} from '../utils/htmlRenderer'

/**
 * HTML içeriğini güvenli şekilde render etmek için React hook'ları
 */

/**
 * HTML string'ini güvenli şekilde render etmek için hook
 * @param html - Render edilecek HTML string
 * @param allowLinks - Link'lere izin verilip verilmeyeceği
 * @returns dangerouslySetInnerHTML için uygun obje
 */
export function useSafeHtml(html: string, allowLinks: boolean = false) {
  return useMemo(() => {
    if (!html) return { __html: '' }
    return createSafeHtml(html, allowLinks)
  }, [html, allowLinks])
}

/**
 * Metin içeriğini HTML formatında güvenli şekilde render etmek için hook
 * @param text - Render edilecek metin
 * @returns dangerouslySetInnerHTML için uygun obje
 */
export function useSafeTextAsHtml(text: string) {
  return useMemo(() => {
    if (!text) return { __html: '' }
    return { __html: textToSafeHtml(text) }
  }, [text])
}

/**
 * URL'leri güvenli link'lere çeviren hook
 * @param text - URL içeren metin
 * @returns dangerouslySetInnerHTML için uygun obje
 */
export function useSafeLinksFromText(text: string) {
  return useMemo(() => {
    if (!text) return { __html: '' }
    return { __html: urlsToSafeLinks(text) }
  }, [text])
}

/**
 * Email içeriğini güvenli şekilde render etmek için hook
 * @param content - Email içeriği
 * @param allowImages - Resim tag'lerine izin verilip verilmeyeceği
 * @returns dangerouslySetInnerHTML için uygun obje
 */
export function useSafeEmailContent(content: string, allowImages: boolean = false) {
  return useMemo(() => {
    if (!content) return { __html: '' }
    return { __html: sanitizeEmailContent(content, allowImages) }
  }, [content, allowImages])
}

/**
 * Kullanıcı yorumlarını güvenli şekilde render etmek için hook
 * @param comment - Kullanıcı yorumu
 * @returns dangerouslySetInnerHTML için uygun obje
 */
export function useSafeUserComment(comment: string) {
  return useMemo(() => {
    if (!comment) return { __html: '' }
    return { __html: sanitizeUserComment(comment) }
  }, [comment])
}

/**
 * Basit markdown formatlamasını güvenli HTML'e çeviren hook
 * @param text - Markdown benzeri metin
 * @returns dangerouslySetInnerHTML için uygun obje
 */
export function useSafeMarkdown(text: string) {
  return useMemo(() => {
    if (!text) return { __html: '' }
    return { __html: simpleMarkdownToSafeHtml(text) }
  }, [text])
}

/**
 * Çoklu kullanım senaryoları için genel güvenli HTML hook'u
 */
export function useMultiSafeHtml() {
  return {
    /**
     * HTML string'ini güvenli şekilde render eder
     */
    renderHtml: (html: string, allowLinks: boolean = false) => {
      if (!html) return { __html: '' }
      return createSafeHtml(html, allowLinks)
    },
    
    /**
     * Metni HTML formatında güvenli şekilde render eder
     */
    renderText: (text: string) => {
      if (!text) return { __html: '' }
      return { __html: textToSafeHtml(text) }
    },
    
    /**
     * URL'leri güvenli link'lere çevirir
     */
    renderWithLinks: (text: string) => {
      if (!text) return { __html: '' }
      return { __html: urlsToSafeLinks(text) }
    },
    
    /**
     * Email içeriğini güvenli şekilde render eder
     */
    renderEmail: (content: string, allowImages: boolean = false) => {
      if (!content) return { __html: '' }
      return { __html: sanitizeEmailContent(content, allowImages) }
    },
    
    /**
     * Kullanıcı yorumunu güvenli şekilde render eder
     */
    renderComment: (comment: string) => {
      if (!comment) return { __html: '' }
      return { __html: sanitizeUserComment(comment) }
    },
    
    /**
     * Basit markdown'ı güvenli HTML'e çevirir
     */
    renderMarkdown: (text: string) => {
      if (!text) return { __html: '' }
      return { __html: simpleMarkdownToSafeHtml(text) }
    }
  }
}