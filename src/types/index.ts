export interface Organization {
  id: string;
  name: string;
}

export interface Certification {
  id: string;
  cert_number: string | null;
  cert_type: string | null;
  naics_codes: string[] | null;
}

export interface Subcontractor {
  id: string;
  organization_id: string;
  legal_name: string;
  certification_number: string | null;
  is_mbe: boolean;
  certifications?: Certification[];
}

export interface BidSubcontractor {
  id: string;
  bid_id: string;
  subcontractor_id: string;
  work_description: string;
  naics_code: string;
  subcontract_value: number;
  counts_toward_mbe: boolean;
  subcontractor?: Subcontractor;
}

export interface Bid {
  id: string;
  organization_id: string;
  solicitation_number: string;
  total_amount: number;
  mbe_goal: number;
  bid_subcontractors?: BidSubcontractor[];
}

export interface ValidationResult {
  id: string;
  bid_id: string;
  rule_name: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  error_message: string;
  created_at: string;
}

export interface ValidationResponse {
  bid_id: string;
  overall_status: string;
  total_validations: number;
  passed: number;
  failed: number;
  warnings: number;
  validations: ValidationResult[];
}

// Request types
export interface BidCreateRequest {
  organization_id: string;
  solicitation_number: string;
  total_amount: number;
  mbe_goal: number;
}

export interface BidSubcontractorCreateRequest {
  subcontractor_id: string;
  work_description: string;
  naics_code: string;
  subcontract_value: number;
  counts_toward_mbe: boolean;
}

export interface OrganizationCreateRequest {
  name: string;
}