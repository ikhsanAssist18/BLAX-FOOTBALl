import { apiClient } from "./api";

// Types for master data entities
export interface Venue {
  id: string;
  name: string;
  gmapsLink: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Rule {
  id: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Facility {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// API payload types
export interface VenuePayload {
  name: string;
  gmapsLink: string;
  address: string;
}

export interface RulePayload {
  description: string;
}

export interface FacilityPayload {
  name: string;
}

class MasterDataService {
  // Venue Management
  async getVenues(search?: string, page?: number, limit?: number): Promise<{
    data: Venue[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    const response = await apiClient.get(`/api/v1/venues?${queryParams}`);
    return response;
  }

  async createVenue(data: VenuePayload): Promise<Venue> {
    const response = await apiClient.post("/api/v1/venues", data);
    return response.data;
  }

  async updateVenue(id: string, data: VenuePayload): Promise<Venue> {
    const response = await apiClient.put(`/api/v1/venues/${id}`, data);
    return response.data;
  }

  async deleteVenue(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/venues/${id}`);
  }

  // Rules Management
  async getRules(search?: string, page?: number, limit?: number): Promise<{
    data: Rule[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    const response = await apiClient.get(`/api/v1/rules?${queryParams}`);
    return response;
  }

  async createRule(data: RulePayload): Promise<Rule> {
    const response = await apiClient.post("/api/v1/rules", data);
    return response.data;
  }

  async updateRule(id: string, data: RulePayload): Promise<Rule> {
    const response = await apiClient.put(`/api/v1/rules/${id}`, data);
    return response.data;
  }

  async deleteRule(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/rules/${id}`);
  }

  // Facilities Management
  async getFacilities(search?: string, page?: number, limit?: number): Promise<{
    data: Facility[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    const response = await apiClient.get(`/api/v1/facilities?${queryParams}`);
    return response;
  }

  async createFacility(data: FacilityPayload): Promise<Facility> {
    const response = await apiClient.post("/api/v1/facilities", data);
    return response.data;
  }

  async updateFacility(id: string, data: FacilityPayload): Promise<Facility> {
    const response = await apiClient.put(`/api/v1/facilities/${id}`, data);
    return response.data;
  }

  async deleteFacility(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/facilities/${id}`);
  }
}

export const masterDataService = new MasterDataService();