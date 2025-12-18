"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Receipt,
  Download,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  Calendar,
  DollarSign,
  Filter,
  ChevronDown,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Invoice } from "@/app/billing/page"

interface BillingHistoryProps {
  invoices: Invoice[]
  onDownloadInvoice: (invoiceId: string) => void
  onViewInvoice: (invoiceId: string) => void
}

const statusConfig = {
  paid: { label: "Paid", color: "text-green-600", bgColor: "bg-green-500/10", icon: CheckCircle2 },
  pending: { label: "Pending", color: "text-amber-600", bgColor: "bg-amber-500/10", icon: Clock },
  failed: { label: "Failed", color: "text-red-600", bgColor: "bg-red-500/10", icon: XCircle },
  refunded: { label: "Refunded", color: "text-blue-600", bgColor: "bg-blue-500/10", icon: AlertTriangle },
}

export function BillingHistory({
  invoices,
  onDownloadInvoice,
  onViewInvoice,
}: BillingHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")

  // Get unique years from invoices
  const years = [...new Set(invoices.map((inv) => new Date(inv.date).getFullYear()))].sort((a, b) => b - a)

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    const matchesYear =
      yearFilter === "all" || new Date(invoice.date).getFullYear().toString() === yearFilter

    return matchesSearch && matchesStatus && matchesYear
  })

  // Calculate totals
  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0)
  const totalPending = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="text-xl font-bold text-foreground">${totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-foreground">${totalPending.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Invoices</p>
              <p className="text-xl font-bold text-foreground">{invoices.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices..."
              className="pl-9 rounded-xl bg-muted/60 border-0"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] rounded-xl bg-muted/60 border-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {/* Year Filter */}
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px] rounded-xl bg-muted/60 border-0">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Invoice List */}
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/40 border-b border-border text-xs font-medium text-muted-foreground">
          <div className="col-span-3">Invoice</div>
          <div className="col-span-3">Description</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Invoice Rows */}
        <div className="divide-y divide-border">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => {
              const status = statusConfig[invoice.status]
              const StatusIcon = status.icon

              return (
                <div
                  key={invoice.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 hover:bg-muted/20 transition-colors"
                >
                  {/* Invoice ID */}
                  <div className="sm:col-span-3">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-muted-foreground sm:hidden" />
                      <span className="text-sm font-medium text-foreground">{invoice.id}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-3">
                    <p className="text-sm text-muted-foreground truncate">{invoice.description}</p>
                  </div>

                  {/* Date */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 sm:hidden" />
                      {format(invoice.date, "MMM d, yyyy")}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground sm:hidden" />
                      <span className="text-sm font-semibold text-foreground">
                        ${invoice.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="sm:col-span-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold",
                        status.bgColor,
                        status.color,
                        "border-transparent"
                      )}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="sm:col-span-1 flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewInvoice(invoice.id)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDownloadInvoice(invoice.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="px-6 py-12 text-center">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No invoices found</p>
              <p className="text-xs text-muted-foreground">
                {searchQuery || statusFilter !== "all" || yearFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Your invoices will appear here"}
              </p>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredInvoices.length > 0 && filteredInvoices.length >= 10 && (
          <div className="px-6 py-4 border-t border-border text-center">
            <Button variant="ghost" className="gap-2 text-sm">
              Load More
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
