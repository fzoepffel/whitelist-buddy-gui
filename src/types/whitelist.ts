export interface WhitelistEntry {
  id: string;
  email: string;
  test_payment_allowed: boolean;
  created_at: string;
  updated_at: string | null;
  sso_id: number;
  sso_mock_allowed: boolean;
}

export interface WhitelistFormData {
  email: string;
  test_payment_allowed: boolean;
  sso_id: number;
  sso_mock_allowed: boolean;
}
