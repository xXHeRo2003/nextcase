"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">User Profile</h1>
        <p className="text-muted-foreground text-lg">
          Manage your account and view your trading activity.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-mono">Not Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Virtual Coins:</span>
                <span className="font-bold text-primary">0 NC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent trades found.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
