import {
    ChevronRight,
    Crown,
    DollarSign,
    Flame,
    Plus,
    Trophy,
    UserPlus,
} from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
    H4,
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
import { Header } from "../../../components/header";
import { ShadowCard } from "../../../components/shadow.card";
import { accentColors } from "../../../theme/colors";
import { FriendsStore } from "../../../data/friends.store";

const Friends = observer(() => {
    useEffect(() => {
        FriendsStore.init();
    }, []);

    return (
        <Container header={({ isSticky }) => <Header isSticky={isSticky} />}>
            <YStack gap="$4" paddingBottom="$6">
                <XStack justifyContent="space-between" alignItems="center">
                    <H4 color="$text11">Friends</H4>
                    <GradientButton
                        label="Add"
                        variant="primary"
                        size="sm"
                        icon={<UserPlus color="white" size={14} />}
                        onPress={() => { }}
                    />
                </XStack>

                {/* Active Challenges */}
                <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                    Active Challenges
                </SizableText>
                {FriendsStore.challenges.map((ch) => (
                    <ShadowCard
                        key={ch.id}
                        pressStyle={{ opacity: 0.8 }}
                        onPress={() => router.push(`/friends/challenge?id=${ch.id}` as never)}
                    >
                        <YStack gap="$2">
                            <XStack justifyContent="space-between" alignItems="center">
                                <XStack alignItems="center" gap="$2">
                                    <Trophy
                                        size={18}
                                        color={ch.type === "pot" ? accentColors.accentOrange : accentColors.accentGreen}
                                    />
                                    <SizableText color="$text11" fontWeight="bold" fontSize="$4">
                                        {ch.title}
                                    </SizableText>
                                </XStack>
                                <ChevronRight color="$text6" size={16} />
                            </XStack>
                            <SizableText color="$text6" fontSize="$3">
                                {ch.description}
                            </SizableText>
                            <XStack justifyContent="space-between" alignItems="center">
                                <XStack alignItems="center" gap="$2">
                                    <SizableText color="$text6" fontSize="$2">
                                        {ch.participants.length} players
                                    </SizableText>
                                    {ch.type === "pot" && (
                                        <XStack alignItems="center" gap="$1">
                                            <DollarSign size={12} color={accentColors.accentGreen} />
                                            <SizableText color={accentColors.accentGreen} fontWeight="bold" fontSize="$3">
                                                ${ch.potAmount} pot
                                            </SizableText>
                                        </XStack>
                                    )}
                                </XStack>
                                <View
                                    backgroundColor="rgba(79,140,255,0.15)"
                                    paddingHorizontal="$2"
                                    paddingVertical="$1"
                                    borderRadius={999}
                                >
                                    <SizableText color={accentColors.accentBlue} fontWeight="bold" fontSize="$2">
                                        {ch.daysRemaining}d left
                                    </SizableText>
                                </View>
                            </XStack>

                            {/* Mini leaderboard preview */}
                            <YStack gap="$1" marginTop="$1">
                                {ch.leaderboard.slice(0, 3).map((entry, i) => (
                                    <XStack key={i} alignItems="center" gap="$2">
                                        <SizableText
                                            color={i === 0 ? accentColors.accentOrange : "$text6"}
                                            fontWeight="bold"
                                            fontSize="$2"
                                            width={16}
                                        >
                                            {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                                        </SizableText>
                                        <SizableText color="$text11" fontSize="$3" flex={1}>
                                            {entry.friend.name}
                                        </SizableText>
                                        <SizableText color="$text6" fontSize="$2">
                                            {FriendsStore.formatMinutes(entry.currentMinutes)}
                                        </SizableText>
                                    </XStack>
                                ))}
                            </YStack>
                        </YStack>
                    </ShadowCard>
                ))}

                <GradientButton
                    label="Create Challenge"
                    variant="primary"
                    fullWidth
                    icon={<Plus color="white" size={16} />}
                    onPress={() => router.push("/friends/challenge" as never)}
                />

                {/* Derivative Bets */}
                <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                    Your Bets
                </SizableText>
                {FriendsStore.bets.map((bet) => (
                    <GlassCard key={bet.id}>
                        <XStack alignItems="center" gap="$3">
                            <Avatar name={bet.targetFriend.name} size="sm" ringVariant="premium" />
                            <YStack flex={1}>
                                <SizableText color="$text11" fontWeight="bold" fontSize="$3">
                                    {bet.targetFriend.name}
                                </SizableText>
                                <SizableText color="$text6" fontSize="$2">
                                    {bet.metric} {bet.threshold}min
                                </SizableText>
                            </YStack>
                            <YStack alignItems="flex-end">
                                <SizableText color={accentColors.accentGreen} fontWeight="bold" fontSize="$4">
                                    ${bet.potentialReturn}
                                </SizableText>
                                <SizableText color="$text6" fontSize="$2">
                                    ${bet.yourStake} staked
                                </SizableText>
                            </YStack>
                        </XStack>
                    </GlassCard>
                ))}

                {/* Friends list */}
                <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                    All Friends ({FriendsStore.friends.length})
                </SizableText>
                <ShadowCard>
                    <YStack>
                        {FriendsStore.sortedByScreenTime.map((friend, i) => (
                            <XStack
                                key={friend.id}
                                alignItems="center"
                                gap="$3"
                                paddingVertical="$2"
                                borderBottomWidth={i < FriendsStore.friends.length - 1 ? 1 : 0}
                                borderColor="$grey3"
                            >
                                <SizableText
                                    color="$text6"
                                    fontWeight="bold"
                                    fontSize="$3"
                                    width={20}
                                    textAlign="center"
                                >
                                    {i + 1}
                                </SizableText>
                                <Avatar name={friend.name} size="sm" showRing={friend.isOnline} ringVariant="success" />
                                <YStack flex={1}>
                                    <XStack alignItems="center" gap="$1">
                                        <SizableText color="$text11" fontWeight="bold" fontSize="$4">
                                            {friend.name}
                                        </SizableText>
                                        {i === 0 && <Crown size={14} color={accentColors.accentOrange} />}
                                    </XStack>
                                    <XStack alignItems="center" gap="$2">
                                        <SizableText color="$text6" fontSize="$2">
                                            {friend.username}
                                        </SizableText>
                                        {friend.streak > 0 && (
                                            <XStack alignItems="center" gap={2}>
                                                <Flame size={10} color={accentColors.accentOrange} />
                                                <SizableText color={accentColors.accentOrange} fontSize={10} fontWeight="bold">
                                                    {friend.streak}
                                                </SizableText>
                                            </XStack>
                                        )}
                                    </XStack>
                                </YStack>
                                <YStack alignItems="flex-end">
                                    <SizableText color="$text11" fontWeight="bold" fontSize="$3">
                                        {FriendsStore.formatMinutes(friend.weeklyScreenTime)}
                                    </SizableText>
                                    <SizableText
                                        color={friend.trend <= 0 ? accentColors.accentGreen : accentColors.accentRed}
                                        fontSize="$2"
                                        fontWeight="bold"
                                    >
                                        {friend.trend <= 0 ? "↓" : "↑"}{Math.abs(friend.trend)}%
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

export default Friends;
