// @ts-nocheck
/* eslint-disable */
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import apiClient from "../config/api";
import {
  Calendar, Clock, MapPin, Users, ChevronRight,
  Search, Filter, CalendarDays,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ModuleSession {
  id: string;
  sessionDate: string;
  startTime: string;
  order: number;
  isHoliday: boolean;
  isCancelled: boolean;
  _count?: { attendances: number };
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  location: string | null;
  scheduleDate: string | null;
  durationHour: number | null;
  maxParticipant: number | null;
  materialUrl: string | null;
  recurringDay: string | null;
  recurringTime: string | null;
  totalSessions: number | null;
  programId: string;
  sessions: ModuleSession[];
  _count: { sessions: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PUBLISHED: { label: "Tersedia", className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
  DRAFT:     { label: "Draft",    className: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30" },
  ARCHIVED:  { label: "Arsip",    className: "bg-amber-500/15 text-amber-400 border border-amber-500/30" },
};

const DAY_LABEL: Record<string, string> = {
  MONDAY: "Senin", TUESDAY: "Selasa", WEDNESDAY: "Rabu",
  THURSDAY: "Kamis", FRIDAY: "Jumat",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function getNextSession(sessions: ModuleSession[]): ModuleSession | null {
  const now = new Date();
  const upcoming = sessions
    .filter((s) => !s.isCancelled && new Date(s.sessionDate) > now)
    .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());
  return upcoming[0] || null;
}

function hasUpcomingSession(sessions: ModuleSession[]): boolean {
  return getNextSession(sessions) !== null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function JadwalModul() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom]       = useState("");
  const [dateTo, setDateTo]           = useState("");
  const [timeFilter, setTimeFilter]   = useState<"ALL" | "UPCOMING" | "PAST">("ALL");

  useEffect(() => {
    if (!user?.objectId) return;
    const fetchModules = async () => {
      try {
        setLoading(true);
        const lectureRes = await apiClient.get(`/lectures/user/${user.objectId}`);
        const lecture = lectureRes.data?.data;
        if (!lecture?.program?.id) { setModules([]); return; }

        // Fetch modules — GET /programs/:id/modules sudah include sessions via _count
        const modulesRes = await apiClient.get(`/programs/${lecture.program.id}/modules`);
        const mods = modulesRes.data?.data || [];

        // Fetch sessions per modul untuk dapat sesi berikutnya
        const modsWithSessions = await Promise.all(
          mods.map(async (mod: any) => {
            try {
              const sessRes = await apiClient.get(`/modules/${mod.id}/sessions`);
              return { ...mod, sessions: sessRes.data?.data || [] };
            } catch {
              return { ...mod, sessions: [] };
            }
          })
        );
        setModules(modsWithSessions);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [user?.objectId]);

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return modules.filter((m) => {
      if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.location?.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "ALL" && m.status !== statusFilter) return false;

      const nextSess = getNextSession(m.sessions);
      const nextDate = nextSess?.sessionDate || m.scheduleDate;

      if (dateFrom && nextDate && new Date(nextDate) < new Date(dateFrom)) return false;
      if (dateTo && nextDate) {
        const toEnd = new Date(dateTo); toEnd.setHours(23, 59, 59);
        if (new Date(nextDate) > toEnd) return false;
      }

      if (timeFilter === "UPCOMING" && !hasUpcomingSession(m.sessions)) return false;
      if (timeFilter === "PAST" && hasUpcomingSession(m.sessions)) return false;

      return true;
    });
  }, [modules, search, statusFilter, dateFrom, dateTo, timeFilter]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     modules.length,
    upcoming:  modules.filter((m) => hasUpcomingSession(m.sessions)).length,
    published: modules.filter((m) => m.status === "PUBLISHED").length,
    draft:     modules.filter((m) => m.status === "DRAFT").length,
  }), [modules]);

  const resetFilters = () => { setSearch(""); setStatusFilter("ALL"); setDateFrom(""); setDateTo(""); setTimeFilter("ALL"); };
  const hasActiveFilter = search || statusFilter !== "ALL" || dateFrom || dateTo || timeFilter !== "ALL";

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Jadwal Modul</h1>
        <p className="text-sm text-zinc-400 mt-1">Pantau sesi, lokasi, dan kehadiran peserta setiap modul</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Modul",    value: stats.total,     color: "text-white" },
          { label: "Ada Sesi Depan", value: stats.upcoming,  color: "text-blue-400" },
          { label: "Dipublikasikan", value: stats.published, color: "text-emerald-400" },
          { label: "Draft",          value: stats.draft,     color: "text-zinc-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#161a23] border border-white/[0.06] rounded-xl px-4 py-4">
            <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#161a23] border border-white/[0.06] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
          <Filter size={14} />
          <span>Filter</span>
          {hasActiveFilter && (
            <button onClick={resetFilters} className="ml-auto text-xs text-zinc-500 hover:text-white transition-colors underline underline-offset-2">Reset semua</button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input type="text" placeholder="Cari modul atau lokasi..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0d0f14] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors">
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Tersedia</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Arsip</option>
          </select>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value as any)}
            className="bg-[#0d0f14] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors">
            <option value="ALL">Semua Waktu</option>
            <option value="UPCOMING">Ada Sesi Depan</option>
            <option value="PAST">Semua Sesi Lewat</option>
          </select>
          <div className="flex gap-2 items-center">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="flex-1 bg-[#0d0f14] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-violet-500/50 transition-colors" />
            <span className="text-zinc-600 text-xs">–</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="flex-1 bg-[#0d0f14] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-violet-500/50 transition-colors" />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? <LoadingSkeleton /> : error ? <ErrorState message={error} /> : filtered.length === 0 ? (
        <EmptyState hasFilter={hasActiveFilter} onReset={resetFilters} />
      ) : (
        <div className="space-y-2">
          <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs text-zinc-600 uppercase tracking-wider">
            <span>Modul</span>
            <span>Sesi Berikutnya</span>
            <span>Durasi/Sesi</span>
            <span>Lokasi</span>
            <span>Sesi</span>
            <span>Status</span>
          </div>
          {filtered.map((module) => (
            <ModuleRow key={module.id} module={module} onClick={() => navigate(`/lecture/modules/${module.id}`)} />
          ))}
          <p className="text-xs text-zinc-600 pt-2 text-right">Menampilkan {filtered.length} dari {modules.length} modul</p>
        </div>
      )}
    </div>
  );
}

// ─── Module Row ───────────────────────────────────────────────────────────────
function ModuleRow({ module, onClick }: { module: Module; onClick: () => void }) {
  const statusCfg  = STATUS_CONFIG[module.status];
  const nextSess   = getNextSession(module.sessions);
  const totalSess  = module.sessions?.length || 0;
  const activeSess = module.sessions?.filter((s) => !s.isCancelled).length || 0;
  const upcoming   = hasUpcomingSession(module.sessions);

  return (
    <div onClick={onClick}
      className={`group relative bg-[#161a23] border rounded-xl px-4 py-4 cursor-pointer transition-all duration-200 hover:border-violet-500/30 hover:bg-[#1a1f2d] ${upcoming ? "border-white/[0.06]" : "border-white/[0.04] opacity-75"}`}>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium leading-snug">{module.title}</p>
            {nextSess ? (
              <p className="text-xs text-zinc-500 mt-0.5">Sesi #{nextSess.order} · {formatDate(nextSess.sessionDate)} · {nextSess.startTime}</p>
            ) : (
              <p className="text-xs text-zinc-600 mt-0.5 italic">Tidak ada sesi berikutnya</p>
            )}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusCfg.className}`}>{statusCfg.label}</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
          {module.durationHour && <span className="flex items-center gap-1"><Clock size={11} /> {module.durationHour} jam</span>}
          {module.location && <span className="flex items-center gap-1"><MapPin size={11} /> {module.location}</span>}
          <span className="flex items-center gap-1"><CalendarDays size={11} /> {activeSess}/{totalSess} sesi aktif</span>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center">
        {/* Title */}
        <div>
          <p className="text-sm font-medium leading-snug group-hover:text-white transition-colors">{module.title}</p>
          {module.recurringDay && (
            <p className="text-xs text-zinc-600 mt-0.5">
              Setiap {DAY_LABEL[module.recurringDay] || module.recurringDay} · {module.recurringTime}
            </p>
          )}
        </div>

        {/* Next session */}
        <div>
          {nextSess ? (
            <div>
              <p className="text-sm text-zinc-300 flex items-center gap-1.5">
                <CalendarDays size={13} className="text-zinc-500" />
                {formatDate(nextSess.sessionDate)}
              </p>
              <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5 ml-[19px]">
                <Clock size={11} /> {nextSess.startTime} · Sesi #{nextSess.order}
              </p>
            </div>
          ) : (
            <span className="text-xs text-zinc-600 italic">Tidak ada sesi berikutnya</span>
          )}
        </div>

        {/* Duration */}
        <div>
          {module.durationHour ? (
            <span className="text-sm text-zinc-300 flex items-center gap-1.5">
              <Clock size={13} className="text-zinc-500" /> {module.durationHour} jam
            </span>
          ) : <span className="text-xs text-zinc-600">–</span>}
        </div>

        {/* Location */}
        <div>
          {module.location ? (
            <span className="text-sm text-zinc-300 flex items-center gap-1.5 truncate">
              <MapPin size={13} className="text-zinc-500 shrink-0" />
              <span className="truncate">{module.location}</span>
            </span>
          ) : <span className="text-xs text-zinc-600">–</span>}
        </div>

        {/* Sessions count */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sm">
            <CalendarDays size={13} className="text-zinc-500" />
            <span className="text-zinc-300">
              {activeSess}<span className="text-zinc-600">/{totalSess}</span>
            </span>
          </div>
          {totalSess > 0 && (
            <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${Math.min((activeSess / totalSess) * 100, 100)}%` }} />
            </div>
          )}
          {totalSess > 0 && <p className="text-[10px] text-zinc-600">{totalSess} total sesi</p>}
        </div>

        {/* Status + arrow */}
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${statusCfg.className}`}>{statusCfg.label}</span>
          <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-[#161a23] border border-white/[0.06] rounded-xl px-4 py-4 animate-pulse">
          <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4">
            <div className="space-y-2"><div className="h-3.5 bg-white/[0.06] rounded w-3/4" /><div className="h-2.5 bg-white/[0.04] rounded w-1/2" /></div>
            <div className="h-3.5 bg-white/[0.06] rounded w-2/3 self-center" />
            <div className="h-3.5 bg-white/[0.06] rounded w-1/2 self-center" />
            <div className="h-3.5 bg-white/[0.06] rounded w-2/3 self-center" />
            <div className="h-3.5 bg-white/[0.06] rounded w-1/2 self-center" />
            <div className="h-5 bg-white/[0.06] rounded-full w-16 self-center" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ hasFilter, onReset }: { hasFilter: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#161a23] border border-white/[0.06] flex items-center justify-center mb-4">
        <Calendar size={22} className="text-zinc-600" />
      </div>
      <p className="text-sm font-medium text-zinc-300">{hasFilter ? "Tidak ada modul yang cocok" : "Belum ada modul"}</p>
      <p className="text-xs text-zinc-600 mt-1 max-w-xs">
        {hasFilter ? "Coba ubah filter atau reset untuk melihat semua modul." : "Modul akan muncul di sini setelah dibuat di halaman Program Saya."}
      </p>
      {hasFilter && <button onClick={onReset} className="mt-4 text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors">Reset filter</button>}
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <Calendar size={22} className="text-red-400" />
      </div>
      <p className="text-sm font-medium text-red-400">Gagal memuat jadwal</p>
      <p className="text-xs text-zinc-600 mt-1">{message}</p>
    </div>
  );
}