
import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "circle" | "rectangle" | "card" | "text" | "avatar";
  count?: number;
  height?: string | number;
  width?: string | number;
  animate?: boolean;
}

export const Skeleton = ({
  variant = "rectangle",
  count = 1,
  height,
  width,
  className,
  animate = true,
  ...props
}: SkeletonProps) => {
  const renderSkeleton = () => {
    const elements = [];
    
    for (let i = 0; i < count; i++) {
      const key = `skeleton-${variant}-${i}`;
      
      let skeletonClass = "bg-gray-200 dark:bg-gray-700";
      
      if (animate) {
        skeletonClass = cn(skeletonClass, "animate-pulse");
      }
      
      let style: React.CSSProperties = {};
      
      if (height) {
        style.height = typeof height === "number" ? `${height}px` : height;
      }
      
      if (width) {
        style.width = typeof width === "number" ? `${width}px` : width;
      }

      switch (variant) {
        case "circle":
          elements.push(
            <div
              key={key}
              className={cn(
                skeletonClass,
                "rounded-full",
                className
              )}
              style={{ 
                ...style,
                height: style.height || "40px",
                width: style.width || "40px",
                aspectRatio: "1" 
              }}
              {...props}
            />
          );
          break;
          
        case "text":
          elements.push(
            <div key={key} className="flex flex-col space-y-2">
              <div
                className={cn(
                  skeletonClass,
                  "h-4 rounded-md",
                  className
                )}
                style={{ 
                  ...style,
                  width: style.width || "80%" 
                }}
                {...props}
              />
              <div
                className={cn(
                  skeletonClass,
                  "h-4 rounded-md",
                  className
                )}
                style={{ 
                  ...style,
                  width: style.width || "60%" 
                }}
                {...props}
              />
            </div>
          );
          break;
          
        case "avatar":
          elements.push(
            <div key={key} className="flex items-center space-x-4">
              <div
                className={cn(
                  skeletonClass,
                  "rounded-full",
                  className
                )}
                style={{ 
                  ...style,
                  height: style.height || "40px",
                  width: style.width || "40px"
                }}
                {...props}
              />
              <div className="space-y-2">
                <div
                  className={cn(
                    skeletonClass,
                    "h-4 rounded-md w-32",
                    className
                  )}
                  {...props}
                />
                <div
                  className={cn(
                    skeletonClass,
                    "h-3 rounded-md w-24",
                    className
                  )}
                  {...props}
                />
              </div>
            </div>
          );
          break;
          
        case "card":
          elements.push(
            <div 
              key={key}
              className={cn(
                "rounded-lg overflow-hidden",
                className
              )}
              style={{ 
                ...style,
                height: style.height || "200px",
                width: style.width || "100%"
              }}
              {...props}
            >
              <div className={cn(skeletonClass, "h-24 w-full")} />
              <div className="p-4 space-y-3">
                <div className={cn(skeletonClass, "h-6 w-3/4 rounded-md")} />
                <div className={cn(skeletonClass, "h-4 w-full rounded-md")} />
                <div className={cn(skeletonClass, "h-4 w-2/3 rounded-md")} />
              </div>
            </div>
          );
          break;
        
        case "line":
          elements.push(
            <div
              key={key}
              className={cn(
                skeletonClass,
                "rounded-md h-4",
                className
              )}
              style={{ 
                ...style,
                width: style.width || "100%"
              }}
              {...props}
            />
          );
          break;
          
        default: // rectangle
          elements.push(
            <div
              key={key}
              className={cn(
                skeletonClass,
                "rounded-md",
                className
              )}
              style={{ 
                ...style,
                height: style.height || "100px",
                width: style.width || "100%"
              }}
              {...props}
            />
          );
          break;
      }
      
      // Add spacing between elements (except for the last one)
      if (i < count - 1) {
        elements.push(<div key={`${key}-spacer`} className="mt-2" />);
      }
    }
    
    return elements;
  };

  return <>{renderSkeleton()}</>;
};

export const SkeletonCard = (props: Omit<SkeletonProps, "variant">) => {
  return <Skeleton variant="card" {...props} />;
};

export const SkeletonText = (props: Omit<SkeletonProps, "variant">) => {
  return <Skeleton variant="text" {...props} />;
};

export const SkeletonAvatar = (props: Omit<SkeletonProps, "variant">) => {
  return <Skeleton variant="avatar" {...props} />;
};
