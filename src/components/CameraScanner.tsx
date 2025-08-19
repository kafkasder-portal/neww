import { useState, useRef, useEffect, useCallback } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import { createWorker } from 'tesseract.js'
import * as Tesseract from 'tesseract.js'
import { Camera, Scan, FileText } from 'lucide-react'

interface CameraScannerProps {
  onScanResult: (data: Record<string, unknown>) => void
  onError?: (error: string) => void
  mode?: 'qr' | 'ocr' // Tarama modu: QR/barkod veya OCR
}

interface ScanResult {
  type: 'qr' | 'barcode' | 'ocr' | 'unknown'
  data: string
  parsedData?: {
    donorId?: string
    transactionRef?: string
    amount?: string
    currency?: string
    donorName?: string
    phone?: string
    email?: string
    purpose?: string
    // OCR için ek alanlar
    firstName?: string
    lastName?: string
    idNumber?: string
    birthDate?: string
    address?: string
    nationality?: string
    passportNumber?: string
    issueDate?: string
    expiryDate?: string
  }
}

const CameraScanner: React.FC<CameraScannerProps> = ({
  onScanResult,
  onError,
  mode = 'qr'
}) => {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [ocrProgress, setOcrProgress] = useState<number>(0)
  const [currentMode, setCurrentMode] = useState<'qr' | 'ocr'>(mode)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const codeReader = useRef<BrowserMultiFormatReader | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const workerRef = useRef<Tesseract.Worker | null>(null)

  // Kamera izni kontrolü
  const checkCameraPermission = useCallback(async () => {
    console.log('Kamera izni kontrol ediliyor...')
    try {
      // Navigator.mediaDevices varlığını kontrol et
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('MediaDevices API desteklenmiyor')
        setHasPermission(false)
        setError('Tarayıcınız kamera erişimini desteklemiyor')
        onError?.('Tarayıcınız kamera erişimini desteklemiyor')
        return
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      console.log('Kamera izni alındı')
      setHasPermission(true)
      stream.getTracks().forEach(track => {
        console.log('Kamera track kapatılıyor:', track.label)
        track.stop()
      })
    } catch (err) {
      console.error('Kamera izni hatası:', err)
      setHasPermission(false)
      const errorMessage = err instanceof Error ? err.message : 'Kamera erişim izni gerekli'
      setError(`Kamera erişim hatası: ${errorMessage}`)
      onError?.(`Kamera erişim hatası: ${errorMessage}`)
    }
  }, [onError])

  // OCR ile kimlik/pasaport verilerini parse etme
  const parseOCRData = (text: string): ScanResult => {
    console.log('OCR parse başlatılıyor, metin uzunluğu:', text.length)
    console.log('Ham OCR metni:', text)
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const parsedData: Record<string, string> = {}
    
    console.log('Temizlenmiş satırlar:', lines)
    
    if (lines.length === 0) {
      console.log('Hiç geçerli satır bulunamadı')
      return {
        type: 'ocr',
        data: text,
        parsedData
      }
    }

    // Türk kimlik kartı için gelişmiş pattern'ler
    const tcPattern = /\b\d{11}\b/g
    const namePattern = /^[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+\s+[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+/
    const birthDatePattern = /(\d{1,2})[./-](\d{1,2})[./-](\d{4})/g
    const addressPattern = /(ADRES|ADRESİ|ADDRESS)\s*:?\s*(.+)/i
    
    // Telefon numarası pattern'i
    const phonePattern = /(\+90|0)?\s*[5][0-9]{2}\s*[0-9]{3}\s*[0-9]{2}\s*[0-9]{2}/g
    
    console.log('Pattern matching başlatılıyor...')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      console.log(`Satır ${i}: "${line}"`)
      
      // TC Kimlik No
      const tcMatches = [...line.matchAll(tcPattern)]
      if (tcMatches.length > 0 && !parsedData.idNumber) {
        parsedData.idNumber = tcMatches[0][0]
        parsedData.donorId = `TC${tcMatches[0][0]}`
        console.log('TC Kimlik No bulundu:', parsedData.idNumber)
      }
      
      // İsim soyisim - daha esnek yaklaşım
      if (!parsedData.firstName && !parsedData.lastName) {
        // Büyük harflerle yazılmış isim satırları
        const upperCaseNamePattern = /^[A-ZÇĞIİÖŞÜ\s]{3,}$/
        if (line.match(upperCaseNamePattern) && line.split(' ').length >= 2) {
          const names = line.split(' ').filter(n => n.length > 1)
          if (names.length >= 2) {
            parsedData.firstName = names[0]
            parsedData.lastName = names.slice(1).join(' ')
            parsedData.donorName = line
            console.log('İsim bulundu:', parsedData.firstName, parsedData.lastName)
          }
        }
        
        // Normal case isim pattern'i
        const nameMatch = line.match(namePattern)
        if (nameMatch) {
          const names = nameMatch[0].split(' ')
          parsedData.firstName = names[0]
          if (names.length > 1) {
            parsedData.lastName = names.slice(1).join(' ')
          }
          parsedData.donorName = nameMatch[0]
          console.log('İsim (normal case) bulundu:', parsedData.firstName, parsedData.lastName)
        }
      }
      
      // Doğum tarihi
      const birthMatches = [...line.matchAll(birthDatePattern)]
      if (birthMatches.length > 0 && !parsedData.birthDate) {
        const match = birthMatches[0]
        const day = match[1].padStart(2, '0')
        const month = match[2].padStart(2, '0')
        const year = match[3]
        parsedData.birthDate = `${year}-${month}-${day}`
        console.log('Doğum tarihi bulundu:', parsedData.birthDate)
      }
      
      // Adres
      const addressMatch = line.match(addressPattern)
      if (addressMatch && !parsedData.address) {
        parsedData.address = addressMatch[2].trim()
        console.log('Adres bulundu:', parsedData.address)
      }
      
      // Telefon numarası
      const phoneMatches = [...line.matchAll(phonePattern)]
      if (phoneMatches.length > 0 && !parsedData.phone) {
        parsedData.phone = phoneMatches[0][0].replace(/\s/g, '')
        console.log('Telefon bulundu:', parsedData.phone)
      }
      
      // Adres bilgisi (uzun satırlar) - fallback
      if (line.length > 20 && line.match(/[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+.*[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+/)) {
        if (!parsedData.address) {
          parsedData.address = line
          console.log('Adres (fallback) bulundu:', parsedData.address)
        }
      }
    }

    // Pasaport formatı kontrol
    const mrzPattern = /P<[A-Z]{3}[A-Z<]+<+[A-Z0-9<]+/
    
    console.log('Pasaport pattern kontrolü...')
    for (const line of lines) {
      // MRZ kodu
      if (line.match(mrzPattern)) {
        console.log('MRZ kodu bulundu:', line)
        const parts = line.split('<')
        if (parts.length > 1) {
          const namePart = parts[1].replace(/</g, ' ').trim()
          if (namePart && !parsedData.firstName) {
            const names = namePart.split(' ').filter(n => n.length > 0)
            if (names.length > 0) {
              parsedData.firstName = names[0]
              if (names.length > 1) {
                parsedData.lastName = names.slice(1).join(' ')
              }
              parsedData.donorName = `${parsedData.firstName} ${parsedData.lastName || ''}`.trim()
              console.log('MRZ\'den isim çıkarıldı:', parsedData.firstName, parsedData.lastName)
            }
          }
        }
      }
      
      // Pasaport numarası (örn: U12345678)
      const passportMatch = line.match(/\b([A-Z]\d{8})\b/)
      if (passportMatch) {
        parsedData.passportNumber = passportMatch[1]
        parsedData.donorId = `PASS${passportMatch[1]}`
        console.log('Pasaport numarası bulundu:', parsedData.passportNumber)
      }
      
      // Veriliş/Son geçerlilik tarihi
      const dateMatch = line.match(/\b(\d{2}[./]\d{2}[./]\d{4})\b/g)
      if (dateMatch && dateMatch.length >= 2) {
        parsedData.issueDate = dateMatch[0]
        parsedData.expiryDate = dateMatch[1]
        console.log('Tarihler bulundu:', parsedData.issueDate, parsedData.expiryDate)
      }
      
      // Ülke/Uyruk
      if (line.match(/TUR|TURKEY|TÜRKİYE/i)) {
        parsedData.nationality = 'Türkiye'
        console.log('Uyruk bulundu:', parsedData.nationality)
      }
    }
    
    console.log('OCR parse sonucu:', parsedData)
    console.log('Bulunan alan sayısı:', Object.keys(parsedData).length)

    return {
      type: 'ocr',
      data: text,
      parsedData
    }
  }

  // QR kod/barkod verilerini parse etme
  const parseScannedData = (rawData: string): ScanResult => {
    try {
      // JSON formatında QR kod kontrolü
      const jsonData = JSON.parse(rawData)
      return {
        type: 'qr',
        data: rawData,
        parsedData: {
          donorId: jsonData.donorId,
          transactionRef: jsonData.transactionRef || jsonData.ref,
          amount: jsonData.amount,
          currency: jsonData.currency || 'TRY',
          donorName: jsonData.donorName || jsonData.name,
          phone: jsonData.phone,
          email: jsonData.email,
          purpose: jsonData.purpose
        }
      }
    } catch {
      // JSON değilse, farklı formatları kontrol et
      
      // Banka referans numarası formatı (örn: REF123456789)
      if (rawData.match(/^REF\d+$/)) {
        return {
          type: 'barcode',
          data: rawData,
          parsedData: {
            transactionRef: rawData
          }
        }
      }
      
      // Bağışçı ID formatı (örn: DONOR123456)
      if (rawData.match(/^DONOR\d+$/)) {
        return {
          type: 'barcode',
          data: rawData,
          parsedData: {
            donorId: rawData
          }
        }
      }
      
      // Telefon numarası formatı
      if (rawData.match(/^\+?[0-9]{10,15}$/)) {
        return {
          type: 'barcode',
          data: rawData,
          parsedData: {
            phone: rawData
          }
        }
      }
      
      // E-posta formatı
      if (rawData.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return {
          type: 'barcode',
          data: rawData,
          parsedData: {
            email: rawData
          }
        }
      }
      
      // Tutar formatı (örn: 1000TRY, 500USD)
      const amountMatch = rawData.match(/^(\d+(?:\.\d{2})?)([A-Z]{3})$/)
      if (amountMatch) {
        return {
          type: 'barcode',
          data: rawData,
          parsedData: {
            amount: amountMatch[1],
            currency: amountMatch[2]
          }
        }
      }
      
      // Varsayılan olarak ham veri döndür
      return {
        type: 'unknown',
        data: rawData
      }
    }
  }

  // OCR tarama fonksiyonu
  const performOCR = async () => {
    console.log('OCR işlemi başlatılıyor...')
    
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video veya canvas referansı bulunamadı')
      setError('Kamera hazır değil')
      return
    }

    try {
      setOcrProgress(0)
      setError(null)
      
      // Video'dan canvas'a görüntü çek
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Canvas context alınamadı')
        setError('Canvas hatası')
        return
      }

      // Video boyutlarını kontrol et
      if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        console.error('Video boyutları geçersiz')
        setError('Video henüz yüklenmedi')
        return
      }

      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      ctx.drawImage(videoRef.current, 0, 0)
      
      console.log(`Canvas boyutu: ${canvas.width}x${canvas.height}`)

      // Tesseract worker oluştur ve başlat
      let worker = workerRef.current
      
      if (!worker) {
        console.log('Yeni Tesseract worker oluşturuluyor...')
        try {
          worker = await createWorker()
          workerRef.current = worker
          console.log('Tesseract worker oluşturuldu')
        } catch (workerError) {
          console.error('Worker oluşturma hatası:', workerError)
          setError('OCR motoru başlatılamadı')
          onError?.('OCR motoru başlatılamadı')
          return
        }
      }

      console.log('Tesseract worker yükleniyor...')
      
      try {
        await worker.load()
        console.log('Tesseract core yüklendi')
        
        await worker.reinitialize('tur+eng')
        console.log('Tesseract worker başlatıldı')
      } catch (initError) {
        console.error('Worker başlatma hatası:', initError)
        // Worker'ı temizle ve yeniden dene
        if (workerRef.current) {
          try {
            await workerRef.current.terminate()
          } catch (e) {
            console.error('Worker terminate hatası:', e)
          }
          workerRef.current = null
        }
        setError('OCR sistemi başlatılamadı')
        onError?.('OCR sistemi başlatılamadı')
        return
      }

      console.log('OCR tanıma işlemi başlatılıyor...')
      // OCR işlemi
      const { data: { text } } = await worker.recognize(canvas)
      
      console.log('OCR sonucu:', text)
      
      if (text.trim()) {
        const parsedResult = parseOCRData(text)
        console.log('Ayrıştırılmış veri:', parsedResult)
        onScanResult(parsedResult.parsedData || { rawData: parsedResult.data })
        setOcrProgress(100)
        setTimeout(() => setOcrProgress(0), 1000)
      } else {
        console.warn('OCR boş metin döndürdü')
        setError('Metin algılanamadı. Lütfen belgeyi daha net konumlandırın.')
      }
      
    } catch (err) {
      console.error('OCR hatası:', err)
      setError(`OCR işlemi başarısız oldu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`)
      onError?.(`OCR işlemi başarısız oldu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`)
      setOcrProgress(0)
    }
  }

  // Tarama başlatma
  const startScanning = useCallback(async () => {
    console.log('Tarama başlatılıyor, mod:', currentMode)
    
    if (!videoRef.current) {
      console.error('Video referansı bulunamadı')
      setError('Video elementi hazır değil')
      return
    }
    
    if (!hasPermission) {
      console.error('Kamera izni yok')
      setError('Kamera izni gerekli')
      return
    }

    try {
      setIsScanning(true)
      setError(null)
      console.log('Tarama modu:', currentMode)
      
      console.log('Kamera stream isteniyor...')
      const constraints = {
        video: {
          facingMode: 'environment', // Arka kamera tercih et
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      }
      
      console.log('Kamera stream isteniyor, constraints:', constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Kamera stream alındı, tracks:', stream.getTracks().length)
      
      streamRef.current = stream
      videoRef.current.srcObject = stream
      
      // Video yüklenene kadar bekle
      await new Promise((resolve, reject) => {
        const video = videoRef.current!
        const timeout = setTimeout(() => {
          reject(new Error('Video yükleme timeout'))
        }, 10000)
        
        video.onloadedmetadata = () => {
          console.log('Video metadata yüklendi:', {
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration
          })
          clearTimeout(timeout)
          resolve(void 0)
        }
        
        video.onerror = (err) => {
          console.error('Video yükleme hatası:', err)
          clearTimeout(timeout)
          reject(new Error('Video yüklenemedi'))
        }
      })
      
      if (currentMode === 'qr') {
        console.log('QR/Barkod tarama modu başlatılıyor...')
        // QR/Barkod tarama modu
        codeReader.current = new BrowserMultiFormatReader()
        
        // Sürekli tarama
        const scanLoop = async () => {
          if (!codeReader.current || !videoRef.current || !isScanning) return
          
          try {
            const result = await codeReader.current.decodeOnceFromVideoDevice(undefined, videoRef.current)
            if (result) {
              console.log('QR kod okundu:', result.getText())
              const parsedResult = parseScannedData(result.getText())
              console.log('Parse edilmiş QR verisi:', parsedResult)
              onScanResult(parsedResult.parsedData || { rawData: parsedResult.data })
              stopScanning()
            }
          } catch (err) {
            if (!(err instanceof NotFoundException)) {
              console.error('Tarama hatası:', err)
            }
            // Tarama devam etsin
            if (isScanning) {
              setTimeout(scanLoop, 100)
            }
          }
        }
        
        // Taramaya başla
        scanLoop()
      } else {
        console.log('OCR kamera stream hazır')
      }
      // OCR modu için manuel tetikleme kullanılacak
      
    } catch (err) {
      console.error('Kamera başlatma hatası:', err)
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(`Kamera başlatılamadı: ${errorMessage}`)
      onError?.(`Kamera başlatılamadı: ${errorMessage}`)
      setIsScanning(false)
    }
  }, [currentMode, hasPermission, isScanning, onScanResult, onError])

  // Tarama durdurma
  const stopScanning = () => {
    console.log('Tarama durduruluyor...')
    setIsScanning(false)
    setOcrProgress(0)
    
    // Video stream'i durdur
    if (streamRef.current) {
      console.log('Video stream kapatılıyor, track sayısı:', streamRef.current.getTracks().length)
      streamRef.current.getTracks().forEach((track, index) => {
        console.log(`Track ${index} kapatılıyor:`, track.label, track.kind)
        track.stop()
      })
      streamRef.current = null
      console.log('Video stream temizlendi')
    }
    
    // Video element'i temizle
    if (videoRef.current) {
      console.log('Video element temizleniyor')
      videoRef.current.srcObject = null
      // Video event listener'larını temizle
      videoRef.current.onloadedmetadata = null
      videoRef.current.onerror = null
    }
    
    // Code reader'ı temizle
    if (codeReader.current) {
      console.log('Code reader temizleniyor')
      try {
        codeReader.current.reset()
      } catch (err) {
        console.error('Code reader reset hatası:', err)
      } finally {
        codeReader.current = null
      }
    }
    
    console.log('Tarama durduruldu')
  }

  // Bileşen mount/unmount
  useEffect(() => {
    console.log('CameraScanner bileşeni mount edildi')
    checkCameraPermission()
    
    return () => {
      console.log('CameraScanner bileşeni unmount ediliyor')
      stopScanning()
      // OCR worker'ı temizle
      if (workerRef.current) {
        console.log('Tesseract worker temizleniyor')
        try {
          workerRef.current.terminate()
        } catch (err) {
          console.error('Worker terminate hatası:', err)
        } finally {
          workerRef.current = null
        }
      }
    }
  }, [checkCameraPermission])

  // İzin alındığında taramaya başla
  useEffect(() => {
    if (hasPermission && !isScanning) {
      console.log('Kamera izni var, tarama başlatılıyor')
      startScanning()
    }
  }, [hasPermission, isScanning, startScanning])

  return (
    <div className="bg-gray-50 border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {currentMode === 'qr' ? <Scan className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          {currentMode === 'qr' ? 'QR Kod / Barkod Tara' : 'Kimlik / Pasaport OCR'}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              console.log('QR/Barkod modu seçildi')
              setCurrentMode('qr')
            }}
            className={`px-3 py-1 text-sm rounded ${
              currentMode === 'qr'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Scan className="w-4 h-4 inline mr-1" />
            QR/Barkod
          </button>
          <button
            onClick={() => {
              console.log('OCR modu seçildi')
              setCurrentMode('ocr')
            }}
            className={`px-3 py-1 text-sm rounded ${
              currentMode === 'ocr'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-1" />
            Kimlik/Pasaport
          </button>
        </div>
      </div>

        {hasPermission === null && (
          <div className="text-center py-8">
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Kamera izni kontrol ediliyor...</p>
          </div>
        )}

        {hasPermission === false && (
          <div className="text-center py-8">
            <Camera className="w-12 h-12 mx-auto text-red-400 mb-4" />
            <p className="text-red-600 mb-4">Kamera erişim izni gerekli</p>
            <button
              onClick={checkCameraPermission}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {hasPermission === true && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              
              {/* Gizli canvas OCR için */}
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              
              {/* Tarama çerçevesi */}
              <div className="absolute inset-0 flex items-center justify-center">
                {currentMode === 'qr' ? (
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg opacity-75"></div>
                ) : (
                  <div className="w-64 h-40 border-2 border-yellow-400 border-solid rounded-lg opacity-75">
                    <div className="absolute -top-6 left-0 text-yellow-400 text-sm font-medium">
                      Kimlik/Pasaport buraya yerleştirin
                    </div>
                  </div>
                )}
              </div>
              
              {/* Durum göstergesi */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                {currentMode === 'qr' ? (
                  isScanning ? 'Taranıyor...' : 'Hazır'
                ) : (
                  ocrProgress > 0 ? `OCR İşleniyor... %${ocrProgress}` : 'OCR Hazır'
                )}
              </div>
              
              {/* OCR modu için yakalama butonu */}
              {currentMode === 'ocr' && isScanning && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={performOCR}
                    disabled={ocrProgress > 0}
                    className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Fotoğraf Çek ve Oku
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                ❌ {error}
              </div>
            )}

            {isScanning && !error && ocrProgress === 0 && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                ✅ {currentMode === 'qr' ? 'QR/Barkod taranıyor...' : 'Kamera hazır - Fotoğraf çekmek için butona basın'}
              </div>
            )}

            {ocrProgress > 0 && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                🔄 OCR işleniyor... {ocrProgress}%
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${ocrProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p className="mb-2"><strong>Desteklenen formatlar:</strong></p>
              {currentMode === 'qr' ? (
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>QR kodlar (JSON veri içeren)</li>
                  <li>Banka referans numaraları (REF123456)</li>
                  <li>Bağışçı ID&#39;leri (DONOR123456)</li>
                  <li>Telefon numaraları</li>
                  <li>E-posta adresleri</li>
                  <li>Tutar bilgileri (1000TRY)</li>
                </ul>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Türk Kimlik Kartı (TC No, Ad Soyad, Doğum Tarihi)</li>
                  <li>Türk Pasaportu (Pasaport No, Kişisel Bilgiler)</li>
                  <li>Adres bilgileri</li>
                  <li>Telefon numaraları</li>
                  <li>Veriliş ve son geçerlilik tarihleri</li>
                </ul>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log('Tarama durdurma butonu tıklandı')
                  stopScanning()
                }}
                disabled={!isScanning}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
              >
                Durdur
              </button>
              <button
                onClick={() => {
                  console.log('Tarama başlatma butonu tıklandı')
                  startScanning()
                }}
                disabled={isScanning || ocrProgress > 0}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {currentMode === 'qr' ? 'QR Tarama Başlat' : 'Kamera Başlat'}
              </button>
              {currentMode === 'ocr' && isScanning && (
                <button
                  onClick={() => {
                    console.log('OCR fotoğraf çekme butonu tıklandı')
                    performOCR()
                  }}
                  disabled={ocrProgress > 0}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
                >
                  {ocrProgress > 0 ? `OCR %${ocrProgress}` : 'OCR Tara'}
                </button>
              )}
            </div>
          </div>
        )}
    </div>
  )
}

export { CameraScanner }
export default CameraScanner