import React, { useState } from 'react';
import { X, Save, AlertCircle, Check, Upload, Calendar, DollarSign, Tag, FileText, Settings } from 'lucide-react';

interface FundFormData {
  id?: string;
  name: string;
  code: string;
  description: string;
  type: 'Genel' | 'Özel' | 'Proje' | 'Acil Durum';
  currency: string;
  minAmount: number;
  maxAmount: number | null;
  targetAmount?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  category?: string;
  tags?: string[];
  image?: string;
}

interface ModernFundFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FundFormData) => void;
  initialData?: Partial<FundFormData>;
  mode: 'create' | 'edit';
}

const ModernFundForm: React.FC<ModernFundFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState<FundFormData>({
    name: '',
    code: '',
    description: '',
    type: 'Genel',
    currency: 'TRY',
    minAmount: 0,
    maxAmount: null,
    targetAmount: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    category: '',
    tags: [],
    image: '',
    ...initialData
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fundTypes = [
    { value: 'Genel', label: 'Genel Fon', description: 'Genel amaçlı bağış toplama', color: 'bg-blue-100 text-blue-700' },
    { value: 'Özel', label: 'Özel Fon', description: 'Belirli amaçlar için özel fon', color: 'bg-purple-100 text-purple-700' },
    { value: 'Proje', label: 'Proje Fonu', description: 'Belirli projeler için', color: 'bg-green-100 text-green-700' },
    { value: 'Acil Durum', label: 'Acil Durum Fonu', description: 'Acil durumlar için', color: 'bg-red-100 text-red-700' }
  ];
  
  const currencies = [
    { value: 'TRY', label: 'Türk Lirası (₺)', symbol: '₺' },
    { value: 'USD', label: 'Amerikan Doları ($)', symbol: '$' },
    { value: 'EUR', label: 'Euro (€)', symbol: '€' }
  ];
  
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Fon adı gereklidir';
      if (!formData.code.trim()) newErrors.code = 'Fon kodu gereklidir';
      if (!formData.description.trim()) newErrors.description = 'Açıklama gereklidir';
    }
    
    if (step === 2) {
      if (formData.minAmount < 0) newErrors.minAmount = 'Minimum tutar 0 veya daha büyük olmalıdır';
      if (formData.maxAmount !== null && formData.maxAmount <= formData.minAmount) {
        newErrors.maxAmount = 'Maksimum tutar minimum tutardan büyük olmalıdır';
      }
      if (formData.targetAmount && formData.targetAmount <= 0) {
        newErrors.targetAmount = 'Hedef tutar 0\'dan büyük olmalıdır';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateFormData = (field: keyof FundFormData, value: FundFormData[keyof FundFormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags?.includes(tag.trim())) {
      updateFormData('tags', [...(formData.tags || []), tag.trim()]);
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    updateFormData('tags', formData.tags?.filter(tag => tag !== tagToRemove) || []);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-financial-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-financial-gray-900">
              {mode === 'create' ? 'Yeni Fon Oluştur' : 'Fon Düzenle'}
            </h2>
            <p className="text-financial-gray-600 mt-1">
              {mode === 'create' ? 'Yeni bir fon tanımı oluşturun' : 'Mevcut fon bilgilerini güncelleyin'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-financial-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-financial-gray-500" />
          </button>
        </div>
        
        {/* Progress Steps */}
        <div className="px-6 py-4 bg-financial-gray-50 border-b border-financial-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  currentStep >= step
                    ? 'bg-financial-primary text-white'
                    : 'bg-financial-gray-200 text-financial-gray-500'
                }`}>
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-24 h-1 mx-4 rounded-full transition-all ${
                    currentStep > step ? 'bg-financial-primary' : 'bg-financial-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-financial-gray-600">Temel Bilgiler</span>
            <span className="text-sm text-financial-gray-600">Finansal Ayarlar</span>
            <span className="text-sm text-financial-gray-600">Ek Bilgiler</span>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-2" />
                      Fon Kodu *
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => updateFormData('code', e.target.value.toUpperCase())}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-primary transition-all ${
                        errors.code ? 'border-red-500' : 'border-financial-gray-300'
                      }`}
                      placeholder="Örn: GEN-001"
                    />
                    {errors.code && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.code}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Fon Adı *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-primary transition-all ${
                        errors.name ? 'border-red-500' : 'border-financial-gray-300'
                      }`}
                      placeholder="Fon adını girin"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-primary transition-all resize-none ${
                      errors.description ? 'border-red-500' : 'border-financial-gray-300'
                    }`}
                    placeholder="Fonun amacını ve kullanım alanını açıklayın"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-financial-gray-700 mb-3">
                    Fon Tipi *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fundTypes.map((type) => (
                      <div
                        key={type.value}
                        onClick={() => updateFormData('type', type.value)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          formData.type === type.value
                            ? 'border-financial-primary bg-financial-primary/5'
                            : 'border-financial-gray-200 hover:border-financial-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${type.color}`}>
                            {type.label}
                          </span>
                          {formData.type === type.value && (
                            <Check className="w-5 h-5 text-financial-primary" />
                          )}
                        </div>
                        <p className="text-sm text-financial-gray-600">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Financial Settings */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-financial-gray-700 mb-3">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Para Birimi
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currencies.map((currency) => (
                      <div
                        key={currency.value}
                        onClick={() => updateFormData('currency', currency.value)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          formData.currency === currency.value
                            ? 'border-financial-primary bg-financial-primary/5'
                            : 'border-financial-gray-200 hover:border-financial-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-financial-gray-900">{currency.symbol}</span>
                            <p className="text-sm text-financial-gray-600">{currency.label}</p>
                          </div>
                          {formData.currency === currency.value && (
                            <Check className="w-5 h-5 text-financial-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                      Minimum Tutar *
                    </label>
                    <input
                      type="number"
                      value={formData.minAmount}
                      onChange={(e) => updateFormData('minAmount', Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-primary transition-all ${
                        errors.minAmount ? 'border-red-500' : 'border-financial-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.minAmount && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.minAmount}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                      Maksimum Tutar
                    </label>
                    <input
                      type="number"
                      value={formData.maxAmount || ''}
                      onChange={(e) => updateFormData('maxAmount', e.target.value ? Number(e.target.value) : null)}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-primary transition-all ${
                        errors.maxAmount ? 'border-red-500' : 'border-financial-gray-300'
                      }`}
                      placeholder="Sınırsız için boş bırakın"
                    />
                    {errors.maxAmount && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.maxAmount}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                      Hedef Tutar
                    </label>
                    <input
                      type="number"
                      value={formData.targetAmount || ''}
                      onChange={(e) => updateFormData('targetAmount', e.target.value ? Number(e.target.value) : undefined)}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-primary transition-all ${
                        errors.targetAmount ? 'border-red-500' : 'border-financial-gray-300'
                      }`}
                      placeholder="İsteğe bağlı"
                    />
                    {errors.targetAmount && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.targetAmount}
                      </p>
                    )}
                  </div>
                </div>
                
                {formData.type === 'Proje' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Başlangıç Tarihi
                      </label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => updateFormData('startDate', e.target.value)}
                        className="w-full px-4 py-3 border border-financial-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-primary transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Bitiş Tarihi
                      </label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => updateFormData('endDate', e.target.value)}
                        className="w-full px-4 py-3 border border-financial-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-primary transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    className="w-full px-4 py-3 border border-financial-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-primary transition-all"
                    placeholder="Örn: Eğitim, Sağlık, Sosyal Yardım"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                    Etiketler
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-4 py-3 border border-financial-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-primary transition-all"
                      placeholder="Etiket yazın ve Enter'a basın"
                    />
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-financial-primary/10 text-financial-primary rounded-full text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-financial-gray-700 mb-2">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Fon Görseli
                  </label>
                  <div className="border-2 border-dashed border-financial-gray-300 rounded-lg p-6 text-center hover:border-financial-primary transition-colors">
                    <Upload className="w-12 h-12 mx-auto text-financial-gray-400 mb-4" />
                    <p className="text-financial-gray-600 mb-2">Görsel yüklemek için tıklayın veya sürükleyin</p>
                    <p className="text-sm text-financial-gray-500">PNG, JPG veya SVG (max. 2MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Handle file upload
                          console.log('File selected:', file.name);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => updateFormData('isActive', e.target.checked)}
                    className="w-5 h-5 text-financial-primary border-financial-gray-300 rounded focus:ring-financial-primary"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-financial-gray-700">
                    <Settings className="w-4 h-4 inline mr-2" />
                    Fonu aktif olarak başlat
                  </label>
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between border-t border-financial-gray-200 p-6 bg-financial-gray-50">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border border-financial-gray-300 text-financial-gray-700 rounded-lg hover:bg-financial-gray-100 transition-colors"
              >
                Önceki
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-financial-gray-300 text-financial-gray-700 rounded-lg hover:bg-financial-gray-100 transition-colors"
            >
              İptal
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-financial-primary text-white rounded-lg hover:bg-financial-primary/90 transition-colors"
              >
                Sonraki
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-financial-primary text-white rounded-lg hover:bg-financial-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === 'create' ? 'Fon Oluştur' : 'Değişiklikleri Kaydet'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernFundForm;