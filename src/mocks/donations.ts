export interface Donation {
  id: number;
  donor_name: string;
  amount: number;
  currency: string;
  donation_type: string;
  status: string;
  date: string;
  description?: string;
  payment_method?: string;
  receipt_number?: string;
}

export const donations: Donation[] = [
  {
    id: 1,
    donor_name: "Ahmet Yılmaz",
    amount: 1000,
    currency: "TRY",
    donation_type: "Genel Bağış",
    status: "Tamamlandı",
    date: "2024-01-15",
    description: "Aylık bağış",
    payment_method: "Kredi Kartı",
    receipt_number: "RC001"
  },
  {
    id: 2,
    donor_name: "Fatma Demir",
    amount: 500,
    currency: "TRY",
    donation_type: "Eğitim Bağışı",
    status: "Beklemede",
    date: "2024-01-16",
    description: "Öğrenci bursu için",
    payment_method: "Banka Transferi",
    receipt_number: "RC002"
  },
  {
    id: 3,
    donor_name: "Mehmet Kaya",
    amount: 2000,
    currency: "TRY",
    donation_type: "Acil Yardım",
    status: "Tamamlandı",
    date: "2024-01-17",
    description: "Deprem yardımı",
    payment_method: "Nakit",
    receipt_number: "RC003"
  }
];