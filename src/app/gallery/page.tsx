"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Filter,
  Search,
  MapPin,
  Clock,
  ExternalLink,
  FolderOpen,
  Image as ImageIcon,
  RefreshCw,
  Grid3X3,
  List,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GallerySession, GalleryCategory } from "@/types/gallery";
import { galleryService } from "@/utils/gallery";
import { useNotifications } from "@/components/organisms/NotificationContainer";
import SearchBar from "@/components/atoms/SearchBar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import Pagination from "@/components/atoms/Pagination";
import Navbar from "@/components/organisms/Navbar";

// Mock data for gallery sessions
const mockGallerySessions: GallerySession[] = [
  {
    id: "1",
    sessionName: "Fun Game Weekday - January 15",
    date: "2025-01-15",
    time: "19:00",
    driveLink: "https://drive.google.com/drive/folders/1abc123def456",
    venue: "Lapangan Futsal Central",
    category: "Fun Game",
    photoCount: 45,
    createdAt: "2025-01-15T19:00:00Z",
  },
  {
    id: "2",
    sessionName: "Weekend Tournament - Semi Final",
    date: "2025-01-14",
    time: "20:00",
    driveLink: "https://drive.google.com/drive/folders/2def456ghi789",
    venue: "GOR Senayan Mini Soccer",
    category: "Tournament",
    photoCount: 67,
    createdAt: "2025-01-14T20:00:00Z",
  },
  {
    id: "3",
    sessionName: "Mix Game Friday Night",
    date: "2025-01-13",
    time: "18:30",
    driveLink: "https://drive.google.com/drive/folders/3ghi789jkl012",
    venue: "Lapangan Futsal Central",
    category: "Mix Game",
    photoCount: 32,
    createdAt: "2025-01-13T18:30:00Z",
  },
  {
    id: "4",
    sessionName: "Championship Final",
    date: "2025-01-12",
    time: "19:30",
    driveLink: "https://drive.google.com/drive/folders/4jkl012mno345",
    venue: "GOR Senayan Mini Soccer",
    category: "Championship",
    photoCount: 89,
    createdAt: "2025-01-12T19:30:00Z",
  },
  {
    id: "5",
    sessionName: "Open Game Wednesday",
    date: "2025-01-11",
    time: "20:30",
    driveLink: "https://drive.google.com/drive/folders/5mno345pqr678",
    venue: "Lapangan Futsal Central",
    category: "Open Game",
    photoCount: 28,
    createdAt: "2025-01-11T20:30:00Z",
  },
  {
    id: "6",
    sessionName: "Training Session - Youth",
    date: "2025-01-10",
    time: "17:00",
    driveLink: "https://drive.google.com/drive/folders/6pqr678stu901",
    venue: "Mini Soccer Plaza",
    category: "Training",
    photoCount: 15,
    createdAt: "2025-01-10T17:00:00Z",
  },
];

// Skeleton Loading Components
function SessionSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-9 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

function SkeletonLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="h-10 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-80 mx-auto animate-pulse"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card className="mb-8 animate-pulse">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              <div className="flex gap-4">
                <div className="w-40 h-10 bg-gray-200 rounded"></div>
                <div className="w-32 h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List Skeleton */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <SessionSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<GallerySession[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<GallerySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchQuery, selectedCategory, selectedVenue]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - in real implementation, fetch from gallery service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock categories
      const mockCategories: GalleryCategory[] = [
        { id: "1", name: "Fun Game", photoCount: 120 },
        { id: "2", name: "Tournament", photoCount: 89 },
        { id: "3", name: "Mix Game", photoCount: 67 },
        { id: "4", name: "Championship", photoCount: 45 },
        { id: "5", name: "Training", photoCount: 23 },
        { id: "6", name: "Open Game", photoCount: 34 },
      ];

      setSessions(mockGallerySessions);
      setCategories(mockCategories);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      showError("Failed to load gallery", "Please try refreshing the page");
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (session) =>
          session.sessionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (session) => session.category === selectedCategory
      );
    }

    // Venue filter
    if (selectedVenue !== "all") {
      filtered = filtered.filter((session) => session.venue === selectedVenue);
    }

    setFilteredSessions(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    showSuccess("Gallery refreshed successfully");
  };

  const handleOpenDriveLink = (driveLink: string, sessionName: string) => {
    window.open(driveLink, "_blank");
    showSuccess(`Opening photos for ${sessionName}`);
  };

  // Get unique venues for filter
  const venues = ["all", ...new Set(sessions.map((session) => session.venue))];

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredSessions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Stats
  const stats = {
    totalSessions: sessions.length,
    categories: categories.length,
    venues: new Set(sessions.map((s) => s.venue)).size,
    totalPhotos: sessions.reduce((sum, s) => sum + s.photoCount, 0),
  };

  if (loading) {
    return <SkeletonLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm border border-blue-100 p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
            Photo Gallery Sessions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Browse through our football community photo sessions. Access complete photo collections from each game and event.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Sessions
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalSessions}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Categories
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.categories}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Grid3X3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Venues</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.venues}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Photos
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalPhotos}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  placeholder="Search sessions by name, venue, or category..."
                  onSearch={handleSearch}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Venues</option>
                  {venues.slice(1).map((venue) => (
                    <option key={venue} value={venue}>
                      {venue}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedVenue !== "all") && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mr-2">Active filters:</p>
                {searchQuery && (
                  <Badge
                    variant="default"
                    className="bg-blue-100 text-blue-800"
                  >
                    Search: {searchQuery}
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge
                    variant="default"
                    className="bg-blue-100 text-blue-800"
                  >
                    Category: {selectedCategory}
                  </Badge>
                )}
                {selectedVenue !== "all" && (
                  <Badge
                    variant="default"
                    className="bg-blue-100 text-blue-800"
                  >
                    Venue: {selectedVenue}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-slate-600 bg-white/60 backdrop-blur-sm border border-blue-100 p-3 rounded-lg">
            Showing {paginatedSessions.length} of {filteredSessions.length} photo sessions
          </p>
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No photo sessions found
              </h3>
              <p className="text-gray-600">
                {searchQuery ||
                selectedCategory !== "all" ||
                selectedVenue !== "all"
                  ? "Try adjusting your search criteria"
                  : "No photo sessions available at the moment"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paginatedSessions.map((session) => (
              <Card
                key={session.id}
                className="hover:shadow-lg transition-all duration-200 border border-blue-100 hover:border-blue-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Session Icon */}
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                        <FolderOpen className="w-6 h-6 text-white" />
                      </div>

                      {/* Session Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                          {session.sessionName}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>{new Date(session.date).toLocaleDateString("id-ID")}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span>{session.time} WIB</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-purple-500" />
                            <span className="truncate">{session.venue}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <ImageIcon className="w-4 h-4 text-orange-500" />
                            <span>{session.photoCount} photos</span>
                          </div>
                        </div>

                        <div className="mt-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {session.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center space-x-3 ml-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm text-gray-500">
                          {session.photoCount} photos
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(session.createdAt).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                      
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenDriveLink(session.driveLink, session.sessionName)}
                        className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">View Photos</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 border-gray-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help Accessing Photos?
              </h3>
              <p className="text-gray-600 mb-4">
                Click "View Photos" to open the Google Drive folder containing all photos from that session.
                You may need to request access if the folder is private.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="text-sm text-gray-500">
                  📞 Support: +62 21 1234 5678
                </div>
                <div className="text-sm text-gray-500">
                  📧 Email: support@blaxfootball.com
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}