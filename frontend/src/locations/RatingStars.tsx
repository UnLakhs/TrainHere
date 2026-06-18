type RatingStarsProps = {
  rating: number;
  size?: "sm" | "md";
};

const RatingStars = ({ rating, size = "md" }: RatingStarsProps) => {
  const roundedRating = Math.round(rating);
  const starClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < roundedRating;

        return (
          <StarIcon
            className={
              isFilled
                ? `${starClass} text-(--color-accent-indicator)`
                : `${starClass} text-(--color-text-tertiary)`
            }
            key={index}
          />
        );
      })}
    </span>
  );
};

const StarIcon = ({ className }: { className: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="m10 1.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9L10 1.5Z" />
  </svg>
);

export default RatingStars;
