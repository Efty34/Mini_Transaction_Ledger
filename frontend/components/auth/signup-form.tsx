"use client";

import { useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/api/auth";
import { ApiError } from "@/lib/api-client";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: String(formData.get("firstName")),
      lastName: String(formData.get("lastName")),
      username: String(formData.get("username")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      retypePassword: String(formData.get("retypePassword")),
    };

    if (payload.password !== payload.retypePassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(payload);

      location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-first-name">First name</Label>
          <Input id="signup-first-name" name="firstName" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-last-name">Last name</Label>
          <Input id="signup-last-name" name="lastName" required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-username">Username</Label>
        <Input id="signup-username" name="username" autoComplete="username" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-retype-password">Retype password</Label>
        <Input
          id="signup-retype-password"
          name="retypePassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
