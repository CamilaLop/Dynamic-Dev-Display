type SemiLogoSymbolProps = {
  className?: string;
};

export function SemiLogoSymbol({ className = "" }: SemiLogoSymbolProps) {
  return (
    <span className={`semi-logo-symbol ${className}`} aria-hidden="true">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 0C17.9086 0 0 17.9086 0 40H40V0Z" fill="currentColor"/>
      </svg>
    </span>
  );
}
