"use client";

import { LayoutGroup } from "motion/react";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutGroup id="edufind-layout">
      {children}
    </LayoutGroup>
  );
}