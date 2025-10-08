"use client";

import StationCreate from "@/components/dashboard/stations/station-create";

export default function StationCreateDemo() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Station Management</h1>
          <p className="text-muted-foreground">
            Manage your EV charging stations
          </p>
        </div>
        <StationCreate />
      </div>

      <div className="bg-card mt-10 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Developer Notes</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">✨ Features:</p>
            <ul className="text-muted-foreground mt-2 ml-4 list-disc space-y-1">
              <li>Simplified with Next.js Server Actions</li>
              <li>Server-side validation with Zod schema</li>
              <li>Geolocation integration for coordinate detection</li>
              <li>Native HTML form elements</li>
              <li>Visual status indicators (Active/Inactive/Maintenance)</li>
              <li>Responsive design (mobile-friendly)</li>
              <li>Loading states and toast notifications</li>
            </ul>
          </div>

          <div>
            <p className="font-medium">📋 Test Data:</p>
            <pre className="bg-muted mt-2 overflow-x-auto rounded-md p-4">
              {JSON.stringify(
                {
                  name: "District 1 Central Station",
                  description: "Located near Ben Thanh Market",
                  address: "123 Le Loi St, District 1, HCMC",
                  latitude: 10.7731,
                  longitude: 106.6983,
                  status: "active",
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div>
            <p className="font-medium">🔧 Integration:</p>
            <p className="text-muted-foreground mt-2">
              Check the browser console for form submission data. In production,
              replace the <code>onSuccess</code> callback with your API call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
