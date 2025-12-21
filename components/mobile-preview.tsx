"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  Monitor,
  Tablet,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Home,
  Search,
  PlusSquare,
  Play,
  User,
  ThumbsUp,
  Send,
  Globe,
  Repeat2,
  BarChart2,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

interface MobilePreviewProps {
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  platform: "twitter" | "linkedin" | "facebook" | "instagram";
  username?: string;
  avatar?: string;
  timestamp?: string;
}

type DeviceType = "mobile" | "tablet" | "desktop";
type Orientation = "portrait" | "landscape";

const deviceSizes = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
};

export function MobilePreview({
  content,
  mediaUrl,
  mediaType = "image",
  platform,
  username = "YourBrand",
  avatar = "YB",
  timestamp = "Just now",
}: MobilePreviewProps) {
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [scale, setScale] = useState(0.7);

  const getDeviceDimensions = () => {
    const base = deviceSizes[device];
    if (orientation === "landscape" && device !== "desktop") {
      return { width: base.height, height: base.width };
    }
    return base;
  };

  const dimensions = getDeviceDimensions();

  const renderTwitterPreview = () => (
    <div className="bg-black text-white min-h-full">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-5 py-2 text-xs">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <Battery className="h-4 w-4" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
          {avatar}
        </div>
        <FaTwitter className="h-6 w-6 text-white" />
        <div className="w-8" />
      </div>

      {/* Tweet */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            {avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-bold">{username}</span>
              <span className="text-gray-500">@{username.toLowerCase()}</span>
              <span className="text-gray-500">· {timestamp}</span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-[15px]">{content}</p>
            {mediaUrl && (
              <div className="mt-3 rounded-2xl overflow-hidden bg-gray-800 aspect-video flex items-center justify-center">
                {mediaType === "video" ? (
                  <Play className="h-12 w-12 text-white" />
                ) : (
                  <span className="text-gray-500 text-sm">Image Preview</span>
                )}
              </div>
            )}
            <div className="flex items-center justify-between mt-3 text-gray-500 max-w-[280px]">
              <button className="flex items-center gap-1 hover:text-blue-400">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">24</span>
              </button>
              <button className="flex items-center gap-1 hover:text-green-400">
                <Repeat2 className="h-4 w-4" />
                <span className="text-xs">12</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-400">
                <Heart className="h-4 w-4" />
                <span className="text-xs">156</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-400">
                <BarChart2 className="h-4 w-4" />
                <span className="text-xs">2.4K</span>
              </button>
              <button className="hover:text-blue-400">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex items-center justify-around py-3">
        <Home className="h-6 w-6" />
        <Search className="h-6 w-6 text-gray-500" />
        <Globe className="h-6 w-6 text-gray-500" />
        <MessageCircle className="h-6 w-6 text-gray-500" />
      </div>
    </div>
  );

  const renderInstagramPreview = () => (
    <div className="bg-black text-white min-h-full">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-5 py-2 text-xs">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <Battery className="h-4 w-4" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <FaInstagram className="h-6 w-6" />
        <span className="font-semibold">Instagram</span>
        <div className="flex gap-4">
          <Heart className="h-6 w-6" />
          <Send className="h-6 w-6" />
        </div>
      </div>

      {/* Post */}
      <div>
        {/* Post Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs">
                {avatar}
              </div>
            </div>
            <span className="font-semibold text-sm">{username.toLowerCase()}</span>
          </div>
          <MoreHorizontal className="h-5 w-5" />
        </div>

        {/* Media */}
        <div className="aspect-square bg-gray-900 flex items-center justify-center">
          {mediaType === "video" ? (
            <Play className="h-16 w-16 text-white" />
          ) : (
            <span className="text-gray-500">Image Preview</span>
          )}
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Heart className="h-6 w-6" />
              <MessageCircle className="h-6 w-6" />
              <Send className="h-6 w-6" />
            </div>
            <Bookmark className="h-6 w-6" />
          </div>

          <div className="mt-2">
            <span className="font-semibold text-sm">1,234 likes</span>
          </div>

          <div className="mt-1">
            <span className="font-semibold text-sm">{username.toLowerCase()}</span>{" "}
            <span className="text-sm">{content.substring(0, 100)}</span>
            {content.length > 100 && (
              <span className="text-gray-500 text-sm">... more</span>
            )}
          </div>

          <div className="mt-1 text-gray-500 text-xs">{timestamp}</div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex items-center justify-around py-3">
        <Home className="h-6 w-6" />
        <Search className="h-6 w-6 text-gray-500" />
        <PlusSquare className="h-6 w-6 text-gray-500" />
        <Play className="h-6 w-6 text-gray-500" />
        <User className="h-6 w-6 text-gray-500" />
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="bg-[#1B1F23] text-white min-h-full">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-5 py-2 text-xs">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <Battery className="h-4 w-4" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#1B1F23] px-4 py-3 border-b border-gray-700 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">
          {avatar}
        </div>
        <div className="flex-1 bg-gray-700 rounded-full px-4 py-2 text-gray-400 text-sm">
          Search
        </div>
        <MessageCircle className="h-5 w-5 text-gray-400" />
      </div>

      {/* Post */}
      <div className="bg-[#1B1F23] mt-2">
        {/* Post Header */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {avatar}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{username}</div>
              <div className="text-xs text-gray-400">Your Company Tagline</div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                {timestamp} · <Globe className="h-3 w-3" />
              </div>
            </div>
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>

        {/* Media */}
        {mediaUrl && (
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            {mediaType === "video" ? (
              <Play className="h-12 w-12 text-white" />
            ) : (
              <span className="text-gray-500 text-sm">Image Preview</span>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-400 border-b border-gray-700">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <ThumbsUp className="h-2 w-2 text-white" />
              </div>
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <Heart className="h-2 w-2 text-white" />
              </div>
            </div>
            <span>523</span>
          </div>
          <span>42 comments · 18 reposts</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-around py-2 px-4">
          <button className="flex items-center gap-1 text-gray-400 text-xs">
            <ThumbsUp className="h-5 w-5" />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-1 text-gray-400 text-xs">
            <MessageCircle className="h-5 w-5" />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-1 text-gray-400 text-xs">
            <Repeat2 className="h-5 w-5" />
            <span>Repost</span>
          </button>
          <button className="flex items-center gap-1 text-gray-400 text-xs">
            <Send className="h-5 w-5" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1B1F23] border-t border-gray-700 flex items-center justify-around py-3">
        <Home className="h-6 w-6" />
        <Users className="h-6 w-6 text-gray-500" />
        <PlusSquare className="h-6 w-6 text-gray-500" />
        <MessageCircle className="h-6 w-6 text-gray-500" />
        <Bell className="h-6 w-6 text-gray-500" />
      </div>
    </div>
  );

  const renderFacebookPreview = () => (
    <div className="bg-[#18191A] text-white min-h-full">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-5 py-2 text-xs">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <Battery className="h-4 w-4" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#242526] px-4 py-3 flex items-center justify-between">
        <FaFacebook className="h-8 w-8 text-blue-500" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
            <Search className="h-5 w-5" />
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
            <MessageCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Post */}
      <div className="bg-[#242526] mt-2 rounded-lg mx-2">
        {/* Post Header */}
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {avatar}
            </div>
            <div>
              <div className="font-semibold text-sm">{username}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                {timestamp} · <Globe className="h-3 w-3" />
              </div>
            </div>
            <MoreHorizontal className="h-5 w-5 text-gray-400 ml-auto" />
          </div>
        </div>

        {/* Content */}
        <div className="px-3 pb-3">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>

        {/* Media */}
        {mediaUrl && (
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            {mediaType === "video" ? (
              <Play className="h-12 w-12 text-white" />
            ) : (
              <span className="text-gray-500 text-sm">Image Preview</span>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="px-3 py-2 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <ThumbsUp className="h-3 w-3 text-white" />
              </div>
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <Heart className="h-3 w-3 text-white" />
              </div>
            </div>
            <span>2.1K</span>
          </div>
          <span>186 comments · 45 shares</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-around py-2 px-3 border-t border-gray-700">
          <button className="flex items-center gap-2 text-gray-400">
            <ThumbsUp className="h-5 w-5" />
            <span className="text-sm">Like</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">Comment</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400">
            <Share2 className="h-5 w-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#242526] border-t border-gray-700 flex items-center justify-around py-3">
        <Home className="h-6 w-6 text-blue-500" />
        <Users className="h-6 w-6 text-gray-500" />
        <Play className="h-6 w-6 text-gray-500" />
        <ShoppingBag className="h-6 w-6 text-gray-500" />
        <Bell className="h-6 w-6 text-gray-500" />
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (platform) {
      case "twitter":
        return renderTwitterPreview();
      case "instagram":
        return renderInstagramPreview();
      case "linkedin":
        return renderLinkedInPreview();
      case "facebook":
        return renderFacebookPreview();
      default:
        return renderTwitterPreview();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant={device === "mobile" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setDevice("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant={device === "tablet" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setDevice("tablet")}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={device === "desktop" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setDevice("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          {device !== "desktop" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOrientation(o => o === "portrait" ? "landscape" : "portrait")}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {dimensions.width} × {dimensions.height}
          </Badge>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale(s => Math.max(0.3, s - 0.1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale(s => Math.min(1, s + 0.1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center bg-muted/30 p-8 overflow-auto">
        <div
          className={cn(
            "relative bg-black rounded-[40px] shadow-2xl overflow-hidden transition-all duration-300",
            device === "mobile" && "p-3",
            device === "tablet" && "p-4",
            device === "desktop" && "rounded-lg p-0"
          )}
          style={{
            width: dimensions.width * scale,
            height: dimensions.height * scale,
          }}
        >
          {/* Device Frame */}
          {device === "mobile" && (
            <>
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-10" />
            </>
          )}

          {/* Screen Content */}
          <div
            className="w-full h-full overflow-hidden"
            style={{
              borderRadius: device === "mobile" ? 32 : device === "tablet" ? 24 : 0,
            }}
          >
            <ScrollArea className="h-full">
              {renderPreview()}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing icon imports for the component
import { Users, Bell, ShoppingBag } from "lucide-react";

// Export a standalone preview dialog component
export function MobilePreviewDialog({
  open,
  onOpenChange,
  content,
  mediaUrl,
  platform,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  mediaUrl?: string;
  platform: "twitter" | "linkedin" | "facebook" | "instagram";
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Mobile Preview</DialogTitle>
        </DialogHeader>
        <MobilePreview content={content} mediaUrl={mediaUrl} platform={platform} />
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
