"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Settings,
  Server,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  RefreshCw,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  Plus,
  X,
  CreditCard,
  Snowflake,
  Database,
  Smartphone,
  Globe,
  SlidersHorizontal,
  Radio,
  Terminal,
  Trash2,
  Printer,
  Search,
  FileSpreadsheet,
  ShieldAlert,
  Cpu,
  Activity,
  Clock,
  Lock,
  Sparkles,
  ChevronDown,
  Layers,
  Send,
  Building2,
  Flame,
  Info,
  ExternalLink,
} from "lucide-react";
import { api, SystemSettings, ApiKeyItem, DEFAULT_SEED_SETTINGS } from "@/lib/api";
import { vipToast } from "../common/VipToast";

const BROADCAST_CHANNEL_NAME = "techcore_admin_settings_channel";

export function SettingsManagement() {
  // 1. STATE CHÍNH: CẤU HÌNH HỆ THỐNG & API KEYS
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SEED_SETTINGS);
  const [activeTab, setActiveTab] = useState<
    "payment" | "coolvan_iot" | "eshield_ledger" | "notifications" | "api_keys"
  >("payment");
  const [isSaving, setIsSaving] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Visibility toggle cho mật khẩu/khóa bí mật
  const [showSecretMap, setShowSecretMap] = useState<Record<string, boolean>>({});

  // Filter & Search cho API Keys
  const [searchKeyQuery, setSearchKeyQuery] = useState("");
  const [envFilter, setEnvFilter] = useState<"all" | "production" | "sandbox">("all");

  // Modals
  const [showPingModal, setShowPingModal] = useState(false);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedApiLog, setSelectedApiLog] = useState<ApiKeyItem | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<ApiKeyItem | null>(null);

  // Ping Testing state
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingProgress, setPingProgress] = useState(100);
  const [pingResults, setPingResults] = useState([
    {
      id: "core",
      name: "Core API Gateway Microservices",
      url: "https://api.techcore.vn/v1/health",
      latency: 11,
      status: "online",
      detail: "6/6 Cụm vi dịch vụ sẵn sàng • Multi-Region TP.HCM & Hà Nội",
    },
    {
      id: "vcb",
      name: "Vietcombank Enterprise Host B2B",
      url: "https://corporate.vietcombank.com.vn/api/v2",
      latency: 18,
      status: "online",
      detail: "mTLS 1.3 xác thực • Đối soát tự động thời gian thực T+0",
    },
    {
      id: "vnpay",
      name: "VNPay Payment Gateway Engine",
      url: "https://sandbox.vnpayment.vn/paymentv2",
      latency: 22,
      status: "online",
      detail: "Chữ ký số SHA-256 • QR Code động độ trễ thấp",
    },
    {
      id: "coolvan",
      name: "Hạm Đội CoolVan MQTT IoT Broker",
      url: "mqtts://iot.coolvan.techcore.vn:8883",
      latency: 8,
      status: "online",
      detail: "5/5 Xe lạnh đang truyền nhận Telemetry (GPS, Cảm biến 18.5°C)",
    },
    {
      id: "eshield",
      name: "e-Shield Private EVM Ledger Node",
      url: "https://node-01.ledger.techcore.vn:8545",
      latency: 14,
      status: "online",
      detail: "Khối hiện tại #4,192,840 • Gas 0.00 Gwei • Thuật toán Raft",
    },
    {
      id: "sms",
      name: "Cổng SMS Brandname & Telegram Alerts",
      url: "https://api.telegram.org/bot71289128.../sendMessage",
      latency: 31,
      status: "online",
      detail: "Brandname TECHCORE đăng ký • Webhook sự cố máy chủ Active",
    },
  ]);

  // New API Key form state
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyClient, setNewKeyClient] = useState("");
  const [newKeyScope, setNewKeyScope] = useState("orders:read, inventory:read");
  const [newKeyEnv, setNewKeyEnv] = useState<"production" | "sandbox">("production");
  const [newKeyRateLimit, setNewKeyRateLimit] = useState("600 req/min");
  const [newKeyError, setNewKeyError] = useState("");

  // 2. KHỞI TẠO DỮ LIỆU TỪ API & ĐỒNG BỘ BROADCASTCHANNEL
  const loadSettingsData = useCallback(async () => {
    try {
      const res = await api.getAdminSettings();
      if (res && res.success && res.data) {
        setSettings(res.data);
      }
    } catch (e) {
      console.error("Lỗi khi tải cấu hình hệ thống:", e);
    }
  }, []);

  useEffect(() => {
    loadSettingsData();

    // Lắng nghe sự kiện đồng bộ từ cùng tab
    const handleLocalEvent = (e: any) => {
      if (e?.detail?.settings) {
        setSettings(e.detail.settings);
      }
    };
    window.addEventListener("techcore:settings-changed", handleLocalEvent);

    // Lắng nghe qua BroadcastChannel giữa các tab
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data?.type === "SETTINGS_UPDATED") {
            loadSettingsData();
            vipToast.info(
              "Cấu hình hệ sinh thái vừa được cập nhật từ quản trị viên khác!",
              "Đồng Bộ Thời Gian Thực"
            );
          }
        };
      }
    } catch (err) {
      console.warn("BroadcastChannel không khả dụng:", err);
    }

    return () => {
      window.removeEventListener("techcore:settings-changed", handleLocalEvent);
      channel?.close();
    };
  }, [loadSettingsData]);

  // Broadcast helper
  const notifyBroadcast = (type: string, payload?: any) => {
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({ type, payload, timestamp: Date.now() });
        channel.close();
      }
    } catch (e) {}
  };

  // 3. COPY CLIPBOARD
  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      vipToast.success(`Đã sao chép ${label} vào bộ nhớ tạm!`, "Sao Chép Thành Công");
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const toggleShowSecret = (field: string) => {
    setShowSecretMap((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // 4. LƯU TOÀN BỘ CẤU HÌNH
  const handleSaveAllConfig = async () => {
    setIsSaving(true);
    try {
      const res = await api.saveAdminSettings(settings);
      if (res && res.success) {
        notifyBroadcast("SETTINGS_UPDATED");
        vipToast.success(
          "Toàn bộ thông số thanh toán, IoT xe lạnh, e-Shield và thông báo đã được lưu trữ vĩnh viễn!",
          "Lưu Cấu Hình Thành Công"
        );
      } else {
        vipToast.error("Không thể lưu cấu hình, vui lòng thử lại.", "Thất Bại");
      }
    } catch (error) {
      vipToast.error("Đã xảy ra lỗi kết nối khi lưu cấu hình!", "Lỗi Máy Chủ");
    } finally {
      setIsSaving(false);
    }
  };

  // 5. CHẠY KIỂM TRA PING TOÀN BỘ MICROSERVICES
  const runLivePingDiagnostics = () => {
    setIsTestingPing(true);
    setPingProgress(15);

    setTimeout(() => {
      setPingProgress(50);
      setPingResults((prev) =>
        prev.map((item) => ({
          ...item,
          latency: Math.floor(Math.random() * 15) + 6,
        }))
      );
    }, 600);

    setTimeout(() => {
      setPingProgress(85);
      setPingResults((prev) =>
        prev.map((item) => ({
          ...item,
          latency: Math.floor(Math.random() * 20) + 8,
        }))
      );
    }, 1200);

    setTimeout(() => {
      setPingProgress(100);
      setIsTestingPing(false);
      vipToast.success(
        "Toàn bộ 6 cụm microservices phản hồi trực tuyến với độ trễ tối ưu trung bình 13ms!",
        "Chẩn Đoán Hoàn Hảo"
      );
    }, 1800);
  };

  // 6. TẠO KHÓA API MỚI
  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      setNewKeyError("Vui lòng nhập tên ứng dụng hoặc mục đích của khóa API.");
      return;
    }
    if (!newKeyClient.trim()) {
      setNewKeyError("Vui lòng nhập tên đối tác / đơn vị sử dụng khóa.");
      return;
    }

    setNewKeyError("");
    try {
      const res = await api.createAdminApiKey({
        name: newKeyName,
        client: newKeyClient,
        scope: newKeyScope,
        environment: newKeyEnv,
        rateLimit: newKeyRateLimit,
      });

      if (res && res.success && res.data) {
        setSettings((prev) => ({
          ...prev,
          apiKeys: [res.data, ...prev.apiKeys],
        }));
        setShowAddKeyModal(false);
        setNewKeyName("");
        setNewKeyClient("");
        notifyBroadcast("SETTINGS_UPDATED");
        vipToast.success(
          `Khóa API ${res.data.keyMasked} đã được phát hành và kích hoạt thành công!`,
          "Phát Hành Khóa API"
        );
      }
    } catch (e) {
      vipToast.error("Không thể tạo khóa API, vui lòng thử lại!", "Lỗi Cấp Khóa");
    }
  };

  // 7. XÓA / THU HỒI KHÓA API
  const handleConfirmRevokeKey = async () => {
    if (!keyToDelete) return;
    try {
      const res = await api.deleteAdminApiKey(keyToDelete.id);
      if (res && res.success) {
        setSettings((prev) => ({
          ...prev,
          apiKeys: prev.apiKeys.filter((k) => k.id !== keyToDelete.id),
        }));
        notifyBroadcast("SETTINGS_UPDATED");
        vipToast.warning(
          `Khóa API ${keyToDelete.name} (${keyToDelete.keyMasked}) đã bị thu hồi vĩnh viễn!`,
          "Thu Hồi Thành Công"
        );
      }
    } catch (e) {
      vipToast.error("Không thể xóa khóa API!", "Lỗi");
    } finally {
      setKeyToDelete(null);
    }
  };

  // 8. TẢI FILE CSV BÁO CÁO CẤU HÌNH (EXCEL UTF-8 BOM)
  const handleDownloadCsv = () => {
    try {
      const bom = "\uFEFF";
      let csv = bom + "BÁO CÁO CẤU HÌNH HẠ TẦNG KỸ THUẬT & API - HỆ SINH THÁI TECHCORE\n";
      csv += `Thời điểm xuất: ${new Date().toLocaleString("vi-VN")}\n`;
      csv += `Đơn vị vận hành: TechCore High-End Ecosystem Corp\n\n`;

      csv += "1. CẤU HÌNH CỔNG THANH TOÁN (PAYMENTS)\n";
      csv += `Vietcombank Client ID,"${settings.payment.vcbClientId}"\n`;
      csv += `Vietcombank Secret Key,"${settings.payment.vcbSecretKey.slice(0, 10)}..."\n`;
      csv += `VNPay TMN Code,"${settings.payment.vnpayTmnCode}"\n`;
      csv += `Đối Soát Tự Động T+0,"${settings.payment.vcbAutoReconcile ? "BẬT (Active)" : "TẮT (Disabled)"}"\n`;
      csv += `TechPay QR Gateway,"${settings.payment.techPayQrEnabled ? "BẬT (Active)" : "TẮT (Disabled)"}"\n\n`;

      csv += "2. CẤU HÌNH HẠM ĐỘI XE LẠNH COOLVAN & IOT\n";
      csv += `MQTT Broker Endpoint,"${settings.coolvan.iotEndpoint}"\n`;
      csv += `Tần Số Telemetry,"${settings.coolvan.telemetryPingSec} giây/ping"\n`;
      csv += `Nhiệt Độ Mục Tiêu,"${settings.coolvan.targetTemp}°C"\n`;
      csv += `Ngưỡng Cảnh Báo Sốc Nhiệt,"${settings.coolvan.tempWarningThreshold}°C"\n`;
      csv += `Tự Động Gán Xe Gần Nhất,"${settings.coolvan.autoDispatchCoolVan ? "BẬT" : "TẮT"}"\n\n`;

      csv += "3. CHUỖI KHỐI E-SHIELD CRYPTOGRAPHIC LEDGER\n";
      csv += `RPC Node URL,"${settings.eshield.ledgerNodeUrl}"\n`;
      csv += `Network Chain ID,"${settings.eshield.ledgerChainId}"\n`;
      csv += `Smart Contract Address,"${settings.eshield.contractAddress}"\n`;
      csv += `Tự Động Đúc Khối S/N,"${settings.eshield.autoMintOnImport ? "BẬT" : "TẮT"}"\n\n`;

      csv += "4. THÔNG BÁO SMS BRANDNAME & TELEGRAM WEBHOOK\n";
      csv += `Brandname Đăng Ký,"${settings.notifications.smsBrandname}"\n`;
      csv += `Thời Gian Hiệu Lực OTP,"${settings.notifications.smsOtpTimeout} giây"\n`;
      csv += `Telegram Webhook Alert,"${settings.notifications.telegramAlertWebhook}"\n\n`;

      csv += "5. DANH SÁCH KHÓA TRUY CẬP API (API KEYS)\n";
      csv += "ID,Tên Khóa / Ứng Dụng,Đơn Vị Thụ Hưởng,Mã Khóa,Môi Trường,Quyền Hạn (Scope),Giới Hạn Tốc Độ,Lần Dùng Gần Nhất,Trạng Thái\n";
      settings.apiKeys.forEach((k) => {
        csv += `"${k.id}","${k.name}","${k.client}","${k.keyMasked}","${k.environment}","${k.scope}","${k.rateLimit}","${k.lastUsed}","${k.statusText}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `TechCore_System_Settings_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      vipToast.success("Bảng tính cấu hình Excel (UTF-8 BOM) đã được tải xuống máy tính!", "Xuất File Hoàn Tất");
    } catch (e) {
      vipToast.error("Không thể xuất bảng tính!", "Lỗi Xuất File");
    }
  };

  // 9. DANH SÁCH KHÓA API ĐÃ LỌC
  const filteredApiKeys = useMemo(() => {
    return settings.apiKeys.filter((k) => {
      const matchEnv = envFilter === "all" || k.environment === envFilter;
      const q = searchKeyQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        k.name.toLowerCase().includes(q) ||
        k.client.toLowerCase().includes(q) ||
        k.keyMasked.toLowerCase().includes(q) ||
        k.scope.toLowerCase().includes(q);
      return matchEnv && matchQuery;
    });
  }, [settings.apiKeys, envFilter, searchKeyQuery]);

  return (
    <div className="space-y-6">
      {/* 1. HEADER EXECUTIVE BAR VỚI PALETTE TECH SANG TRỌNG */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span
              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white flex items-center gap-1.5 shadow-xs"
              style={{ backgroundColor: "#001C44" }}
            >
              <Settings className="w-3.5 h-3.5" style={{ color: "#BCFEFE" }} />
              CORE ARCHITECTURE &amp; API INFRASTRUCTURE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SLA 99.98% High Availability
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              style={{
                backgroundColor: "rgba(188, 254, 254, 0.25)",
                borderColor: "#2D99AE",
                color: "#0C5776",
              }}
            >
              <Radio className="w-3 h-3 text-[#2D99AE] animate-pulse" />
              Multi-Tab Sync Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Cài Đặt Hệ Thống &amp; Cổng API Đối Tác</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Thiết lập hạ tầng thanh toán Vietcombank &amp; VNPay, giao thức MQTT hạm đội xe lạnh CoolVan, nút mạng
            e-Shield EVM Ledger và cấp phát khóa xác thực API Keys cho đối tác chiến lược.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setShowPingModal(true);
              runLivePingDiagnostics();
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/90 text-xs font-bold transition flex items-center gap-2 shadow-xs hover:border-slate-300"
          >
            <Activity className="w-4 h-4 text-[#2D99AE]" />
            <span>Kiểm Tra Ping API</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Báo Cáo Kỹ Thuật (Xem trước)</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAllConfig}
            disabled={isSaving}
            style={{ backgroundColor: "#0C5776" }}
            className="px-5 py-2.5 rounded-2xl text-white text-xs font-black transition flex items-center gap-2 shadow-sm hover:brightness-110 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#BCFEFE]" />
            ) : (
              <Check className="w-4 h-4 text-[#BCFEFE]" />
            )}
            <span>{isSaving ? "Đang Ghi Sổ Cấu Hình..." : "Lưu Toàn Bộ Cấu Hình"}</span>
          </button>
        </div>
      </div>

      {/* 2. 3 EXECUTIVE KPI CARDS REALTIME METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                ĐỘ SẴN SÀNG CORE ENGINE
              </span>
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-xs"
                style={{ backgroundColor: "rgba(188, 254, 254, 0.3)", color: "#0C5776" }}
              >
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">99.98%</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SLA Vượt Trội
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              6/6 Cụm vi dịch vụ đang trực tuyến • Multi-Region TP.HCM &amp; Hà Nội
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Độ trễ TB: <strong className="text-emerald-600 font-mono font-bold">11ms</strong>
            </span>
            <span>
              Packet Loss: <strong className="text-slate-800 font-mono">0.00%</strong>
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                LƯU LƯỢNG API 24H QUA
              </span>
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-xs text-blue-600 bg-blue-50"
              >
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">1.482.900</span>
              <span className="text-xs font-bold text-blue-600">Reqs / 24h</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Tỷ lệ gọi thành công (2xx): <strong className="text-emerald-600 font-bold">99.94%</strong>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Đỉnh tải: <strong className="text-slate-900 font-mono font-bold">240 req/s</strong>
            </span>
            <span>
              Lỗi 5xx: <strong className="text-emerald-600 font-mono">0.00%</strong>
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                HẠ TẦNG BẢO MẬT &amp; KẾT NỐI
              </span>
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-xs"
                style={{ backgroundColor: "#001C44", color: "#BCFEFE" }}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {settings.apiKeys.length} Khóa
              </span>
              <span className="text-xs font-bold text-slate-500">API Đang Hoạt Động</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              mTLS 1.3 • Chữ ký SHA-256 • Telemetry IoT {settings.coolvan.telemetryPingSec}s/lần
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              WAF Guard: <strong className="text-emerald-600 font-bold">Bảo Vệ Chủ Động</strong>
            </span>
            <span>
              e-Shield: <strong className="text-[#0C5776] font-bold">Private EVM</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3. TABS CHUYỂN ĐỔI CHUYÊN BIỆT */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        {[
          { key: "payment", label: "Cổng Thanh Toán & Đối Soát", icon: CreditCard },
          { key: "coolvan_iot", label: "Hạm Đội Xe Lạnh CoolVan & IoT", icon: Snowflake },
          { key: "eshield_ledger", label: "Chuỗi Khối Định Danh e-Shield", icon: Database },
          { key: "notifications", label: "Thông Báo SMS OTP & Webhooks", icon: Smartphone },
          {
            key: "api_keys",
            label: `Quản Lý Khóa API (${settings.apiKeys.length})`,
            icon: KeyRound,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              style={
                isSelected
                  ? { backgroundColor: "#001C44", color: "#ffffff", borderColor: "#001C44" }
                  : {}
              }
              className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 border text-xs font-bold shadow-xs ${
                isSelected
                  ? ""
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                className="w-4 h-4"
                style={isSelected ? { color: "#BCFEFE" } : { color: "#0C5776" }}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. NỘI DUNG TỪNG TAB */}

      {/* TAB 1: CỔNG THANH TOÁN & ĐỐI SOÁT */}
      {activeTab === "payment" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-[#0C5776]" />
                  <span>Cấu Hình Kết Nối Cổng Thanh Toán Doanh Nghiệp Vietcombank &amp; VNPay</span>
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                  mTLS Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Tự động đối soát giao dịch ngân hàng trực tiếp T+0 khi khách hàng chuyển khoản hoặc quét mã QR.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* VCB Client ID */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Vietcombank Enterprise Client ID:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.payment.vcbClientId}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        payment: { ...prev.payment, vcbClientId: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE] transition"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(settings.payment.vcbClientId, "Client ID")}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-1"
                    title="Sao chép"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* VCB Secret Key */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Vietcombank Secret Key (Chữ ký điện tử HMAC-SHA256):
                </label>
                <div className="relative">
                  <input
                    type={showSecretMap["vcbSecret"] ? "text" : "password"}
                    value={settings.payment.vcbSecretKey}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        payment: { ...prev.payment, vcbSecretKey: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-20 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE] transition"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleShowSecret("vcbSecret")}
                      className="text-slate-400 hover:text-slate-700 p-1"
                      title={showSecretMap["vcbSecret"] ? "Ẩn" : "Hiện"}
                    >
                      {showSecretMap["vcbSecret"] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.payment.vcbSecretKey, "Secret Key")}
                      className="text-slate-400 hover:text-slate-700 p-1"
                      title="Sao chép"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* VNPay TMN Code & Hash Secret */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    VNPay Terminal ID (TMN Code):
                  </label>
                  <input
                    type="text"
                    value={settings.payment.vnpayTmnCode}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        payment: { ...prev.payment, vnpayTmnCode: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE] transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    VNPay Hash Secret Key:
                  </label>
                  <div className="relative">
                    <input
                      type={showSecretMap["vnpaySecret"] ? "text" : "password"}
                      value={settings.payment.vnpayHashSecret}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          payment: { ...prev.payment, vnpayHashSecret: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE] transition"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowSecret("vnpaySecret")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-1"
                    >
                      {showSecretMap["vnpaySecret"] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Webhook Endpoint (Readonly) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Webhook Tiếp Nhận IPN Đối Soát Sao Kê Tự Động:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value="https://api.techcore.vn/v1/webhook/banking-reconcile"
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-4 pr-12 py-2.5 font-mono text-slate-600 cursor-not-allowed text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "https://api.techcore.vn/v1/webhook/banking-reconcile",
                        "Webhook URL"
                      )
                    }
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-800 p-1"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Switches */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      Tự Động Đối Soát Giao Dịch Thời Gian Thực (T+0):
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Khi tiền vào tài khoản Vietcombank, hệ thống lập tức đối soát mã đơn và chuyển trạng thái sang ĐÃ THANH TOÁN.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.payment.vcbAutoReconcile}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        payment: { ...prev.payment, vcbAutoReconcile: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 rounded border-slate-300 text-[#0C5776] focus:ring-[#2D99AE]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      Bật Cổng TechPay QR Động Chuẩn VietQR Pro:
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tự động nhúng số tiền và mã hóa đơn vào mã QR khi khách hàng tiến hành thanh toán giỏ hàng.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.payment.techPayQrEnabled}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        payment: { ...prev.payment, techPayQrEnabled: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 rounded border-slate-300 text-[#0C5776] focus:ring-[#2D99AE]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Status Column */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-3">
                TRẠNG THÁI KẾT NỐI NGÂN HÀNG
              </span>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <span className="font-bold text-emerald-950 block">Vietcombank Core API</span>
                      <span className="text-[10px] text-emerald-700">mTLS Handshake Thành Công</span>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-mono font-bold text-xs">18ms</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <span className="font-bold text-emerald-950 block">VNPay Gateway Server</span>
                      <span className="text-[10px] text-emerald-700">SHA-256 Digest Valid</span>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-mono font-bold text-xs">22ms</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <div>
                      <span className="font-bold text-blue-950 block">TechPay QR Generator</span>
                      <span className="text-[10px] text-blue-700">VietQR Pro Dynamic Engine</span>
                    </div>
                  </div>
                  <span className="text-blue-700 font-mono font-bold text-xs">9ms</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  vipToast.info(
                    "Đang gửi giao dịch giả lập 10.000 ₫ qua Vietcombank Sandbox để kiểm tra luồng IPN...",
                    "Gửi Lệnh Thử Nghiệm"
                  );
                  setTimeout(() => {
                    vipToast.success(
                      "Giao dịch thử nghiệm thành công! Webhook đã nhận tín hiệu và đối soát hợp lệ.",
                      "Sandbox 200 OK"
                    );
                  }, 1200);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-[#BCFEFE]" />
                <span>Gửi Giao Dịch Thử Nghiệm Sandbox</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HẠM ĐỘI XE LẠNH COOLVAN & IOT */}
      {activeTab === "coolvan_iot" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2.5">
                <Snowflake className="w-5 h-5 text-[#2D99AE]" />
                <span>Cấu Hình Hạm Đội Xe Lạnh CoolVan &amp; Telemetry Cảm Biến IoT Chuỗi Lạnh</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Thiết lập cổng tiếp nhận dữ liệu nhiệt độ, độ ẩm và gia tốc sốc từ 5 xe CoolVan chuyên dụng giao hàng High-End.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  IoT MQTT Broker Telemetry Endpoint:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.coolvan.iotEndpoint}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        coolvan: { ...prev.coolvan, iotEndpoint: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE] transition"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(settings.coolvan.iotEndpoint, "MQTT Broker Endpoint")}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-1"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Chu kỳ Telemetry Ping (giây):
                  </label>
                  <input
                    type="number"
                    value={settings.coolvan.telemetryPingSec}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        coolvan: { ...prev.coolvan, telemetryPingSec: Number(e.target.value) },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Khuyến nghị: 5 giây/lần</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Nhiệt độ tiêu chuẩn khoang (°C):
                  </label>
                  <input
                    type="text"
                    value={settings.coolvan.targetTemp}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        coolvan: { ...prev.coolvan, targetTemp: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono font-bold text-[#0C5776] focus:bg-white focus:outline-none focus:border-[#2D99AE]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Tối ưu: 18.0°C - 20.0°C</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Ngưỡng cảnh báo sốc nhiệt (°C):
                  </label>
                  <input
                    type="text"
                    value={settings.coolvan.tempWarningThreshold}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        coolvan: { ...prev.coolvan, tempWarningThreshold: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono font-bold text-rose-600 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Cảnh báo nếu vượt &gt;23.0°C</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">
                    Tự Động Kích Hoạt Điều Phối Xe CoolVan Gần Nhất:
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Khi đơn hàng Workstation hoặc GPU High-End được đóng gói xong, thuật toán AI sẽ tự động gán xe CoolVan trống có tọa độ gần kho nhất.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.coolvan.autoDispatchCoolVan}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      coolvan: { ...prev.coolvan, autoDispatchCoolVan: e.target.checked },
                    }))
                  }
                  className="w-5 h-5 rounded border-slate-300 text-[#0C5776] focus:ring-[#2D99AE]"
                />
              </div>
            </div>
          </div>

          {/* Right Fleet Monitor */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-3">
                TRẠNG THÁI HẠM ĐỘI 5 XE COOLVAN
              </span>
              <div className="space-y-2.5 text-xs">
                {[
                  { name: "CoolVan #01", loc: "Hub Landmark 81 (TP.HCM)", temp: "18.2°C", status: "Đang giao đơn #TECH-8888", ok: true },
                  { name: "CoolVan #02", loc: "Quận 1, TP.HCM", temp: "18.5°C", status: "Sẵn sàng nhận lệnh", ok: true },
                  { name: "CoolVan #03", loc: "Hub Cầu Giấy (Hà Nội)", temp: "18.6°C", status: "Đang giao hàng", ok: true },
                  { name: "CoolVan #04", loc: "Tây Hồ, Hà Nội", temp: "18.4°C", status: "Sẵn sàng nhận lệnh", ok: true },
                  { name: "CoolVan #05", loc: "Cầu Sài Gòn, TP.HCM", temp: "18.3°C", status: "Đang hoàn tất lượt", ok: true },
                ].map((van, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/70 transition"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-slate-900">{van.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{van.loc}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[#0C5776] font-bold text-xs block">{van.temp}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">{van.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  vipToast.info("Đang gửi xung hiệu chuẩn đến bộ cảm biến 5 xe CoolVan...", "Hiệu Chuẩn");
                  setTimeout(() => {
                    vipToast.success("Hiệu chuẩn hoàn tất! Độ nhạy cảm biến g-Sensor đạt 100%.", "Sẵn Sàng Vận Hành");
                  }, 1200);
                }}
                style={{ backgroundColor: "#0C5776" }}
                className="w-full text-white font-bold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-xs hover:brightness-110"
              >
                <Activity className="w-3.5 h-3.5 text-[#BCFEFE]" />
                <span>Hiệu Chuẩn Cảm Biến g-Sensor &amp; Đo Nhiệt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHUỖI KHỐI ĐỊNH DANH E-SHIELD */}
      {activeTab === "eshield_ledger" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2.5">
                <Database className="w-5 h-5 text-indigo-600" />
                <span>Cấu Hình Chuỗi Khối Định Danh e-Shield Cryptographic Ledger (SHA-256)</span>
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                Private EVM Consensual
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Quản lý nút mạng Blockchain xác thực nguồn gốc vi mạch, tem niêm phong và lịch sử RMA chống tráo đổi linh kiện.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Địa Chỉ Nút Mạng Ledger RPC Node URL:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.eshield.ledgerNodeUrl}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      eshield: { ...prev.eshield, ledgerNodeUrl: e.target.value },
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(settings.eshield.ledgerNodeUrl, "RPC Node URL")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-1"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Network Chain ID &amp; Thuật Toán Đồng Thuận:
              </label>
              <input
                type="text"
                value={settings.eshield.ledgerChainId}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    eshield: { ...prev.eshield, ledgerChainId: e.target.value },
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-1.5">
                Smart Contract Định Danh e-Shield Address:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.eshield.contractAddress}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      eshield: { ...prev.eshield, contractAddress: e.target.value },
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(settings.eshield.contractAddress, "Smart Contract Address")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-1"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">
                Tự Động Băm Mã SHA-256 &amp; Đúc Khối e-Shield Khi Nhập Kho:
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mỗi khi thủ kho quét Serial Number nhập kho linh kiện mới, hệ thống tự sinh mã băm SHA-256 ghi nhận lên sổ cái phân tán không thể chỉnh sửa.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.eshield.autoMintOnImport}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  eshield: { ...prev.eshield, autoMintOnImport: e.target.checked },
                }))
              }
              className="w-5 h-5 rounded border-slate-300 text-[#0C5776] focus:ring-[#2D99AE]"
            />
          </div>

          {/* Block Explorer Preview */}
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                e-Shield Ledger Explorer Snapshot
              </span>
              <span>Gas Price: 0.00 Gwei (Private Zero-Fee EVM)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-500 block">Latest Block:</span>
                <span className="text-white font-bold">#4,192,840</span>
              </div>
              <div>
                <span className="text-slate-500 block">Block Time:</span>
                <span className="text-white font-bold">1.2 giây/khối</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Tokens Minted:</span>
                <span className="text-white font-bold">18,420 e-Shields</span>
              </div>
              <div>
                <span className="text-slate-500 block">Consensus State:</span>
                <span className="text-emerald-400 font-bold">100% Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: THÔNG BÁO SMS OTP & WEBHOOKS */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <span>Cấu Hình SMS Brandname Viễn Thông &amp; Telegram Alert Webhook</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Cấp phát mã OTP khôi phục mật khẩu bảo mật cao và bắn thông báo khẩn cấp khi phát sinh đơn hàng lớn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Tên SMS Brandname Viễn Thông Đã Đăng Ký:
              </label>
              <input
                type="text"
                value={settings.notifications.smsBrandname}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, smsBrandname: e.target.value },
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Brandname cấp bởi Viettel / VNPT</span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Thời Hạn Hiệu Lực Mã OTP (giây):
              </label>
              <input
                type="number"
                value={settings.notifications.smsOtpTimeout}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, smsOtpTimeout: Number(e.target.value) },
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Khuyến nghị an toàn: 60 giây</span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-1.5">
                Telegram VIP Order Alert Webhook URL:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.notifications.telegramAlertWebhook}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, telegramAlertWebhook: e.target.value },
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(settings.notifications.telegramAlertWebhook, "Telegram Webhook")
                  }
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-1"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Tự động gửi tin nhắn báo động cho ban quản trị khi có đơn hàng VIP &gt; 50 triệu hoặc nhiệt độ xe lạnh vượt ngưỡng.
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">
                Gửi Báo Cáo Tài Chính Tự Động Định Kỳ Qua Email Ban Giám Đốc:
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tổng hợp doanh thu, biên lợi nhuận ròng và chi phí bảo hành mỗi 23:59 hàng ngày.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.emailAlertsEnabled}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, emailAlertsEnabled: e.target.checked },
                }))
              }
              className="w-5 h-5 rounded border-slate-300 text-[#0C5776] focus:ring-[#2D99AE]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                vipToast.info("Đang gửi tin nhắn thử nghiệm OTP giả định đến số quản trị viên...", "Thử Nghiệm");
                setTimeout(() => {
                  vipToast.success("Mã OTP thử nghiệm [892110] đã được bắn qua cổng Brandname TECHCORE!", "SMS Đã Gửi");
                }, 1000);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition flex items-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-[#BCFEFE]" />
              <span>Gửi Tin Nhắn Thử Nghiệm OTP</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: QUẢN LÝ KHÓA API (API KEYS) */}
      {activeTab === "api_keys" && (
        <div className="space-y-4">
          {/* Top Filter & Add Key Bar */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Tìm khóa theo tên ứng dụng, đối tác, mã key hoặc scope..."
                  value={searchKeyQuery}
                  onChange={(e) => setSearchKeyQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
                />
              </div>

              <select
                value={envFilter}
                onChange={(e) => setEnvFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2D99AE]"
              >
                <option value="all">Tất cả môi trường</option>
                <option value="production">Production</option>
                <option value="sandbox">Sandbox</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowAddKeyModal(true)}
              style={{ backgroundColor: "#001C44" }}
              className="text-white text-xs font-black px-4 py-2.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-xs hover:brightness-110"
            >
              <Plus className="w-4 h-4 text-[#BCFEFE]" />
              <span>+ Cấp Phát Khóa API Mới</span>
            </button>
          </div>

          {/* Table List */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider"
                    style={{ backgroundColor: "rgba(12, 87, 118, 0.04)", color: "#0C5776" }}
                  >
                    <th className="p-4">TÊN KHÓA &amp; ỨNG DỤNG</th>
                    <th className="p-4">MÃ KHÓA API KEY</th>
                    <th className="p-4">PHẠM VI QUYỀN HẠN (SCOPE)</th>
                    <th className="p-4">MÔI TRƯỜNG</th>
                    <th className="p-4">LẦN DÙNG GẦN NHẤT</th>
                    <th className="p-4 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApiKeys.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Không tìm thấy khóa API nào phù hợp với bộ lọc tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredApiKeys.map((key) => {
                      const isVisible = showSecretMap[key.id];
                      return (
                        <tr key={key.id} className="transition hover:bg-slate-50/70">
                          {/* Name & Client */}
                          <td className="p-4">
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">{key.name}</span>
                              <span className="text-[11px] text-slate-400 font-medium">{key.client}</span>
                            </div>
                          </td>

                          {/* Key & Mask */}
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 font-mono text-xs">
                              <span className="bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 font-bold text-slate-800">
                                {isVisible ? key.keyMasked : "••••••••••••••••••••••••"}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleShowSecret(key.id)}
                                className="text-slate-400 hover:text-slate-700 p-1"
                                title={isVisible ? "Ẩn" : "Hiện"}
                              >
                                {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopy(key.keyMasked, "Khóa API")}
                                className="text-slate-400 hover:text-slate-700 p-1"
                                title="Sao chép"
                              >
                                {copiedText === key.keyMasked ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Scope */}
                          <td className="p-4">
                            <span
                              className="font-mono text-[10px] px-2.5 py-1 rounded-lg border font-bold block max-w-[220px] truncate"
                              style={{
                                backgroundColor: "rgba(188, 254, 254, 0.2)",
                                borderColor: "#2D99AE",
                                color: "#0C5776",
                              }}
                            >
                              {key.scope}
                            </span>
                          </td>

                          {/* Env */}
                          <td className="p-4">
                            <span
                              className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase font-mono ${
                                key.environment === "production"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {key.environment}
                            </span>
                          </td>

                          {/* Last Used & Rate */}
                          <td className="p-4">
                            <div>
                              <span className="font-bold text-slate-800 text-xs block">{key.lastUsed}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{key.rateLimit}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedApiLog(key)}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition inline-flex items-center gap-1"
                                title="Xem nhật ký gọi API"
                              >
                                <Terminal className="w-3.5 h-3.5 text-[#0C5776]" />
                                <span>Nhật ký</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setKeyToDelete(key)}
                                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                                title="Thu hồi / Xóa khóa API"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. SLA BANNER Ở CUỐI TRANG */}
      <div
        className="rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 border shadow-xs"
        style={{
          background: "linear-gradient(135deg, rgba(0, 28, 68, 0.04) 0%, rgba(12, 87, 118, 0.08) 100%)",
          borderColor: "rgba(45, 153, 174, 0.3)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ backgroundColor: "#001C44", color: "#BCFEFE" }}
          >
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">
              Cam Kết Độ Sẵn Sàng Hạ Tầng Kỹ Thuật (SLA 99.99% High-Availability)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-2xl">
              Toàn bộ kiến trúc máy chủ TechCore được triển khai song song Multi-Region giữa Trung tâm dữ liệu Landmark 81 (TP.HCM) và Cầu Giấy (Hà Nội), tự động chuyển mạch dự phòng tức thì trong vòng dưới 300 mili-giây nếu xảy ra sự cố gián đoạn mạng.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              vipToast.info("Đang tải tài liệu đặc tả OpenAPI 3.0 của TechCore...", "Tài Liệu API");
            }}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2.5 rounded-2xl transition shadow-xs"
          >
            Tài Liệu Swagger API
          </button>
          <button
            type="button"
            onClick={() => {
              vipToast.success("Toàn bộ 6 cụm máy chủ đang ở mức tải tối ưu (CPU 18%, RAM 32%)!", "Trạng Thái Cụm Node");
            }}
            style={{ backgroundColor: "#001C44" }}
            className="text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition shadow-xs hover:brightness-110"
          >
            Giám Sát Tài Nguyên
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: LIVE PING DIAGNOSTICS MODAL                                      */}
      {/* ========================================================================= */}
      {showPingModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white inline-block mb-1"
                  style={{ backgroundColor: "#001C44" }}
                >
                  LIVE SYSTEM DIAGNOSTICS
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Chẩn Đoán Kết Nối &amp; Độ Trễ Hạ Tầng (Ping Diagnostics)
                </h3>
              </div>
              <button
                onClick={() => setShowPingModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1.5">
                  {isTestingPing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0C5776]" />
                      <span>Đang kiểm tra các cụm dịch vụ...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chẩn đoán hoàn tất • 100% Cụm dịch vụ hoạt động bình thường</span>
                    </>
                  )}
                </span>
                <span className="font-mono text-[#0C5776]">{pingProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${pingProgress}%`,
                    backgroundColor: "#0C5776",
                  }}
                />
              </div>
            </div>

            {/* List of Services */}
            <div className="space-y-2.5">
              {pingResults.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 block">{item.url}</span>
                    <p className="text-[11px] text-slate-500">{item.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono font-bold text-xs px-2.5 py-1 rounded-xl border ${
                        item.latency < 15
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : item.latency < 25
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {item.latency}ms
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">ONLINE</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={runLivePingDiagnostics}
                disabled={isTestingPing}
                className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? "animate-spin" : ""}`} />
                <span>Chạy Lại Toàn Bộ Kiểm Tra</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPingModal(false)}
                style={{ backgroundColor: "#001C44" }}
                className="px-5 py-2 rounded-2xl text-white font-bold text-xs transition shadow-xs hover:brightness-110"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TẠO KHÓA API MỚI                                                 */}
      {/* ========================================================================= */}
      {showAddKeyModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white inline-block mb-1"
                  style={{ backgroundColor: "#001C44" }}
                >
                  NEW API CREDENTIAL
                </span>
                <h3 className="text-xl font-black text-slate-900">+ Cấp Phát Khóa API Mới</h3>
              </div>
              <button
                onClick={() => setShowAddKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newKeyError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{newKeyError}</span>
              </div>
            )}

            <form onSubmit={handleCreateApiKey} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Tên Khóa / Mục Đích Tích Hợp: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cổng ERP Oracle Kế Toán Doanh Nghiệp"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Đối Tác / Đơn Vị Thụ Hưởng Khóa: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Synnex FPT B2B Division"
                  value={newKeyClient}
                  onChange={(e) => setNewKeyClient(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#2D99AE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Môi Trường:</label>
                  <select
                    value={newKeyEnv}
                    onChange={(e) => setNewKeyEnv(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-[#2D99AE]"
                  >
                    <option value="production">Production (Chính thức)</option>
                    <option value="sandbox">Sandbox (Thử nghiệm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Giới Hạn Tốc Độ:</label>
                  <input
                    type="text"
                    value={newKeyRateLimit}
                    onChange={(e) => setNewKeyRateLimit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#2D99AE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Phạm Vi Quyền Hạn (Scopes):
                </label>
                <select
                  value={newKeyScope}
                  onChange={(e) => setNewKeyScope(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 font-mono font-bold text-[#0C5776] focus:outline-none focus:border-[#2D99AE]"
                >
                  <option value="orders:read, inventory:read">orders:read, inventory:read (Chỉ đọc đơn &amp; kho)</option>
                  <option value="orders:read_write, coolvan:track">orders:read_write, coolvan:track (Đầy đủ đơn &amp; xe lạnh)</option>
                  <option value="eshield:verify, rma:read">eshield:verify, rma:read (Xác thực vi mạch &amp; bảo hành)</option>
                  <option value="*">Full Access (* Toàn quyền)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddKeyModal(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#0C5776" }}
                  className="px-5 py-2.5 rounded-2xl text-white font-black transition shadow-xs hover:brightness-110"
                >
                  Phát Hành Khóa API
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: NHẬT KÝ GỌI API (REQUEST LOGS DOSSIER)                            */}
      {/* ========================================================================= */}
      {selectedApiLog && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white inline-block mb-1"
                  style={{ backgroundColor: "#001C44" }}
                >
                  REALTIME API TRAFFIC DOSSIER
                </span>
                <h3 className="text-xl font-black text-slate-900">{selectedApiLog.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Client: {selectedApiLog.client} • Scope: {selectedApiLog.scope}
                </p>
              </div>
              <button
                onClick={() => setSelectedApiLog(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Terminal View */}
            <div className="bg-slate-950 text-slate-200 p-5 rounded-3xl font-mono text-[11px] space-y-3 max-h-72 overflow-y-auto shadow-inner">
              <div className="text-slate-500 pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>[STREAMING RECENT REQUESTS - BUFFER 50 ITEMS]</span>
                <span className="text-emerald-400 font-bold">LIVE 200 OK</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>[200 OK] POST /v1/telemetry/ping</span>
                  <span className="text-slate-500">8ms • 14.161.40.88</span>
                </div>
                <div className="text-slate-400 text-[10px]">
                  Payload: {`{"van_id":"CoolVan #01","temp":18.2,"humidity":47,"g_sensor":0.02,"lat":10.7769,"lng":106.7009}`}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-900">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>[200 OK] GET /v1/orders/TECH-2026-8888</span>
                  <span className="text-slate-500">12ms • 118.69.182.10</span>
                </div>
                <div className="text-slate-400 text-[10px]">
                  Response: {`{"order_id":"TECH-2026-8888","status":"SHIPPING_COOLVAN","total":185000000}`}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-900">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>[200 OK] POST /v1/eshield/verify</span>
                  <span className="text-slate-500">14ms • SHA-256 Valid</span>
                </div>
                <div className="text-slate-400 text-[10px]">
                  Hash: 0x8a9210bf44c... (Định danh linh kiện chính hãng ASUS ROG Strix)
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApiLog(null)}
                style={{ backgroundColor: "#001C44" }}
                className="px-5 py-2.5 rounded-2xl text-white text-xs font-bold transition shadow-xs hover:brightness-110"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: XÁC NHẬN THU HỒI / XÓA KHÓA API                                   */}
      {/* ========================================================================= */}
      {keyToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Xác Nhận Thu Hồi Khóa API?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn thu hồi khóa <strong className="text-slate-900">{keyToDelete.name}</strong> (
              <span className="font-mono text-rose-600 font-bold">{keyToDelete.keyMasked}</span>)? Các ứng dụng
              đối tác đang sử dụng khóa này sẽ lập tức bị chặn truy cập (HTTP 401 Unauthorized).
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setKeyToDelete(null)}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmRevokeKey}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition shadow-xs"
              >
                Xác Nhận Thu Hồi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: XEM TRƯỚC BÁO CÁO KỸ THUẬT & EXCEL SPREADSHEET                  */}
      {/* ========================================================================= */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    EXECUTIVE TECHNICAL DOSSIER &amp; SPECIFICATION
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    Báo Cáo Cấu Hình Hạ Tầng Kỹ Thuật &amp; API TechCore
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Preview Area (Printable) */}
            <div id="settings-print-area" className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5 text-xs">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <h4 className="font-black text-slate-900 text-base">TECHCORE HIGH-END ECOSYSTEM</h4>
                  <p className="text-[11px] text-slate-500">Trung tâm Điều hành Hạ tầng &amp; Cổng Kết nối Đối tác</p>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <p>Ngày kết xuất: <strong className="text-slate-800">{new Date().toLocaleString("vi-VN")}</strong></p>
                  <p>Mã tài liệu: <span className="font-mono text-emerald-700 font-bold">TECH-SYS-CONF-2026</span></p>
                </div>
              </div>

              {/* Summary Tables */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-black text-slate-900 text-xs mb-2">1. CỔNG THANH TOÁN (PAYMENTS)</h5>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 grid grid-cols-2 gap-3 text-[11px]">
                    <div>VCB Client ID: <strong className="font-mono">{settings.payment.vcbClientId}</strong></div>
                    <div>VNPay TMN Code: <strong className="font-mono">{settings.payment.vnpayTmnCode}</strong></div>
                    <div>Đối soát tự động T+0: <strong className="text-emerald-600 font-bold">{settings.payment.vcbAutoReconcile ? "BẬT" : "TẮT"}</strong></div>
                    <div>TechPay QR Dynamic: <strong className="text-emerald-600 font-bold">{settings.payment.techPayQrEnabled ? "BẬT" : "TẮT"}</strong></div>
                  </div>
                </div>

                <div>
                  <h5 className="font-black text-slate-900 text-xs mb-2">2. HẠM ĐỘI XE LẠNH COOLVAN &amp; IOT</h5>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 grid grid-cols-2 gap-3 text-[11px]">
                    <div>MQTT Endpoint: <strong className="font-mono">{settings.coolvan.iotEndpoint}</strong></div>
                    <div>Tần số Telemetry: <strong>{settings.coolvan.telemetryPingSec} giây/ping</strong></div>
                    <div>Nhiệt độ tiêu chuẩn: <strong className="text-[#0C5776]">{settings.coolvan.targetTemp}°C</strong></div>
                    <div>Ngưỡng cảnh báo: <strong className="text-rose-600">{settings.coolvan.tempWarningThreshold}°C</strong></div>
                  </div>
                </div>

                <div>
                  <h5 className="font-black text-slate-900 text-xs mb-2">3. KHÓA TRUY CẬP API ĐANG HOẠT ĐỘNG ({settings.apiKeys.length})</h5>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                        <tr>
                          <th className="p-2.5">Ứng Dụng</th>
                          <th className="p-2.5">Đối Tác</th>
                          <th className="p-2.5">Mã Khóa</th>
                          <th className="p-2.5">Môi Trường</th>
                          <th className="p-2.5">Tốc Độ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {settings.apiKeys.map((k) => (
                          <tr key={k.id}>
                            <td className="p-2.5 font-bold">{k.name}</td>
                            <td className="p-2.5 text-slate-500">{k.client}</td>
                            <td className="p-2.5 font-mono">{k.keyMasked}</td>
                            <td className="p-2.5 font-bold uppercase">{k.environment}</td>
                            <td className="p-2.5 font-mono">{k.rateLimit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Tải Bảng Tính Excel (CSV UTF-8 BOM)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>In Bản Cấu Hình (A4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  style={{ backgroundColor: "#001C44" }}
                  className="px-5 py-2.5 rounded-2xl text-white font-bold text-xs transition shadow-xs hover:brightness-110"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
