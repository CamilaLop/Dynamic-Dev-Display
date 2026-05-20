import titleSemiSymbol from "../../assets/title-semi-symbol.svg";

type SemiLogoSymbolProps = {
  className?: string;
};

export function SemiLogoSymbol({ className = "" }: SemiLogoSymbolProps) {
  return (
    <span className={`semi-logo-symbol ${className}`} aria-hidden="true">
      <img src={titleSemiSymbol} alt="" />
    </span>
  );
}
