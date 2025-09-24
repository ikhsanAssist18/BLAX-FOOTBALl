"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  Filter,
  Search,
  MapPin,
  Calendar,
  Eye,
  Share2,
  Download,
  Grid3X3,
  List,
  Heart,
  ExternalLink,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GalleryPhoto, GalleryCategory } from "@/types/gallery";
import { galleryService } from "@/utils/gallery";
import { useNotifications } from "@/components/organisms/NotificationContainer";
import SearchBar from "@/components/atoms/SearchBar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import Pagination from "@/components/atoms/Pagination";

// Skeleton Loading Components
function PhotoSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex space-x-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function SkeletonLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Photos Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <PhotoSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [photos, searchQuery, selectedCategory, selectedVenue]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [photosResult, categoriesResult] = await Promise.all([
        galleryService.getPublicPhotos(),
        galleryService.getCategories(),
      ]);

      if (photosResult) {
        setPhotos(photosResult.data);
      }
      if (categoriesResult) {
        setCategories(categoriesResult);
      }
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      showError("Failed to load gallery", "Please try refreshing the page");
    } finally {
      setLoading(false);
    }
  };

  const filterPhotos = () => {
    let filtered = photos;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (photo) =>
          photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          photo.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          photo.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          photo.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (photo) => photo.category === selectedCategory
      );
    }

    // Venue filter
    if (selectedVenue !== "all") {
      filtered = filtered.filter((photo) => photo.venue === selectedVenue);
    }

    setFilteredPhotos(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleShare = (photo: GalleryPhoto) => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess("Link copied to clipboard");
    }
  };

  const handlePhotoClick = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  // Get unique venues for filter
  const venues = ["all", ...new Set(photos.map((photo) => photo.venue))];

  // Pagination
  const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPhotos = filteredPhotos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Stats
  const stats = {
    totalPhotos: photos.length,
    categories: categories.length,
    venues: new Set(photos.map((p) => p.venue)).size,
    thisMonth: photos.filter(
      (p) => new Date(p.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
  };

  if (loading) {
    return <SkeletonLoading />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8 bg-white/80 backdrop-blur-sm border border-blue-100 p-8 rounded-2xl shadow-lg">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
              Gameplay Gallery
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore exciting moments from our football community. See the
              action, passion, and camaraderie that makes our games special.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Camera className="w-6 h-6 text-blue-600" />
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
                      This Month
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.thisMonth}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-600" />
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
                    placeholder="Search photos by title, venue, or tags..."
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

                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        viewMode === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        viewMode === "list"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
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
              Showing {paginatedPhotos.length} of {filteredPhotos.length} photos
            </p>
          </div>

          {/* Photos Grid/List */}
          {filteredPhotos.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No photos found
                </h3>
                <p className="text-gray-600">
                  {searchQuery ||
                  selectedCategory !== "all" ||
                  selectedVenue !== "all"
                    ? "Try adjusting your search criteria"
                    : "No photos available at the moment"}
                </p>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                  onClick={() => handlePhotoClick(photo)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={photo.thumbnailUrl || photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(photo);
                        }}
                        className="bg-white/90 hover:bg-white text-gray-700"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-black/70 text-white border-0">
                        {photo.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {photo.title}
                    </h3>
                    {photo.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {photo.venue}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(photo.date).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                    {photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {photo.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {photo.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                            +{photo.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedPhotos.map((photo) => (
                <Card
                  key={photo.id}
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  // onClick={() => handlePhotoClick(photo)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={photo.thumbnailUrl || photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {photo.title}
                          </h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            {photo.category}
                          </Badge>
                        </div>
                        {photo.description && (
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {photo.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {photo.venue}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(photo.date).toLocaleDateString("id-ID")}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(photo);
                            }}
                            className="hover:bg-blue-50 text-blue-600"
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
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
        </div>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="relative">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedPhoto.title}
                  </h2>
                  <Badge className="bg-blue-100 text-blue-800">
                    {selectedPhoto.category}
                  </Badge>
                </div>
                {selectedPhoto.description && (
                  <p className="text-gray-600 mb-4">
                    {selectedPhoto.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedPhoto.venue}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(selectedPhoto.date).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(selectedPhoto)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        window.open(selectedPhoto.imageUrl, "_blank")
                      }
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Full
                    </Button>
                  </div>
                </div>
                {selectedPhoto.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                    {selectedPhoto.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
