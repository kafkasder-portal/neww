import DOMPurify from 'dompurify'
import { sanitizeInput, SANITIZATION_CONFIGS } from './sanitization'

/**
 * HTML içeriğini güvenli şekilde render etmek için utility fonksiyonları
 */

/**
 * HTML string'ini sanitize ederek güvenli hale getirir
 * @param html - Sanitize edilecek HTML string
 * @param allowLinks - Link'lere izin verilip verilmeyeceği
 * @returns Sanitize edilmiş HTML string
 */
export function sanitizeHtml(html: string, allowLinks: boolean = false): string {
  const config = allowLinks ? SANITIZATION_CONFIGS.HTML_WITH_LINKS : SANITIZATION_CONFIGS.RICH_TEXT
  return sanitizeInput(html, config)
}

/**
 * HTML içeriğini React component'inde güvenli şekilde render etmek için
 * dangerouslySetInnerHTML prop'u oluşturur
 * @param html - Render edilecek HTML string
 * @param allowLinks - Link'lere izin verilip verilmeyeceği
 * @returns dangerouslySetInnerHTML için uygun obje
 */
export function createSafeHtml(html: string, allowLinks: boolean = false) {
  const sanitizedHtml = sanitizeHtml(html, allowLinks)
  return { __html: sanitizedHtml }
}

/**
 * Metin içeriğini HTML formatında güvenli şekilde render eder
 * Satır sonlarını <br> tag'lerine çevirir
 * @param text - Render edilecek metin
 * @returns Sanitize edilmiş HTML string
 */
export function textToSafeHtml(text: string): string {
  // Önce metni sanitize et
  const sanitizedText = sanitizeInput(text, SANITIZATION_CONFIGS.TEXT_ONLY)
  // Satır sonlarını <br> tag'lerine çevir
  const htmlWithBreaks = sanitizedText.replace(/\n/g, '<br>')
  // Tekrar sanitize et (br tag'leri korunacak)
  return DOMPurify.sanitize(htmlWithBreaks, {
    ALLOWED_TAGS: ['br'],
    ALLOWED_ATTR: []
  }) as string
}

/**
 * URL'leri güvenli link'lere çeviren utility
 * @param text - URL içeren metin
 * @returns Güvenli link'ler içeren HTML
 */
export function urlsToSafeLinks(text: string): string {
  // Önce metni sanitize et
  const sanitizedText = sanitizeInput(text, SANITIZATION_CONFIGS.TEXT_ONLY)
  
  // URL regex pattern
  const urlRegex = /(https?:\/\/[^\s]+)/g
  
  // URL'leri link'lere çevir
  const textWithLinks = sanitizedText.replace(urlRegex, (url) => {
    // URL'yi sanitize et
    const sanitizedUrl = sanitizeInput(url, SANITIZATION_CONFIGS.TEXT_ONLY)
    return `<a href="${sanitizedUrl}" target="_blank" rel="noopener noreferrer">${sanitizedUrl}</a>`
  })
  
  // Final sanitization with links allowed
  return sanitizeInput(textWithLinks, SANITIZATION_CONFIGS.HTML_WITH_LINKS) as string
}

/**
 * Email içeriğini güvenli şekilde render eder
 * @param content - Email içeriği
 * @param allowImages - Resim tag'lerine izin verilip verilmeyeceği
 * @returns Sanitize edilmiş email içeriği
 */
export function sanitizeEmailContent(content: string, allowImages: boolean = false): string {
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'];
  const allowedAttr = ['href', 'target', 'rel', 'style'];

  if (allowImages) {
    allowedTags.push('img');
    allowedAttr.push('src', 'alt', 'width', 'height');
  }

  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttr,
    ALLOW_DATA_ATTR: false
  }) as string
}

/**
 * Kullanıcı yorumlarını güvenli şekilde render eder
 * @param comment - Kullanıcı yorumu
 * @returns Sanitize edilmiş yorum
 */
export function sanitizeUserComment(comment: string): string {
  // Sadece temel formatlamaya izin ver
  const config = {
    ALLOWED_TAGS: ['br', 'strong', 'b', 'em', 'i'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false
  }
  
  // Satır sonlarını br tag'lerine çevir
  const commentWithBreaks = comment.replace(/\n/g, '<br>')
  
  return DOMPurify.sanitize(commentWithBreaks, config) as string
}

/**
 * Markdown benzeri basit formatlamayı HTML'e çevirir ve sanitize eder
 * @param text - Markdown benzeri metin
 * @returns Sanitize edilmiş HTML
 */
export function simpleMarkdownToSafeHtml(text: string): string {
  // Önce metni sanitize et
  let sanitizedText = sanitizeInput(text, SANITIZATION_CONFIGS.TEXT_ONLY)
  
  // Basit markdown formatlaması
  sanitizedText = sanitizedText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
    .replace(/\n/g, '<br>') // line breaks
  
  // Final sanitization
  return DOMPurify.sanitize(sanitizedText, {
    ALLOWED_TAGS: ['strong', 'em', 'br'],
    ALLOWED_ATTR: []
  }) as string
}