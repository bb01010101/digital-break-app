import { Lock, Shield, Sparkles, Users, Zap } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
    H4,
    Paragraph,
    SizableText,
    Switch,
    View,
    XStack,
    YStack,
} from "tamagui";

import { Container } from "../../../components/container";
import { GlassCard } from "../../../components/glass-card";
import { GradientButton } from "../../../components/gradient-button";
import { Header } from "../../../components/header";
import { ShadowCard } from "../../../components/shadow.card";
import { accentColors } from "../../../theme/colors";
import { BlockingStore, type BlockedApp, type BlockingMode } from "../../../data/blocking.store";

const modeIcons: Record<BlockingMode, React.ReactNode> = {
    "friend-2fa": <Users size={14} color={accentColors.accentPurple} />,
    "custom-challenge": <Sparkles size={14} color={accentColors.accentOrange} />,
    "simple-timer": <Lock size={14} color={accentColors.accentBlue} />,
};

const modeLabels: Record<BlockingMode, string> = {
    "friend-2fa": "Friend 2FA",
    "custom-challenge": "Challenge",
    "simple-timer": "Timer",
};

const AppRow = observer(({ app }: { app: BlockedApp }) => (
    <XStack
        alignItems="center"
        gap="$3"
        paddingVertical="$2"
        borderBottomWidth={1}
        borderColor="$grey3"
    >
        <View
            width={40}
            height={40}
            borderRadius={12}
            backgroundColor={app.color}
            opacity={0.15}
            alignItems="center"
            justifyContent="center"
        >
            <View
                width={18}
                height={18}
                borderRadius={5}
                backgroundColor={app.color}
            />
        </View>
        <YStack flex={1}>
            <SizableText color="$text11" fontWeight="bold" fontSize="$4">
                {app.name}
            </SizableText>
            <XStack alignItems="center" gap="$1">
                {modeIcons[app.mode]}
                <SizableText color="$text6" fontSize="$2">
                    {modeLabels[app.mode]}
                    {app.mode === "friend-2fa" && app.friendPhone
                        ? ` • ${app.friendPhone}`
                        : ""}
                    {app.mode === "custom-challenge" && app.challengeConfig
                        ? ` • ${app.challengeConfig.icon} ${app.challengeConfig.label}`
                        : ""}
                </SizableText>
            </XStack>
        </YStack>
        <Switch
            size="$3"
            checked={app.enabled}
            onCheckedChange={() => BlockingStore.toggleApp(app.id)}
            backgroundColor={app.enabled ? accentColors.accentGreen : "$grey3"}
        >
            <Switch.Thumb animation="quick" />
        </Switch>
    </XStack>
));

const Blocking = observer(() => {
    useEffect(() => {
        BlockingStore.init();
    }, []);

    return (
        <Container header={({ isSticky }) => <Header isSticky={isSticky} />}>
            <YStack gap="$4" paddingBottom="$6">
                <H4 color="$text11">Blocking</H4>

                {/* Active blocks count */}
                <GlassCard>
                    <XStack alignItems="center" gap="$3">
                        <View
                            backgroundColor="rgba(79,140,255,0.15)"
                            padding="$2"
                            borderRadius={999}
                        >
                            <Shield color={accentColors.accentBlue} size={22} />
                        </View>
                        <YStack flex={1}>
                            <SizableText color="$text11" fontWeight="900" fontSize="$7">
                                {BlockingStore.enabledApps.length}
                            </SizableText>
                            <Paragraph color="$text6">Apps actively blocked</Paragraph>
                        </YStack>
                        <View
                            backgroundColor="rgba(52,211,153,0.15)"
                            paddingHorizontal="$3"
                            paddingVertical="$1"
                            borderRadius={999}
                        >
                            <SizableText
                                color={accentColors.accentGreen}
                                fontWeight="bold"
                                fontSize="$3"
                            >
                                Active
                            </SizableText>
                        </View>
                    </XStack>
                </GlassCard>

                {/* Blocking modes */}
                <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                    Blocking Modes
                </SizableText>
                <XStack gap="$3">
                    <ShadowCard
                        flex={1}
                        pressStyle={{ opacity: 0.8 }}
                        onPress={() => router.push("/blocking/friend-2fa" as never)}
                    >
                        <YStack alignItems="center" gap="$2" paddingVertical="$2">
                            <View
                                backgroundColor="rgba(168,85,247,0.15)"
                                padding="$3"
                                borderRadius={999}
                            >
                                <Users color={accentColors.accentPurple} size={24} />
                            </View>
                            <SizableText color="$text11" fontWeight="bold" fontSize="$4" textAlign="center">
                                Friend 2FA
                            </SizableText>
                            <Paragraph
                                color="$text6"
                                fontSize="$2"
                                textAlign="center"
                                lineHeight={14}
                            >
                                Your friend must send you a code to unlock
                            </Paragraph>
                        </YStack>
                    </ShadowCard>
                    <ShadowCard
                        flex={1}
                        pressStyle={{ opacity: 0.8 }}
                        onPress={() =>
                            router.push("/blocking/custom-challenge" as never)
                        }
                    >
                        <YStack alignItems="center" gap="$2" paddingVertical="$2">
                            <View
                                backgroundColor="rgba(251,146,60,0.15)"
                                padding="$3"
                                borderRadius={999}
                            >
                                <Zap color={accentColors.accentOrange} size={24} />
                            </View>
                            <SizableText color="$text11" fontWeight="bold" fontSize="$4" textAlign="center">
                                Custom Challenge
                            </SizableText>
                            <Paragraph
                                color="$text6"
                                fontSize="$2"
                                textAlign="center"
                                lineHeight={14}
                            >
                                Complete a task to earn screen time
                            </Paragraph>
                        </YStack>
                    </ShadowCard>
                </XStack>

                {/* Blocked apps list */}
                <ShadowCard>
                    <YStack gap="$1">
                        <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                            Blocked Apps
                        </SizableText>
                        {BlockingStore.blockedApps.map((app) => (
                            <AppRow key={app.id} app={app} />
                        ))}
                    </YStack>
                </ShadowCard>

                <GradientButton
                    label="Add App to Block"
                    variant="primary"
                    fullWidth
                    onPress={() => { }}
                />
            </YStack>
        </Container>
    );
});

export default Blocking;
