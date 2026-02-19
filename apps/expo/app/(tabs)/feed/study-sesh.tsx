import { ArrowLeft, Radio, Users } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";
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
import { ShadowCard } from "../../../components/shadow.card";
import { accentColors } from "../../../theme/colors";
import { FeedStore } from "../../../data/feed.store";

const StudySesh = observer(() => {
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
                    <H4 color="$text11">Study Sessions</H4>
                </XStack>

                <GlassCard>
                    <YStack alignItems="center" gap="$3" paddingVertical="$3">
                        <View
                            backgroundColor="rgba(244,63,94,0.15)"
                            padding="$4"
                            borderRadius={999}
                        >
                            <Radio color={accentColors.accentRed} size={40} />
                        </View>
                        <SizableText
                            color="$text11"
                            fontWeight="900"
                            fontSize="$6"
                            textAlign="center"
                        >
                            Study Together, Stay Accountable
                        </SizableText>
                        <Paragraph color="$text6" textAlign="center" lineHeight={20}>
                            Go live and share your screen or camera. Your friends can join
                            your session to study together — you can't use your phone while
                            streaming!
                        </Paragraph>
                        <GradientButton
                            label="Go Live"
                            variant="danger"
                            icon={<Radio color="white" size={16} />}
                            onPress={() => { }}
                        />
                    </YStack>
                </GlassCard>

                <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                    Active Sessions
                </SizableText>
                {FeedStore.studySeshes.map((sesh) => {
                    const elapsed = Math.floor(
                        (Date.now() - sesh.startedAt) / 60000
                    );
                    return (
                        <ShadowCard key={sesh.id}>
                            <XStack alignItems="center" gap="$3">
                                <Avatar name={sesh.hostName} size="md" ringVariant={sesh.isLive ? "danger" : "primary"} />
                                <YStack flex={1}>
                                    <XStack alignItems="center" gap="$2">
                                        <SizableText
                                            color="$text11"
                                            fontWeight="bold"
                                            fontSize="$4"
                                        >
                                            {sesh.title}
                                        </SizableText>
                                        {sesh.isLive && (
                                            <View
                                                backgroundColor={accentColors.accentRed}
                                                paddingHorizontal={6}
                                                paddingVertical={1}
                                                borderRadius={999}
                                            >
                                                <SizableText
                                                    color="white"
                                                    fontWeight="bold"
                                                    fontSize={9}
                                                >
                                                    LIVE
                                                </SizableText>
                                            </View>
                                        )}
                                    </XStack>
                                    <SizableText color="$text6" fontSize="$2">
                                        Hosted by {sesh.hostName} • {elapsed}m
                                    </SizableText>
                                    <XStack alignItems="center" gap="$1" marginTop="$1">
                                        <Users size={12} color="$text6" />
                                        <SizableText color="$text6" fontSize="$2">
                                            {sesh.participants} studying
                                        </SizableText>
                                    </XStack>
                                </YStack>
                                {sesh.isLive && (
                                    <GradientButton
                                        label="Join"
                                        variant="primary"
                                        size="sm"
                                        onPress={() => { }}
                                    />
                                )}
                            </XStack>
                        </ShadowCard>
                    );
                })}
            </YStack>
        </Container>
    );
});

export default StudySesh;
