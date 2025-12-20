"use client";

import { ArrowLeft, Share, Copy } from "lucide-react";
import { Button } from "@/app/ui/shadcn/button";
import { useRouter } from "next/navigation";

interface BotDetailsActionsProps {
  showCopyButton?: boolean;
}

export default function BotDetailsActions({
  showCopyButton = true,
}: BotDetailsActionsProps) {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="flex gap-3">
      <Button className="gap-2" onClick={handleShare} variant="outline">
        <Share /> Share
      </Button>
      {showCopyButton && (
        <Button className="gap-2">
          <Copy /> Start Copying
        </Button>
      )}
    </div>
  );
}
