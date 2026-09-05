"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";

export function LogoutButton() {
  const { logout } = useUser();

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => void logout()}
    >
      Log out
    </Button>
  );
}
