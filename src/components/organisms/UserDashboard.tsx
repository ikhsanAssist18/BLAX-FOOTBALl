import React, { useState, useEffect } from "react";
import {
  User,
  Trophy,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  Loader2,
  Star,
  TrendingUp,
} from "lucide-react";
import Button from "../atoms/Button";
import PolicySubmissionForm, {
  PolicySubmissionData,
} from "./PolicySubmissionForm";
import { User as UserType } from "@/types/auth";
import { Policy } from "@/types/policy";
import { policyService } from "@/utils/policies";
import { leaderboardService } from "@/utils/leaderboard";
import { useNotifications } from "./NotificationContainer";
import Badge from "../atoms/Badge";
import { policyAnalysisService } from "@/utils/policyAnalysis";

interface UserDashboardProps {
  user: UserType;
  className?: string;
}

export default function UserDashboard({
  user,
  className = "",
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "submit">("overview");
  const [userPolicies, setUserPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRank, setUserRank] = useState<{ rank: number; total: number } | null>(null);
  const [badgeProgress, setBadgeProgress] = useState<any>(null);
  
  const { showSuccess, showError } = useNotifications();

  // Fetch user policies on component mount
  useEffect(() => {
    fetchUserPolicies();
    fetchUserStats();
  }, []);

  const fetchUserPolicies = async () => {
    try {
      setIsLoading(true);
      const result = await policyService.getUserPolicies();
      setUserPolicies(result.policies);
    } catch (error) {
      console.error("Error fetching user policies:", error);
      showError("Failed to load policies", "Please try refreshing the page");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const [rankResult, badgeResult] = await Promise.all([
        leaderboardService.getUserRank(user.id),
        leaderboardService.getUserBadgeProgress(user.id)
      ]);
      
      setUserRank(rankResult);
      setBadgeProgress(badgeResult);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handlePolicySubmission = async (data: PolicySubmissionData) => {
    try {
      setIsSubmitting(true);

      const response = await policyService.submitPolicy({
        app_name: data.appName,
        developer: data.developer || undefined,
        policy_url: data.policyUrl || undefined,
        raw_text: data.policyText,
      });

      if (response.success) {
        showSuccess(
          "Policy Submitted!",
          response.message || "Your policy has been submitted for review"
        );
        // Refresh the user policies list
        await fetchUserPolicies();
        // Refresh user stats
        await fetchUserStats();
        // Switch to overview tab to show the new submission
        setTimeout(() => {
          setActiveTab("overview");
        }, 2000);
      } else {
        showError(
          "Submission Failed",
          response.error || "Failed to submit policy. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting policy:", error);
      showError(
        "Unexpected Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats from user policies
  const verified = userPolicies.filter((policy) => policy.is_verified);
  const stats = {
    submissions: userPolicies.length,
    verified: verified.length,
    points: verified.length * 10, // 10 points per verified policy
    rank: userRank?.rank || "N/A",
    badge: badgeProgress?.currentBadge || "bronze",
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "submit", label: "Submit Policy", icon: Plus },
  ];

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                {user.name}
              </h1>
              <p className="text-gray-600 truncate">{user.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={stats.badge as any} className="text-xs">
                  {stats.badge.charAt(0).toUpperCase() + stats.badge.slice(1)}
                </Badge>
                {userRank && (
                  <span className="text-xs text-gray-500">
                    Rank #{userRank.rank} of {userRank.total}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Member since{" "}
                {new Date(user.created_at || "").toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xl md:text-2xl font-bold text-blue-600">#{stats.rank}</div>
            <div className="text-sm text-gray-500">Privacy Advocate</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 md:mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 md:space-x-8 px-4 md:px-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "submit")}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 md:p-8">
          {activeTab === "overview" && (
            <div className="space-y-6 md:space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 mb-1">Submissions</p>
                      <p className="text-2xl md:text-3xl font-bold text-blue-900">
                        {stats.submissions}
                      </p>
                    </div>
                    <FileText className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 md:p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 mb-1">Verified</p>
                      <p className="text-2xl md:text-3xl font-bold text-green-900">
                        {stats.verified}
                      </p>
                    </div>
                    <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600 flex-shrink-0" />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 md:p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 mb-1">Points</p>
                      <p className="text-2xl md:text-3xl font-bold text-purple-900">
                        {stats.points}
                      </p>
                    </div>
                    <Trophy className="h-6 w-6 md:h-8 md:w-8 text-purple-600 flex-shrink-0" />
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 md:p-6 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 mb-1">Global Rank</p>
                      <p className="text-xl md:text-2xl font-bold text-orange-900">
                        {stats.rank}
                      </p>
                    </div>
                    <Trophy className="h-6 w-6 md:h-8 md:w-8 text-orange-600 flex-shrink-0" />
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-4 md:p-6 border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-600 mb-1">Badge</p>
                      <p className="text-lg md:text-xl font-bold text-indigo-900 capitalize">
                        {stats.badge}
                      </p>
                    </div>
                    <Star className="h-6 w-6 md:h-8 md:w-8 text-indigo-600 flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* Badge Progress */}
              {badgeProgress && badgeProgress.nextBadge && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Badge Progress</h3>
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Progress to {badgeProgress.nextBadge} badge
                      </span>
                      <span className="text-sm font-medium text-purple-600">
                        {Math.round(badgeProgress.progress)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(badgeProgress.progress, 100)}%` }}
                      ></div>
                    </div>
                    
                    {badgeProgress.requirements && (
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Requirements for {badgeProgress.nextBadge}:</p>
                        <p>• {badgeProgress.requirements.min_contributions} contributions</p>
                        <p>• {badgeProgress.requirements.min_verified} verified policies</p>
                        <p>• {badgeProgress.requirements.min_accuracy}% accuracy rate</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                  Recent Submissions
                </h2>

                {isLoading ? (
                  <div className="bg-gray-50 rounded-xl p-6 md:p-8 text-center">
                    <Loader2 className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">Loading your submissions...</p>
                  </div>
                ) : userPolicies.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-6 md:p-8 text-center">
                    <Clock className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                      No Submissions Yet
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                      Start contributing by submitting your first privacy policy
                      for analysis.
                    </p>
                    <Button
                      onClick={() => setActiveTab("submit")}
                      className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
                    >
                      Submit Your First Policy
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPolicies.slice(0, 5).map((policy) => (
                      <div
                        key={policy.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 md:p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {policy.app_name}
                            </h4>
                            {policy.developer && (
                              <p className="text-sm text-gray-600 truncate">
                                by {policy.developer}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Submitted{" "}
                              {new Date(policy.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                policy.is_verified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {policy.is_verified
                                ? "Verified"
                                : "Pending Review"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "submit" && (
            <div>
              <PolicySubmissionForm
                onSubmit={handlePolicySubmission}
                isLoading={isSubmitting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}