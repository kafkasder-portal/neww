export interface FormData {
  // Temel Bilgiler
  name: string
  surname: string
  category: string
  nationality: string
  birth_date: string
  birth_place: string
  identity_no: string
  gender: string
  marital_status: string
  education_level: string
  mother_name: string
  father_name: string
  
  // İletişim Bilgileri
  phone: string
  alternative_phone: string
  email: string
  address: string
  city: string
  district: string
  neighborhood: string
  postal_code: string
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relation: string
  
  // Finansal Bilgiler
  monthly_income: string
  household_size: string
  dependent_count: string
  employment_status: string
  occupation: string
  social_security_no: string
  bank_account_no: string
  bank_name: string
  
  // Sağlık Bilgileri
  has_disability: boolean
  disability_type: string
  disability_percentage: string
  chronic_illness: string
  medication_needs: string
  health_insurance: boolean
  health_insurance_type: string
  
  // Konut Bilgileri
  housing_type: string
  monthly_rent: string
  room_count: string
  has_electricity: boolean
  has_water: boolean
  has_gas: boolean
  has_internet: boolean
  housing_condition: string
  
  // Ek Bilgiler
  special_needs: string
  previous_aid_received: boolean
  previous_aid_details: string
  verification_status: string
  notes: string
  
  // Sistem Alanları
  fund_region: string
  file_connection: string
  file_number: string
  status: string
  mernis_check: boolean
}

export interface TempFormData {
  name: string
  surname: string
  identity_no: string
}

export const defaultFormData: FormData = {
  // Temel Bilgiler
  name: '',
  surname: '',
  category: 'Yetim Ailesi',
  nationality: 'TC',
  birth_date: '',
  birth_place: '',
  identity_no: '',
  gender: '',
  marital_status: '',
  education_level: '',
  mother_name: '',
  father_name: '',
  
  // İletişim Bilgileri
  phone: '',
  alternative_phone: '',
  email: '',
  address: '',
  city: '',
  district: '',
  neighborhood: '',
  postal_code: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relation: '',
  
  // Finansal Bilgiler
  monthly_income: '',
  household_size: '',
  dependent_count: '',
  employment_status: '',
  occupation: '',
  social_security_no: '',
  bank_account_no: '',
  bank_name: '',
  
  // Sağlık Bilgileri
  has_disability: false,
  disability_type: '',
  disability_percentage: '',
  chronic_illness: '',
  medication_needs: '',
  health_insurance: false,
  health_insurance_type: '',
  
  // Konut Bilgileri
  housing_type: '',
  monthly_rent: '',
  room_count: '',
  has_electricity: true,
  has_water: true,
  has_gas: false,
  has_internet: false,
  housing_condition: '',
  
  // Ek Bilgiler
  special_needs: '',
  previous_aid_received: false,
  previous_aid_details: '',
  verification_status: 'pending',
  notes: '',
  
  // Sistem Alanları
  fund_region: 'Genel',
  file_connection: 'Doğrudan Başvuru',
  file_number: '',
  status: 'active',
  mernis_check: false
}

export const defaultTempFormData: TempFormData = {
  name: '',
  surname: '',
  identity_no: ''
}