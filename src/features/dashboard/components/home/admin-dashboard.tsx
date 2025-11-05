"use client";

import { User, UserApi } from "@/features/users/schemas/user.types";
import {
  MapPin,
  Users,
  Car,
  Plug,
  Package,
  ArrowUpRight,
  ReceiptText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionHeader from "@/components/shared/section-header";
import StatCard from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import SectionContent from "@/components/shared/section-content";
import { Station } from "@/features/stations/schemas/station.schema";
import { useUser } from "@/contexts/user-context";
import { ConnectorType } from "@/features/connector-type/schemas/connector-type.schema";
import { CarModel } from "@/features/vehicle-models/schemas/vehicle-model.schema";
import { Subscription } from "@/features/subscriptions/schemas/subscription.schema";
import { ReportedIncident } from "@/app/(app-layout)/dashboard/admin/incident-reports/page";
import InsightsClient from "@/app/(app-layout)/dashboard/admin/insights/InsightsClient";

interface AdminDashboardProps {
  users: UserApi[];
  stations: Station[];
  connectorTypes: ConnectorType[];
  carModels: CarModel[];
  subscriptions: Subscription[];
  reportedIncidents: ReportedIncident[];
}

export function AdminDashboard({
  users,
  stations,
  connectorTypes,
  carModels,
  subscriptions,
  reportedIncidents,
}: AdminDashboardProps) {
  const { user } = useUser();
  return (
    <div>
      <SectionHeader
        title={`Chào mừng quản trị viên, ${user!.name || user!.email}!`}
        subtitle="Tổng quan hệ thống và quản lý toàn diện"
      />

      <SectionContent className="mt-8">
        {/* Primary Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Trạm Sạc" icon={<MapPin />} value={stations.length}>
            {stations.filter((station) => station.status === "ACTIVE").length}{" "}
            hoạt động
          </StatCard>

          <StatCard title="Người Dùng" icon={<Users />} value={users.length}>
            {users.filter((user) => user.role === "driver").length} tài xế
          </StatCard>

          <StatCard
            title="Loại Cổng"
            icon={<Plug />}
            value={connectorTypes.length}
          >
            Chuẩn kết nối
          </StatCard>

          <StatCard title="Mẫu Xe" icon={<Car />} value={carModels.length}>
            Xe điện hỗ trợ
          </StatCard>
        </div>

        {/* Management Table */}
        <Card>
          <CardHeader>
            <CardTitle>Quản Lý Hệ Thống</CardTitle>
            <CardDescription>
              Truy cập nhanh các chức năng quản trị
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chức năng</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Trạm sạc
                    </div>
                  </TableCell>
                  <TableCell>{stations.length}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {
                        stations.filter(
                          (station) => station.status === "ACTIVE",
                        ).length
                      }{" "}
                      hoạt động
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href="/dashboard/admin/stations"
                      className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      Quản lý <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Plug className="h-4 w-4" />
                      Loại cổng sạc
                    </div>
                  </TableCell>
                  <TableCell>{connectorTypes.length}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Chuẩn</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href="/dashboard/admin/connector-type"
                      className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      Quản lý <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Mẫu xe điện
                    </div>
                  </TableCell>
                  <TableCell>{carModels.length}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Hỗ trợ</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href="/dashboard/admin/vehicle-models"
                      className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      Quản lý <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Gói dịch vụ
                    </div>
                  </TableCell>
                  <TableCell>{subscriptions.length}</TableCell>
                  <TableCell>
                    <Badge>Đang bán</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href="/dashboard/admin/subscriptions"
                      className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      Quản lý <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Báo cáo sự cố
                    </div>
                  </TableCell>
                  <TableCell>{reportedIncidents.length}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Đang theo dõi</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href="/dashboard/admin/incident-reports"
                      className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      Quản lý <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <InsightsClient />
      </SectionContent>
    </div>
  );
}
