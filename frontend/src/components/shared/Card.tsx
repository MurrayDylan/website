import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-lg bg-neutral-800 p-5 shadow-sm flex-shrink-0 ${className}`}>
      {children}
    </div>
  );
}