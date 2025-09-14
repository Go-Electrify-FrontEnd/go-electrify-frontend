import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Battery,
  Zap,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

export function StationsContent() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Quản Lý Trạm Sạc
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Tổng quan và trạng thái của tất cả các trạm sạc
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Export Data (CSV)
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            Add Station
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Stations
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-chart-3 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +2 from last week
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Energy Delivered
            </CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247 kWh</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-chart-3 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from yesterday
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-chart-5 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                -3 from peak hour
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-chart-3 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% from yesterday
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Station Status */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Station Status</CardTitle>
            <CardDescription className="text-sm">
              Real-time status of all charging stations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  id: "ST-001",
                  name: "Downtown Plaza",
                  status: "active",
                  usage: 85,
                  sessions: 3,
                },
                {
                  id: "ST-002",
                  name: "Shopping Mall",
                  status: "active",
                  usage: 92,
                  sessions: 4,
                },
                {
                  id: "ST-003",
                  name: "Office Complex",
                  status: "maintenance",
                  usage: 0,
                  sessions: 0,
                },
                {
                  id: "ST-004",
                  name: "Residential Area",
                  status: "active",
                  usage: 67,
                  sessions: 2,
                },
                {
                  id: "ST-005",
                  name: "Highway Rest Stop",
                  status: "active",
                  usage: 78,
                  sessions: 5,
                },
              ].map((station) => (
                <div
                  key={station.id}
                  className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm sm:text-base">
                          {station.name}
                        </span>
                        <Badge
                          variant={
                            station.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {station.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {station.status}
                        </Badge>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {station.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:gap-4">
                    <div className="text-left sm:text-right">
                      <div className="text-xs sm:text-sm font-medium">
                        {station.sessions} sessions
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {station.usage}% capacity
                      </div>
                    </div>
                    <div className="w-16 sm:w-24">
                      <Progress value={station.usage} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <Button
                className="w-full justify-start bg-transparent text-sm"
                variant="outline"
                size="sm"
              >
                <Zap className="mr-2 h-4 w-4" />
                Add New Station
              </Button>
              <Button
                className="w-full justify-start bg-transparent text-sm"
                variant="outline"
                size="sm"
              >
                <Activity className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button
                className="w-full justify-start bg-transparent text-sm"
                variant="outline"
                size="sm"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <AlertTriangle className="h-4 w-4 text-chart-5 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Station ST-003 Offline</p>
                  <p className="text-xs text-muted-foreground">
                    Maintenance required
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      2 hours ago
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <CheckCircle className="h-4 w-4 text-chart-3 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">High Usage Alert</p>
                  <p className="text-xs text-muted-foreground">
                    ST-002 at 92% capacity
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      15 minutes ago
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
