/**
 * Screen Time API wrapper — direct access to iOS FamilyControls,
 * DeviceActivity, and ManagedSettings via react-native-device-activity.
 *
 * On web/Android this module exports no-op stubs so the rest of the
 * app can import it safely.
 */

import { Platform } from "react-native";

/* ─── Types ─── */
export type AuthStatus =
    | "authorized"
    | "denied"
    | "notDetermined"
    | "approved"
    | "unavailable";

export interface ScreenTimeAPI {
    /** Request FamilyControls authorization. */
    requestAuthorization(): Promise<AuthStatus>;

    /** Revoke FamilyControls authorization. */
    revokeAuthorization(): Promise<void>;

    /** Block selected apps by familyActivitySelectionId. */
    blockApps(selectionId: string): void;

    /** Unblock selected apps by familyActivitySelectionId. */
    unblockApps(selectionId: string): void;

    /** Store a user's app selection with a reusable ID. */
    saveSelection(id: string, selectionToken: string): void;

    /** Start monitoring device activity with a schedule. */
    startMonitoring(
        activityName: string,
        schedule: {
            intervalStart: { hour: number; minute: number; second?: number };
            intervalEnd: { hour: number; minute: number; second?: number };
            repeats: boolean;
        },
        events?: Array<{
            eventName: string;
            familyActivitySelection?: string;
            familyActivitySelectionId?: string;
            threshold: { hour?: number; minute?: number; second?: number };
            actions?: Array<{
                type: string;
                familyActivitySelectionId?: string;
                shieldId?: string;
            }>;
        }>
    ): Promise<void>;

    /** Stop monitoring a specific activity. */
    stopMonitoring(activityName: string): Promise<void>;

    /** Update the shield UI (blocking screen). */
    updateShield(
        config: {
            title?: string;
            subtitle?: string;
            primaryButtonLabel?: string;
            iconSystemName?: string;
            backgroundBlurStyle?: number;
            titleColor?: { red: number; green: number; blue: number };
            subtitleColor?: { red: number; green: number; blue: number };
        },
        actions?: {
            primary?: { type?: string; behavior?: string };
            secondary?: { type?: string; behavior?: string };
        }
    ): void;

    /** Get event history. */
    getEvents(): Array<{
        callbackName: string;
        activityName: string;
        eventName?: string;
        date: string;
    }>;

    /** Set web content filter policy on device. */
    setWebContentFilterPolicy(policy: {
        type: "auto" | "specific" | "all" | "none";
        domains?: string[];
        exceptDomains?: string[];
    }): void;

    /** Clear web content filter policy. */
    clearWebContentFilterPolicy(): void;

    /** Whether the native API is available on this platform. */
    readonly isAvailable: boolean;
}

/* ─── Native Implementation (iOS only) ─── */
function createNativeAPI(): ScreenTimeAPI {
    // Lazy-require so the native module only loads on iOS
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RN = require("react-native-device-activity") as typeof import("react-native-device-activity");

    return {
        isAvailable: true,

        async requestAuthorization() {
            const status = await RN.requestAuthorization();
            return (status as unknown) as AuthStatus;
        },

        async revokeAuthorization() {
            RN.revokeAuthorization();
        },

        blockApps(selectionId: string) {
            RN.blockSelection({ activitySelectionId: selectionId });
        },

        unblockApps(selectionId: string) {
            RN.unblockSelection({ activitySelectionId: selectionId });
        },

        saveSelection(id: string, selectionToken: string) {
            RN.setFamilyActivitySelectionId({
                id,
                familyActivitySelection: selectionToken,
            });
        },

        async startMonitoring(activityName, schedule, events = []) {
            await RN.startMonitoring(activityName, schedule, events as any);
        },

        async stopMonitoring(activityName) {
            await RN.stopMonitoring([activityName] as any);
        },

        updateShield(config, actions) {
            RN.updateShield(config as any, actions as any ?? {});
        },

        getEvents() {
            return RN.getEvents() as any;
        },

        setWebContentFilterPolicy(policy) {
            RN.setWebContentFilterPolicy(policy as any);
        },

        clearWebContentFilterPolicy() {
            RN.clearWebContentFilterPolicy();
        },
    };
}

/* ─── Web / Android stubs ─── */
function createStubAPI(): ScreenTimeAPI {
    const noop = () => { };
    return {
        isAvailable: false,
        requestAuthorization: async () => "unavailable" as AuthStatus,
        revokeAuthorization: async () => { },
        blockApps: noop,
        unblockApps: noop,
        saveSelection: noop,
        startMonitoring: async () => { },
        stopMonitoring: async () => { },
        updateShield: noop,
        getEvents: () => [],
        setWebContentFilterPolicy: noop,
        clearWebContentFilterPolicy: noop,
    };
}

/* ─── Export ─── */
export const ScreenTimeNative: ScreenTimeAPI =
    Platform.OS === "ios" ? createNativeAPI() : createStubAPI();

/**
 * Re-export the native picker components for use in screens.
 * These are only available on iOS — guard with Platform.OS check.
 */
export {
    DeviceActivitySelectionView,
    DeviceActivitySelectionSheetView,
} from "react-native-device-activity";
