import { ArrowLeft, Check } from "@tamagui/lucide-icons";
import { router } from "expo-router";
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

import { Container } from "../../../components/container";
import { GlassCard } from "../../../components/glass-card";
import { GradientButton } from "../../../components/gradient-button";
import { ShadowCard } from "../../../components/shadow.card";
import { accentColors } from "../../../theme/colors";
import { BlockingStore } from "../../../data/blocking.store";

const CustomChallenge = observer(() => {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [customPrompt, setCustomPrompt] = useState("");

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
                    <H4 color="$text11">Custom Challenge</H4>
                </XStack>

                <GlassCard>
                    <YStack alignItems="center" gap="$3" paddingVertical="$2">
                        <SizableText fontSize={40}>🏆</SizableText>
                        <SizableText
                            color="$text11"
                            fontWeight="900"
                            fontSize="$6"
                            textAlign="center"
                        >
                            Earn Your Screen Time
                        </SizableText>
                        <Paragraph
                            color="$text6"
                            textAlign="center"
                            lineHeight={20}
                            paddingHorizontal="$2"
                        >
                            Design your own challenge with built-in AI-powered customization.
                            Complete something productive before unlocking — or realize the
                            dopamine hit wasn't worth it anyway.
                        </Paragraph>
                    </YStack>
                </GlassCard>

                <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                    Choose a Challenge Type
                </SizableText>

                <YStack gap="$2">
                    {BlockingStore.challengeTemplates.map((tmpl, idx) => {
                        const isSelected = selectedIdx === idx;
                        return (
                            <ShadowCard
                                key={idx}
                                pressStyle={{ opacity: 0.8 }}
                                onPress={() => setSelectedIdx(idx)}
                                borderColor={isSelected ? accentColors.accentOrange : "$grey3"}
                                borderWidth={isSelected ? 2 : 1}
                            >
                                <XStack alignItems="center" gap="$3">
                                    <SizableText fontSize={28}>{tmpl.icon}</SizableText>
                                    <YStack flex={1}>
                                        <SizableText
                                            color="$text11"
                                            fontWeight="bold"
                                            fontSize="$4"
                                        >
                                            {tmpl.label}
                                        </SizableText>
                                        <SizableText color="$text6" fontSize="$2" lineHeight={14}>
                                            {tmpl.description}
                                        </SizableText>
                                    </YStack>
                                    <XStack alignItems="center" gap="$1">
                                        <SizableText
                                            color="$text11"
                                            fontWeight="bold"
                                            fontSize="$5"
                                        >
                                            {tmpl.quantity}
                                        </SizableText>
                                        <SizableText color="$text6" fontSize="$2">
                                            {tmpl.unit}
                                        </SizableText>
                                    </XStack>
                                    {isSelected && (
                                        <View
                                            backgroundColor={accentColors.accentOrange}
                                            borderRadius={999}
                                            padding={2}
                                        >
                                            <Check color="white" size={14} />
                                        </View>
                                    )}
                                </XStack>
                            </ShadowCard>
                        );
                    })}
                </YStack>

                {/* AI customization mockup */}
                <ShadowCard>
                    <YStack gap="$3">
                        <XStack alignItems="center" gap="$2">
                            <SizableText fontSize={18}>✨</SizableText>
                            <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                                AI Customization
                            </SizableText>
                        </XStack>
                        <Paragraph color="$text6" fontSize="$3" lineHeight={16}>
                            Describe your ideal challenge and our AI will build it for you.
                        </Paragraph>
                        <Input
                            placeholder="e.g. 'Make me solve 3 SAT math questions before I can open TikTok'"
                            value={customPrompt}
                            onChangeText={setCustomPrompt}
                            multiline
                            numberOfLines={3}
                            size="$4"
                        />
                        <GradientButton
                            label="Generate Challenge"
                            variant="premium"
                            fullWidth
                            icon={<SizableText fontSize={14}>✨</SizableText>}
                            onPress={() => { }}
                        />
                    </YStack>
                </ShadowCard>

                {selectedIdx !== null && (
                    <GradientButton
                        label={`Apply "${BlockingStore.challengeTemplates[selectedIdx]?.label}" Challenge`}
                        variant="success"
                        fullWidth
                        onPress={() => router.back()}
                    />
                )}
            </YStack>
        </Container>
    );
});

export default CustomChallenge;
