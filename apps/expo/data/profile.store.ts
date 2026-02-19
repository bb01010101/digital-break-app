import { makeAutoObservable } from "mobx";

export interface UserProfile {
    name: string;
    username: string;
    joinDate: string;
    streak: number;
    lifetimeHoursSaved: number;
    appsBlocked: number;
    challengesWon: number;
    isPremium: boolean;
    linkedAccounts: LinkedAccount[];
}

export interface LinkedAccount {
    id: string;
    name: string;
    icon: string;
    connected: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
    name: "Brian Boler",
    username: "@brianboler",
    joinDate: "2025-01-15",
    streak: 14,
    lifetimeHoursSaved: 127,
    appsBlocked: 6,
    challengesWon: 3,
    isPremium: false,
    linkedAccounts: [
        { id: "strava", name: "Strava", icon: "🏃", connected: true },
        { id: "quizlet", name: "Quizlet", icon: "📚", connected: true },
        { id: "garmin", name: "Garmin", icon: "⌚", connected: false },
        { id: "spotify", name: "Spotify", icon: "🎵", connected: false },
    ],
};

class ProfileStoreSingleton {
    profile: UserProfile = DEFAULT_PROFILE;
    _initialized = false;

    constructor() {
        makeAutoObservable(this);
    }

    init() {
        if (this._initialized) return;
        this._initialized = true;
    }

    toggleLinkedAccount(id: string) {
        const account = this.profile.linkedAccounts.find((a) => a.id === id);
        if (account) account.connected = !account.connected;
    }

    get memberSince(): string {
        const d = new Date(this.profile.joinDate);
        return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
}

export const ProfileStore = new ProfileStoreSingleton();
