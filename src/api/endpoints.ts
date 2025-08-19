import { SupabaseApi } from './supabase';
import { supabase } from '../lib/supabase';

// Beneficiaries API
export class BeneficiariesApi extends SupabaseApi {
  constructor() {
    super('beneficiaries');
  }

  // Custom search for beneficiaries
  protected buildQuery(params?: any) {
    let query = super.buildQuery(params);
    
    if (params?.search && params.search.trim()) {
      query = query.or(`name.ilike.%${params.search}%,identity_no.ilike.%${params.search}%,phone.ilike.%${params.search}%`);
    }
    
    return query;
  }
}

// Applications API
export class ApplicationsApi extends SupabaseApi {
  constructor() {
    super('applications');
  }

  // Get applications by beneficiary
  async getByBeneficiary(beneficiaryId: string | number) {
    return this.getAll({
      filters: { beneficiary_id: beneficiaryId }
    });
  }

  // Get applications by status
  async getByStatus(status: string) {
    return this.getAll({
      filters: { status }
    });
  }
}

// Aid Records API
export class AidRecordsApi extends SupabaseApi {
  constructor() {
    super('aid_records');
  }

  // Get aid records by beneficiary
  async getByBeneficiary(beneficiaryId: string | number) {
    return this.getAll({
      filters: { beneficiary_id: beneficiaryId }
    });
  }

  // Get aid records by date range
  async getByDateRange(startDate: string, endDate: string) {
    try {
      const response = await supabase
        .from(this.tableName)
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate);
      
      return this.handleResponse(response);
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }
}

// Payments API
export class PaymentsApi extends SupabaseApi {
  constructor() {
    super('payments');
  }

  // Get payments by beneficiary
  async getByBeneficiary(beneficiaryId: string | number) {
    return this.getAll({
      filters: { beneficiary_id: beneficiaryId }
    });
  }

  // Get payments by status
  async getByStatus(status: string) {
    return this.getAll({
      filters: { status }
    });
  }
}

// In-Kind Aids API
export class InKindAidsApi extends SupabaseApi {
  constructor() {
    super('in_kind_aids');
  }

  // Get in-kind aids by beneficiary
  async getByBeneficiary(beneficiaryId: string | number) {
    return this.getAll({
      filters: { beneficiary_id: beneficiaryId }
    });
  }

  // Get in-kind aids by type
  async getByType(type: string) {
    return this.getAll({
      filters: { aid_type: type }
    });
  }
}

// Documents API
export class DocumentsApi extends SupabaseApi {
  constructor() {
    super('documents');
  }

  // Get documents by entity
  async getByEntity(entityType: string, entityId: string | number) {
    return this.getAll({
      filters: { 
        entity_type: entityType,
        entity_id: entityId 
      }
    });
  }
}

// Family Members API
export class FamilyMembersApi extends SupabaseApi {
  constructor() {
    super('family_members');
  }

  // Get family members by beneficiary
  async getByBeneficiary(beneficiaryId: string | number) {
    return this.getAll({
      filters: { beneficiary_id: beneficiaryId }
    });
  }
}

// User Profiles API
export class UserProfilesApi extends SupabaseApi {
  constructor() {
    super('user_profiles');
  }

  // Get users by role
  async getByRole(role: string) {
    return this.getAll({
      filters: { role }
    });
  }

  // Get active users
  async getActiveUsers() {
    return this.getAll({
      filters: { is_active: true }
    });
  }
}

// API instances - singleton pattern
export const beneficiariesApi = new BeneficiariesApi();
export const applicationsApi = new ApplicationsApi();
export const aidRecordsApi = new AidRecordsApi();
export const paymentsApi = new PaymentsApi();
export const inKindAidsApi = new InKindAidsApi();
export const documentsApi = new DocumentsApi();
export const familyMembersApi = new FamilyMembersApi();
export const userProfilesApi = new UserProfilesApi();

// Export all APIs as a single object
export const api = {
  beneficiaries: beneficiariesApi,
  applications: applicationsApi,
  aidRecords: aidRecordsApi,
  payments: paymentsApi,
  inKindAids: inKindAidsApi,
  documents: documentsApi,
  familyMembers: familyMembersApi,
  userProfiles: userProfilesApi
};