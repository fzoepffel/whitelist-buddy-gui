
export interface WhitelistEntry {
  id: string;
  email: string;
  test_payment_allowed: boolean;
  created_at: string;
  updated_at: string | null;
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

// New interface for form input values that separates the UI string representation from the data model
export interface WhitelistFormInputs {
  email: string;
  test_payment_allowed: boolean;
  activity_api: boolean;
  sso_id: string; // String representation for the input field
  sso_mock_allowed: boolean;
}

