"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/atoms/LoadingScreen";

export default function GlobalLoadingScreen() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAdminPage = pathname?.startsWith("/admin");
    const hasRscParam = searchParams?.has("_rsc");

    if (isAdminPage && hasRscParam) {
      setIsLoading(true);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return <LoadingScreen message="Loading content..." />;
}
