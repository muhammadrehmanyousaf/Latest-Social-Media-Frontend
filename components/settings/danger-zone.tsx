"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  Trash2,
  Download,
  RefreshCw,
  UserX,
  Database,
  FileX,
  AlertCircle,
  ShieldAlert,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DangerZoneProps {
  accountEmail: string
}

export function DangerZone({ accountEmail }: DangerZoneProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState<string[]>([])

  const deleteTerms = [
    "I understand that all my data will be permanently deleted",
    "I understand this action cannot be undone",
    "I have downloaded any data I want to keep",
    "I understand my subscription will be cancelled",
  ]

  const canDelete =
    deleteConfirmation === accountEmail &&
    acceptedTerms.length === deleteTerms.length

  const handleDeleteAccount = () => {
    // Mock delete account functionality
    console.log("Account deletion requested")
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Irreversible and destructive actions
        </p>
      </div>

      {/* Warning Banner */}
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-600">Proceed with Caution</h3>
            <p className="text-xs text-muted-foreground mt-1">
              The actions on this page are permanent and cannot be undone. Please make sure you
              understand the consequences before proceeding.
            </p>
          </div>
        </div>
      </div>

      {/* Export Data */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Export Your Data</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Download a copy of all your data including posts, analytics, and account information.
              This may take a few minutes to prepare.
            </p>
            <Button variant="outline" className="mt-4 rounded-xl gap-2">
              <Download className="w-4 h-4" />
              Request Data Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Clear All Data */}
      <Card className="p-6 border-amber-500/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Clear All Analytics Data</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Permanently delete all analytics data while keeping your account and social connections.
              Your historical performance data will be lost.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 rounded-xl gap-2 border-amber-500/30 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10">
                  <FileX className="w-4 h-4" />
                  Clear Analytics
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Clear Analytics Data?
                  </DialogTitle>
                  <DialogDescription>
                    This will permanently delete all your analytics data. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 text-sm text-amber-700">
                    <p className="font-medium">This will delete:</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• All engagement metrics</li>
                      <li>• Historical performance data</li>
                      <li>• Audience insights</li>
                      <li>• Content analytics</li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Disconnect All Accounts */}
      <Card className="p-6 border-amber-500/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Disconnect All Social Accounts</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Remove all connected social media accounts. You'll need to reconnect them to continue
              using SocialFlow. Scheduled posts will be cancelled.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 rounded-xl gap-2 border-amber-500/30 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10">
                  <LogOut className="w-4 h-4" />
                  Disconnect All
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Disconnect All Accounts?
                  </DialogTitle>
                  <DialogDescription>
                    All your connected social media accounts will be disconnected.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 text-sm text-amber-700">
                    <p className="font-medium">This will:</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• Disconnect all social accounts</li>
                      <li>• Cancel all scheduled posts</li>
                      <li>• Remove access tokens</li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive" className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Disconnect All
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Delete Account */}
      <Card className="p-6 border-red-500/30 bg-red-500/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <UserX className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-600">Delete Account</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Permanently delete your account and all associated data. This action is irreversible
              and will immediately cancel your subscription.
            </p>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="mt-4 rounded-xl gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <ShieldAlert className="w-5 h-5" />
                    Delete Account Permanently
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. Please read carefully before proceeding.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                  {/* Warning */}
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <h4 className="text-sm font-semibold text-red-600 mb-2">
                      What will be deleted:
                    </h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• All your posts and scheduled content</li>
                      <li>• All analytics and performance data</li>
                      <li>• All connected social accounts</li>
                      <li>• All team members and permissions</li>
                      <li>• Your subscription and payment history</li>
                      <li>• All templates and saved content</li>
                    </ul>
                  </div>

                  {/* Confirmation Checkboxes */}
                  <div className="space-y-3">
                    {deleteTerms.map((term, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Checkbox
                          id={`term-${index}`}
                          checked={acceptedTerms.includes(term)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAcceptedTerms([...acceptedTerms, term])
                            } else {
                              setAcceptedTerms(acceptedTerms.filter((t) => t !== term))
                            }
                          }}
                        />
                        <Label
                          htmlFor={`term-${index}`}
                          className="text-xs text-muted-foreground cursor-pointer"
                        >
                          {term}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Email Confirmation */}
                  <div className="space-y-2">
                    <Label htmlFor="delete-confirm" className="text-sm">
                      Type <span className="font-mono font-bold">{accountEmail}</span> to confirm
                    </Label>
                    <Input
                      id="delete-confirm"
                      placeholder="Enter your email"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      className={cn(
                        "rounded-xl",
                        deleteConfirmation === accountEmail
                          ? "border-green-500 focus-visible:ring-green-500"
                          : ""
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDeleteDialogOpen(false)
                      setDeleteConfirmation("")
                      setAcceptedTerms([])
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={!canDelete}
                    onClick={handleDeleteAccount}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Forever
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Support Notice */}
      <div className="p-4 rounded-xl bg-muted/40 text-center">
        <p className="text-xs text-muted-foreground">
          Need help? Contact our support team before making any permanent changes.{" "}
          <a href="#" className="text-primary hover:underline">
            Get Support
          </a>
        </p>
      </div>
    </div>
  )
}
