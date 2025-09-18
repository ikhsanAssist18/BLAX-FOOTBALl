import {
  PolicySubmissionRequest,
  PolicySubmissionResponse,
  Policy,
} from "@/types/policy";
import { apiClient } from "./api";

class PolicyService {
  // Submit new policy
  async submitPolicy(
    policyData: PolicySubmissionRequest
  ): Promise<PolicySubmissionResponse> {
    try {
      const result = await apiClient.post("/policies", policyData);
      return result;
    } catch (error) {
      console.error("Error submitting policy:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to submit policy",
      };
    }
  }

  // Get user's submitted policies
  async getUserPolicies(
    limit?: number,
    offset?: number
  ): Promise<{
    policies: Policy[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    try {
      const queryParams = new URLSearchParams();

      if (limit) queryParams.append("limit", limit.toString());
      if (offset) queryParams.append("offset", offset.toString());

      const result = await apiClient.get(`/policies/user?${queryParams}`);

      return {
        policies: result.data || [],
        pagination: result.pagination || {
          total: 0,
          limit: limit || 20,
          offset: offset || 0,
          hasMore: false,
        },
      };
    } catch (error) {
      console.error("Error fetching user policies:", error);
      return {
        policies: [],
        pagination: {
          total: 0,
          limit: limit || 20,
          offset: offset || 0,
          hasMore: false,
        },
      };
    }
  }

  // Get all policies (for leaderboard/public view)
  async getAllPolicies(
    limit?: number,
    offset?: number,
    status?: string,
    search?: string
  ): Promise<{
    success: boolean;
    data: Policy[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
    error?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append("limit", limit.toString());
      if (offset) queryParams.append("offset", offset.toString());
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);

      const result = await apiClient.get(`/policies?${queryParams}`);

      return {
        success: true,
        data: result.data || [],
        pagination: result.pagination || {
          total: 0,
          limit: limit || 50,
          offset: offset || 0,
          hasMore: false,
        },
      };
    } catch (error) {
      console.error("Error fetching all policies:", error);
      return {
        success: false,
        data: [],
        pagination: {
          total: 0,
          limit: limit || 50,
          offset: offset || 0,
          hasMore: false,
        },
        error:
          error instanceof Error ? error.message : "Failed to fetch policies",
      };
    }
  }

  // Get policy by ID
  async getPolicyById(id: string): Promise<Policy | null> {
    try {
      const result = await apiClient.get(`/policies/${id}`);

      return result.data;
    } catch (error) {
      console.error("Error fetching policy:", error);
      return null;
    }
  }
}

export const policyService = new PolicyService();
