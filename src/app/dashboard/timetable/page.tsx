import { getUserProfile } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoTimetables } from "@/lib/demo-data";
import { Clock, MapPin, BookOpen, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WORK_DAYS = [1, 2, 3, 4, 5]; // Mon–Fri

const DAY_COLORS = [
  "#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b",
];

export default async function TimetablePage() {
  const profile = await getUserProfile();
  if (!profile || !hasPermission(profile.role, "timetable:read")) redirect("/dashboard");

  const timetables = demoTimetables
    .slice()
    .sort((a, b) => a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time));

  const byDay = WORK_DAYS.map((i, idx) => ({
    day: DAYS[i],
    dayIndex: i,
    color: DAY_COLORS[idx],
    slots: timetables.filter((t) => t.day_of_week === i),
  }));

  const totalClasses = timetables.length;
  const todayDow = new Date().getDay();
  const todayClasses = timetables.filter((t) => t.day_of_week === todayDow).length;

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Timetable</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {totalClasses} classes per week · {todayClasses} today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" dot>Mon – Fri Schedule</Badge>
        </div>
      </div>

      {/* Week overview strip */}
      <div className="grid grid-cols-5 gap-2">
        {byDay.map(({ day, dayIndex, color, slots }) => {
          const isToday = dayIndex === todayDow;
          return (
            <div
              key={day}
              className={cn(
                "rounded-xl p-3 text-center border transition-all",
                isToday
                  ? "border-[var(--brand)] shadow-glow-brand"
                  : "border-[var(--border)]"
              )}
              style={{ background: isToday ? `${color}12` : "var(--muted-bg)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isToday ? color : "var(--muted)" }}>
                {day.slice(0, 3)}
              </p>
              <p className="text-xl font-extrabold mt-0.5" style={{ color: isToday ? color : "var(--foreground)" }}>
                {slots.length}
              </p>
              <p className="text-[9px] text-[var(--muted)]">class{slots.length !== 1 ? "es" : ""}</p>
              {isToday && (
                <div className="mt-1.5 h-1 w-4 mx-auto rounded-full" style={{ background: color }} />
              )}
            </div>
          );
        })}
      </div>

      {timetables.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar className="h-10 w-10 text-[var(--muted)] opacity-30 mb-3" />
          <p className="text-sm text-[var(--muted)]">No timetable data available</p>
        </Card>
      ) : (
        <div className="grid gap-5">
          {byDay.map(({ day, dayIndex, color, slots }) => {
            const isToday = dayIndex === todayDow;
            if (slots.length === 0) return null;
            return (
              <Card key={day} variant={isToday ? "gradient" : "default"}>
                <CardHeader className="flex flex-row items-center gap-3 pb-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold"
                    style={{ background: color }}
                  >
                    {day.slice(0, 2)}
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {day}
                      {isToday && (
                        <Badge variant="default" className="text-[10px] animate-pulse">Today</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{slots.length} class{slots.length !== 1 ? "es" : ""}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-xl border border-[var(--border)] p-4 hover:bg-[var(--muted-bg)] transition-colors"
                        style={{ borderLeft: `3px solid ${color}` }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: `${color}15` }}
                          >
                            <BookOpen className="h-4 w-4" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[var(--foreground)] truncate">
                              {(slot.subjects as { name: string })?.name}
                            </p>
                            <Badge variant="secondary" className="text-[10px] mt-0.5">
                              {(slot.subjects as { code: string })?.code}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span>{slot.start_time} – {slot.end_time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>Room {slot.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
