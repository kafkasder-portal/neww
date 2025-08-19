import crypto from 'crypto';
import axios from 'axios';

// Interface for payment gateway configuration
interface PaymentGatewayConfig {
  merchantId: string;
  secretKey: string;
  apiKey: string;
  baseUrl: string;
  environment: 'sandbox' | 'production';
}

// Interface for payment request
interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  description?: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

// Interface for payment response
interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  token?: string;
  errorCode?: string;
  errorMessage?: string;
  checkoutFormContent?: string;
}

// Interface for payment verification
interface PaymentVerification {
  success: boolean;
  status: 'completed' | 'failed' | 'pending' | 'cancelled';
  transactionId: string;
  amount: number;
  currency: string;
  orderId: string;
  errorMessage?: string;
}

// Abstract base class for payment gateways
abstract class PaymentGateway {
  protected config: PaymentGatewayConfig;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
  }

  abstract initiatePayment(request: PaymentRequest): Promise<PaymentResponse>;
  abstract verifyPayment(token: string): Promise<PaymentVerification>;
  abstract refundPayment(transactionId: string, amount?: number): Promise<PaymentResponse>;
}

// İyzico Payment Gateway Implementation
class IyzicoGateway extends PaymentGateway {
  private generateSignature(requestData: string): string {
    const dataToSign = this.config.secretKey + requestData;
    return crypto.createHash('sha1').update(dataToSign, 'utf8').digest('base64');
  }

  private prepareHeaders(requestData: string) {
    const randomString = crypto.randomBytes(16).toString('hex');
    const signature = this.generateSignature(requestData);
    
    return {
      'Authorization': `IYZWS ${this.config.apiKey}:${signature}`,
      'Content-Type': 'application/json',
      'x-iyzi-rnd': randomString
    };
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const requestData = {
        locale: 'tr',
        conversationId: request.orderId,
        price: request.amount.toString(),
        paidPrice: request.amount.toString(),
        currency: request.currency,
        installment: '1',
        basketId: request.orderId,
        paymentChannel: 'WEB',
        paymentGroup: 'PRODUCT',
        callbackUrl: request.callbackUrl,
        enabledInstallments: ['2', '3', '6', '9'],
        buyer: {
          id: 'BY789',
          name: request.customerName?.split(' ')[0] || 'Ad',
          surname: request.customerName?.split(' ').slice(1).join(' ') || 'Soyad',
          gsmNumber: request.customerPhone || '+905350000000',
          email: request.customerEmail || 'email@email.com',
          identityNumber: '74300864791',
          lastLoginDate: new Date().toISOString(),
          registrationDate: new Date().toISOString(),
          registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
          ip: '85.34.78.112',
          city: 'Istanbul',
          country: 'Turkey',
          zipCode: '34732'
        },
        shippingAddress: {
          contactName: request.customerName || 'Jane Doe',
          city: 'Istanbul',
          country: 'Turkey',
          address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
          zipCode: '34742'
        },
        billingAddress: {
          contactName: request.customerName || 'Jane Doe',
          city: 'Istanbul',
          country: 'Turkey',
          address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
          zipCode: '34742'
        },
        basketItems: [
          {
            id: 'BI101',
            name: request.description || 'Bağış',
            category1: 'Donation',
            category2: 'Charity',
            itemType: 'VIRTUAL',
            price: request.amount.toString()
          }
        ]
      };

      const requestString = JSON.stringify(requestData);
      const headers = this.prepareHeaders(requestString);

      const response = await axios.post(
        `${this.config.baseUrl}/payment/iyzipos/checkoutform/initialize/auth/ecom`,
        requestData,
        { headers }
      );

      if (response.data.status === 'success') {
        return {
          success: true,
          token: response.data.token,
          paymentUrl: response.data.paymentPageUrl,
          checkoutFormContent: response.data.checkoutFormContent
        };
      } else {
        return {
          success: false,
          errorCode: response.data.errorCode,
          errorMessage: response.data.errorMessage
        };
      }
    } catch (error) {
      console.error('İyzico payment initiation error:', error);
      return {
        success: false,
        errorMessage: 'Payment gateway error'
      };
    }
  }

  async verifyPayment(token: string): Promise<PaymentVerification> {
    try {
      const requestData = {
        locale: 'tr',
        conversationId: token,
        token: token
      };

      const requestString = JSON.stringify(requestData);
      const headers = this.prepareHeaders(requestString);

      const response = await axios.post(
        `${this.config.baseUrl}/payment/iyzipos/checkoutform/auth/ecom/detail`,
        requestData,
        { headers }
      );

      const data = response.data;

      if (data.status === 'success' && data.paymentStatus === 'SUCCESS') {
        return {
          success: true,
          status: 'completed',
          transactionId: data.paymentId,
          amount: parseFloat(data.paidPrice),
          currency: data.currency,
          orderId: data.basketId
        };
      } else {
        return {
          success: false,
          status: 'failed',
          transactionId: data.paymentId || '',
          amount: parseFloat(data.paidPrice || '0'),
          currency: data.currency || 'TRY',
          orderId: data.basketId || '',
          errorMessage: data.errorMessage
        };
      }
    } catch (error) {
      console.error('İyzico payment verification error:', error);
      return {
        success: false,
        status: 'failed',
        transactionId: '',
        amount: 0,
        currency: 'TRY',
        orderId: '',
        errorMessage: 'Payment verification failed'
      };
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResponse> {
    try {
      const requestData = {
        locale: 'tr',
        conversationId: `refund-${transactionId}`,
        paymentTransactionId: transactionId,
        price: amount?.toString(),
        ip: '85.34.78.112'
      };

      const requestString = JSON.stringify(requestData);
      const headers = this.prepareHeaders(requestString);

      const response = await axios.post(
        `${this.config.baseUrl}/payment/iyzipos/refund`,
        requestData,
        { headers }
      );

      if (response.data.status === 'success') {
        return {
          success: true,
          transactionId: response.data.paymentId
        };
      } else {
        return {
          success: false,
          errorCode: response.data.errorCode,
          errorMessage: response.data.errorMessage
        };
      }
    } catch (error) {
      console.error('İyzico refund error:', error);
      return {
        success: false,
        errorMessage: 'Refund processing failed'
      };
    }
  }
}

// PayTR Payment Gateway Implementation
class PayTRGateway extends PaymentGateway {
  private generateHash(data: string): string {
    return crypto.createHmac('sha256', this.config.secretKey)
      .update(data)
      .digest('base64');
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const merchantOid = request.orderId;
      const userBasket = JSON.stringify([
        [request.description || 'Bağış', request.amount.toString(), 1]
      ]);

      const hashData = [
        this.config.merchantId,
        request.customerEmail || 'test@test.com',
        request.orderId,
        request.amount * 100, // PayTR expects amount in cents
        request.currency,
        '1', // test_mode (0 for production)
        userBasket
      ].join('');

      const paytrToken = this.generateHash(hashData);

      const postData = {
        merchant_id: this.config.merchantId,
        user_ip: '85.34.78.112',
        merchant_oid: merchantOid,
        email: request.customerEmail || 'test@test.com',
        payment_amount: (request.amount * 100).toString(),
        currency: request.currency,
        test_mode: this.config.environment === 'sandbox' ? '1' : '0',
        non_3d: '0',
        merchant_ok_url: request.callbackUrl + '/success',
        merchant_fail_url: request.callbackUrl + '/fail',
        user_name: request.customerName || 'Test User',
        user_address: 'Test Address',
        user_phone: request.customerPhone || '05551234567',
        user_basket: userBasket,
        debug_on: '1',
        paytr_token: paytrToken,
        installment_count: '0'
      };

      const response = await axios.post(
        'https://www.paytr.com/odeme/api/get-token',
        new URLSearchParams(postData).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.status === 'success') {
        return {
          success: true,
          token: response.data.token,
          paymentUrl: `https://www.paytr.com/odeme/guvenli/${response.data.token}`
        };
      } else {
        return {
          success: false,
          errorMessage: response.data.reason
        };
      }
    } catch (error) {
      console.error('PayTR payment initiation error:', error);
      return {
        success: false,
        errorMessage: 'Payment gateway error'
      };
    }
  }

  async verifyPayment(merchantOid: string): Promise<PaymentVerification> {
    // PayTR verification is typically done via webhook
    // This is a placeholder implementation
    try {
      return {
        success: true,
        status: 'completed',
        transactionId: merchantOid,
        amount: 0,
        currency: 'TRY',
        orderId: merchantOid
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        transactionId: '',
        amount: 0,
        currency: 'TRY',
        orderId: merchantOid,
        errorMessage: 'Verification failed'
      };
    }
  }

  async refundPayment(transactionId: string): Promise<PaymentResponse> {
    // PayTR refunds are typically handled manually through their panel
    return {
      success: false,
      errorMessage: 'Refunds must be processed through PayTR merchant panel'
    };
  }
}

// Payment Gateway Factory
class PaymentGatewayFactory {
  static createGateway(provider: 'iyzico' | 'paytr', config: PaymentGatewayConfig): PaymentGateway {
    switch (provider) {
      case 'iyzico':
        return new IyzicoGateway(config);
      case 'paytr':
        return new PayTRGateway(config);
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }
}

// Payment Service - Main interface for the application
export class TurkishPaymentService {
  private gateways: Map<string, PaymentGateway> = new Map();

  constructor() {
    this.initializeGateways();
  }

  private initializeGateways() {
    // İyzico configuration
    if (process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY) {
      const iyzicoConfig: PaymentGatewayConfig = {
        merchantId: process.env.IYZICO_MERCHANT_ID || '',
        secretKey: process.env.IYZICO_SECRET_KEY,
        apiKey: process.env.IYZICO_API_KEY,
        baseUrl: process.env.NODE_ENV === 'production' 
          ? 'https://api.iyzipay.com' 
          : 'https://sandbox-api.iyzipay.com',
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      };

      this.gateways.set('iyzico', PaymentGatewayFactory.createGateway('iyzico', iyzicoConfig));
    }

    // PayTR configuration
    if (process.env.PAYTR_MERCHANT_ID && process.env.PAYTR_SECRET_KEY) {
      const paytrConfig: PaymentGatewayConfig = {
        merchantId: process.env.PAYTR_MERCHANT_ID,
        secretKey: process.env.PAYTR_SECRET_KEY,
        apiKey: process.env.PAYTR_API_KEY || '',
        baseUrl: 'https://www.paytr.com',
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      };

      this.gateways.set('paytr', PaymentGatewayFactory.createGateway('paytr', paytrConfig));
    }
  }

  async processPayment(
    provider: string, 
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    const gateway = this.gateways.get(provider);
    if (!gateway) {
      throw new Error(`Payment provider ${provider} not configured`);
    }

    return gateway.initiatePayment(request);
  }

  async verifyPayment(
    provider: string, 
    token: string
  ): Promise<PaymentVerification> {
    const gateway = this.gateways.get(provider);
    if (!gateway) {
      throw new Error(`Payment provider ${provider} not configured`);
    }

    return gateway.verifyPayment(token);
  }

  async refundPayment(
    provider: string, 
    transactionId: string, 
    amount?: number
  ): Promise<PaymentResponse> {
    const gateway = this.gateways.get(provider);
    if (!gateway) {
      throw new Error(`Payment provider ${provider} not configured`);
    }

    return gateway.refundPayment(transactionId, amount);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.gateways.keys());
  }
}

export default TurkishPaymentService;
