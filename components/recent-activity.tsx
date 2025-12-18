import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight } from "lucide-react"

const activities = [
  {
    path: "/api/users",
    method: "GET",
    status: "200",
    requests: "45.2K",
    latency: "124ms",
  },
  {
    path: "/api/products",
    method: "GET",
    status: "200",
    requests: "32.1K",
    latency: "89ms",
  },
  {
    path: "/api/orders",
    method: "POST",
    status: "201",
    requests: "18.7K",
    latency: "156ms",
  },
  {
    path: "/api/auth/login",
    method: "POST",
    status: "200",
    requests: "12.4K",
    latency: "234ms",
  },
  {
    path: "/api/analytics",
    method: "GET",
    status: "500",
    requests: "8.9K",
    latency: "342ms",
  },
]

function getStatusColor(status: string) {
  if (status.startsWith("2")) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  if (status.startsWith("4")) return "bg-amber-500/20 text-amber-400 border-amber-500/30"
  if (status.startsWith("5")) return "bg-red-500/20 text-red-400 border-red-500/30"
  return "bg-muted text-muted-foreground"
}

function getMethodColor(method: string) {
  switch (method) {
    case "GET":
      return "text-emerald-400"
    case "POST":
      return "text-blue-400"
    case "PUT":
      return "text-amber-400"
    case "DELETE":
      return "text-red-400"
    default:
      return "text-muted-foreground"
  }
}

export function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Paths</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 bg-secondary border-border h-9" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Request Path</th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Method</th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Requests</th>
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Avg Latency</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-2">
                    <code className="text-sm font-mono text-foreground">{activity.path}</code>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`text-sm font-mono font-medium ${getMethodColor(activity.method)}`}>
                      {activity.method}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant="outline" className={`font-mono text-xs ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm text-foreground">{activity.requests}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm text-muted-foreground">{activity.latency}</span>
                  </td>
                  <td className="py-3 px-2">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
