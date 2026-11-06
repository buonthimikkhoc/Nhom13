"use client";

import React, { useState } from "react";
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
  Mail,
  Send,
  Building2,
  Activity,
  Globe,
  SlidersHorizontal,
  Wifi,
  Radio,
  FileCode,
  Terminal,
} from "lucide-react";

export function SettingsManagement() {
  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "payment" | "coolvan_iot" | "eshield_ledger" | "sms_notifications" | "api_keys"
  >("payment");

  // State cấu hình thanh toán
  const [vcbClientId, setVcbClientId] = useState("VCB_CORP_TECHCORE_9921448");
  const [vcbSecretKey, setVcbSecretKey] = useState("sk_live_9f823a7b91c20e4d88e01");
  const [showVcbSecret, setShowVcbSecret] = useState(false);
  const [vcbAutoReconcile, setVcbAutoReconcile] = useState(true);

  // State cấu hình CoolVan IoT
  const [iotEndpoint, setIotEndpoint] = useState("mqtts://iot.coolvan.techcore.vn:8883");
  const [telemetryPingSec, setTelemetryPingSec] = useState(5);
  const [targetTemp, setTargetTemp] = useState("18.5");
  const [autoDispatchCoolVan, setAutoDispatchCoolVan] = useState(true);

  // State cấu hình e-Shield
  const [ledgerNodeUrl, setLedgerNodeUrl] = useState("https://node-01.ledger.techcore.vn:8545");
  const [ledgerChainId, setLedgerChainId] = useState("1337 (TechCore Private EVM)");
  const [autoMintOnImport, setAutoMintOnImport] = useState(true);

  // State cấu hình SMS OTP
  const [smsBrandname, setSmsBrandname] = useState("TECHCORE");
  const [smsOtpTimeout, setSmsOtpTimeout] = useState(60);
  const [telegramAlertWebhook, setTelegramAlertWebhook] = useState("https://api.telegram.org/bot71289128:AAH.../sendMessage");

  // State API Keys
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKeyMap, setShowKeyMap] = useState<{ [key: string]: boolean }>({});
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [selectedApiLog, setSelectedApiLog] = useState<any | null>(null);

  // Ping Testing State
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Danh sách API Keys
  const [apiKeysList, setApiKeysList] = useState([
    {
      id: "key-01",
      name: "CoolVan IoT Fleet Telemetry Agent",
      client: "CoolVan Onboard Microcontroller v2",
      keyMasked: "tc_live_coolvan_99182a4d8120e7",
      scope: "iot:write_telemetry, gps:stream",
      environment: "production",
      createdDate: "01/01/2026",
      lastUsed: "12 giây trước",
      rateLimit: "1.200 req/min",
      status: "active",
      statusText: "Đang hoạt động",
    },
    {
      id: "key-02",
      name: "Vietcombank Enterprise Webhook Reconcile",
      client: "Vietcombank Core Banking Gateway",
      keyMasked: "tc_live_vcb_reconcile_448192a01b",
      scope: "payments:webhook_receive, ledger:verify",
      environment: "production",
      createdDate: "10/01/2026",
      lastUsed: "4 phút trước",
      rateLimit: "500 req/min",
      status: "active",
      statusText: "Đang hoạt động",
    },
    {
      id: "key-03",
      name: "ASUS ROG Enterprise PO Dispatch Sync",
      client: "ASUS Global Supply Chain B2B",
      keyMasked: "tc_live_asus_po_881920b72c91",
      scope: "po:create, inventory:sync",
      environment: "production",
      createdDate: "15/01/2026",
      lastUsed: "25 phút trước",
      rateLimit: "300 req/min",
      status: "active",
      statusText: "Đang hoạt động",
    },
    {
      id: "key-04",
      name: "Mobile App Kỹ Thuật Viên TechCare+",
      client: "KTV On-Site Field Service App",
      keyMasked: "tc_live_ktv_field_7718921a990",
      scope: "rma:update, eshield:scan_qr",
      environment: "production",
      createdDate: "01/02/2026",
      lastUsed: "1 phút trước",
      rateLimit: "600 req/min",
      status: "active",
      statusText: "Đang hoạt động",
    },
  ]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const toggleShowKey = (id: string) => {
    setShowKeyMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Chạy kiểm tra Ping tức thì
  const handleRunPingTest = () => {
    setIsPinging(true);
    setPingStatus("Đang kiểm tra kết nối với 6 cụm Microservices & Webhooks...");
    setTimeout(() => {
      setIsPinging(false);
      setPingStatus("✓ Hoàn tất kiểm tra: 6/6 Dịch vụ phản hồi 200 OK • Độ trễ trung bình: 12ms!");
      setTimeout(() => setPingStatus(null), 6000);
    }, 1200);
  };

  // Lưu cấu hình
  const handleSaveAllConfig = () => {
    alert("✓ Đã lưu toàn bộ thiết lập Cấu hình & API Core vào cơ sở dữ liệu hệ thống thành công!");
  };

  return (
    <>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
            <span>QUẢN TRỊ HỆ SINH THÁI TECHCORE ENTERPRISE</span>
            <span className="text-slate-300">•</span>
            <span>HỆ THỐNG VÀ CƠ SỞ HẠ TẦNG</span>
            <span className="text-slate-300">•</span>
            <span>CẤU HÌNH &amp; API CORE</span>
          </p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Cấu Hình &amp; API Core
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              TechCore CoreEngine v3.4.8 Online
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
              <Server className="w-3 h-3 text-blue-600" />
              Node 01: Latency 12ms (TP.HCM Hub)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3 text-purple-600" />
              TLS 1.3 &amp; mTLS Encrypted
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleRunPingTest}
            disabled={isPinging}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isPinging ? "animate-spin" : ""}`} />
            <span>Kiểm Tra Ping API</span>
          </button>

          <button
            type="button"
            onClick={() => alert("Đang xuất bản sao lưu cấu hình hệ thống ra file config.json...")}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Sao Lưu Cấu Hình</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAllConfig}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-sm shadow-blue-500/25 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Lưu Toàn Bộ Cấu Hình</span>
          </button>
        </div>
      </div>

      {/* PING STATUS NOTIFICATION */}
      {pingStatus && (
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            <span>{pingStatus}</span>
          </div>
          <button
            type="button"
            onClick={() => setPingStatus(null)}
            className="p-1 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                TRẠNG THÁI CORE API ENGINE
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600">99.98%</span>
              <span className="text-xs font-bold text-slate-500">Uptime</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              6/6 Cụm Microservices đang trực tuyến
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Độ trễ trung bình: <strong className="text-emerald-600 font-mono">12ms</strong></span>
            <span>Timeout: <strong className="text-slate-800">0%</strong></span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                LƯỢT GỌI API (24H)
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">1.482.900</span>
              <span className="text-xs font-bold text-blue-600">Reqs</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Đỉnh điểm: 240 req/s lúc 14:30
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Thành công (2xx): <strong className="text-emerald-600 font-bold">99.94%</strong></span>
            <span>Lỗi 5xx: <strong className="text-slate-800">0.00%</strong></span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                CỔNG KẾT NỐI ĐỐI TÁC
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-700">8 / 8</span>
              <span className="text-xs font-bold text-slate-500">Cổng Online</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Vietcombank, Stripe, CoolVan, SMS OTP, ASUS B2B
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Webhook: <strong className="text-emerald-600">Đồng bộ T+0</strong></span>
            <span>Chữ ký số: <strong className="text-slate-800">SHA-256</strong></span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                TƯỜNG LỬA BẢO VỆ (WAF)
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-purple-700">142</span>
              <span className="text-xs font-bold text-slate-500">Lần chặn</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chặn 100% tấn công SQLi, XSS &amp; Rate-Limit</span>
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Rate limit: <strong className="text-slate-800">120 req/min/IP</strong></span>
            <span>DDoS Guard: <strong className="text-emerald-600">Active</strong></span>
          </div>
        </div>
      </div>

      {/* SETTINGS SUB-TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        {[
          { key: "payment", label: "Cổng thanh toán & Vietcombank Banking", icon: CreditCard },
          { key: "coolvan_iot", label: "Đội xe lạnh CoolVan & IoT Gateway", icon: Snowflake },
          { key: "eshield_ledger", label: "Chuỗi khối e-Shield & Blockchain", icon: Database },
          { key: "sms_notifications", label: "SMS OTP Brandname & Webhook", icon: Smartphone },
          { key: "api_keys", label: "Quản lý khóa API (API Keys)", icon: KeyRound },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CỔNG THANH TOÁN & VIETCOMBANK */}
      {activeTab === "payment" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Cấu Hình Cổng Thanh Toán Vietcombank Enterprise &amp; TechPay</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Thiết lập kết nối trực tiếp tài khoản doanh nghiệp Vietcombank đối soát tự động T+0
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Vietcombank Enterprise Client ID:
                </label>
                <input
                  type="text"
                  value={vcbClientId}
                  onChange={(e) => setVcbClientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Vietcombank Secret Key (Chữ ký điện tử SHA-256):
                </label>
                <div className="relative">
                  <input
                    type={showVcbSecret ? "text" : "password"}
                    value={vcbSecretKey}
                    onChange={(e) => setVcbSecretKey(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowVcbSecret(!showVcbSecret)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showVcbSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Webhook Đối Soát Tự Động URL:
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue="https://api.techcore.vn/v1/webhook/vcb-reconcile"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-600 cursor-not-allowed text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Phương Thức Xác Thực Ký Số:
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue="HMAC-SHA256 (Chuẩn Core Banking VCB)"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold cursor-not-allowed text-[11px]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Tự Động Đối Soát Giao Dịch Thời Gian Thực (T+0):
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Khi tiền vào tài khoản Vietcombank, hệ thống lập tức cập nhật trạng thái đơn sang ĐÃ THANH TOÁN.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={vcbAutoReconcile}
                  onChange={(e) => setVcbAutoReconcile(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                TRẠNG THÁI KẾT NỐI TRỰC TUYẾN
              </span>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-emerald-900">Vietcombank Enterprise Host</span>
                  </div>
                  <span className="text-emerald-700 font-mono text-[10px] font-bold">18ms</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-emerald-900">Stripe Terminal Gateway</span>
                  </div>
                  <span className="text-emerald-700 font-mono text-[10px] font-bold">32ms</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-emerald-900">TechPay QR Dynamic Generator</span>
                  </div>
                  <span className="text-emerald-700 font-mono text-[10px] font-bold">9ms</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Đang gửi lệnh test giao dịch giả định 10.000 ₫ qua Vietcombank Sandbox...")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              Gửi Giao Dịch Thử Nghiệm Sandbox
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: ĐỘI XE LẠNH COOLVAN & IOT GATEWAY */}
      {activeTab === "coolvan_iot" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-cyan-600" />
                <span>Cấu Hình Hạm Đội Xe Lạnh CoolVan &amp; Cảm Biến IoT Telemetry</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Thiết lập cổng tiếp nhận dữ liệu thời gian thực từ 5 xe CoolVan chuyên dụng
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  IoT MQTT Broker Telemetry Endpoint:
                </label>
                <input
                  type="text"
                  value={iotEndpoint}
                  onChange={(e) => setIotEndpoint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Chu kỳ gửi Ping định vị &amp; cảm biến (giây):
                  </label>
                  <input
                    type="number"
                    value={telemetryPingSec}
                    onChange={(e) => setTelemetryPingSec(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Khuyến nghị: 5 giây / ping</span>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Nhiệt độ kiểm soát tiêu chuẩn khoang xe (°C):
                  </label>
                  <input
                    type="text"
                    value={targetTemp}
                    onChange={(e) => setTargetTemp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold text-cyan-700 font-mono focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Dải tối ưu: 18.0°C - 20.0°C</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Tự Động Kích Hoạt Điều Phối Xe CoolVan Gần Nhất:
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Khi đơn hàng Workstation hoặc GPU được đóng gói xong, thuật toán sẽ tự gán xe CoolVan trống gần nhất.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoDispatchCoolVan}
                  onChange={(e) => setAutoDispatchCoolVan(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                HẠM ĐỘI 5 XE COOLVAN ONLINE
              </span>
              <div className="space-y-2 text-xs">
                {[
                  { name: "CoolVan #01", loc: "Landmark 81 (TP.HCM)", temp: "18.2°C", status: "Đang giao hàng" },
                  { name: "CoolVan #02", loc: "Quận 1, TP.HCM", temp: "18.5°C", status: "Sẵn sàng" },
                  { name: "CoolVan #03", loc: "Cầu Giấy (Hà Nội)", temp: "18.6°C", status: "Đang giao hàng" },
                  { name: "CoolVan #04", loc: "Tây Hồ, Hà Nội", temp: "18.4°C", status: "Sẵn sàng" },
                  { name: "CoolVan #05", loc: "Cầu Sài Gòn", temp: "18.3°C", status: "Sẵn sàng" },
                ].map((van, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{van.name}</span>
                      <span className="text-[10px] text-slate-400">{van.loc}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-cyan-700 font-bold text-[11px] block">{van.temp}</span>
                      <span className="text-[9px] text-emerald-600 font-bold">{van.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Đang kiểm tra độ nhạy cảm biến chống sốc g-Sensor trên 5 xe CoolVan...")}
              className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              Hiệu Chuẩn Cảm Biến g-Sensor
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CHUỖI KHỐI E-SHIELD */}
      {activeTab === "eshield_ledger" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>Cấu Hình Chuỗi Khối e-Shield Cryptographic Ledger (SHA-256)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quản lý nút mạng Blockchain xác thực nguồn gốc linh kiện và chống làm giả vi mạch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Địa Chỉ Nút Mạng Ledger RPC Node URL:
              </label>
              <input
                type="text"
                value={ledgerNodeUrl}
                onChange={(e) => setLedgerNodeUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Network Chain ID &amp; Giao Thức Đồng Thuận:
              </label>
              <input
                type="text"
                value={ledgerChainId}
                onChange={(e) => setLedgerChainId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">
                Tự Động Đúc Khối S/N e-Shield Khi Nhập Kho:
              </span>
              <p className="text-[11px] text-slate-500">
                Mỗi khi nhân viên kho nhập 1 GPU hoặc CPU mới, hệ thống tự động băm mã SHA-256 lưu trữ vĩnh viễn trên sổ cái.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoMintOnImport}
              onChange={(e) => setAutoMintOnImport(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* TAB 4: SMS OTP & WEBHOOKS */}
      {activeTab === "sms_notifications" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <span>Cấu Hình Cổng SMS OTP Brandname &amp; Webhook Thông Báo</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cấp phát mã OTP khôi phục mật khẩu 60s và thông báo sự cố tức thì qua Telegram
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Tên Brandname SMS đăng ký:</label>
              <input
                type="text"
                value={smsBrandname}
                onChange={(e) => setSmsBrandname(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Thời gian hiệu lực mã OTP (giây):</label>
              <input
                type="number"
                value={smsOtpTimeout}
                onChange={(e) => setSmsOtpTimeout(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-700 font-bold mb-1">
              Telegram VIP Order Alert Webhook URL:
            </label>
            <input
              type="text"
              value={telegramAlertWebhook}
              onChange={(e) => setTelegramAlertWebhook(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Bắn thông báo ngay khi có đơn hàng VIP trên 50 triệu hoặc yêu cầu RMA 1-đổi-1
            </span>
          </div>
        </div>
      )}

      {/* TAB 5: QUẢN LÝ KHÓA API (API KEYS) */}
      {activeTab === "api_keys" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-sm">
                Danh Sách Khóa Truy Cập API (Production API Keys)
              </h3>
              <p className="text-xs text-slate-400">
                Cấp phép quyền truy cập dữ liệu đơn hàng, kho và xe lạnh cho các hệ thống đối tác
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddKeyModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tạo Khóa API Mới</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="p-4">TÊN KHÓA &amp; ỨNG DỤNG</th>
                    <th className="p-4">MÃ KHÓA API KEY</th>
                    <th className="p-4">PHẠM VI QUYỀN HẠN (SCOPE)</th>
                    <th className="p-4">MÔI TRƯỜNG</th>
                    <th className="p-4">LẦN DÙNG GẦN NHẤT</th>
                    <th className="p-4 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apiKeysList.map((key) => {
                    const isVisible = showKeyMap[key.id];
                    return (
                      <tr key={key.id} className="transition hover:bg-slate-50/70">
                        {/* Name & Client */}
                        <td className="p-4">
                          <div>
                            <span className="font-bold text-slate-900 block">{key.name}</span>
                            <span className="text-[10px] text-slate-400">{key.client}</span>
                          </div>
                        </td>

                        {/* Key & Copy */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-mono text-xs">
                            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-800">
                              {isVisible ? key.keyMasked : "••••••••••••••••••••••••"}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleShowKey(key.id)}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(key.keyMasked)}
                              className="text-slate-400 hover:text-blue-600 p-0.5"
                            >
                              {copiedKey === key.keyMasked ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Scope */}
                        <td className="p-4">
                          <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold block max-w-[200px] truncate">
                            {key.scope}
                          </span>
                        </td>

                        {/* Environment */}
                        <td className="p-4">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase font-mono">
                            {key.environment}
                          </span>
                        </td>

                        {/* Last Used & Rate */}
                        <td className="p-4">
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">{key.lastUsed}</span>
                            <span className="text-[10px] text-slate-400">{key.rateLimit}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedApiLog(key)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold transition inline-flex items-center gap-1"
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Nhật ký gọi</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM PROTOCOL BANNER */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">
              Cam Kết Độ Sẵn Sàng Hạ Tầng Kỹ Thuật (SLA 99.99% High-Availability)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Toàn bộ kiến trúc máy chủ TechCore được triển khai song song Multi-Region giữa Trung tâm dữ liệu Landmark 81 (TP.HCM) và Cầu Giấy (Hà Nội), tự động chuyển mạch dự phòng tức thì trong vòng dưới 300 mili-giây nếu xảy ra sự cố cáp quang biển.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => alert("Đang tải tài liệu đặc tả OpenAPI 3.0 của TechCore...")}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Tài Liệu Swagger API
          </button>
          <button
            type="button"
            onClick={() => alert("✓ Trạng thái hệ thống: Toàn bộ 6 cụm máy chủ đang ở mức tải tối ưu (CPU 18%, RAM 32%)!")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-blue-500/25"
          >
            Giám Sát Tài Nguyên
          </button>
        </div>
      </div>

      {/* MODAL 1: TẠO KHÓA API MỚI */}
      {showAddKeyModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  TECHCORE API GATEWAY
                </span>
                <h3 className="text-xl font-black text-slate-900">+ Tạo Khóa API Mới</h3>
              </div>
              <button
                onClick={() => setShowAddKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = (fd.get("name") as string) || "Dịch vụ tích hợp mới";
                const client = (fd.get("client") as string) || "Đối tác ngoài";
                const env = (fd.get("env") as string) || "production";
                const scope = (fd.get("scope") as string) || "orders:read";

                const newKey = {
                  id: `key-${Date.now()}`,
                  name,
                  client,
                  keyMasked: `tc_${env}_${Math.random().toString(16).slice(2, 10)}_${Date.now().toString().slice(-4)}`,
                  scope,
                  environment: env,
                  createdDate: new Date().toLocaleDateString("vi-VN"),
                  lastUsed: "Vừa tạo mới",
                  rateLimit: "600 req/min",
                  status: "active",
                  statusText: "Đang hoạt động",
                };

                setApiKeysList((prev) => [newKey, ...prev]);
                setShowAddKeyModal(false);
                alert(`✓ Đã tạo thành công khóa API mới cho ${name}!`);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tên ứng dụng / Mục đích sử dụng:</label>
                <input
                  name="name"
                  required
                  placeholder="Ví dụ: Hệ thống ERP Kế Toán Doanh Nghiệp"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Đối tác / Đơn vị thụ hưởng:</label>
                <input
                  name="client"
                  required
                  placeholder="Ví dụ: FPT AI Lab hoặc Synnex Corporation"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Môi trường:</label>
                  <select
                    name="env"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="production">Production (Môi trường thực)</option>
                    <option value="sandbox">Sandbox (Thử nghiệm)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phạm vi quyền hạn (Scope):</label>
                  <select
                    name="scope"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-mono text-blue-700 font-bold"
                  >
                    <option value="orders:read, inventory:read">orders:read, inventory:read</option>
                    <option value="orders:read_write, coolvan:track">orders:all, coolvan:track</option>
                    <option value="eshield:verify, rma:read">eshield:verify, rma:read</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddKeyModal(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-sm shadow-blue-500/25"
                >
                  Phát Hành Khóa API
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NHẬT KÝ GỌI API DOSSIER */}
      {selectedApiLog && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  NHẬT KÝ GIAO VẬN API REQUEST LOGS
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedApiLog.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Client: {selectedApiLog.client} • Scope: {selectedApiLog.scope}
                </p>
              </div>
              <button
                onClick={() => setSelectedApiLog(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live Logs */}
            <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-[11px] space-y-2 max-h-56 overflow-y-auto">
              <div className="text-emerald-400 font-bold">
                [200 OK] POST /v1/telemetry/ping - Latency: 8ms
              </div>
              <div className="text-slate-400">
                Payload: {`{"van_id":"CoolVan #01","temp":18.2,"humidity":47,"esd":0.02}`}
              </div>
              <div className="text-emerald-400 font-bold pt-1 border-t border-slate-800">
                [200 OK] GET /v1/orders/TECH-2026-8888 - Latency: 12ms
              </div>
              <div className="text-emerald-400 font-bold pt-1 border-t border-slate-800">
                [200 OK] POST /v1/eshield/verify - Latency: 14ms (SHA-256 Valid)
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApiLog(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

