import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, TrendingUp, Award, Heart, Edit, Save, X } from 'lucide-react';
import DonationCard from './DonationCard';

interface DonorInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: Date;
  totalDonations: number;
  donationCount: number;
  lastDonation: Date;
  averageDonation: number;
  preferredMethod: 'cash' | 'online' | 'bank' | 'other';
  status: 'active' | 'inactive' | 'vip';
  notes?: string;
}

interface DonationHistory {
  id: string;
  date: Date;
  amount: number;
  method: 'cash' | 'online' | 'bank' | 'other';
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

interface DonorProfileProps {
  donorId: string;
  className?: string;
  onClose?: () => void;
}

// Mock data
const mockDonor: DonorInfo = {
  id: '1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@email.com',
  phone: '+90 532 123 45 67',
  address: 'Kadıköy, İstanbul',
  joinDate: new Date('2023-01-15'),
  totalDonations: 25000,
  donationCount: 12,
  lastDonation: new Date('2024-01-10'),
  averageDonation: 2083,
  preferredMethod: 'online',
  status: 'vip',
  notes: 'Düzenli bağışçı, özel günlerde ek bağış yapar.'
};

const mockDonationHistory: DonationHistory[] = [
  {
    id: '1',
    date: new Date('2024-01-10'),
    amount: 3000,
    method: 'online',
    description: 'Aylık düzenli bağış',
    status: 'completed'
  },
  {
    id: '2',
    date: new Date('2023-12-25'),
    amount: 5000,
    method: 'bank',
    description: 'Yılbaşı özel bağışı',
    status: 'completed'
  },
  {
    id: '3',
    date: new Date('2023-12-10'),
    amount: 2500,
    method: 'online',
    description: 'Aylık düzenli bağış',
    status: 'completed'
  },
  {
    id: '4',
    date: new Date('2023-11-10'),
    amount: 2500,
    method: 'online',
    description: 'Aylık düzenli bağış',
    status: 'completed'
  },
  {
    id: '5',
    date: new Date('2023-10-10'),
    amount: 2000,
    method: 'cash',
    description: 'Nakit bağış',
    status: 'completed'
  }
];

const DonorProfile: React.FC<DonorProfileProps> = ({ className = '', onClose }) => {
  const [donor, setDonor] = useState<DonorInfo>(mockDonor);
  const [donationHistory] = useState<DonationHistory[]>(mockDonationHistory);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDonor, setEditedDonor] = useState<DonorInfo>(donor);

  const handleSave = () => {
    setDonor(editedDonor);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDonor(donor);
    setIsEditing(false);
  };

  const getStatusColor = (status: DonorInfo['status']) => {
    switch (status) {
      case 'vip':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return '💵';
      case 'online': return '💳';
      case 'bank': return '🏦';
      case 'other': return '📄';
      default: return '💳';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR');
  };

  const calculateLoyaltyScore = () => {
    const monthsSinceJoin = Math.floor((Date.now() - donor.joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const donationsPerMonth = donor.donationCount / Math.max(monthsSinceJoin, 1);
    return Math.min(Math.round(donationsPerMonth * 20 + (donor.totalDonations / 1000)), 100);
  };

  const loyaltyScore = calculateLoyaltyScore();

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {donor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{donor.name}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(donor.status)}`}>
                  {donor.status === 'vip' ? '⭐ VIP' : 
                   donor.status === 'active' ? '✅ Aktif' : '⏸️ Pasif'}
                </span>
                <span className="text-sm text-gray-500">
                  Üyelik: {formatDate(donor.joinDate)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Düzenle"
              >
                <Edit className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="Kaydet"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="İptal"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DonationCard
            title="Toplam Bağış"
            value={donor.totalDonations}
            currency="TRY"
            icon={DollarSign}
            variant="success"
          />
          
          <DonationCard
            title="Bağış Sayısı"
            value={donor.donationCount}
            currency=""
            icon={Heart}
            variant="info"
          />
          
          <DonationCard
            title="Ortalama Bağış"
            value={donor.averageDonation}
            currency="TRY"
            icon={TrendingUp}
            variant="warning"
          />
          
          <DonationCard
            title="Sadakat Puanı"
            value={loyaltyScore}
            currency="%"
            icon={Award}
            variant="default"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              İletişim Bilgileri
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editedDonor.email}
                    onChange={(e) => setEditedDonor({...editedDonor, email: e.target.value})}
                    className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
                  />
                ) : (
                  <span className="text-gray-700">{donor.email}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedDonor.phone}
                    onChange={(e) => setEditedDonor({...editedDonor, phone: e.target.value})}
                    className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
                  />
                ) : (
                  <span className="text-gray-700">{donor.phone}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDonor.address}
                    onChange={(e) => setEditedDonor({...editedDonor, address: e.target.value})}
                    className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
                  />
                ) : (
                  <span className="text-gray-700">{donor.address}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Son bağış: {formatDate(donor.lastDonation)}</span>
              </div>
            </div>
          </div>

          {/* Preferences and Notes */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tercihler ve Notlar</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tercih Edilen Yöntem</label>
                {isEditing ? (
                  <select
                    value={editedDonor.preferredMethod}
                    onChange={(e) => setEditedDonor({...editedDonor, preferredMethod: e.target.value as any})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="cash">💵 Nakit</option>
                    <option value="online">💳 Online</option>
                    <option value="bank">🏦 Banka</option>
                    <option value="other">📄 Diğer</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{getMethodIcon(donor.preferredMethod)}</span>
                    <span className="text-gray-700 capitalize">{donor.preferredMethod}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Notlar</label>
                {isEditing ? (
                  <textarea
                    value={editedDonor.notes || ''}
                    onChange={(e) => setEditedDonor({...editedDonor, notes: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20 resize-none"
                    placeholder="Bağışçı hakkında notlar..."
                  />
                ) : (
                  <p className="text-gray-700 text-sm">{donor.notes || 'Not bulunmuyor.'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bağış Geçmişi</h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {donationHistory.map((donation) => (
              <div key={donation.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-lg">{getMethodIcon(donation.method)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{donation.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(donation.date)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-green-600">{donation.amount.toLocaleString('tr-TR')} ₺</p>
                  <p className="text-xs text-gray-500 capitalize">{donation.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;