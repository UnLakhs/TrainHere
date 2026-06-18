import { useCallback, useEffect, useMemo, useState } from "react";
import { hasAuthToken, subscribeToAuthChanges } from "../api/auth/auth";
import {
  createReview,
  deleteReview,
  getLocationReviews,
  updateReview,
  type ReviewRequest,
  type ReviewResponse,
} from "../api/reviews/reviews";
import RatingStars from "./RatingStars";

type ReviewSectionProps = {
  locationId: string;
  onReviewsChanged: () => Promise<void>;
  photoUploadSlot?: React.ReactNode;
};

type ReviewFormState = {
  rating: number;
  title: string;
  comment: string;
};

const emptyReviewForm: ReviewFormState = {
  rating: 5,
  title: "",
  comment: "",
};

const ReviewSection = ({
  locationId,
  onReviewsChanged,
  photoUploadSlot,
}: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<ReviewFormState>(emptyReviewForm);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthToken());

  const ownedReview = useMemo(
    () => reviews.find((review) => review.ownedByCurrentUser),
    [reviews],
  );
  const canCreateReview = isAuthenticated && !ownedReview && !editingReviewId;

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

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(hasAuthToken());
      void loadReviews();
    };

    return subscribeToAuthChanges(syncAuthState);
  }, [loadReviews]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitStatus("loading");
      setMessage("");

      const request = mapFormToRequest(formData);

      if (editingReviewId) {
        await updateReview(editingReviewId, request);
      } else {
        await createReview(locationId, request);
      }

      setEditingReviewId(null);
      setFormData(emptyReviewForm);
      setSubmitStatus("idle");
      await loadReviews();
      await onReviewsChanged();
    } catch (error) {
      console.error("Error saving review:", error);
      setSubmitStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Could not save review.",
      );
    }
  };

  const handleEditClick = (review: ReviewResponse) => {
    setEditingReviewId(review.id);
    setFormData({
      rating: review.rating,
      title: review.title ?? "",
      comment: review.comment ?? "",
    });
  };

  const handleDeleteClick = async (reviewId: string) => {
    try {
      setMessage("");
      await deleteReview(reviewId);
      setEditingReviewId(null);
      setFormData(emptyReviewForm);
      await loadReviews();
      await onReviewsChanged();
    } catch (error) {
      console.error("Error deleting review:", error);
      setMessage(
        error instanceof Error ? error.message : "Could not delete review.",
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setFormData(emptyReviewForm);
    setSubmitStatus("idle");
    setMessage("");
  };

  return (
    <section className="rounded-lg border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl shadow-black/10 sm:p-8">
      <div>
        <h2 className="text-2xl font-semibold text-(--color-text-primary)">
          Community reviews
        </h2>
      </div>

      {message && (
        <p
          className={
            submitStatus === "error" || status === "error"
              ? "mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              : "mt-4 rounded-md border border-(--color-border) bg-(--color-elevated) px-3 py-2 text-sm text-(--color-text-secondary)"
          }
        >
          {message}
        </p>
      )}

      {isAuthenticated ? (
        canCreateReview || editingReviewId ? (
          <ReviewForm
            formData={formData}
            isEditing={Boolean(editingReviewId)}
            onCancel={handleCancelEdit}
            onChange={setFormData}
            onSubmit={handleSubmit}
            submitStatus={submitStatus}
          />
        ) : (
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-(--color-text-secondary)">
            <CheckIcon />
            You have already reviewed this location. You can edit or delete
            your review below.
          </p>
        )
      ) : (
        <p className="mt-5 rounded-md border border-(--color-border) bg-(--color-page) p-4 text-sm text-(--color-text-secondary)">
          Sign in to write a review.
        </p>
      )}

      {photoUploadSlot && <div className="mt-6">{photoUploadSlot}</div>}

      <div className="mt-6 flex flex-col gap-4">
        {status === "loading" && (
          <p className="text-sm text-(--color-text-secondary)">
            Loading reviews...
          </p>
        )}

        {status === "success" && reviews.length === 0 && (
          <p className="rounded-md border border-(--color-border) bg-(--color-page) p-4 text-sm text-(--color-text-secondary)">
            No reviews yet.
          </p>
        )}

        {status === "success" &&
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              onDelete={() => void handleDeleteClick(review.id)}
              onEdit={() => handleEditClick(review)}
              review={review}
            />
          ))}
      </div>
    </section>
  );
};

const ReviewForm = ({
  formData,
  isEditing,
  onCancel,
  onChange,
  onSubmit,
  submitStatus,
}: {
  formData: ReviewFormState;
  isEditing: boolean;
  onCancel: () => void;
  onChange: (formData: ReviewFormState) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitStatus: "idle" | "loading" | "error";
}) => (
  <form className="mt-5 flex flex-col gap-4" onSubmit={onSubmit}>
    <div>
      <label
        className="text-sm font-medium text-(--color-text-primary)"
        htmlFor="reviewRating"
      >
        Rating
      </label>
      <select
        className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-page) px-3 py-2.5 text-(--color-text-primary) outline-none transition focus:border-(--color-accent-indicator) focus:ring-2 focus:ring-(--color-accent-indicator)/20"
        id="reviewRating"
        onChange={(event) =>
          onChange({ ...formData, rating: Number(event.target.value) })
        }
        value={formData.rating}
      >
        <option value={5}>5 - Excellent</option>
        <option value={4}>4 - Good</option>
        <option value={3}>3 - Okay</option>
        <option value={2}>2 - Poor</option>
        <option value={1}>1 - Bad</option>
      </select>
    </div>

    <div>
      <label
        className="text-sm font-medium text-(--color-text-primary)"
        htmlFor="reviewTitle"
      >
        Title
      </label>
      <input
        className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-page) px-3 py-2.5 text-(--color-text-primary) outline-none transition placeholder:text-(--color-text-tertiary) focus:border-(--color-accent-indicator) focus:ring-2 focus:ring-(--color-accent-indicator)/20"
        id="reviewTitle"
        maxLength={160}
        onChange={(event) =>
          onChange({ ...formData, title: event.target.value })
        }
        placeholder="Short summary"
        value={formData.title}
      />
    </div>

    <div>
      <label
        className="text-sm font-medium text-(--color-text-primary)"
        htmlFor="reviewComment"
      >
        Comment
      </label>
      <textarea
        className="mt-1 min-h-28 w-full resize-y rounded-md border border-(--color-border) bg-(--color-page) px-3 py-2.5 text-(--color-text-primary) outline-none transition placeholder:text-(--color-text-tertiary) focus:border-(--color-accent-indicator) focus:ring-2 focus:ring-(--color-accent-indicator)/20"
        id="reviewComment"
        maxLength={4000}
        onChange={(event) =>
          onChange({ ...formData, comment: event.target.value })
        }
        placeholder="What should others know before going?"
        value={formData.comment}
      />
    </div>

    <div className="flex flex-wrap gap-3">
      <button
        className="rounded-md bg-(--color-accent) px-4 py-2 text-sm font-semibold text-(--color-accent-text) transition hover:bg-(--color-accent-hover) disabled:cursor-not-allowed disabled:bg-(--color-elevated) disabled:text-(--color-text-tertiary)"
        disabled={submitStatus === "loading"}
        type="submit"
      >
        {submitStatus === "loading"
          ? "Saving..."
          : isEditing
            ? "Save review"
            : "Add review"}
      </button>
      {isEditing && (
        <button
          className="rounded-md border border-(--color-border) px-4 py-2 text-sm font-semibold text-(--color-text-primary) transition hover:bg-(--color-elevated)"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      )}
    </div>
  </form>
);

const ReviewCard = ({
  onDelete,
  onEdit,
  review,
}: {
  onDelete: () => void;
  onEdit: () => void;
  review: ReviewResponse;
}) => (
  <article className="rounded-md border border-(--color-border) bg-(--color-page) p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-base font-semibold text-(--color-text-primary)">
          {review.displayName}
        </p>
        <div className="mt-1 flex items-center gap-2 text-sm text-(--color-text-secondary)">
          <RatingStars rating={review.rating} size="sm" />
          <span>{review.rating.toFixed(1)}</span>
        </div>
      </div>

      {review.ownedByCurrentUser && (
        <div className="flex gap-2">
          <button
            className="rounded-md border border-(--color-border) px-3 py-1.5 text-sm font-semibold text-(--color-text-primary) transition hover:bg-(--color-elevated)"
            onClick={onEdit}
            type="button"
          >
            Edit
          </button>
          <button
            className="rounded-md border border-(--color-border) px-3 py-1.5 text-sm font-semibold text-(--color-text-secondary) transition hover:border-red-400/50 hover:bg-red-400/10 hover:text-red-500"
            onClick={onDelete}
            type="button"
          >
            Delete
          </button>
        </div>
      )}
    </div>

    {review.title && (
      <h3 className="mt-4 text-base font-semibold text-(--color-text-primary)">
        {review.title}
      </h3>
    )}
    {review.comment && (
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-(--color-text-secondary)">
        {review.comment}
      </p>
    )}
  </article>
);

const CheckIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 text-(--color-accent-indicator)"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const mapFormToRequest = (formData: ReviewFormState): ReviewRequest => ({
  rating: formData.rating,
  title: formData.title.trim(),
  comment: formData.comment.trim(),
});

export default ReviewSection;
