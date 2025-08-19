import bcrypt from 'bcrypt';
import DOMPurify from 'isomorphic-dompurify';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
// import crypto from 'crypto';

// ID and UUID Functions
export const generateId = (): string => {
  return uuidv4();
};

export const isValidUUID = (uuid: string | null): boolean => {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// String Utilities
export const slugify = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html);
};

// Validation Functions
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

export const validateTurkishId = (id: string): boolean => {
  if (!id || id.length !== 11 || !/^\d{11}$/.test(id)) return false;

  const digits = id.split('').map(Number);
  const checksum = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 -
    (digits[1] + digits[3] + digits[5] + digits[7]);

  return (checksum % 10) === digits[9] &&
    ((digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0)) % 10) === digits[10];
};

export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateCreditCard = (cardNumber: string): boolean => {
  if (!cardNumber || !/^\d{13,19}$/.test(cardNumber)) return false;

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const validateIBAN = (iban: string): boolean => {
  if (!iban) return false;
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  if (cleanIban.length < 15 || cleanIban.length > 34) return false;

  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);
  const numericString = rearranged.replace(/[A-Z]/g, (char) =>
    (char.charCodeAt(0) - 55).toString()
  );

  return BigInt(numericString) % 97n === 1n;
};

// Password Functions
export const hashPassword = async (password: string): Promise<string> => {
  if (!password) throw new Error('Password is required');
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  if (!password || !hash) throw new Error('Password and hash are required');
  return bcrypt.compare(password, hash);
};

// Token Functions
export const generateToken = (payload: any): string => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

export const verifyToken = (token: string): any => {
  if (!token) throw new Error('Token is required');
  const secret = process.env.JWT_SECRET || 'default-secret';
  return jwt.verify(token, secret);
};

// Currency and Number Functions
export const formatCurrency = (amount: number, currency = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatPercentage = (value: number, decimals = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const roundToDecimal = (value: number, decimals = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const convertCurrency = async (amount: number, from: string, to: string): Promise<number> => {
  // Mock implementation - in real app, use currency API
  const rates: { [key: string]: number } = {
    'USD': 1,
    'TRY': 27.5,
    'EUR': 0.85
  };

  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;

  return (amount / fromRate) * toRate;
};

// Date Functions
export const formatDate = (date: Date | string, format = 'dd/MM/yyyy'): string => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year.toString());
};

export const calculateAge = (birthDate: Date | string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// Phone Functions
export const parsePhoneNumber = (phone: string): { countryCode: string; number: string } => {
  const cleaned = phone.replace(/[^+\d]/g, '');
  if (cleaned.startsWith('+90')) {
    return { countryCode: '+90', number: cleaned.slice(3) };
  }
  if (cleaned.startsWith('0')) {
    return { countryCode: '+90', number: cleaned.slice(1) };
  }
  return { countryCode: '+90', number: cleaned };
};

export const formatPhoneNumber = (phone: string): string => {
  const { countryCode, number } = parsePhoneNumber(phone);
  if (number.length === 10) {
    return `${countryCode} (${number.slice(0, 3)}) ${number.slice(3, 6)} ${number.slice(6, 8)} ${number.slice(8)}`;
  }
  return phone;
};

// File Functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
};

// Financial Functions
export const calculateTax = (amount: number, taxRate = 0.18): number => {
  return amount * taxRate;
};

export const calculateDonationTax = (amount: number): number => {
  // Turkish donation tax calculation
  if (amount <= 1000) return 0;
  if (amount <= 5000) return amount * 0.05;
  return amount * 0.10;
};

export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
};

export const maskCreditCard = (cardNumber: string): string => {
  if (!cardNumber || cardNumber.length < 4) return cardNumber;
  return '**** **** **** ' + cardNumber.slice(-4);
};

export const formatIBAN = (iban: string): string => {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

// Distance calculation
export const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
  // Validate coordinates
  if (!point1 || !point2 ||
    typeof point1.lat !== 'number' || typeof point1.lng !== 'number' ||
    typeof point2.lat !== 'number' || typeof point2.lng !== 'number' ||
    Math.abs(point1.lat) > 90 || Math.abs(point2.lat) > 90 ||
    Math.abs(point1.lng) > 180 || Math.abs(point2.lng) > 180) {
    throw new Error('Invalid coordinates');
  }

  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Mock implementations for complex functions
export const generateQRCode = async (data: string, _width?: number, _height?: number): Promise<string> => {
  // Mock implementation - in real app, use QR code library
  return `data:image/png;base64,mock-qr-code-${Buffer.from(data).toString('base64')}`;
};

export const sendEmail = async (to: string, subject: string, _body: string): Promise<boolean> => {
  // Mock implementation - in real app, use email service
  console.log(`Sending email to ${to}: ${subject}`);
  return true;
};

export const sendSMS = async (to: string, _message: string): Promise<boolean> => {
  // Mock implementation - in real app, use SMS service
  console.log(`Sending SMS to ${to}: ${_message}`);
  return true;
};

export const uploadFile = async (_file: Buffer, filename: string): Promise<string> => {
  // Mock implementation - in real app, use file storage service
  return `https://storage.example.com/${filename}`;
};

export const deleteFile = async (_url: string): Promise<boolean> => {
  // Mock implementation - in real app, delete from storage service
  console.log(`Deleting file: ${_url}`);
  return true;
};

export const resizeImage = async (buffer: Buffer, _width: number, _height: number): Promise<Buffer> => {
  // Mock implementation - in real app, use image processing library
  return buffer;
};

export const generatePDF = async (_html: string): Promise<Buffer> => {
  // Mock implementation - in real app, use PDF generation library
  return Buffer.from(_html);
};

export const exportToExcel = async (_data: any[]): Promise<Buffer> => {
  // Mock implementation - in real app, use Excel library
  return Buffer.from(JSON.stringify(_data));
};

export const importFromExcel = async (_buffer: Buffer): Promise<any[]> => {
  // Mock implementation - in real app, parse Excel file
  return JSON.parse(_buffer.toString());
};