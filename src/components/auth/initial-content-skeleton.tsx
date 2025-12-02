import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function InitialContentSkeleton({ content }: { content: string }) {
  return (
    <div className="w-full max-w-md">
      <div className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/50 p-6 md:p-8 backdrop-blur-md">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/2" />
          </div>

          <div className="space-y-3 pt-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-1/2" />
          </div>

          <div className="pt-4">
             <Card className="bg-muted/50 border-accent/20">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <h3 className="font-headline text-lg text-primary">For You</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{content}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
