type LocationFilterButtonProps = {
  isActive: boolean;
  isLoading?: boolean;
  label: string;
  onClick: () => void;
};

const LocationFilterButton = ({
  isActive,
  isLoading = false,
  label,
  onClick,
}: LocationFilterButtonProps) => (
  <button
    className={
      isActive
        ? "rounded-md border border-(--color-border) bg-(--color-elevated) px-3 py-1.5 text-sm font-semibold text-(--color-text-primary) shadow-sm shadow-black/10"
        : "rounded-md border border-(--color-border) px-3 py-1.5 text-sm font-semibold text-(--color-text-secondary) transition hover:bg-(--color-elevated) hover:text-(--color-text-primary)"
    }
    disabled={isLoading}
    onClick={onClick}
    type="button"
  >
    {label}
  </button>
);

export default LocationFilterButton;
