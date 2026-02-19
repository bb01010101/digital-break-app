import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { SizableText, View } from "tamagui";

import { gradients } from "../theme/colors";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<AvatarSize, { outer: number; inner: number; font: number; ring: number }> = {
    sm: { outer: 36, inner: 32, font: 13, ring: 2 },
    md: { outer: 48, inner: 42, font: 16, ring: 3 },
    lg: { outer: 64, inner: 56, font: 22, ring: 4 },
    xl: { outer: 96, inner: 86, font: 32, ring: 5 },
};

export const Avatar = ({
    name,
    size = "md",
    ringVariant = "primary",
    showRing = true,
    imageUri,
}: {
    name: string;
    size?: AvatarSize;
    ringVariant?: keyof typeof gradients;
    showRing?: boolean;
    imageUri?: string;
}) => {
    const dims = sizeMap[size];
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const bgColor = stringToColor(name);

    if (!showRing) {
        return (
            <View
                width={dims.inner}
                height={dims.inner}
                borderRadius={dims.inner / 2}
                backgroundColor={bgColor}
                alignItems="center"
                justifyContent="center"
            >
                <SizableText color="white" fontWeight="bold" fontSize={dims.font}>
                    {initials}
                </SizableText>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={[...gradients[ringVariant]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ring, { width: dims.outer, height: dims.outer, borderRadius: dims.outer / 2, padding: dims.ring }]}
        >
            <View
                width={dims.inner}
                height={dims.inner}
                borderRadius={dims.inner / 2}
                backgroundColor={bgColor}
                alignItems="center"
                justifyContent="center"
            >
                <SizableText color="white" fontWeight="bold" fontSize={dims.font}>
                    {initials}
                </SizableText>
            </View>
        </LinearGradient>
    );
};

function stringToColor(str: string): string {
    const palette = [
        "#6366F1", "#8B5CF6", "#A855F7", "#D946EF",
        "#EC4899", "#F43F5E", "#EF4444", "#F97316",
        "#F59E0B", "#84CC16", "#22C55E", "#14B8A6",
        "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length]!;
}

const styles = StyleSheet.create({
    ring: {
        alignItems: "center",
        justifyContent: "center",
    },
});
