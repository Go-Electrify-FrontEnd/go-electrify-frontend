"use client";

import { useState } from "react";
import { createStation } from "@/actions/stations-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddressSearch from "@/components/shared/address-search";

interface StationCreateProps {
  onCancel?: () => void;
}

export default function StationCreate({ onCancel }: StationCreateProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [useManualCoords, setUseManualCoords] = useState(false);
  const [latitude, setLatitude] = useState("10.8231");
  const [longitude, setLongitude] = useState("106.6297");

  // Get current location using browser geolocation API
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Định vị địa lý không được hỗ trợ bởi trình duyệt của bạn");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        toast.success("Đã phát hiện vị trí thành công");
        setIsLocating(false);
      },
      (error) => {
        toast.error(`Không thể lấy vị trí: ${error.message}`);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      await createStation(formData);
      toast.success("Đã tạo trạm thành công!");
      setOpen(false);
    } catch (error) {
      toast.error("Không thể tạo trạm. Vui lòng thử lại.");
      console.error("Station creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo Trạm
        </Button>
      </DialogTrigger>
      <DialogContent className="no-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="text-primary h-5 w-5" />
            Tạo Trạm Sạc Mới
          </DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết bên dưới để thêm trạm sạc mới vào mạng lưới.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit}>
          <input
            type="hidden"
            name="useManualCoords"
            value={useManualCoords.toString()}
          />
          <div className="space-y-6">
            {/* Station Name */}
            <div className="grid gap-3">
              <label htmlFor="name" className="text-sm font-medium">
                Tên Trạm *
              </label>
              <Input
                id="name"
                name="name"
                placeholder="VD: Trạm Trung Tâm Thành Phố Hồ Chí Minh"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="grid gap-3">
                <label htmlFor="description" className="text-sm font-medium">
                  Mô tả
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Mô tả ngắn gọn về vị trí trạm, địa danh lân cận, hoặc tính năng đặc biệt..."
                  rows={4}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Chi tiết tùy chọn về trạm (tối đa 500 ký tự)
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <div className="grid gap-3">
                <label htmlFor="image" className="text-sm font-medium">
                  Ảnh Trạm
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="text-muted-foreground file:bg-muted block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Tải lên ảnh cho trạm (tùy chọn). Chỉ chấp nhận tệp hình ảnh.
              </p>
            </div>

            {/* Location Section */}
            <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Vị Trí Trạm *</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUseManualCoords(!useManualCoords)}
                >
                  {useManualCoords ? "Sử Dụng Địa Chỉ" : "Sử Dụng Tọa Độ"}
                </Button>
              </div>

              {!useManualCoords ? (
                /* Address Input Mode */
                <div className="space-y-2">
                  <div className="grid gap-3">
                    <label htmlFor="address" className="text-sm font-medium">
                      Địa Chỉ
                    </label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="VD: 123 Đường Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh"
                      required={!useManualCoords}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Nhập địa chỉ đầy đủ - tọa độ sẽ được xác định tự động
                  </p>
                </div>
              ) : (
                /* Manual Coordinates Mode */
                <>
                  <div className="space-y-2">
                    <div className="grid gap-3">
                      <label htmlFor="address" className="text-sm font-medium">
                        Địa Chỉ (Tùy Chọn)
                      </label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="VD: 123 Đường Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh"
                      />
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Tùy chọn: Bạn vẫn có thể cung cấp địa chỉ để tham khảo
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Tọa Độ</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGetCurrentLocation}
                      disabled={isLocating}
                    >
                      {isLocating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang Phát Hiện...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Sử Dụng Vị Trí Hiện Tại
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="grid gap-3">
                        <label
                          htmlFor="latitude"
                          className="text-sm font-medium"
                        >
                          Vĩ Độ
                        </label>
                        <Input
                          id="latitude"
                          name="latitude"
                          type="number"
                          step="0.000001"
                          placeholder="10.8231"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          required={useManualCoords}
                        />
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Phạm vi: -90 đến 90
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="grid gap-3">
                        <label
                          htmlFor="longitude"
                          className="text-sm font-medium"
                        >
                          Kinh Độ
                        </label>
                        <Input
                          id="longitude"
                          name="longitude"
                          type="number"
                          step="0.000001"
                          placeholder="106.6297"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          required={useManualCoords}
                        />
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Phạm vi: -180 đến 180
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-xs">
                    💡 Mẹo: Nhấp &ldquo;Sử Dụng Vị Trí Hiện Tại&rdquo; hoặc lấy
                    tọa độ từ Google Maps
                  </p>
                </>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <div className="grid gap-3">
                <label htmlFor="status" className="text-sm font-medium">
                  Trạng Thái Trạm *
                </label>
                <Select name="status" defaultValue="active" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt Động</SelectItem>
                    <SelectItem value="inactive">Không Hoạt Động</SelectItem>
                    <SelectItem value="maintenance">Bảo Trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-muted-foreground text-xs">
                Trạng thái hoạt động hiện tại của trạm sạc
              </p>
            </div>
          </div>

          <div>
            <AddressSearch />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang Tạo...
                </>
              ) : (
                <>Tạo Trạm</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
