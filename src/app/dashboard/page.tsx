import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-accent/20 bg-secondary">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Welcome to the Dashboard</CardTitle>
          <CardDescription>You have successfully logged in.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a protected area. In a real application, you would see your personalized news feed and other features here.</p>
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link href="/">Log out</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
