import { ArrowLeft, Phone, Send, Users } from "@tamagui/lucide-icons";
import { router } from "expo-router";
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

import { Container } from "../../../components/container";
import { GlassCard } from "../../../components/glass-card";
import { GradientButton } from "../../../components/gradient-button";
import { ShadowCard } from "../../../components/shadow.card";
import { accentColors } from "../../../theme/colors";

export default function Friend2FA() {
    const [phone, setPhone] = useState("");
    const [sent, setSent] = useState(false);

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
                    <H4 color="$text11">Friend 2FA</H4>
                </XStack>

                <GlassCard>
                    <YStack alignItems="center" gap="$3" paddingVertical="$3">
                        <View
                            backgroundColor="rgba(168,85,247,0.15)"
                            padding="$4"
                            borderRadius={999}
                        >
                            <Users color={accentColors.accentPurple} size={40} />
                        </View>
                        <SizableText
                            color="$text11"
                            fontWeight="900"
                            fontSize="$6"
                            textAlign="center"
                        >
                            The Ultimate Accountability
                        </SizableText>
                        <Paragraph
                            color="$text6"
                            textAlign="center"
                            lineHeight={20}
                            paddingHorizontal="$2"
                        >
                            You literally cannot access the apps you blocked unless your
                            friend sends you a 2FA code. Sign up with your friend's phone
                            number — they'll get a notification every time you try to open a
                            blocked app.
                        </Paragraph>
                    </YStack>
                </GlassCard>

                <ShadowCard>
                    <YStack gap="$3">
                        <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                            How it works
                        </SizableText>
                        {[
                            {
                                step: "1",
                                title: "Enter your friend's phone",
                                desc: "They'll create an account too — 2 users at once!",
                            },
                            {
                                step: "2",
                                title: "Block your apps",
                                desc: "Choose which apps require Friend 2FA to unlock.",
                            },
                            {
                                step: "3",
                                title: "Try to open a blocked app",
                                desc: "Your friend gets a push notification with your unlock code.",
                            },
                            {
                                step: "4",
                                title: "Get the code (or don't 😈)",
                                desc: "Your friend decides whether you deserve the screen time.",
                            },
                        ].map((item, i) => (
                            <XStack key={i} gap="$3" alignItems="flex-start">
                                <View
                                    width={28}
                                    height={28}
                                    borderRadius={14}
                                    backgroundColor={accentColors.accentPurple}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <SizableText color="white" fontWeight="bold" fontSize="$3">
                                        {item.step}
                                    </SizableText>
                                </View>
                                <YStack flex={1}>
                                    <SizableText color="$text11" fontWeight="bold" fontSize="$4">
                                        {item.title}
                                    </SizableText>
                                    <SizableText color="$text6" fontSize="$3" lineHeight={16}>
                                        {item.desc}
                                    </SizableText>
                                </YStack>
                            </XStack>
                        ))}
                    </YStack>
                </ShadowCard>

                <ShadowCard>
                    <YStack gap="$3">
                        <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                            Friend's Phone Number
                        </SizableText>
                        <XStack gap="$2" alignItems="center">
                            <Phone color="$text6" size={18} />
                            <Input
                                flex={1}
                                placeholder="+1 (555) 123-4567"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                size="$4"
                            />
                        </XStack>
                        {sent ? (
                            <XStack
                                alignItems="center"
                                gap="$2"
                                backgroundColor="rgba(52,211,153,0.1)"
                                padding="$3"
                                borderRadius="$3"
                            >
                                <SizableText color={accentColors.accentGreen} fontWeight="bold">
                                    ✓ Invite sent!
                                </SizableText>
                                <SizableText color="$text6" fontSize="$3">
                                    Waiting for your friend to accept...
                                </SizableText>
                            </XStack>
                        ) : (
                            <GradientButton
                                label="Send Invite"
                                variant="premium"
                                fullWidth
                                icon={<Send color="white" size={16} />}
                                onPress={() => setSent(true)}
                            />
                        )}
                    </YStack>
                </ShadowCard>
            </YStack>
        </Container>
    );
}
