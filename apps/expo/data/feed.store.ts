import { makeAutoObservable } from "mobx";

export interface FeedPost {
    id: string;
    userName: string;
    screenTimeMinutes: number;
    topApp: string;
    topAppColor: string;
    topAppMinutes: number;
    apps: { name: string; minutes: number; color: string }[];
    likes: number;
    comments: FeedComment[];
    liked: boolean;
    timestamp: number;
    caption: string;
}

export interface FeedComment {
    id: string;
    userName: string;
    text: string;
    timestamp: number;
}

export interface StudySesh {
    id: string;
    hostName: string;
    title: string;
    participants: number;
    isLive: boolean;
    startedAt: number;
}

const USERS = [
    "Alex Chen", "Jordan Smith", "Taylor Kim", "Morgan Lee",
    "Casey Rivera", "Quinn Patel", "Avery Singh", "Riley Johnson",
    "Drew Williams", "Jamie Park",
];

const CAPTIONS = [
    "Down 23% this week 💪 no more scrolling at midnight",
    "2 hours saved today — went for a run instead 🏃",
    "My friend 2FA buddy rejected my TikTok unlock request 😭😂",
    "New personal record! Under 1 hour total screen time 🔥",
    "The custom challenge pushups actually got me in shape???",
    "Touch grass challenge: day 14 ✅",
    "Instagram who? I don't know her anymore",
    "Screentime down, grades up 📈 correlation or causation? both.",
    "My mom has lower screen time than me... time to lock in",
    "POV: you completed 20 pushups just to check Instagram for 30 seconds",
];

const MOCK_APPS = [
    { name: "Instagram", color: "#E1306C" },
    { name: "TikTok", color: "#00F2EA" },
    { name: "YouTube", color: "#FF0000" },
    { name: "Twitter", color: "#1DA1F2" },
    { name: "Reddit", color: "#FF4500" },
    { name: "Snapchat", color: "#FFFC00" },
    { name: "Discord", color: "#5865F2" },
];

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePosts(): FeedPost[] {
    const posts: FeedPost[] = [];
    for (let i = 0; i < 15; i++) {
        const user = USERS[i % USERS.length]!;
        const numApps = rand(3, 6);
        const apps = MOCK_APPS.slice(0, numApps).map((a) => ({
            ...a,
            minutes: rand(5, 90),
        }));
        const totalMin = apps.reduce((s, a) => s + a.minutes, 0);
        const topApp = apps.reduce((max, a) => (a.minutes > max.minutes ? a : max), apps[0]!);
        const commentCount = rand(0, 4);
        const comments: FeedComment[] = [];
        for (let c = 0; c < commentCount; c++) {
            const commenter = USERS[rand(0, USERS.length - 1)]!;
            comments.push({
                id: `c${i}-${c}`,
                userName: commenter,
                text: [
                    "you got this!! 🙌",
                    "no way that's real lol",
                    "teach me your ways 🙏",
                    "still higher than mine 😏",
                    "W behavior fr",
                    "bro put the phone down and go outside 💀",
                ][rand(0, 5)]!,
                timestamp: Date.now() - rand(300000, 7200000),
            });
        }
        posts.push({
            id: `post-${i}`,
            userName: user,
            screenTimeMinutes: totalMin,
            topApp: topApp.name,
            topAppColor: topApp.color,
            topAppMinutes: topApp.minutes,
            apps,
            likes: rand(3, 120),
            comments,
            liked: Math.random() > 0.6,
            timestamp: Date.now() - i * 86400000 - rand(0, 43200000),
            caption: CAPTIONS[i % CAPTIONS.length]!,
        });
    }
    return posts;
}

function generateStudySeshes(): StudySesh[] {
    return [
        { id: "s1", hostName: "Jordan Smith", title: "Finals Study Grind 📚", participants: 7, isLive: true, startedAt: Date.now() - 3600000 },
        { id: "s2", hostName: "Taylor Kim", title: "Morning Focus Session ☀️", participants: 3, isLive: true, startedAt: Date.now() - 1800000 },
        { id: "s3", hostName: "Casey Rivera", title: "Late Night Coding 💻", participants: 12, isLive: false, startedAt: Date.now() - 7200000 },
    ];
}

class FeedStoreSingleton {
    posts: FeedPost[] = [];
    studySeshes: StudySesh[] = [];
    _initialized = false;

    constructor() {
        makeAutoObservable(this);
    }

    init() {
        if (this._initialized) return;
        this._initialized = true;
        this.posts = generatePosts();
        this.studySeshes = generateStudySeshes();
    }

    toggleLike(postId: string) {
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
        }
    }

    addComment(postId: string, text: string) {
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
            post.comments.push({
                id: `c-new-${Date.now()}`,
                userName: "You",
                text,
                timestamp: Date.now(),
            });
        }
    }

    getPost(postId: string): FeedPost | undefined {
        return this.posts.find((p) => p.id === postId);
    }

    formatTime(minutes: number): string {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h === 0) return `${m}m`;
        return `${h}h ${m}m`;
    }

    formatTimestamp(ts: number): string {
        const diff = Date.now() - ts;
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    }
}

export const FeedStore = new FeedStoreSingleton();
