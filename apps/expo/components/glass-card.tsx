import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import { View } from "tamagui";

import { useTheme } from "./theme-provider";

export const GlassCard = ({
    children,
    intensity = 40,
    ...viewProps
}: {
    children: React.ReactNode;
    intensity?: number;
} & React.ComponentProps<typeof View>) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    if (Platform.OS === "web") {
        return (
            <View
                backgroundColor={isDark ? "rgba(30,30,46,0.7)" : "rgba(255,255,255,0.7)"}
                borderRadius="$4"
                borderWidth={1}
                borderColor={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}
                padding="$3"
                style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                }}
                {...viewProps}
            >
                {children}
            </View>
        );
    }

    return (
        <View borderRadius="$4" overflow="hidden" {...viewProps}>
            <BlurView
                intensity={intensity}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />
            <View
                borderRadius="$4"
                borderWidth={1}
                borderColor={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}
                padding="$3"
                style={StyleSheet.absoluteFill}
            />
            <View padding="$3">{children}</View>
        </View>
    );
};
