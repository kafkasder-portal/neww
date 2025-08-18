// React import not needed in modern React

function DebugApp() {
  console.log('DebugApp component rendered')
  
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#28a745' }}>✓ React App Çalışıyor!</h1>
        <p>Bu basit React component&apos;i başarıyla render edildi.</p>
        
        <h2>Test Sonuçları:</h2>
        <ul>
          <li style={{ color: '#28a745' }}>✓ React render sistemi çalışıyor</li>
          <li style={{ color: '#28a745' }}>✓ TypeScript derleniyor</li>
          <li style={{ color: '#28a745' }}>✓ Vite dev server çalışıyor</li>
        </ul>
        
        <h2>Sonraki Adımlar:</h2>
        <ol>
          <li>Ana App component&apos;ini adım adım test et</li>
          <li>Supabase bağlantısını kontrol et</li>
          <li>Auth store&apos;u test et</li>
          <li>Router&apos;ı test et</li>
        </ol>
        
        <p style={{ 
          backgroundColor: '#e7f3ff', 
          padding: '10px', 
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <strong>Not:</strong> Bu debug component&apos;i çalışıyorsa, sorun ana App component&apos;inde.
        </p>
      </div>
    </div>
  )
}

export default DebugApp