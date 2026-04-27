"use client";

import { Suspense } from "react";
import MatchPage from "./MatchPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MatchPage />
    </Suspense>
  );
}
