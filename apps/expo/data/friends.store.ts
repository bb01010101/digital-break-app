import { makeAutoObservable } from "mobx";

export interface Friend {
    id: string;
    name: string;
    username: string;
    weeklyScreenTime: number;
    streak: number;
    trend: number; // percentage
    isOnline: boolean;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    participants: Friend[];
    goalMinutes: number; // weekly goal (under this to win)
    durationDays: number;
    daysRemaining: number;
    potAmount: number; // 0 = free
    leaderboard: { friend: Friend; currentMinutes: number }[];
    type: "free" | "pot";
}

export interface DerivativeBet {
    id: string;
    targetFriend: Friend;
    metric: string;
    threshold: number;
    yourStake: number;
    potentialReturn: number;
    status: "active" | "won" | "lost";
}

const MOCK_FRIENDS: Friend[] = [
    { id: "f1", name: "Jordan Smith", username: "@jordan_s", weeklyScreenTime: 840, streak: 14, trend: -12, isOnline: true },
    { id: "f2", name: "Taylor Kim", username: "@tkim", weeklyScreenTime: 1260, streak: 3, trend: 8, isOnline: true },
    { id: "f3", name: "Morgan Lee", username: "@morganlee", weeklyScreenTime: 620, streak: 21, trend: -18, isOnline: false },
    { id: "f4", name: "Casey Rivera", username: "@casey_r", weeklyScreenTime: 1050, streak: 7, trend: -5, isOnline: true },
    { id: "f5", name: "Quinn Patel", username: "@quinnp", weeklyScreenTime: 980, streak: 0, trend: 15, isOnline: false },
    { id: "f6", name: "Avery Singh", username: "@avery", weeklyScreenTime: 540, streak: 30, trend: -22, isOnline: false },
    { id: "f7", name: "Riley Johnson", username: "@rileyj", weeklyScreenTime: 1400, streak: 1, trend: 20, isOnline: true },
    { id: "f8", name: "Drew Williams", username: "@drew_w", weeklyScreenTime: 700, streak: 10, trend: -9, isOnline: false },
];

function generateChallenges(): Challenge[] {
    return [
        {
            id: "ch1",
            title: "Screen Time Under 2hrs/day 🔥",
            description: "Keep your daily average under 2 hours for the week",
            participants: MOCK_FRIENDS.slice(0, 5),
            goalMinutes: 840,
            durationDays: 7,
            daysRemaining: 4,
            potAmount: 25,
            type: "pot",
            leaderboard: [
                { friend: MOCK_FRIENDS[5]!, currentMinutes: 380 },
                { friend: MOCK_FRIENDS[2]!, currentMinutes: 420 },
                { friend: MOCK_FRIENDS[0]!, currentMinutes: 560 },
                { friend: MOCK_FRIENDS[3]!, currentMinutes: 710 },
                { friend: MOCK_FRIENDS[1]!, currentMinutes: 890 },
            ],
        },
        {
            id: "ch2",
            title: "No TikTok Week 🚫",
            description: "Zero TikTok usage for 7 days straight",
            participants: MOCK_FRIENDS.slice(2, 6),
            goalMinutes: 0,
            durationDays: 7,
            daysRemaining: 2,
            potAmount: 0,
            type: "free",
            leaderboard: [
                { friend: MOCK_FRIENDS[2]!, currentMinutes: 0 },
                { friend: MOCK_FRIENDS[3]!, currentMinutes: 0 },
                { friend: MOCK_FRIENDS[4]!, currentMinutes: 15 },
                { friend: MOCK_FRIENDS[5]!, currentMinutes: 45 },
            ],
        },
    ];
}

function generateBets(): DerivativeBet[] {
    return [
        {
            id: "b1",
            targetFriend: MOCK_FRIENDS[2]!,
            metric: "Weekly screen time under",
            threshold: 600,
            yourStake: 10,
            potentialReturn: 18,
            status: "active",
        },
        {
            id: "b2",
            targetFriend: MOCK_FRIENDS[0]!,
            metric: "30-day streak maintained",
            threshold: 30,
            yourStake: 5,
            potentialReturn: 15,
            status: "active",
        },
    ];
}

class FriendsStoreSingleton {
    friends: Friend[] = [];
    challenges: Challenge[] = [];
    bets: DerivativeBet[] = [];
    _initialized = false;

    constructor() {
        makeAutoObservable(this);
    }

    init() {
        if (this._initialized) return;
        this._initialized = true;
        this.friends = MOCK_FRIENDS;
        this.challenges = generateChallenges();
        this.bets = generateBets();
    }

    get onlineFriends() {
        return this.friends.filter((f) => f.isOnline);
    }

    get sortedByScreenTime() {
        return [...this.friends].sort((a, b) => a.weeklyScreenTime - b.weeklyScreenTime);
    }

    formatMinutes(min: number): string {
        const h = Math.floor(min / 60);
        const m = min % 60;
        if (h === 0) return `${m}m`;
        return `${h}h ${m}m`;
    }
}

export const FriendsStore = new FriendsStoreSingleton();
