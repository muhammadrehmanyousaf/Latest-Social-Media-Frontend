"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CreditCard,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  X,
  Shield,
  Lock,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "@/app/billing/page"

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[]
  onAddPaymentMethod: (method: Omit<PaymentMethod, "id">) => void
  onRemovePaymentMethod: (methodId: string) => void
  onSetDefault: (methodId: string) => void
}

const cardBrands: Record<string, { name: string; color: string; gradient: string }> = {
  visa: { name: "Visa", color: "#1A1F71", gradient: "from-blue-600 to-blue-800" },
  mastercard: { name: "Mastercard", color: "#EB001B", gradient: "from-red-500 to-orange-500" },
  amex: { name: "American Express", color: "#006FCF", gradient: "from-blue-500 to-blue-700" },
  discover: { name: "Discover", color: "#FF6000", gradient: "from-orange-500 to-orange-600" },
}

export function PaymentMethods({
  paymentMethods,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onSetDefault,
}: PaymentMethodsProps) {
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const handleAddCard = () => {
    // Simulated card addition
    const brand = newCard.number.startsWith("4")
      ? "visa"
      : newCard.number.startsWith("5")
      ? "mastercard"
      : newCard.number.startsWith("3")
      ? "amex"
      : "visa"

    onAddPaymentMethod({
      type: "card",
      brand,
      last4: newCard.number.slice(-4),
      expiryMonth: parseInt(newCard.expiry.split("/")[0]),
      expiryYear: parseInt("20" + newCard.expiry.split("/")[1]),
      isDefault: paymentMethods.length === 0,
    })

    setNewCard({ number: "", expiry: "", cvc: "", name: "" })
    setShowAddCard(false)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4)
    }
    return v
  }

  return (
    <div className="space-y-6">
      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const brand = cardBrands[method.brand] || cardBrands.visa
          const isExpiringSoon =
            new Date(method.expiryYear, method.expiryMonth - 1) <
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          const isExpired =
            new Date(method.expiryYear, method.expiryMonth - 1) < new Date()

          return (
            <Card
              key={method.id}
              className={cn(
                "overflow-hidden transition-all",
                method.isDefault && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Card Visual */}
                <div
                  className={cn(
                    "w-20 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br",
                    brand.gradient
                  )}
                >
                  <CreditCard className="w-6 h-6 text-white" />
                </div>

                {/* Card Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      {brand.name} ending in {method.last4}
                    </span>
                    {method.isDefault && (
                      <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
                        <Star className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                    {isExpired && (
                      <Badge className="bg-red-500/10 text-red-600 border-0 text-[10px]">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Expired
                      </Badge>
                    )}
                    {isExpiringSoon && !isExpired && (
                      <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[10px]">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-xl"
                      onClick={() => onSetDefault(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemovePaymentMethod(method.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}

        {paymentMethods.length === 0 && !showAddCard && (
          <Card className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No payment methods</p>
            <p className="text-xs text-muted-foreground mb-4">
              Add a payment method to upgrade your plan
            </p>
            <Button onClick={() => setShowAddCard(true)} className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Add Payment Method
            </Button>
          </Card>
        )}
      </div>

      {/* Add New Card Form */}
      {showAddCard ? (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Add New Card</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowAddCard(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-4">
            {/* Card Preview */}
            <div className="w-full max-w-sm mx-auto h-48 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-9 rounded bg-gradient-to-br from-yellow-300 to-yellow-500" />
                <CreditCard className="w-8 h-8 text-white/50" />
              </div>

              <p className="text-lg font-mono text-white tracking-wider mb-4">
                {newCard.number || "•••• •••• •••• ••••"}
              </p>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-white/50 uppercase mb-1">Card Holder</p>
                  <p className="text-sm text-white font-medium">
                    {newCard.name || "YOUR NAME"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase mb-1">Expires</p>
                  <p className="text-sm text-white font-medium">
                    {newCard.expiry || "MM/YY"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Form */}
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={newCard.number}
                  onChange={(e) =>
                    setNewCard({ ...newCard, number: formatCardNumber(e.target.value) })
                  }
                  maxLength={19}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={newCard.name}
                  onChange={(e) =>
                    setNewCard({ ...newCard, name: e.target.value.toUpperCase() })
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={newCard.expiry}
                    onChange={(e) =>
                      setNewCard({ ...newCard, expiry: formatExpiry(e.target.value) })
                    }
                    maxLength={5}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={newCard.cvc}
                    onChange={(e) =>
                      setNewCard({
                        ...newCard,
                        cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    maxLength={4}
                    type="password"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 max-w-sm mx-auto">
              <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Secure Payment</p>
                <p className="text-xs text-blue-600/80">
                  Your card information is encrypted and securely stored. We never store your full
                  card number.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
            <Button variant="ghost" onClick={() => setShowAddCard(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCard}
              disabled={
                !newCard.number ||
                !newCard.name ||
                !newCard.expiry ||
                !newCard.cvc ||
                newCard.number.replace(/\s/g, "").length < 16
              }
              className="gap-2 rounded-xl"
            >
              <Lock className="w-4 h-4" />
              Add Card
            </Button>
          </div>
        </Card>
      ) : (
        paymentMethods.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowAddCard(true)}
            className="gap-2 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Add New Payment Method
          </Button>
        )
      )}
    </div>
  )
}
