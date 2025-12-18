"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Hash,
  Link2,
  Image,
  Clock,
  Globe,
  Sparkles,
  Plus,
  X,
  Type,
  MessageSquare,
  AtSign,
  Wand2,
  Settings2,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ContentDefaults } from "@/app/settings/page"

interface ContentSettingsProps {
  defaults: ContentDefaults
  onUpdate: (defaults: ContentDefaults) => void
}

const postingTimes = [
  { value: "9:00", label: "9:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "21:00", label: "9:00 PM" },
]

export function ContentSettings({ defaults, onUpdate }: ContentSettingsProps) {
  const [newHashtag, setNewHashtag] = useState("")

  const handleAddHashtag = () => {
    if (newHashtag.trim() && !defaults.defaultHashtags.includes(newHashtag.trim())) {
      onUpdate({
        ...defaults,
        defaultHashtags: [...defaults.defaultHashtags, newHashtag.trim().replace(/^#/, "")],
      })
      setNewHashtag("")
    }
  }

  const handleRemoveHashtag = (hashtag: string) => {
    onUpdate({
      ...defaults,
      defaultHashtags: defaults.defaultHashtags.filter((h) => h !== hashtag),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Content Defaults</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Set default settings for your posts and content
        </p>
      </div>

      {/* Default Hashtags */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Hash className="w-4 h-4" />
          Default Hashtags
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          These hashtags will be automatically suggested when creating new posts
        </p>

        {/* Hashtag Input */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Add a hashtag..."
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddHashtag()
                }
              }}
              className="pl-10 rounded-xl"
            />
          </div>
          <Button
            onClick={handleAddHashtag}
            disabled={!newHashtag.trim()}
            className="rounded-xl"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Hashtag List */}
        {defaults.defaultHashtags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {defaults.defaultHashtags.map((hashtag) => (
              <Badge
                key={hashtag}
                variant="secondary"
                className="px-3 py-1.5 gap-2 rounded-full"
              >
                <Hash className="w-3 h-3" />
                {hashtag}
                <button
                  onClick={() => handleRemoveHashtag(hashtag)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-muted/40 rounded-xl">
            <Hash className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No default hashtags</p>
            <p className="text-xs text-muted-foreground">Add hashtags above</p>
          </div>
        )}
      </Card>

      {/* Default Signature */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <AtSign className="w-4 h-4" />
          Post Signature
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Add a default signature that will appear at the end of your posts
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="signature-enabled">Enable signature</Label>
            <Switch
              id="signature-enabled"
              checked={defaults.signatureEnabled}
              onCheckedChange={(checked) =>
                onUpdate({ ...defaults, signatureEnabled: checked })
              }
            />
          </div>
          {defaults.signatureEnabled && (
            <Textarea
              placeholder="e.g., — Posted via SocialFlow"
              value={defaults.signature || ""}
              onChange={(e) => onUpdate({ ...defaults, signature: e.target.value })}
              className="rounded-xl resize-none"
              rows={2}
            />
          )}
        </div>
      </Card>

      {/* Default Posting Times */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Default Posting Times
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Set preferred times for scheduling posts
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {postingTimes.map((time) => {
            const isSelected = defaults.defaultPostingTimes.includes(time.value)
            return (
              <button
                key={time.value}
                onClick={() => {
                  if (isSelected) {
                    onUpdate({
                      ...defaults,
                      defaultPostingTimes: defaults.defaultPostingTimes.filter(
                        (t) => t !== time.value
                      ),
                    })
                  } else {
                    onUpdate({
                      ...defaults,
                      defaultPostingTimes: [...defaults.defaultPostingTimes, time.value],
                    })
                  }
                }}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Clock
                  className={cn(
                    "w-5 h-5 mx-auto mb-1",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <p
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {time.label}
                </p>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Selected times:{" "}
          {defaults.defaultPostingTimes.length > 0
            ? defaults.defaultPostingTimes.join(", ")
            : "None"}
        </p>
      </Card>

      {/* URL Shortening */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          URL Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Auto-shorten URLs</p>
                <p className="text-xs text-muted-foreground">
                  Automatically shorten links in your posts
                </p>
              </div>
            </div>
            <Switch
              checked={defaults.autoShortenUrls}
              onCheckedChange={(checked) =>
                onUpdate({ ...defaults, autoShortenUrls: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">UTM Tracking</p>
                <p className="text-xs text-muted-foreground">
                  Add UTM parameters to track link performance
                </p>
              </div>
            </div>
            <Switch
              checked={defaults.utmTracking}
              onCheckedChange={(checked) =>
                onUpdate({ ...defaults, utmTracking: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Image Settings */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Image className="w-4 h-4" />
          Image Defaults
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Default Image Quality</Label>
            <Select defaultValue="high">
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Original (No compression)</SelectItem>
                <SelectItem value="high">High Quality</SelectItem>
                <SelectItem value="medium">Medium (Balanced)</SelectItem>
                <SelectItem value="low">Low (Smaller file size)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Auto-optimize images</p>
                <p className="text-xs text-muted-foreground">
                  Automatically optimize images for each platform
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Type className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Add watermark</p>
                <p className="text-xs text-muted-foreground">
                  Add your brand watermark to all images
                </p>
              </div>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      {/* AI Assistance */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Assistance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">AI Writing Assistant</p>
                <p className="text-xs text-muted-foreground">
                  Get AI suggestions while writing posts
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2">
            <Label>AI Tone</Label>
            <Select defaultValue="professional">
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual & Friendly</SelectItem>
                <SelectItem value="witty">Witty & Engaging</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This affects AI-generated captions and suggestions
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Auto-suggest hashtags</p>
                <p className="text-xs text-muted-foreground">
                  AI will suggest relevant hashtags for your content
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Grammar & Spell Check</p>
                <p className="text-xs text-muted-foreground">
                  Automatically check for grammar and spelling errors
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Caption Templates */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Caption Templates
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Quick-access templates for common post types
            </p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl gap-2">
            <Settings2 className="w-4 h-4" />
            Manage Templates
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "Product Launch", count: 3 },
            { name: "Blog Post", count: 5 },
            { name: "Event Promo", count: 2 },
            { name: "Behind the Scenes", count: 4 },
          ].map((template) => (
            <div
              key={template.name}
              className="p-4 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-colors"
            >
              <p className="text-sm font-medium text-foreground">{template.name}</p>
              <p className="text-xs text-muted-foreground">{template.count} templates</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
