import { ChevronRight } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
    H2,
    H4,
    Paragraph,
    SizableText,
    View,
    XStack,
    YStack,
} from "tamagui";

import { Container } from "../../../components/container";
import { GlassCard } from "../../../components/glass-card";
import { Header } from "../../../components/header";
import { MiniBarChart } from "../../../components/mini-chart";
import { ShadowCard } from "../../../components/shadow.card";
import { accentColors } from "../../../theme/colors";
import { ScreenTimeStore } from "../../../data/screen-time.store";

const RangeSelector = observer(
    ({
        selected,
        onChange,
    }: {
        selected: "day" | "week" | "month";
        onChange: (v: "day" | "week" | "month") => void;
    }) => {
        const options: ("day" | "week" | "month")[] = ["day", "week", "month"];
        return (
            <XStack
                backgroundColor="$grey1"
                borderRadius="$3"
                padding="$1"
                gap="$1"
            >
                {options.map((opt) => (
                    <View
                        key={opt}
                        flex={1}
                        paddingVertical="$2"
                        borderRadius="$2"
                        alignItems="center"
                        backgroundColor={selected === opt ? "$background1" : "transparent"}
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => onChange(opt)}
                    >
                        <SizableText
                            fontSize="$3"
                            fontWeight={selected === opt ? "bold" : "normal"}
                            color={selected === opt ? "$text11" : "$text6"}
                            textTransform="capitalize"
                        >
                            {opt}
                        </SizableText>
                    </View>
                ))}
            </XStack>
        );
    }
);

const Stats = observer(() => {
    useEffect(() => {
        ScreenTimeStore.init();
    }, []);

    const todayFormatted = ScreenTimeStore.formatMinutes(ScreenTimeStore.todayTotal);
    const avgFormatted = ScreenTimeStore.formatMinutes(ScreenTimeStore.weeklyAverage);
    const trendPercent = ScreenTimeStore.weeklyTrendPercent;
    const trendColor = trendPercent <= 0 ? accentColors.accentGreen : accentColors.accentRed;
    const trendArrow = trendPercent <= 0 ? "↓" : "↑";

    return (
        <Container header={({ isSticky }) => <Header isSticky={isSticky} />}>
            <YStack gap="$4" paddingBottom="$6">
                <H4 color="$text11">Screen Time</H4>

                {/* Hero card */}
                <GlassCard>
                    <YStack gap="$2">
                        <Paragraph color="$text6">Today</Paragraph>
                        <H2 color="$text11" fontWeight="900" fontSize="$10">
                            {todayFormatted}
                        </H2>
                        <XStack gap="$3" alignItems="center">
                            <SizableText color={trendColor} fontWeight="bold" fontSize="$4">
                                {trendArrow} {Math.abs(trendPercent)}%
                            </SizableText>
                            <SizableText color="$text6" fontSize="$3">
                                vs last week
                            </SizableText>
                        </XStack>
                        <XStack gap="$4" marginTop="$2">
                            <YStack>
                                <SizableText color="$text6" fontSize="$2">
                                    Daily Avg
                                </SizableText>
                                <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                                    {avgFormatted}
                                </SizableText>
                            </YStack>
                            <YStack>
                                <SizableText color="$text6" fontSize="$2">
                                    Week Total
                                </SizableText>
                                <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                                    {ScreenTimeStore.formatMinutes(ScreenTimeStore.weekTotal)}
                                </SizableText>
                            </YStack>
                        </XStack>
                    </YStack>
                </GlassCard>

                {/* Range selector */}
                <RangeSelector
                    selected={ScreenTimeStore.selectedRange}
                    onChange={(v) => {
                        ScreenTimeStore.selectedRange = v;
                    }}
                />

                {/* Pie chart breakdown */}
                <ShadowCard>
                    <YStack gap="$3">
                        <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                            App Breakdown
                        </SizableText>
                        {ScreenTimeStore.pieChartData.map((item, idx) => {
                            const total = ScreenTimeStore.pieChartData.reduce(
                                (s, d) => s + d.value,
                                0
                            );
                            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;

                            return (
                                <XStack key={idx} alignItems="center" gap="$3">
                                    <View
                                        width={12}
                                        height={12}
                                        borderRadius={6}
                                        backgroundColor={item.color}
                                    />
                                    <SizableText
                                        color="$text11"
                                        flex={1}
                                        fontSize="$4"
                                        fontWeight="600"
                                    >
                                        {item.label}
                                    </SizableText>
                                    <SizableText color="$text6" fontSize="$3">
                                        {ScreenTimeStore.formatMinutes(item.value)}
                                    </SizableText>
                                    <View
                                        backgroundColor={item.color}
                                        opacity={0.2}
                                        height={6}
                                        width={pct * 0.8}
                                        borderRadius={3}
                                    />
                                    <SizableText
                                        color="$text6"
                                        fontSize="$2"
                                        width={36}
                                        textAlign="right"
                                    >
                                        {pct}%
                                    </SizableText>
                                </XStack>
                            );
                        })}
                    </YStack>
                </ShadowCard>

                {/* Top apps list */}
                <ShadowCard>
                    <YStack gap="$3">
                        <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                            Top Apps
                        </SizableText>
                        {ScreenTimeStore.topApps.slice(0, 5).map((app, idx) => (
                            <XStack
                                key={idx}
                                alignItems="center"
                                gap="$3"
                                pressStyle={{ opacity: 0.7 }}
                                onPress={() => router.push(`/stats/${app.iconKey}` as never)}
                            >
                                <View
                                    width={36}
                                    height={36}
                                    borderRadius={10}
                                    backgroundColor={app.color}
                                    opacity={0.15}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <View
                                        width={16}
                                        height={16}
                                        borderRadius={4}
                                        backgroundColor={app.color}
                                    />
                                </View>
                                <YStack flex={1}>
                                    <SizableText
                                        color="$text11"
                                        fontWeight="bold"
                                        fontSize="$4"
                                    >
                                        {app.appName}
                                    </SizableText>
                                    <SizableText color="$text6" fontSize="$2">
                                        {ScreenTimeStore.formatMinutes(app.totalMinutesToday)} today
                                    </SizableText>
                                </YStack>
                                <MiniBarChart
                                    data={app.dailyUsage.slice(-7).map((d) => d.minutes)}
                                    barColor={app.color}
                                    height={24}
                                    width={50}
                                />
                                <SizableText
                                    color={
                                        app.weeklyTrend <= 0
                                            ? accentColors.accentGreen
                                            : accentColors.accentRed
                                    }
                                    fontSize="$3"
                                    fontWeight="bold"
                                >
                                    {app.weeklyTrend <= 0 ? "↓" : "↑"}
                                    {Math.abs(app.weeklyTrend)}%
                                </SizableText>
                                <ChevronRight color="$text6" size={16} />
                            </XStack>
                        ))}
                    </YStack>
                </ShadowCard>

                {/* Workflow wave (daily totals) */}
                <ShadowCard>
                    <YStack gap="$3">
                        <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                            Daily Usage Wave
                        </SizableText>
                        <XStack alignItems="flex-end" gap={3} height={100}>
                            {ScreenTimeStore.dailyTotals.slice(-14).map((day, i) => {
                                const max = Math.max(
                                    ...ScreenTimeStore.dailyTotals
                                        .slice(-14)
                                        .map((d) => d.totalMinutes),
                                    1
                                );
                                const h = (day.totalMinutes / max) * 90;
                                const isToday = i === 13;
                                return (
                                    <YStack key={i} flex={1} alignItems="center" gap={2}>
                                        <View
                                            height={Math.max(4, h)}
                                            width="100%"
                                            borderRadius={4}
                                            backgroundColor={
                                                isToday
                                                    ? accentColors.accentBlue
                                                    : accentColors.accentPurple
                                            }
                                            opacity={isToday ? 1 : 0.4 + (i / 14) * 0.5}
                                        />
                                        {(i === 0 || i === 6 || i === 13) && (
                                            <SizableText color="$text6" fontSize={8}>
                                                {day.date.slice(5)}
                                            </SizableText>
                                        )}
                                    </YStack>
                                );
                            })}
                        </XStack>
                    </YStack>
                </ShadowCard>
            </YStack>
        </Container>
    );
});

export default Stats;
