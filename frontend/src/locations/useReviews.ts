import { useCallback, useEffect, useState } from "react";
import {
  getLocationReviews,
  type ReviewResponse,
} from "../api/reviews/reviews";

export const useReviews = (locationId: string) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      setStatus("loading");
      setMessage("");
      const response = await getLocationReviews(locationId);
      setReviews(response);
      setStatus("success");
    } catch (error) {
      console.error("Error loading reviews:", error);
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Could not load reviews.",
      );
    }
  }, [locationId]);

  useEffect(() => {
    let shouldIgnore = false;

    getLocationReviews(locationId)
      .then((response) => {
        if (shouldIgnore) {
          return;
        }

        setReviews(response);
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (shouldIgnore) {
          return;
        }

        console.error("Error loading reviews:", error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Could not load reviews.",
        );
      });

    return () => {
      shouldIgnore = true;
    };
  }, [locationId]);

  return {
    loadReviews,
    message,
    reviews,
    setMessage,
    status,
  };
};
