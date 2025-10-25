import React, { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridSystemProps {
  children: ReactNode;
  guideWidth?: number;
  className?: string;
}

interface GridProps {
  rows?: number;
  columns?: number;
  children?: ReactNode;
  className?: string;
  gap?: number;
}

interface GridCellProps {
  row?: number | "auto";
  column?: number | "auto";
  rowSpan?: number;
  columnSpan?: number;
  children?: ReactNode;
  className?: string;
}

interface GridCrossProps {
  row: number;
  column: number;
  className?: string;
}

// Grid System wrapper - should be at root of page
function GridSystem({ children, guideWidth = 1, className }: GridSystemProps) {
  return (
    <div
      className={cn("relative", className)}
      style={
        {
          "--guide-width": `${guideWidth}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

// Main Grid component
function Grid({ rows = 1, columns = 1, children, className, gap }: GridProps) {
  // Generate grid guides
  const guides = Array.from({ length: rows * columns }, (_, index) => {
    const x = (index % columns) + 1;
    const y = Math.floor(index / columns) + 1;
    return { x, y, key: `guide-${x}-${y}` };
  });

  return (
    <div
      className={cn("relative grid", className)}
      style={
        {
          "--rows": rows,
          "--columns": columns,
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: gap ? `${gap}px` : undefined,
        } as CSSProperties
      }
    >
      {/* Grid guides using display: contents trick */}
      <div className="contents">
        {guides.map(({ x, y, key }) => {
          const isLastCol = x === columns;
          const isLastRow = y === rows;
          return (
            <div
              key={key}
              className="pointer-events-none absolute inset-0"
              style={
                {
                  "--x": x,
                  "--y": y,
                  gridColumnStart: x,
                  gridColumnEnd: "span 1",
                  gridRowStart: y,
                  gridRowEnd: "span 1",
                  borderRight: isLastCol
                    ? "none"
                    : `var(--guide-width) solid currentColor`,
                  borderBottom: isLastRow
                    ? "none"
                    : `var(--guide-width) solid currentColor`,
                } as CSSProperties
              }
              aria-hidden="true"
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}

// Grid Cell component
function GridCell({
  row = "auto",
  column = "auto",
  rowSpan = 1,
  columnSpan = 1,
  children,
  className,
}: GridCellProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        gridRow: row === "auto" ? "auto" : `${row} / span ${rowSpan}`,
        gridColumn:
          column === "auto" ? "auto" : `${column} / span ${columnSpan}`,
      }}
    >
      {children}
    </div>
  );
}

// Grid Cross component (intersection markers)
function GridCross({ row, column, className }: GridCrossProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2",
        className,
      )}
      style={{
        gridRow: row < 0 ? row : row,
        gridColumn: column < 0 ? column : column,
        top: row < 0 ? "100%" : "0%",
        left: column < 0 ? "100%" : "0%",
      }}
      aria-hidden="true"
    >
      {/* Horizontal line */}
      <div className="bg-border absolute top-1/2 left-1/2 h-[var(--guide-width)] w-3 -translate-x-1/2 -translate-y-1/2" />
      {/* Vertical line */}
      <div className="bg-border absolute top-1/2 left-1/2 h-3 w-[var(--guide-width)] -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

// Compose the Grid namespace
const GridNamespace = Object.assign(Grid, {
  System: GridSystem,
  Cell: GridCell,
  Cross: GridCross,
});

export { GridNamespace as Grid };
