import {
    ArrowLeft,
    DollarSign,
    Trophy,
    Users,
} from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
    H4,
    Input,
    Paragraph,
    SizableText,
    View,
    XStack,
    YStack,
} from "tamagui";

import { Avatar } from "../../../components/avatar";
import { Container } from "../../../components/container";
import { GlassCard } from "../../../components/glass-card";
import { GradientButton } from "../../../components/gradient-button";
import { ShadowCard } from "../../../components/shadow.card";
import { accentColors } from "../../../theme/colors";
import { FriendsStore } from "../../../data/friends.store";

const ChallengeScreen = observer(() => {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const challenge = id
        ? FriendsStore.challenges.find((c) => c.id === id)
        : null;

    // Create mode
    const [goalHrs, setGoalHrs] = useState("2");
    const [potAmount, setPotAmount] = useState("10");
    const [isPot, setIsPot] = useState(true);

    if (!challenge) {
        // Create challenge view
        return (
            <Container>
                <YStack gap="$4" paddingBottom="$6">
                    <XStack alignItems="center" gap="$2" paddingTop="$2">
                        <View
                            pressStyle={{ opacity: 0.7 }}
                            onPress={() => router.back()}
                            padding="$1"
                        >
                            <ArrowLeft color="$text11" size={22} />
                        </View>
                        <H4 color="$text11">Create Challenge</H4>
                    </XStack>

                    <GlassCard>
                        <YStack alignItems="center" gap="$3" paddingVertical="$2">
                            <Trophy color={accentColors.accentOrange} size={40} />
                            <SizableText
                                color="$text11"
                                fontWeight="900"
                                fontSize="$6"
                                textAlign="center"
                            >
                                Challenge Your Friends
                            </SizableText>
                            <Paragraph
                                color="$text6"
                                textAlign="center"
                                lineHeight={20}
                            >
                                Set a weekly screen-time goal and compete. Winner takes all —
                                or play for free. Bet on yourself!
                            </Paragraph>
                        </YStack>
                    </GlassCard>

                    <ShadowCard>
                        <YStack gap="$3">
                            <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                                Goal
                            </SizableText>
                            <XStack alignItems="center" gap="$2">
                                <SizableText color="$text6" fontSize="$3">Under</SizableText>
                                <Input
                                    width={60}
                                    value={goalHrs}
                                    onChangeText={setGoalHrs}
                                    keyboardType="numeric"
                                    size="$4"
                                    textAlign="center"
                                />
                                <SizableText color="$text6" fontSize="$3">hours / day</SizableText>
                            </XStack>
                        </YStack>
                    </ShadowCard>

                    <ShadowCard>
                        <YStack gap="$3">
                            <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                                Challenge Type
                            </SizableText>
                            <XStack gap="$2">
                                <View
                                    flex={1}
                                    padding="$3"
                                    borderRadius="$3"
                                    borderWidth={2}
                                    borderColor={isPot ? accentColors.accentGreen : "$grey3"}
                                    onPress={() => setIsPot(true)}
                                    alignItems="center"
                                >
                                    <DollarSign
                                        size={20}
                                        color={isPot ? accentColors.accentGreen : "$text6"}
                                    />
                                    <SizableText
                                        color={isPot ? "$text11" : "$text6"}
                                        fontWeight="bold"
                                        fontSize="$3"
                                    >
                                        Pot
                                    </SizableText>
                                    <SizableText color="$text6" fontSize="$1" textAlign="center">
                                        Winner takes all
                                    </SizableText>
                                </View>
                                <View
                                    flex={1}
                                    padding="$3"
                                    borderRadius="$3"
                                    borderWidth={2}
                                    borderColor={!isPot ? accentColors.accentBlue : "$grey3"}
                                    onPress={() => setIsPot(false)}
                                    alignItems="center"
                                >
                                    <Trophy
                                        size={20}
                                        color={!isPot ? accentColors.accentBlue : "$text6"}
                                    />
                                    <SizableText
                                        color={!isPot ? "$text11" : "$text6"}
                                        fontWeight="bold"
                                        fontSize="$3"
                                    >
                                        Free
                                    </SizableText>
                                    <SizableText color="$text6" fontSize="$1" textAlign="center">
                                        Bragging rights
                                    </SizableText>
                                </View>
                            </XStack>
                            {isPot && (
                                <XStack alignItems="center" gap="$2">
                                    <SizableText color="$text6">Buy-in: $</SizableText>
                                    <Input
                                        width={60}
                                        value={potAmount}
                                        onChangeText={setPotAmount}
                                        keyboardType="numeric"
                                        size="$4"
                                        textAlign="center"
                                    />
                                    <SizableText color="$text6" fontSize="$2">per person</SizableText>
                                </XStack>
                            )}
                        </YStack>
                    </ShadowCard>

                    <ShadowCard>
                        <YStack gap="$2">
                            <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                                Derivative Bet
                            </SizableText>
                            <Paragraph color="$text6" fontSize="$3" lineHeight={16}>
                                Bet on a friend to hit their goal. If they succeed, you both
                                earn. Think of it as a productive prediction market.
                            </Paragraph>
                            <GlassCard>
                                <XStack alignItems="center" gap="$2">
                                    <SizableText fontSize={20}>📈</SizableText>
                                    <YStack flex={1}>
                                        <SizableText color="$text11" fontWeight="bold" fontSize="$3">
                                            "Bet on Jordan to stay under 2hrs"
                                        </SizableText>
                                        <SizableText color="$text6" fontSize="$2">
                                            Stake $5 → Win $15 if he hits it
                                        </SizableText>
                                    </YStack>
                                </XStack>
                            </GlassCard>
                        </YStack>
                    </ShadowCard>

                    <GradientButton
                        label="Create & Invite Friends"
                        variant="success"
                        fullWidth
                        icon={<Users color="white" size={16} />}
                        onPress={() => router.back()}
                    />
                </YStack>
            </Container>
        );
    }

    // Detail view for existing challenge
    return (
        <Container>
            <YStack gap="$4" paddingBottom="$6">
                <XStack alignItems="center" gap="$2" paddingTop="$2">
                    <View
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => router.back()}
                        padding="$1"
                    >
                        <ArrowLeft color="$text11" size={22} />
                    </View>
                    <H4 color="$text11">{challenge.title}</H4>
                </XStack>

                <GlassCard>
                    <XStack justifyContent="space-around">
                        <YStack alignItems="center">
                            <SizableText color="$text11" fontWeight="900" fontSize="$7">
                                {challenge.daysRemaining}
                            </SizableText>
                            <SizableText color="$text6" fontSize="$2">Days left</SizableText>
                        </YStack>
                        <YStack alignItems="center">
                            <SizableText color="$text11" fontWeight="900" fontSize="$7">
                                {challenge.participants.length}
                            </SizableText>
                            <SizableText color="$text6" fontSize="$2">Players</SizableText>
                        </YStack>
                        {challenge.type === "pot" && (
                            <YStack alignItems="center">
                                <SizableText color={accentColors.accentGreen} fontWeight="900" fontSize="$7">
                                    ${challenge.potAmount * challenge.participants.length}
                                </SizableText>
                                <SizableText color="$text6" fontSize="$2">Total Pot</SizableText>
                            </YStack>
                        )}
                    </XStack>
                </GlassCard>

                <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                    Leaderboard
                </SizableText>
                <ShadowCard>
                    <YStack>
                        {challenge.leaderboard.map((entry, i) => (
                            <XStack
                                key={i}
                                alignItems="center"
                                gap="$3"
                                paddingVertical="$2"
                                borderBottomWidth={i < challenge.leaderboard.length - 1 ? 1 : 0}
                                borderColor="$grey3"
                            >
                                <SizableText
                                    fontWeight="bold"
                                    fontSize="$5"
                                    width={28}
                                    textAlign="center"
                                    color={
                                        i === 0
                                            ? accentColors.accentOrange
                                            : i === 1
                                                ? "$text6"
                                                : "$text6"
                                    }
                                >
                                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                                </SizableText>
                                <Avatar name={entry.friend.name} size="sm" showRing={false} />
                                <YStack flex={1}>
                                    <SizableText color="$text11" fontWeight="bold" fontSize="$4">
                                        {entry.friend.name}
                                    </SizableText>
                                </YStack>
                                <YStack alignItems="flex-end">
                                    <SizableText color="$text11" fontWeight="bold" fontSize="$4">
                                        {FriendsStore.formatMinutes(entry.currentMinutes)}
                                    </SizableText>
                                    <SizableText
                                        color={
                                            entry.currentMinutes <= challenge.goalMinutes
                                                ? accentColors.accentGreen
                                                : accentColors.accentRed
                                        }
                                        fontSize="$2"
                                    >
                                        {entry.currentMinutes <= challenge.goalMinutes
                                            ? "On track ✓"
                                            : "Over goal ✗"}
                                    </SizableText>
                                </YStack>
                            </XStack>
                        ))}
                    </YStack>
                </ShadowCard>
            </YStack>
        </Container>
    );
});

export default ChallengeScreen;
