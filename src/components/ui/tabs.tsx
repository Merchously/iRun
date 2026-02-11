"use client";

import { cn } from "@/lib/utils";
import { createContext, useContext, useState, HTMLAttributes, ButtonHTMLAttributes, forwardRef } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

export function Tabs({
  defaultValue,
  children,
  className,
  ...props
}: { defaultValue: string } & HTMLAttributes<HTMLDivElement>) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext value={{ activeTab, setActiveTab }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext>
  );
}

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 border-b border-border",
        className
      )}
      role="tablist"
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

export const TabsTrigger = forwardRef<
  HTMLButtonElement,
  { value: string } & ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, value, ...props }, ref) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;
  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center px-4 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "border-b-2 border-primary text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = forwardRef<
  HTMLDivElement,
  { value: string } & HTMLAttributes<HTMLDivElement>
>(({ className, value, ...props }, ref) => {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;
  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn("mt-4", className)}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";
