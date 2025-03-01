import { ReactNode } from "react";

export function Section({ title, children }: { title: ReactNode; children?: ReactNode; }) {
  return (
    <div>
      <h2>{title}</h2>

      {children}
    </div>
  )
}
