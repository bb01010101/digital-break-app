import { View } from "tamagui";

import { accentColors } from "../theme/colors";

export const MiniBarChart = ({
    data,
    height = 32,
    width = 60,
    barColor = accentColors.accentBlue,
    barCount = 7,
}: {
    data: number[];
    height?: number;
    width?: number;
    barColor?: string;
    barCount?: number;
}) => {
    const sliced = data.slice(-barCount);
    const max = Math.max(...sliced, 1);
    const barWidth = Math.max(2, (width - (sliced.length - 1) * 2) / sliced.length);

    return (
        <View
            flexDirection="row"
            alignItems="flex-end"
            gap={2}
            height={height}
            width={width}
        >
            {sliced.map((val, i) => {
                const barHeight = Math.max(2, (val / max) * height);
                return (
                    <View
                        key={i}
                        width={barWidth}
                        height={barHeight}
                        backgroundColor={barColor}
                        borderRadius={barWidth / 2}
                        opacity={0.6 + (i / sliced.length) * 0.4}
                    />
                );
            })}
        </View>
    );
};
