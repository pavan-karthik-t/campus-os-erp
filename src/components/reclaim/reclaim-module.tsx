"use client";

import { useState } from "react";
import { reportFoundItem, submitClaim } from "@/actions/reclaim";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import type { ReclaimItem, UserRole } from "@/types";

interface ReclaimModuleProps {
  items: ReclaimItem[];
  role: UserRole;
}

export function ReclaimModule({ items, role }: ReclaimModuleProps) {
  const [loading, setLoading] = useState(false);

  const handleReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await reportFoundItem(new FormData(e.currentTarget));
    if (result?.error) toast.error(result.error);
    else { toast.success("Item reported!"); e.currentTarget.reset(); }
    setLoading(false);
  };

  const handleClaim = async (itemId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set("item_id", itemId);
    const result = await submitClaim(fd);
    if (result?.error) toast.error(result.error);
    else toast.success("Claim submitted for review!");
    setLoading(false);
  };

  const statusColor = (s: string) => {
    const map: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
      found: "default", claimed: "warning", under_review: "warning",
      approved: "success", rejected: "destructive", returned: "secondary",
    };
    return map[s] || "default";
  };

  return (
    <Tabs defaultValue="browse">
      <TabsList>
        <TabsTrigger value="browse">Browse Items</TabsTrigger>
        <TabsTrigger value="report">Report Found Item</TabsTrigger>
      </TabsList>

      <TabsContent value="browse" className="space-y-4 mt-4">
        {items.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">No items in ReClaim</Card>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-lg">{item.category}</CardTitle>
                <Badge variant={statusColor(item.status)}>{item.status.replace("_", " ")}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Found at: {item.location_found}</p>
                <p className="text-sm text-gray-500">Date: {formatDate(item.date_found)}</p>
                {item.description && <p className="mt-2">{item.description}</p>}

                {role === "student" && item.status === "found" && (
                  <form onSubmit={(e) => handleClaim(item.id, e)} className="mt-4 space-y-3 border-t pt-4">
                    <p className="font-medium text-sm">Submit Claim</p>
                    <div>
                      <Label>Ownership Description</Label>
                      <Input name="description" required placeholder="Describe identifying features..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Email</Label>
                        <Input name="contact_email" type="email" required />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input name="contact_phone" required />
                      </div>
                    </div>
                    <Button type="submit" size="sm" disabled={loading}>Submit Claim</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="report" className="mt-4">
        <Card>
          <CardHeader><CardTitle>Report Found Item</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <Label>Category</Label>
                <Input name="category" required placeholder="e.g. Wallet, Keys, Phone" />
              </div>
              <div>
                <Label>Location Found</Label>
                <Input name="location_found" required />
              </div>
              <div>
                <Label>Date Found</Label>
                <Input name="date_found" type="date" required />
              </div>
              <div>
                <Label>Hidden Ownership Identifiers (admin-only)</Label>
                <Input name="hidden_identifiers" required placeholder="Serial number, inscription, etc." />
              </div>
              <div>
                <Label>Description (public)</Label>
                <Input name="description" placeholder="General description without identifiers" />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Reporting..." : "Report Item"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
