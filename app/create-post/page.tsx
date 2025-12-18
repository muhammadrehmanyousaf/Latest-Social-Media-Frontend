"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { CreatePostHeader } from "@/components/create-post/header"
import { PlatformSelector } from "@/components/create-post/platform-selector"
import { PostEditor } from "@/components/create-post/post-editor"
import { PostPreview } from "@/components/create-post/post-preview"
import { TagsManager } from "@/components/create-post/tags-manager"

export type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "threads" | "tiktok"

export interface PostContent {
  text: string
  media: { url: string; type: "image" | "video" }[]
  hashtags: string[]
}

export default function CreatePostPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["instagram", "linkedin"])
  const [activePlatform, setActivePlatform] = useState<Platform>("instagram")
  const [syncContent, setSyncContent] = useState(true)
  const [selectedTags, setSelectedTags] = useState<string[]>(["Marketing"])

  // Content per platform (when not synced)
  const [platformContent, setPlatformContent] = useState<Record<Platform, PostContent>>({
    instagram: { text: "", media: [], hashtags: [] },
    facebook: { text: "", media: [], hashtags: [] },
    twitter: { text: "", media: [], hashtags: [] },
    linkedin: { text: "", media: [], hashtags: [] },
    threads: { text: "", media: [], hashtags: [] },
    tiktok: { text: "", media: [], hashtags: [] },
  })

  // Shared content (when synced)
  const [sharedContent, setSharedContent] = useState<PostContent>({
    text: "",
    media: [],
    hashtags: [],
  })

  const currentContent = syncContent ? sharedContent : platformContent[activePlatform]

  const updateContent = (content: Partial<PostContent>) => {
    if (syncContent) {
      setSharedContent((prev) => ({ ...prev, ...content }))
    } else {
      setPlatformContent((prev) => ({
        ...prev,
        [activePlatform]: { ...prev[activePlatform], ...content },
      }))
    }
  }

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        const newPlatforms = prev.filter((p) => p !== platform)
        if (activePlatform === platform && newPlatforms.length > 0) {
          setActivePlatform(newPlatforms[0])
        }
        return newPlatforms
      }
      return [...prev, platform]
    })
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CreatePostHeader selectedTags={selectedTags} />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Editor */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-border">
            {/* Platform Selector */}
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              activePlatform={activePlatform}
              onTogglePlatform={togglePlatform}
              onSetActivePlatform={setActivePlatform}
              syncContent={syncContent}
              onToggleSync={() => setSyncContent(!syncContent)}
            />

            {/* Tags Manager */}
            <TagsManager selectedTags={selectedTags} onTagsChange={setSelectedTags} />

            {/* Post Editor */}
            <PostEditor
              content={currentContent}
              onContentChange={updateContent}
              activePlatform={activePlatform}
              syncContent={syncContent}
            />
          </div>

          {/* Right Panel - Preview */}
          <PostPreview platform={activePlatform} content={currentContent} />
        </div>
      </div>
    </div>
  )
}
