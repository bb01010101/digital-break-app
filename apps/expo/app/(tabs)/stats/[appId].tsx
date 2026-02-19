import { ArrowLeft } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { ShadowCard } from "../../../components/shadow.card";
import { MiniBarChart } from "../../../components/mini-chart";
import { accentColors } from "../../../theme/colors";
import { ScreenTimeStore } from "../../../data/screen-time.store";

const AppDetail = observer(() => {
    const { appId } = useLocalSearchParams<{ appId: string }>();

    useEffect(() => {
        ScreenTimeStore.init();
    }, []);

    const app = ScreenTimeStore.getAppById(appId ?? "");

    if (!app) {
        return (
            <Container>
                <YStack padding="$4" alignItems="center">
                    <Paragraph color="$text6">App not found</Paragraph>
                </YStack>
            </Container>
        );
    }

    return (
        <Container>
            <YStack gap="$4" paddingBottom="$6">
                {/* Back */}
                <XStack alignItems="center" gap="$2" paddingTop="$2">
                    <View
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => router.back()}
                        padding="$1"
                    >
                        <ArrowLeft color="$text11" size={22} />
                    </View>
                    <View
                        width={28}
                        height={28}
                        borderRadius={8}
                        backgroundColor={app.color}
                        opacity={0.2}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <View
                            width={14}
                            height={14}
                            borderRadius={4}
                            backgroundColor={app.color}
                        />
                    </View>
                    <H4 color="$text11">{app.appName}</H4>
                </XStack>

                {/* Hero */}
                <ShadowCard>
                    <XStack justifyContent="space-between" alignItems="flex-end">
                        <YStack>
                            <Paragraph color="$text6">Today</Paragraph>
                            <H2 color="$text11" fontWeight="900">
                                {ScreenTimeStore.formatMinutes(app.totalMinutesToday)}
                            </H2>
                        </YStack>
                        <YStack alignItems="flex-end">
                            <Paragraph color="$text6">This Week</Paragraph>
                            <SizableText color="$text11" fontWeight="bold" fontSize="$6">
                                {ScreenTimeStore.formatMinutes(app.totalMinutesWeek)}
                            </SizableText>
                        </YStack>
                    </XStack>
                    <XStack marginTop="$3" alignItems="center" gap="$2">
                        <SizableText
                            color={
                                app.weeklyTrend <= 0
                                    ? accentColors.accentGreen
                                    : accentColors.accentRed
                            }
                            fontWeight="bold"
                            fontSize="$4"
                        >
                            {app.weeklyTrend <= 0 ? "↓" : "↑"} {Math.abs(app.weeklyTrend)}%
                        </SizableText>
                        <SizableText color="$text6" fontSize="$3">
                            vs last week
                        </SizableText>
                    </XStack>
                </ShadowCard>

                {/* 30 day chart */}
                <ShadowCard>
                    <YStack gap="$3">
                        <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                            Last 30 Days
                        </SizableText>
                        <MiniBarChart
                            data={app.dailyUsage.map((d) => d.minutes)}
                            barColor={app.color}
                            height={60}
                            width={300}
                            barCount={30}
                        />
                    </YStack>
                </ShadowCard>

                {/* Hourly breakdown */}
                <ShadowCard>
                    <YStack gap="$3">
                        <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                            Hourly Average
                        </SizableText>
                        <XStack alignItems="flex-end" gap={2} height={60}>
                            {app.hourlyAverage.map((h, i) => {
                                const max = Math.max(
                                    ...app.hourlyAverage.map((hh) => hh.minutes),
                                    1
                                );
                                const barH = Math.max(2, (h.minutes / max) * 55);
                                return (
                                    <YStack key={i} flex={1} alignItems="center" gap={1}>
                                        <View
                                            height={barH}
                                            width="100%"
                                            borderRadius={2}
                                            backgroundColor={app.color}
                                            opacity={0.3 + (h.minutes / max) * 0.7}
                                        />
                                        {i % 4 === 0 && (
                                            <SizableText color="$text6" fontSize={7}>
                                                {i}
                                            </SizableText>
                                        )}
                                    </YStack>
                                );
                            })}
                        </XStack>
                    </YStack>
                </ShadowCard>

                {/* Daily breakdown */}
                <ShadowCard>
                    <YStack gap="$2">
                        <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                            Daily Breakdown
                        </SizableText>
                        {app.dailyUsage
                            .slice(-7)
                            .reverse()
                            .map((day, i) => {
                                const dayName = new Date(day.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                });
                                return (
                                    <XStack
                                        key={i}
                                        justifyContent="space-between"
                                        paddingVertical="$1"
                                        borderBottomWidth={i < 6 ? 1 : 0}
                                        borderColor="$grey3"
                                    >
                                        <SizableText color="$text6" fontSize="$3">
                                            {dayName}
                                        </SizableText>
                                        <SizableText
                                            color="$text11"
                                            fontWeight="bold"
                                            fontSize="$3"
                                        >
                                            {ScreenTimeStore.formatMinutes(day.minutes)}
                                        </SizableText>
                                    </XStack>
                                );
                            })}
                    </YStack>
                </ShadowCard>
            </YStack>
        </Container>
    );
});

export default AppDetail;
