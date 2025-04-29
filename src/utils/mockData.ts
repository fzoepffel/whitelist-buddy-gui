
import { WhitelistEntry } from "../types/whitelist";

export const mockWhitelistData: WhitelistEntry[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "test1@company.com",
    test_payment_allowed: true,
    created_at: "2023-01-15T09:30:00",
    updated_at: "2023-01-15T09:30:00",
    activity_api: true,
    sso_id: 1001,
    sso_mock_allowed: true
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "test2@company.com",
    test_payment_allowed: false,
    created_at: "2023-02-20T14:15:00",
    updated_at: "2023-03-10T11:45:00",
    activity_api: true,
    sso_id: 1002,
    sso_mock_allowed: false
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "dev@company.com",
    test_payment_allowed: true,
    created_at: "2023-03-05T10:00:00",
    updated_at: "2023-03-05T10:00:00",
    activity_api: false,
    sso_id: null,
    sso_mock_allowed: true
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "qa@company.com",
    test_payment_allowed: true,
    created_at: "2023-04-12T16:20:00",
    updated_at: "2023-04-22T09:10:00",
    activity_api: true,
    sso_id: 1003,
    sso_mock_allowed: true
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    email: "demo@company.com",
    test_payment_allowed: false,
    created_at: "2023-05-08T13:40:00",
    updated_at: "2023-05-08T13:40:00",
    activity_api: false,
    sso_id: 1004,
    sso_mock_allowed: false
  }
];
