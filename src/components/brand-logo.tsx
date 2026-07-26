import * as React from "react";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex font-black select-none tracking-tight ${className}`}>
      <span className="text-[#0047AB]">Fin</span>
      <span className="text-[#FFB347]">Disce</span>
    </span>
  );
}
