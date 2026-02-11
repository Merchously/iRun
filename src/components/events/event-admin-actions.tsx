"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface EventAdminActionsProps {
  eventId: string;
  status: string;
  publishAction: (eventId: string) => Promise<void>;
  unpublishAction: (eventId: string) => Promise<void>;
  deleteAction: (eventId: string) => Promise<void>;
}

export function EventAdminActions({
  eventId,
  status,
  publishAction,
  unpublishAction,
  deleteAction,
}: EventAdminActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      {status === "draft" && (
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await publishAction(eventId);
              router.refresh();
            })
          }
        >
          Publish
        </Button>
      )}
      {status === "published" && (
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await unpublishAction(eventId);
              router.refresh();
            })
          }
        >
          Unpublish
        </Button>
      )}
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Are you sure you want to delete this event?")) return;
          startTransition(async () => {
            await deleteAction(eventId);
          });
        }}
      >
        Delete
      </Button>
    </div>
  );
}
