"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "../atoms/Card";

// Generic Loading Skeleton Components
export const StatCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
      <div className="h-3 md:h-4 bg-gray-200 rounded w-16 md:w-20"></div>
      <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded"></div>
    </CardHeader>
    <CardContent className="p-3 md:p-6 pt-0">
      <div className="h-6 md:h-8 bg-gray-200 rounded w-12 md:w-16 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-20 md:w-24 hidden md:block"></div>
    </CardContent>
  </Card>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-4">
    {[...Array(rows)].map((_, i) => (
      <div
        key={i}
        className="flex items-center space-x-2 md:space-x-4 p-3 md:p-4 border rounded-lg animate-pulse"
      >
        <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 md:h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-2 md:h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="w-12 md:w-20 h-4 md:h-6 bg-gray-200 rounded"></div>
        <div className="w-16 md:w-24 h-4 md:h-6 bg-gray-200 rounded"></div>
        <div className="w-12 md:w-16 h-4 md:h-6 bg-gray-200 rounded"></div>
        <div className="flex space-x-1 md:space-x-2">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded"></div>
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export const CardGridSkeleton = ({ 
  cols = 3, 
  rows = 2 
}: { 
  cols?: number; 
  rows?: number; 
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-3 md:gap-6`}>
    {[...Array(cols * rows)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <div className="relative overflow-hidden h-32 md:h-48 w-full bg-gray-200"></div>
        <CardContent className="p-3 md:p-6">
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-12 md:w-16 h-3 md:h-4 bg-gray-200 rounded-full"></div>
              <div className="w-16 md:w-20 h-3 md:h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 md:h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-1 md:space-y-2">
              <div className="h-3 md:h-4 bg-gray-200 rounded"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex justify-between items-center pt-2 md:pt-4">
              <div className="w-16 md:w-24 h-3 md:h-4 bg-gray-200 rounded"></div>
              <div className="flex space-x-1 md:space-x-2">
                <div className="w-12 md:w-16 h-6 md:h-8 bg-gray-200 rounded"></div>
                <div className="w-12 md:w-16 h-6 md:h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const FormSkeleton = () => (
  <div className="space-y-4 md:space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <div className="space-y-2">
        <div className="h-3 md:h-4 bg-gray-200 rounded w-16 md:w-20"></div>
        <div className="h-8 md:h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 md:h-4 bg-gray-200 rounded w-16 md:w-20"></div>
        <div className="h-8 md:h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 md:h-4 bg-gray-200 rounded w-20 md:w-24"></div>
      <div className="h-20 md:h-24 bg-gray-200 rounded"></div>
    </div>
    <div className="flex justify-end space-x-2 md:space-x-3">
      <div className="w-16 md:w-20 h-8 md:h-10 bg-gray-200 rounded"></div>
      <div className="w-20 md:w-24 h-8 md:h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const FilterSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-3 md:p-6">
      <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
        <div className="flex-1 h-8 md:h-10 bg-gray-200 rounded"></div>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
          <div className="w-full sm:w-24 md:w-32 h-8 md:h-10 bg-gray-200 rounded"></div>
          <div className="w-full sm:w-20 md:w-24 h-8 md:h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const HeaderSkeleton = () => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
    <div className="space-y-2">
      <div className="h-6 md:h-8 bg-gray-200 rounded w-32 md:w-48 animate-pulse"></div>
      <div className="h-3 md:h-4 bg-gray-200 rounded w-40 md:w-64 animate-pulse"></div>
    </div>
    <div className="flex space-x-2">
      <div className="h-8 md:h-10 w-16 md:w-24 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-8 md:h-10 w-20 md:w-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

// Comprehensive Loading Screen for entire tabs
export const TabLoadingSkeleton = ({ 
  type = "default" 
}: { 
  type?: "default" | "overview" | "table" | "cards" | "form" 
}) => {
  switch (type) {
    case "overview":
      return (
        <div className="space-y-4 md:space-y-6">
          <HeaderSkeleton />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card className="animate-pulse">
              <CardHeader className="p-3 md:p-6">
                <div className="h-4 md:h-6 bg-gray-200 rounded w-24 md:w-32"></div>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="h-48 md:h-64 bg-gray-200 rounded-lg"></div>
              </CardContent>
            </Card>
            <Card className="animate-pulse">
              <CardHeader className="p-3 md:p-6">
                <div className="h-4 md:h-6 bg-gray-200 rounded w-28 md:w-40"></div>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-3 md:space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-1 md:space-y-2">
                        <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 md:h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-12 md:w-16 h-4 md:h-6 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );

    case "table":
      return (
        <div className="space-y-4 md:space-y-6">
          <HeaderSkeleton />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <FilterSkeleton />
          <Card className="animate-pulse">
            <CardContent className="p-0">
              <TableSkeleton rows={8} />
            </CardContent>
          </Card>
        </div>
      );

    case "cards":
      return (
        <div className="space-y-4 md:space-y-6">
          <HeaderSkeleton />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <FilterSkeleton />
          <CardGridSkeleton cols={4} rows={3} />
        </div>
      );

    case "form":
      return (
        <div className="space-y-4 md:space-y-6">
          <HeaderSkeleton />
          <Card className="animate-pulse">
            <CardContent className="p-3 md:p-6">
              <FormSkeleton />
            </CardContent>
          </Card>
        </div>
      );

    default:
      return (
        <div className="space-y-4 md:space-y-6">
          <HeaderSkeleton />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <FilterSkeleton />
          <div className="space-y-3 md:space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-16 md:h-20 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      );
  }
};

// Specific loading components for different sections
export const OverviewLoadingSkeleton = () => (
  <TabLoadingSkeleton type="overview" />
);

export const TableLoadingSkeleton = () => (
  <TabLoadingSkeleton type="table" />
);

export const CardsLoadingSkeleton = () => (
  <TabLoadingSkeleton type="cards" />
);

export const FormLoadingSkeleton = () => (
  <TabLoadingSkeleton type="form" />
);