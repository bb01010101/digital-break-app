import { useEffect } from "react";
import { SizableText } from "tamagui";
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from "react-native-reanimated";

const AnimatedSizableText = Animated.createAnimatedComponent(SizableText);

export const AnimatedCounter = ({
    value,
    suffix = "",
    prefix = "",
    duration = 1200,
    ...textProps
}: {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
} & Omit<React.ComponentProps<typeof SizableText>, "children">) => {
    const animatedValue = useSharedValue(0);

    useEffect(() => {
        animatedValue.value = withTiming(value, {
            duration,
            easing: Easing.out(Easing.cubic),
        });
    }, [value, duration, animatedValue]);

    const animatedProps = useAnimatedProps(() => {
        const current = Math.round(animatedValue.value);
        return {
            text: `${prefix}${current}${suffix}`,
            children: `${prefix}${current}${suffix}`,
        } as Record<string, unknown>;
    });

    return (
        <AnimatedSizableText
            animatedProps={animatedProps as any}
            {...textProps}
        >
            {`${prefix}${value}${suffix}`}
        </AnimatedSizableText>
    );
};
