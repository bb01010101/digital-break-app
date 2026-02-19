import { makeAutoObservable } from "mobx";

export type BlockingMode = "friend-2fa" | "custom-challenge" | "simple-timer";

export interface BlockedApp {
    id: string;
    name: string;
    iconKey: string;
    color: string;
    enabled: boolean;
    mode: BlockingMode;
    friendPhone?: string;
    challengeType?: ChallengeType;
    challengeConfig?: ChallengeConfig;
}

export type ChallengeType =
    | "quizlet"
    | "leetcode"
    | "crossword"
    | "pushups"
    | "walk"
    | "bible"
    | "audiobook"
    | "custom";

export interface ChallengeConfig {
    type: ChallengeType;
    label: string;
    description: string;
    quantity: number;
    unit: string;
    icon: string;
}

const CHALLENGE_TEMPLATES: ChallengeConfig[] = [
    { type: "quizlet", label: "Quizlet Quiz", description: "Answer quiz questions before unlocking", quantity: 10, unit: "questions", icon: "📚" },
    { type: "leetcode", label: "LeetCode Problem", description: "Solve a coding problem", quantity: 1, unit: "problem", icon: "💻" },
    { type: "crossword", label: "Crossword Puzzle", description: "Complete a crossword puzzle", quantity: 1, unit: "puzzle", icon: "🧩" },
    { type: "pushups", label: "Pushups", description: "Do pushups to earn screen time", quantity: 20, unit: "pushups", icon: "💪" },
    { type: "walk", label: "Walk / Jog", description: "Go for a walk or jog", quantity: 10, unit: "minutes", icon: "🚶" },
    { type: "bible", label: "Bible Passage", description: "Read a Bible passage", quantity: 1, unit: "passage", icon: "📖" },
    { type: "audiobook", label: "Audiobook Chapter", description: "Listen to an audiobook chapter", quantity: 1, unit: "chapter", icon: "🎧" },
    { type: "custom", label: "Custom", description: "Design your own challenge", quantity: 1, unit: "task", icon: "✨" },
];

const DEFAULT_BLOCKED_APPS: BlockedApp[] = [
    { id: "1", name: "Instagram", iconKey: "instagram", color: "#E1306C", enabled: true, mode: "simple-timer" },
    { id: "2", name: "TikTok", iconKey: "tiktok", color: "#00F2EA", enabled: true, mode: "friend-2fa", friendPhone: "+1 (555) 123-4567" },
    { id: "3", name: "YouTube", iconKey: "youtube", color: "#FF0000", enabled: false, mode: "custom-challenge", challengeType: "pushups", challengeConfig: CHALLENGE_TEMPLATES[3] },
    { id: "4", name: "Twitter", iconKey: "twitter", color: "#1DA1F2", enabled: true, mode: "custom-challenge", challengeType: "walk", challengeConfig: CHALLENGE_TEMPLATES[4] },
    { id: "5", name: "Reddit", iconKey: "reddit", color: "#FF4500", enabled: false, mode: "simple-timer" },
    { id: "6", name: "Snapchat", iconKey: "snapchat", color: "#FFFC00", enabled: false, mode: "simple-timer" },
];

class BlockingStoreSingleton {
    blockedApps: BlockedApp[] = [];
    challengeTemplates: ChallengeConfig[] = CHALLENGE_TEMPLATES;
    _initialized = false;

    constructor() {
        makeAutoObservable(this);
    }

    init() {
        if (this._initialized) return;
        this._initialized = true;
        this.blockedApps = DEFAULT_BLOCKED_APPS;
    }

    toggleApp(id: string) {
        const app = this.blockedApps.find((a) => a.id === id);
        if (app) app.enabled = !app.enabled;
    }

    setMode(id: string, mode: BlockingMode) {
        const app = this.blockedApps.find((a) => a.id === id);
        if (app) app.mode = mode;
    }

    setFriendPhone(id: string, phone: string) {
        const app = this.blockedApps.find((a) => a.id === id);
        if (app) app.friendPhone = phone;
    }

    setChallenge(id: string, config: ChallengeConfig) {
        const app = this.blockedApps.find((a) => a.id === id);
        if (app) {
            app.challengeType = config.type;
            app.challengeConfig = config;
        }
    }

    get enabledApps(): BlockedApp[] {
        return this.blockedApps.filter((a) => a.enabled);
    }

    get disabledApps(): BlockedApp[] {
        return this.blockedApps.filter((a) => !a.enabled);
    }
}

export const BlockingStore = new BlockingStoreSingleton();
