/**
 * Kumbara için benzersiz QR kod oluşturur
 * @param bankData Kumbara bilgileri
 * @returns QR kod string'i
 */
export const generateQRCode = (bankData: {
  bankNumber: string
  assignedTo: string
  location: string
  contactPerson: string
  contactPhone: string
}): string => {
  try {
    const qrData = JSON.stringify({
      type: 'piggy_bank',
      ...bankData,
      timestamp: new Date().toISOString()
    })
    
    // QR kod string'i olarak döndür (gerçek QR kod oluşturma modal'da yapılacak)
    return qrData
  } catch (error) {
    console.error('QR kod oluşturma hatası:', error)
    return `QB${Date.now().toString().slice(-6)}QR`
  }
}

/**
 * QR kod verisini parse eder
 * @param qrData QR kod verisi
 * @returns Parse edilmiş veri
 */
export const parseQRCode = (qrData: string) => {
  try {
    const parsed = JSON.parse(qrData)
    if (parsed.type === 'piggy_bank') {
      return {
        isValid: true,
        bankNumber: parsed.bankNumber,
        bankId: parsed.bankId,
        timestamp: parsed.timestamp
      }
    }
    return { isValid: false }
  } catch {
    return { isValid: false }
  }
}

/**
 * Benzersiz kumbara numarası oluşturur
 * @param existingBanks Mevcut kumbara listesi
 * @returns Yeni benzersiz numara
 */
export const generateUniqueBankNumber = (existingBanks: { bankNumber: string }[]): string => {
  const year = new Date().getFullYear()
  let counter = 1
  
  const existingNumbers = existingBanks.map(bank => bank.bankNumber)
  
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const newNumber = `KB-${year}-${counter.toString().padStart(3, '0')}`
    if (!existingNumbers.includes(newNumber)) {
      return newNumber
    }
    counter++
  }
}

/**
 * QR kod yazdırma için HTML oluşturur
 * @param qrCodeDataURL QR kod data URL'i
 * @param bankNumber Kumbara numarası
 * @returns Yazdırma HTML'i
 */
export const generatePrintableQR = (qrCodeDataURL: string, bankNumber: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kumbara QR Kod - ${bankNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        }
        .qr-container {
          border: 2px solid #000;
          padding: 20px;
          margin: 20px auto;
          width: 300px;
        }
        .qr-code {
          margin: 10px 0;
        }
        .bank-number {
          font-size: 18px;
          font-weight: bold;
          margin: 10px 0;
        }
        .instructions {
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="qr-container">
        <h2>Kumbara QR Kod</h2>
        <div class="bank-number">${bankNumber}</div>
        <div class="qr-code">
          <img src="${qrCodeDataURL}" alt="QR Kod" />
        </div>
        <div class="instructions">
          Bu QR kodu tarayarak kumbara bilgilerine ulaşabilirsiniz.
        </div>
      </div>
    </body>
    </html>
  `
}