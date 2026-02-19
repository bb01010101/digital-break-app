import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet } from "react-native";
import { SizableText, View } from "tamagui";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";

import { gradients } from "../theme/colors";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type GradientVariant = keyof typeof gradients;

export const GradientButton = ({
    label,
    onPress,
    variant = "primary",
    icon,
    fullWidth = false,
    size = "md",
}: {
    label: string;
    onPress?: () => void;
    variant?: GradientVariant;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    size?: "sm" | "md" | "lg";
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const paddingMap = { sm: 10, md: 14, lg: 18 };
    const fontSizeMap = { sm: 13, md: 15, lg: 17 };

    return (
        <AnimatedPressable
            onPressIn={() => {
                scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
            }}
            onPressOut={() => {
                scale.value = withSpring(1, { damping: 15, stiffness: 200 });
            }}
            onPress={onPress}
            style={[animatedStyle, fullWidth && { width: "100%" }]}
        >
            <LinearGradient
                colors={[...gradients[variant]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.gradient,
                    { paddingVertical: paddingMap[size] },
                ]}
            >
                <View flexDirection="row" alignItems="center" gap="$2">
                    {icon}
                    <SizableText
                        color="white"
                        fontWeight="bold"
                        fontSize={fontSizeMap[size]}
                    >
                        {label}
                    </SizableText>
                </View>
            </LinearGradient>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    gradient: {
        borderRadius: 14,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
    },
});
