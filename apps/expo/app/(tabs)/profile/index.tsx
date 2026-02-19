import {
    Bell,
    ChevronRight,
    Crown,
    ExternalLink,
    Flame,
    Link2,
    Moon,
    Settings,
    Shield,
    Star,
    Trophy,
} from "@tamagui/lucide-icons";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
    H2,
    H4,
    Paragraph,
    SizableText,
    Switch,
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
import { ProfileStore } from "../../../data/profile.store";

const Profile = observer(() => {
    useEffect(() => {
        ProfileStore.init();
    }, []);

    const { profile } = ProfileStore;

    return (
        <Container header={({ isSticky }) => <Header isSticky={isSticky} />}>
            <YStack gap="$4" paddingBottom="$6">
                {/* Profile header */}
                <YStack alignItems="center" gap="$3" paddingVertical="$4">
                    <Avatar name={profile.name} size="xl" ringVariant="premium" />
                    <YStack alignItems="center">
                        <H2 color="$text11" fontWeight="900">
                            {profile.name}
                        </H2>
                        <SizableText color="$text6" fontSize="$4">
                            {profile.username}
                        </SizableText>
                    </YStack>
                    <XStack alignItems="center" gap="$2">
                        <Flame size={16} color={accentColors.accentOrange} />
                        <SizableText
                            color={accentColors.accentOrange}
                            fontWeight="bold"
                            fontSize="$4"
                        >
                            {profile.streak} day streak
                        </SizableText>
                    </XStack>
                    <SizableText color="$text6" fontSize="$2">
                        Member since {ProfileStore.memberSince}
                    </SizableText>
                </YStack>

                {/* Stats cards */}
                <XStack gap="$3">
                    <ShadowCard flex={1} alignItems="center">
                        <Shield size={20} color={accentColors.accentBlue} />
                        <SizableText color="$text11" fontWeight="900" fontSize="$7">
                            {profile.lifetimeHoursSaved}
                        </SizableText>
                        <SizableText color="$text6" fontSize="$2">
                            Hours Saved
                        </SizableText>
                    </ShadowCard>
                    <ShadowCard flex={1} alignItems="center">
                        <Star size={20} color={accentColors.accentPurple} />
                        <SizableText color="$text11" fontWeight="900" fontSize="$7">
                            {profile.appsBlocked}
                        </SizableText>
                        <SizableText color="$text6" fontSize="$2">
                            Apps Blocked
                        </SizableText>
                    </ShadowCard>
                    <ShadowCard flex={1} alignItems="center">
                        <Trophy size={20} color={accentColors.accentOrange} />
                        <SizableText color="$text11" fontWeight="900" fontSize="$7">
                            {profile.challengesWon}
                        </SizableText>
                        <SizableText color="$text6" fontSize="$2">
                            Wins
                        </SizableText>
                    </ShadowCard>
                </XStack>

                {/* Premium CTA */}
                {!profile.isPremium && (
                    <GlassCard>
                        <YStack gap="$3" paddingVertical="$2">
                            <XStack alignItems="center" gap="$2">
                                <Crown size={24} color={accentColors.accentOrange} />
                                <YStack flex={1}>
                                    <SizableText color="$text11" fontWeight="900" fontSize="$5">
                                        Upgrade to Premium
                                    </SizableText>
                                    <SizableText color="$text6" fontSize="$3">
                                        Unlock advanced analytics & features
                                    </SizableText>
                                </YStack>
                            </XStack>
                            <YStack gap="$1" paddingLeft="$2">
                                {[
                                    "Advanced workflow wave analytics",
                                    "Unlimited custom challenges",
                                    "Priority study sesh rooms",
                                    "Extended data history (1 year+)",
                                    "Custom themes & app icons",
                                ].map((feat, i) => (
                                    <XStack key={i} alignItems="center" gap="$2">
                                        <SizableText color={accentColors.accentGreen} fontSize="$3">
                                            ✓
                                        </SizableText>
                                        <SizableText color="$text11" fontSize="$3">
                                            {feat}
                                        </SizableText>
                                    </XStack>
                                ))}
                            </YStack>
                            <GradientButton
                                label="Get Premium — $4.99/month"
                                variant="premium"
                                fullWidth
                                icon={<Crown color="white" size={16} />}
                                onPress={() => { }}
                            />
                            <SizableText color="$text6" fontSize="$1" textAlign="center">
                                or pay $5 once and get everything forever
                            </SizableText>
                        </YStack>
                    </GlassCard>
                )}

                {/* Settings */}
                <H4 color="$text11">Settings</H4>
                <ShadowCard>
                    <YStack>
                        {[
                            {
                                icon: <Bell size={18} color={accentColors.accentBlue} />,
                                label: "Notifications",
                                hasSwitch: true,
                            },
                            {
                                icon: <Moon size={18} color={accentColors.accentPurple} />,
                                label: "Dark Mode",
                                hasSwitch: true,
                            },
                            {
                                icon: <Settings size={18} color="$text6" />,
                                label: "General Settings",
                                hasChevron: true,
                            },
                            {
                                icon: <ExternalLink size={18} color="$text6" />,
                                label: "Export Data",
                                hasChevron: true,
                            },
                        ].map((item, i) => (
                            <XStack
                                key={i}
                                alignItems="center"
                                gap="$3"
                                paddingVertical="$3"
                                borderBottomWidth={i < 3 ? 1 : 0}
                                borderColor="$grey3"
                            >
                                {item.icon}
                                <SizableText
                                    color="$text11"
                                    fontSize="$4"
                                    fontWeight="600"
                                    flex={1}
                                >
                                    {item.label}
                                </SizableText>
                                {item.hasSwitch && (
                                    <Switch size="$3" defaultChecked>
                                        <Switch.Thumb animation="quick" />
                                    </Switch>
                                )}
                                {item.hasChevron && <ChevronRight size={18} color="$text6" />}
                            </XStack>
                        ))}
                    </YStack>
                </ShadowCard>

                {/* Linked accounts */}
                <H4 color="$text11">Linked Accounts</H4>
                <ShadowCard>
                    <YStack>
                        {profile.linkedAccounts.map((acc, i) => (
                            <XStack
                                key={acc.id}
                                alignItems="center"
                                gap="$3"
                                paddingVertical="$2"
                                borderBottomWidth={
                                    i < profile.linkedAccounts.length - 1 ? 1 : 0
                                }
                                borderColor="$grey3"
                            >
                                <SizableText fontSize={22}>{acc.icon}</SizableText>
                                <SizableText
                                    color="$text11"
                                    fontWeight="600"
                                    fontSize="$4"
                                    flex={1}
                                >
                                    {acc.name}
                                </SizableText>
                                {acc.connected ? (
                                    <XStack alignItems="center" gap="$1">
                                        <Link2 size={14} color={accentColors.accentGreen} />
                                        <SizableText
                                            color={accentColors.accentGreen}
                                            fontWeight="bold"
                                            fontSize="$2"
                                        >
                                            Connected
                                        </SizableText>
                                    </XStack>
                                ) : (
                                    <View
                                        pressStyle={{ opacity: 0.7 }}
                                        onPress={() =>
                                            ProfileStore.toggleLinkedAccount(acc.id)
                                        }
                                    >
                                        <SizableText
                                            color={accentColors.accentBlue}
                                            fontWeight="bold"
                                            fontSize="$3"
                                        >
                                            Connect
                                        </SizableText>
                                    </View>
                                )}
                            </XStack>
                        ))}
                    </YStack>
                </ShadowCard>
            </YStack>
        </Container>
    );
});

export default Profile;
