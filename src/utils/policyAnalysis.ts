import { apiClient } from "./api";

export interface PolicyAnalysis {
  risk_score: number;
  data_collected: string[];
  retention: string;
  sharing_practices: string[];
  user_rights: string[];
  summary: string;
  compliance_flags: {
    gdpr_compliant: boolean;
    ccpa_compliant: boolean;
    coppa_compliant: boolean;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number;
}

export interface PDFExtractionResult {
  extracted_text: string;
  file_name: string;
  file_size: number;
  extraction_date: string;
}

class PolicyAnalysisService {
  // Validate policy data
  async validatePolicy(data: {
    app_name: string;
    developer?: string;
    policy_text: string;
  }): Promise<{
    success: boolean;
    data?: ValidationResult;
    error?: string;
  }> {
    try {
      const result = await apiClient.post("/policies/validate", data);
      return result;
    } catch (error) {
      console.error("Error validating policy:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to validate policy",
      };
    }
  }

  // Extract text from PDF
  async extractPDFText(file: File): Promise<{
    success: boolean;
    data?: PDFExtractionResult;
    error?: string;
    message?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Ambil session
      const session = await import("./auth").then((m) =>
        m.AuthService.getSession()
      );

      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      // Panggil endpoint
      const response = await fetch("/api/policies/extract-pdf", {
        method: "POST",
        headers,
        body: formData,
      });

      const result: unknown = await response.json();

      if (!response.ok) {
        const errMsg =
          (result as { error?: string }).error || "PDF extraction failed";
        throw new Error(errMsg);
      }

      return {
        success: true,
        data: (result as { data: PDFExtractionResult }).data,
        message: "PDF extracted successfully",
      };
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to extract PDF text",
        message: "Extraction failed",
      };
    }
  }

  // Get risk level from score
  getRiskLevel(score: number): "safe" | "moderate" | "high" {
    if (score <= 4) return "safe";
    if (score <= 7) return "moderate";
    return "high";
  }

  // Get risk color classes
  getRiskColorClasses(riskLevel: string): string {
    switch (riskLevel) {
      case "safe":
        return "text-green-600 bg-green-50 border-green-200";
      case "moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  }
}

export const policyAnalysisService = new PolicyAnalysisService();
