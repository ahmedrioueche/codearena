import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

const RoomOptions = ({ roomId = "123-456-789" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy room ID:", err);
    }
  };

  return (
    <div className="p-4 mt-8 bg-light-background dark:bg-dark-background rounded-xl shadow-lg max-w-md mx-auto ">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="flex items-center justify-center text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-3 gap-3">
          <Share2 className="w-8 h-8 text-light-primary dark:text-dark-primary" />
          Invite Friends
        </h2>
        <p className="text-center text-lg text-light-foreground/80 dark:text-dark-foreground/80">
          Share this room with your friends via social media or copy the room
          ID.
        </p>
      </div>

      {/* Room ID Section */}
      <div className="p-4 bg-white dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg shadow-sm">
        <div className="flex flex-col space-y-6 items-center">
          <span className="text-xl font-mono text-light-foreground dark:text-dark-foreground break-all">
            {roomId}
          </span>
          <button
            onClick={handleCopyRoomId}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
            <span className="text-lg font-medium">
              {copied ? "Copied!" : "Copy ID"}
            </span>
          </button>
        </div>
      </div>

      {/* Social Media Sharing Section (Optional) */}
      <div className="mt-8">
        <h3 className="text-center text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-4">
          Share via Social Media
        </h3>
        <div className="flex items-center justify-center gap-4">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition-colors"
          >
            <img src="/icons/facebook.svg" alt="Facebook" className="w-6 h-6" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              window.location.href
            )}&text=${encodeURIComponent("Join my room!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition-colors"
          >
            <img src="/icons/twitter.svg" alt="Twitter" className="w-6 h-6" />
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Join my room! ${window.location.href}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition-colors"
          >
            <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RoomOptions;
