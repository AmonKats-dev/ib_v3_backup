import { useState, useEffect } from "react";
import { useDataProvider } from "react-admin";

export function usePendingProjectsCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const dataProvider = useDataProvider();

  useEffect(() => {
    let isMounted = true;
    let isInitialLoad = true;

    const fetchCount = async () => {
      try {
        // Only set loading state on initial load to prevent app-wide re-renders
        if (isInitialLoad) {
          setLoading(true);
        }
        const response = await dataProvider.getList("projects", {
          filter: { action: "PENDING", is_deleted: false },
          pagination: { page: 1, perPage: 1 },
          sort: { field: "id", order: "DESC" },
        }).catch((error) => {
          console.error("Error fetching pending projects count:", error);
          return { data: [], total: 0 };
        });

        if (isMounted && response?.total !== undefined) {
          setCount(response.total);
        }
      } catch (error) {
        console.error("Failed to fetch pending projects count:", error);
        if (isMounted) {
          setCount(0);
        }
      } finally {
        if (isMounted && isInitialLoad) {
          setLoading(false);
          isInitialLoad = false;
        }
      }
    };

    fetchCount();

    // Refresh count every 30 seconds (silently, without triggering loading state)
    const interval = setInterval(fetchCount, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [dataProvider]);

  return { count, loading };
}

