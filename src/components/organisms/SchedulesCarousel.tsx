"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Shield,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  Clock,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";
import { Schedule } from "@/types/schedule";
import { scheduleService } from "@/utils/schedule";
import { useNotifications } from "./NotificationContainer";
import { formatCurrency } from "@/lib/helper";
import { formatDate } from "@/utils/helpers";
import BookModal from "../molecules/BookModal";

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-200 h-full animate-pulse">
    <div className="flex flex-col h-full">
      {/* Image Section Skeleton */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <div className="absolute top-4 right-4">
          <div className="bg-gray-300 rounded-full px-3 py-1 w-16 h-6"></div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-gray-300/80 backdrop-blur-sm border border-gray-300/20 p-3 rounded-2xl">
            <div className="bg-gray-400 h-6 w-20 rounded mb-1"></div>
            <div className="bg-gray-400 h-3 w-16 rounded mb-2"></div>
            <div className="bg-gray-400 h-6 w-20 rounded mb-1"></div>
            <div className="bg-gray-400 h-3 w-12 rounded"></div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-xl mr-3"></div>
            <div>
              <div className="bg-gray-300 h-5 w-32 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-24 rounded"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="space-y-2 mb-4">
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
            <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
          </div>

          {/* Match Details Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center">
              <div className="bg-gray-200 h-4 w-4 rounded mr-2"></div>
              <div className="bg-gray-200 h-4 w-40 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-200 h-4 w-4 rounded mr-2"></div>
              <div className="bg-gray-200 h-4 w-36 rounded"></div>
            </div>
          </div>

          {/* Facilities Skeleton */}
          <div className="flex flex-wrap gap-1 mb-4">
            <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
            <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
            <div className="bg-gray-200 h-6 w-14 rounded-full"></div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-300 h-2 rounded-full w-3/5"></div>
            </div>
            <div className="bg-gray-200 h-3 w-16 rounded mt-1"></div>
          </div>

          {/* Footer Skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 space-x-2">
            <div className="bg-gray-200 h-9 flex-1 rounded"></div>
            <div className="bg-gray-300 h-9 flex-1 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton Loading State Component
const SkeletonLoading = () => (
  <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-xl mr-3">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Jadwal Pertandingan
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Pilih jadwal fun game terbaik mu pekan ini!
        </p>
      </div>

      {/* Skeleton Cards */}
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Skeleton Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Skeleton CTA */}
      <div className="flex justify-center mt-12">
        <div className="bg-gray-200 h-12 w-48 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </section>
);

export default function SchedulesCarousel() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { showSuccess, showError } = useNotifications();
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  // Move matchesData inside useEffect or create it as a useMemo
  const matchesData = schedules.map((schedule) => ({
    id: schedule.id.toString(),
    name: schedule.name,
    date: schedule.date,
    time: schedule.time,
    venue: schedule.venue,
    openSlots: schedule.openSlots,
    bookedSlots: schedule.bookedSlots,
    totalSlots: schedule.totalSlots,
    feePlayer: Number(schedule.feePlayer),
    feeGk: Number(schedule.feeGk),
    type: schedule.typeEvent,
    typeMatch: schedule.typeMatch,
    facilities: schedule.facilities,
    description: `Pertandingan ${schedule.typeMatch.toLowerCase()} untuk semua level pemain`,
    image: schedule.imageUrl,
  }));

  const itemsPerPage = 2;
  const totalSlides = Math.ceil(matchesData.length / itemsPerPage);

  // Group matches into pairs for carousel slides
  const groupedMatches = [];
  for (let i = 0; i < matchesData.length; i += itemsPerPage) {
    groupedMatches.push(matchesData.slice(i, i + itemsPerPage));
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || totalSlides === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? totalSlides - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === totalSlides - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const result = await scheduleService.getSchedules();
      if (result) setSchedules(result);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      showError("Failed to load schedules", "Please try refreshing the page");
    } finally {
      setIsLoading(false);
    }
  };

  // Show skeleton loading state while fetching data
  if (isLoading) {
    return <SkeletonLoading />;
  }

  const handleDetailClick = (matchId: string) => {
    router.push(`/schedule/${matchId}`);
  };

  const handleBooking = (schedule: any) => {
    setIsBookModalOpen(true);
    setSelectedSchedule(schedule);
  };

  // Show message if no schedules available
  if (!isLoading && schedules.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No schedules available
            </h3>
            <p className="text-gray-600">
              Check back later for upcoming matches!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-xl mr-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Jadwal Pertandingan
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pilih jadwal fun game terbaik mu pekan ini!
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-7xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {groupedMatches.map((matchPair, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
                      {matchPair.map((match) => (
                        <div
                          key={match.id}
                          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-200 h-full"
                        >
                          <div className="flex flex-col h-full">
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={match.image}
                                alt={`${match.type} match`}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                              <div className="absolute top-4 right-4">
                                <Badge
                                  variant="default"
                                  className="flex items-center bg-white/90 text-green-700"
                                >
                                  <Users className="h-3 w-3 mr-1" />
                                  {match.openSlots}/{match.totalSlots}
                                </Badge>
                              </div>
                              <div className="absolute bottom-4 left-4 text-white bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl">
                                <div className="text-2xl font-bold">
                                  {formatCurrency(match.feePlayer)}
                                </div>
                                <div className="text-sm opacity-90">
                                  Player Fee
                                </div>
                                <div className="text-2xl font-bold">
                                  {formatCurrency(match.feeGk)}
                                </div>
                                <div className="text-sm opacity-90">GK Fee</div>
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6 flex-1 flex flex-col">
                              {/* Header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                                      {match.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-1">
                                      {match.type} • {match.typeMatch}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 flex flex-col">
                                <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3 flex-1">
                                  {match.description}
                                </p>

                                {/* Match Details */}
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="h-4 w-4 mr-2 text-green-500" />
                                    {formatDate(match.date)} • {match.time}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2 text-green-500" />
                                    {match.venue}
                                  </div>
                                </div>

                                {/* Facilities */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {match.facilities
                                    .slice(0, 3)
                                    .map((facility, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200"
                                      >
                                        {facility.name}
                                      </span>
                                    ))}
                                  {match.facilities.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs border border-gray-200">
                                      +{match.facilities.length - 3} more
                                    </span>
                                  )}
                                </div>
                                {/* Progress Bar */}
                                <div className="mt-4">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${
                                          (Number(match.bookedSlots) /
                                            Number(match.totalSlots)) *
                                          100
                                        }%`,
                                      }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {Math.round(
                                      (Number(match.bookedSlots) /
                                        Number(match.totalSlots)) *
                                        100
                                    )}
                                    % terisi
                                  </p>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDetailClick(match.id)}
                                    className="flex-1 hover:bg-sky-50 hover:border-sky-300"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Detail
                                  </Button>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleBooking(match)}
                                    disabled={Number(match.openSlots) === 0}
                                    className="flex-1 shadow-md hover:shadow-lg"
                                  >
                                    {Number(match.openSlots) === 0
                                      ? "Penuh"
                                      : "Book Now"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* If odd number of matches in last slide, add placeholder */}
                      {matchPair.length === 1 && (
                        <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">
                              Jadwal lainnya segera hadir
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {totalSlides > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalSlides }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? "bg-green-500 scale-125"
                        : "bg-green-200 hover:bg-green-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="flex justify-center mt-12 space-x-6">
            <Button
              variant="primary"
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-500 hover:to-teal-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => router.push("/schedule")}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Lihat Semua Jadwal
            </Button>
          </div>
        </div>
      </section>

      {/* Book Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
        scheduleId={selectedSchedule?.id || null}
      />
    </>
  );
}
