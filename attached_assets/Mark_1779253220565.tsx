import camilaLogo from "../../assets/camila-logo.svg";

type MarkProps = {
  className?: string;
  strokeWidth?: number;
};

export function Mark({ className = "", strokeWidth = 1.45 }: MarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M50 10 L50 90" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M22 28 L78 72" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className = "",
  withText = false,
}: {
  className?: string;
  withText?: boolean;
}) {
  return (
    <div className={`brand-logo ${className}`} aria-label="Camila Lopes">
      <img className="brand-logo__real" src={camilaLogo} alt="Camila Lopes" />
      {withText && <span className="brand-logo__text">CL · Studio</span>}
    </div>
  );
}
