import { apiClient } from "./api";

// Types for master data entities
export interface Venue {
  id: string;
  name: string;
  gmapLink: string;
  address: string;
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
  gmapLink: string;
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
  async getVenues(search?: string): Promise<Venue[]> {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("name", search);

    const response = await apiClient.get(
      `/api/v1/venues/venue-data?${queryParams}`
    );
    return response.data;
  }

  async createVenue(data: VenuePayload): Promise<Venue> {
    const response = await apiClient.post("/api/v1/venues/add-venue", data);
    return response.data;
  }

  async updateVenue(id: string, data: VenuePayload): Promise<Venue> {
    const response = await apiClient.put(
      `/api/v1/venues/update-venue/${id}`,
      data
    );
    return response.data;
  }

  async deleteVenue(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/venues/delete-venue/${id}`);
  }

  // Rules Management
  async getRules(
    search?: string,
    page?: number,
    limit?: number
  ): Promise<Rule[]> {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("desc", search);

    const response = await apiClient.get(
      `/api/v1/rules/rules-data?${queryParams}`
    );
    return response.data;
  }

  async createRule(data: RulePayload): Promise<Rule> {
    const response = await apiClient.post("/api/v1/rules/add-rules", data);
    return response.data;
  }

  async updateRule(id: string, data: RulePayload): Promise<Rule> {
    const response = await apiClient.put(
      `/api/v1/rules/update-rule/${id}`,
      data
    );
    return response.data;
  }

  async deleteRule(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/rules/delete-rule/${id}`);
  }

  // Facilities Management
  async getFacilities(
    search?: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: Facility[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    const response = await apiClient.get(
      `/api/v1/facilities/facilities-data?${queryParams}`
    );
    return response;
  }

  async createFacility(data: FacilityPayload): Promise<Facility> {
    const response = await apiClient.post(
      "/api/v1/facilities/add-facility",
      data
    );
    return response.data;
  }

  async updateFacility(id: string, data: FacilityPayload): Promise<Facility> {
    const response = await apiClient.put(
      `/api/v1/facilities/update-facility/${id}`,
      data
    );
    return response.data;
  }

  async deleteFacility(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/facilities/delete-facility/${id}`);
  }
}

export const masterDataService = new MasterDataService();
