"use client";

import * as React from "react";

/**
 * DEPRECATED: legacy ReservationForm implementation.
 * The active UI is now provided by `reservation-create-button`.
 * This stub keeps the module as a valid module so compatibility
 * shims can re-export safely during the feature migration.
 */
export function ReservationForm({ onContinue }: { onContinue?: () => void }) {
  // Keep the surface stable (no-op render). Replace with the
  // full implementation when/if we restore the form.
  return null;
}
