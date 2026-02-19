import { makeAutoObservable } from "mobx";

interface AppUsageDay {
    date: string; // YYYY-MM-DD
    minutes: number;
}

interface HourlyUsage {
    hour: number; // 0-23
    minutes: number;
}

export interface AppScreenTime {
    appName: string;
    iconKey: string;
    color: string;
    dailyUsage: AppUsageDay[];
    hourlyAverage: HourlyUsage[];
    totalMinutesToday: number;
    totalMinutesWeek: number;
    weeklyTrend: number; // percentage change from last week
}

interface DailyTotal {
    date: string;
    totalMinutes: number;
    apps: { appName: string; minutes: number; color: string }[];
}

const APP_TEMPLATES = [
    { name: "Instagram", iconKey: "instagram", color: "#E1306C", avgMin: 65, variance: 25 },
    { name: "TikTok", iconKey: "tiktok", color: "#00F2EA", avgMin: 55, variance: 30 },
    { name: "YouTube", iconKey: "youtube", color: "#FF0000", avgMin: 45, variance: 20 },
    { name: "Twitter", iconKey: "twitter", color: "#1DA1F2", avgMin: 30, variance: 15 },
    { name: "Reddit", iconKey: "reddit", color: "#FF4500", avgMin: 25, variance: 12 },
    { name: "Snapchat", iconKey: "snapchat", color: "#FFFC00", avgMin: 20, variance: 10 },
    { name: "Discord", iconKey: "discord", color: "#5865F2", avgMin: 18, variance: 8 },
    { name: "Netflix", iconKey: "netflix", color: "#E50914", avgMin: 35, variance: 20 },
];

const HOUR_WEIGHTS = [
    0.02, 0.01, 0.01, 0.01, 0.01, 0.02, 0.03, 0.05,
    0.06, 0.07, 0.06, 0.05, 0.06, 0.07, 0.06, 0.05,
    0.04, 0.05, 0.06, 0.07, 0.08, 0.07, 0.05, 0.03,
];

function randomInRange(base: number, variance: number): number {
    return Math.max(0, Math.round(base + (Math.random() - 0.5) * 2 * variance));
}

function getDateStr(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().slice(0, 10);
}

function generateDailyUsage(avgMin: number, variance: number, days: number): AppUsageDay[] {
    const result: AppUsageDay[] = [];
    for (let i = days - 1; i >= 0; i--) {
        const weekday = new Date(Date.now() - i * 86400000).getDay();
        const weekendBoost = weekday === 0 || weekday === 6 ? 1.3 : 1;
        result.push({
            date: getDateStr(i),
            minutes: randomInRange(avgMin * weekendBoost, variance),
        });
    }
    return result;
}

function generateHourlyAverage(totalDailyMin: number): HourlyUsage[] {
    return HOUR_WEIGHTS.map((w, hour) => ({
        hour,
        minutes: Math.round(totalDailyMin * w),
    }));
}

class ScreenTimeStoreSingleton {
    apps: AppScreenTime[] = [];
    dailyTotals: DailyTotal[] = [];
    _selectedRange: "day" | "week" | "month" = "week";
    _initialized = false;

    constructor() {
        makeAutoObservable(this);
    }

    init() {
        if (this._initialized) return;
        this._initialized = true;

        this.apps = APP_TEMPLATES.map((tmpl) => {
            const dailyUsage = generateDailyUsage(tmpl.avgMin, tmpl.variance, 30);
            const today = dailyUsage[dailyUsage.length - 1]!;
            const thisWeek = dailyUsage.slice(-7).reduce((s, d) => s + d.minutes, 0);
            const lastWeek = dailyUsage.slice(-14, -7).reduce((s, d) => s + d.minutes, 0);
            const weeklyTrend = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

            return {
                appName: tmpl.name,
                iconKey: tmpl.iconKey,
                color: tmpl.color,
                dailyUsage,
                hourlyAverage: generateHourlyAverage(today.minutes),
                totalMinutesToday: today.minutes,
                totalMinutesWeek: thisWeek,
                weeklyTrend,
            };
        });

        // build daily totals for the workflow wave
        const days = 30;
        this.dailyTotals = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = getDateStr(i);
            const appsForDay = this.apps.map((app) => {
                const dayData = app.dailyUsage.find((d) => d.date === date);
                return { appName: app.appName, minutes: dayData?.minutes ?? 0, color: app.color };
            });
            this.dailyTotals.push({
                date,
                totalMinutes: appsForDay.reduce((s, a) => s + a.minutes, 0),
                apps: appsForDay,
            });
        }
    }

    get selectedRange() {
        return this._selectedRange;
    }

    set selectedRange(value: "day" | "week" | "month") {
        this._selectedRange = value;
    }

    get todayTotal(): number {
        return this.apps.reduce((s, a) => s + a.totalMinutesToday, 0);
    }

    get weekTotal(): number {
        return this.apps.reduce((s, a) => s + a.totalMinutesWeek, 0);
    }

    get weeklyAverage(): number {
        return Math.round(this.weekTotal / 7);
    }

    get weeklyTrendPercent(): number {
        const thisWeek = this.weekTotal;
        const lastWeek = this.apps.reduce((s, a) => {
            return s + a.dailyUsage.slice(-14, -7).reduce((ss, d) => ss + d.minutes, 0);
        }, 0);
        if (lastWeek === 0) return 0;
        return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    }

    get pieChartData(): { label: string; value: number; color: string }[] {
        const range = this._selectedRange;
        return this.apps
            .map((app) => {
                let val = 0;
                if (range === "day") val = app.totalMinutesToday;
                else if (range === "week") val = app.totalMinutesWeek;
                else val = app.dailyUsage.reduce((s, d) => s + d.minutes, 0);
                return { label: app.appName, value: val, color: app.color };
            })
            .filter((d) => d.value > 0)
            .sort((a, b) => b.value - a.value);
    }

    get topApps(): AppScreenTime[] {
        return [...this.apps].sort((a, b) => b.totalMinutesToday - a.totalMinutesToday);
    }

    getAppById(iconKey: string): AppScreenTime | undefined {
        return this.apps.find((a) => a.iconKey === iconKey);
    }

    formatMinutes(min: number): string {
        const h = Math.floor(min / 60);
        const m = min % 60;
        if (h === 0) return `${m}m`;
        return `${h}h ${m}m`;
    }
}

export const ScreenTimeStore = new ScreenTimeStoreSingleton();
