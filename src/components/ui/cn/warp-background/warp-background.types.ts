import type React from "react";

export interface WarpBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  perspective?: number;
  beamsPerSide?: number;
  beamSize?: number;
  beamDelayMax?: number;
  beamDelayMin?: number;
  beamDuration?: number;
  /** Cor das linhas da grade 3D. @default "var(--ks-rule)" */
  gridColor?: string;
}
