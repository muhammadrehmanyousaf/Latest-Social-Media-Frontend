"use client"

import { useState, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileSpreadsheet,
  Image as ImageIcon,
  Film,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform, MediaItem } from "@/app/bulk-schedule/page"

interface BulkUploadZoneProps {
  onCSVImport: (data: Array<{ content: string; platforms: string; date: string; time: string }>) => void
  onAddPost: (content?: string, platforms?: Platform[], media?: MediaItem[]) => string
  isUploading: boolean
  setIsUploading: (uploading: boolean) => void
}

export function BulkUploadZone({
  onCSVImport,
  onAddPost,
  isUploading,
  setIsUploading,
}: BulkUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; status: "success" | "error"; message?: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const parseCSV = useCallback((text: string) => {
    const lines = text.split("\n").filter((line) => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const contentIndex = headers.findIndex((h) => h === "content" || h === "text" || h === "post")
    const platformsIndex = headers.findIndex((h) => h === "platforms" || h === "platform")
    const dateIndex = headers.findIndex((h) => h === "date" || h === "scheduled_date")
    const timeIndex = headers.findIndex((h) => h === "time" || h === "scheduled_time")

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""))
      return {
        content: contentIndex >= 0 ? values[contentIndex] || "" : "",
        platforms: platformsIndex >= 0 ? values[platformsIndex] || "instagram" : "instagram",
        date: dateIndex >= 0 ? values[dateIndex] || "" : "",
        time: timeIndex >= 0 ? values[timeIndex] || "" : "",
      }
    })
  }, [])

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setIsUploading(true)
      setUploadProgress(0)
      const fileArray = Array.from(files)
      const results: { name: string; status: "success" | "error"; message?: string }[] = []

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        setUploadProgress(((i + 1) / fileArray.length) * 100)

        try {
          if (file.name.endsWith(".csv")) {
            const text = await file.text()
            const data = parseCSV(text)
            if (data.length > 0) {
              onCSVImport(data)
              results.push({ name: file.name, status: "success", message: `${data.length} posts imported` })
            } else {
              results.push({ name: file.name, status: "error", message: "No valid data found" })
            }
          } else if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            const url = URL.createObjectURL(file)
            const media: MediaItem = {
              id: Math.random().toString(36).substring(2, 9),
              type: file.type.startsWith("image/") ? "image" : "video",
              url,
              name: file.name,
              size: file.size,
            }
            onAddPost("", ["instagram"], [media])
            results.push({ name: file.name, status: "success", message: "Post created with media" })
          } else {
            results.push({ name: file.name, status: "error", message: "Unsupported file type" })
          }
        } catch {
          results.push({ name: file.name, status: "error", message: "Failed to process file" })
        }
      }

      setUploadedFiles(results)
      setIsUploading(false)
      setTimeout(() => setUploadedFiles([]), 5000)
    },
    [onCSVImport, onAddPost, parseCSV, setIsUploading]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const downloadTemplate = useCallback(() => {
    const template = `content,platforms,date,time
"Your post content here","instagram,twitter","2024-12-20","09:00"
"Another great post!","facebook,linkedin","2024-12-21","12:00"
"Weekend vibes content","instagram,tiktok","2024-12-22","18:00"`

    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bulk-schedule-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return (
    <Card
      className={cn(
        "relative mb-6 border-2 border-dashed transition-all duration-300 overflow-hidden",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border bg-card hover:border-primary/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative p-8">
        {isUploading ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Processing files...</h3>
            <Progress value={uploadProgress} className="w-64 mx-auto h-2" />
            <p className="text-sm text-muted-foreground mt-2">{Math.round(uploadProgress)}% complete</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-sm">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Drag & drop files here
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Upload CSV files for bulk import, or drag images/videos to create posts instantly
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                className="gap-2 rounded-xl"
                onClick={() => csvInputRef.current?.click()}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Import CSV
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-4 h-4" />
                Upload Media
              </Button>
              <Button
                variant="ghost"
                className="gap-2 rounded-xl text-muted-foreground"
                onClick={downloadTemplate}
              >
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                CSV
              </span>
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                JPG, PNG, GIF
              </span>
              <span className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                MP4, MOV
              </span>
            </div>
          </>
        )}

        {/* Upload Results */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl",
                  file.status === "success" ? "bg-green-500/10" : "bg-destructive/10"
                )}
              >
                {file.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                )}
                <span className="text-sm font-medium text-foreground flex-1 truncate">
                  {file.name}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    file.status === "success" ? "text-green-600" : "text-destructive"
                  )}
                >
                  {file.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </Card>
  )
}
