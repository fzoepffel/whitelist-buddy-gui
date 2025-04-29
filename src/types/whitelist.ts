
export interface WhitelistEntry {
  id: string;
  email: string;
  test_payment_allowed: boolean;
  created_at: string;
  updated_at: string;
  activity_api: boolean;
  sso_id: number | null;
  sso_mock_allowed: boolean;
}

export interface WhitelistFormData {
  email: string;
  test_payment_allowed: boolean;
  activity_api: boolean;
  sso_id: number | null;
  sso_mock_allowed: boolean;
}
