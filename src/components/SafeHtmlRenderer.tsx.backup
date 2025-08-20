// import React from 'react'
import { useSafeHtml, useSafeTextAsHtml, useSafeLinksFromText, useSafeEmailContent, useSafeUserComment, useSafeMarkdown } from '../hooks/useSafeHtml'

/**
 * Güvenli HTML render component'leri
 */

interface SafeHtmlProps {
  html: string
  allowLinks?: boolean
  className?: string
}

/**
 * HTML içeriğini güvenli şekilde render eden component
 */
export function SafeHtml({ html, allowLinks = false, className }: SafeHtmlProps) {
  const safeHtml = useSafeHtml(html, allowLinks)
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={safeHtml}
    />
  )
}

interface SafeTextProps {
  text: string
  className?: string
}

/**
 * Metin içeriğini HTML formatında güvenli şekilde render eden component
 * Satır sonlarını <br> tag'lerine çevirir
 */
export function SafeText({ text, className }: SafeTextProps) {
  const safeHtml = useSafeTextAsHtml(text)
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={safeHtml}
    />
  )
}

/**
 * URL'leri güvenli link'lere çeviren component
 */
export function SafeTextWithLinks({ text, className }: SafeTextProps) {
  const safeHtml = useSafeLinksFromText(text)
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={safeHtml}
    />
  )
}

interface SafeEmailContentProps {
  content: string
  allowImages?: boolean
  className?: string
}

/**
 * Email içeriğini güvenli şekilde render eden component
 */
export function SafeEmailContent({ content, allowImages = false, className }: SafeEmailContentProps) {
  const safeHtml = useSafeEmailContent(content, allowImages)
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={safeHtml}
    />
  )
}

/**
 * Kullanıcı yorumlarını güvenli şekilde render eden component
 */
export function SafeUserComment({ text, className }: SafeTextProps) {
  const safeHtml = useSafeUserComment(text)
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={safeHtml}
    />
  )
}

/**
 * Basit markdown formatlamasını güvenli HTML'e çeviren component
 */
export function SafeMarkdown({ text, className }: SafeTextProps) {
  const safeHtml = useSafeMarkdown(text)
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={safeHtml}
    />
  )
}

/**
 * Çoklu kullanım senaryoları için genel güvenli HTML component'i
 */
interface SafeContentProps {
  content: string
  type: 'html' | 'text' | 'textWithLinks' | 'email' | 'comment' | 'markdown'
  allowLinks?: boolean
  allowImages?: boolean
  className?: string
}

export function SafeContent({ 
  content, 
  type, 
  allowLinks = false, 
  allowImages = false, 
  className 
}: SafeContentProps) {
  switch (type) {
    case 'html':
      return <SafeHtml html={content} allowLinks={allowLinks} className={className} />
    case 'text':
      return <SafeText text={content} className={className} />
    case 'textWithLinks':
      return <SafeTextWithLinks text={content} className={className} />
    case 'email':
      return <SafeEmailContent content={content} allowImages={allowImages} className={className} />
    case 'comment':
      return <SafeUserComment text={content} className={className} />
    case 'markdown':
      return <SafeMarkdown text={content} className={className} />
    default:
      return <SafeText text={content} className={className} />
  }
}

/**
 * Kullanım örnekleri için demo component
 */
export function SafeHtmlDemo() {
  const sampleHtml = '<p>Bu bir <strong>HTML</strong> içeriğidir. <script>alert("XSS")</script></p>'
  const sampleText = 'Bu bir metin içeriğidir.\nYeni satır var.'
  const sampleTextWithUrl = 'Bu metinde bir URL var: https://example.com'
  const sampleEmail = '<h2>Email Başlığı</h2><p>Bu bir email içeriğidir.</p><img src="malicious.jpg" onerror="alert(1)">'
  const sampleComment = 'Bu bir kullanıcı yorumudur.\n**Kalın** ve *italik* metin.'
  const sampleMarkdown = 'Bu **kalın** ve *italik* metin içerir.\nYeni satır da var.'
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Güvenli HTML Render Örnekleri</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">HTML İçeriği (XSS korumalı):</h3>
          <div className="border p-3 bg-gray-50">
            <SafeHtml html={sampleHtml} allowLinks={true} />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Metin İçeriği (satır sonları ile):</h3>
          <div className="border p-3 bg-gray-50">
            <SafeText text={sampleText} />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">URL&apos;li Metin (otomatik linkler):</h3>
          <div className="border p-3 bg-gray-50">
            <SafeTextWithLinks text={sampleTextWithUrl} />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Email İçeriği (güvenli):</h3>
          <div className="border p-3 bg-gray-50">
            <SafeEmailContent content={sampleEmail} allowImages={false} />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Kullanıcı Yorumu:</h3>
          <div className="border p-3 bg-gray-50">
            <SafeUserComment text={sampleComment} />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Basit Markdown:</h3>
          <div className="border p-3 bg-gray-50">
            <SafeMarkdown text={sampleMarkdown} />
          </div>
        </div>
      </div>
    </div>
  )
}