"use client"

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const checkPasswordStrength = (password: string) => {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLevels = [
  { label: "", color: "bg-transparent", width: "w-0" },
  { label: "Weak", color: "bg-red-500", width: "w-1/5" },
  { label: "Fair", color: "bg-yellow-500", width: "w-2/5" },
  { label: "Good", color: "bg-yellow-500", width: "w-3/5" },
  { label: "Strong", color: "bg-green-500", width: "w-4/5" },
  { label: "Very Strong", color: "bg-green-500", width: "w-full" },
];

export const PasswordStrength = ({ password }: { password?: string }) => {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    setStrength(checkPasswordStrength(password || ""));
  }, [password]);

  if (!password) return null;

  const currentLevel = strengthLevels[strength];

  return (
    <div className="mt-1.5 space-y-1">
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300",
            currentLevel.color,
            currentLevel.width
          )}
        />
      </div>
      <span className="text-xs text-muted-foreground">{currentLevel.label}</span>
    </div>
  );
};
