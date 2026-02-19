import { Heart, MessageCircle, Radio } from "@tamagui/lucide-icons";
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
import { Header } from "../../../components/header";
import { ShadowCard } from "../../../components/shadow.card";
import { accentColors } from "../../../theme/colors";
import { FeedStore, type FeedPost } from "../../../data/feed.store";

const PostCard = observer(({ post }: { post: FeedPost }) => {
    const totalMinutes = post.screenTimeMinutes;
    return (
        <ShadowCard pressStyle={{ opacity: 0.95 }}>
            <YStack gap="$3">
                {/* User header */}
                <XStack alignItems="center" gap="$2">
                    <Avatar name={post.userName} size="md" ringVariant="primary" />
                    <YStack flex={1}>
                        <SizableText color="$text11" fontWeight="bold" fontSize="$4">
                            {post.userName}
                        </SizableText>
                        <SizableText color="$text6" fontSize="$2">
                            {FeedStore.formatTimestamp(post.timestamp)}
                        </SizableText>
                    </YStack>
                    <View
                        backgroundColor={totalMinutes < 120 ? "rgba(52,211,153,0.15)" : "rgba(244,63,94,0.15)"}
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius={999}
                    >
                        <SizableText
                            color={totalMinutes < 120 ? accentColors.accentGreen : accentColors.accentRed}
                            fontWeight="bold"
                            fontSize="$3"
                        >
                            {FeedStore.formatTime(totalMinutes)}
                        </SizableText>
                    </View>
                </XStack>

                {/* Screen time postcard */}
                <GlassCard>
                    <YStack gap="$2">
                        <XStack justifyContent="space-between" alignItems="center">
                            <SizableText color="$text11" fontWeight="900" fontSize="$7">
                                {FeedStore.formatTime(totalMinutes)}
                            </SizableText>
                            <YStack alignItems="flex-end">
                                <SizableText color="$text6" fontSize="$2">Top App</SizableText>
                                <XStack alignItems="center" gap="$1">
                                    <View
                                        width={8}
                                        height={8}
                                        borderRadius={4}
                                        backgroundColor={post.topAppColor}
                                    />
                                    <SizableText color="$text11" fontWeight="bold" fontSize="$3">
                                        {post.topApp} • {FeedStore.formatTime(post.topAppMinutes)}
                                    </SizableText>
                                </XStack>
                            </YStack>
                        </XStack>

                        {/* Mini app breakdown bar */}
                        <XStack height={8} borderRadius={4} overflow="hidden">
                            {post.apps.map((app, i) => (
                                <View
                                    key={i}
                                    flex={app.minutes}
                                    backgroundColor={app.color}
                                    height={8}
                                />
                            ))}
                        </XStack>

                        {/* App legend */}
                        <XStack flexWrap="wrap" gap="$1">
                            {post.apps.slice(0, 4).map((app, i) => (
                                <XStack key={i} alignItems="center" gap={3}>
                                    <View
                                        width={6}
                                        height={6}
                                        borderRadius={3}
                                        backgroundColor={app.color}
                                    />
                                    <SizableText color="$text6" fontSize={10}>
                                        {app.name}
                                    </SizableText>
                                </XStack>
                            ))}
                        </XStack>
                    </YStack>
                </GlassCard>

                {/* Caption */}
                <Paragraph color="$text11" fontSize="$3" lineHeight={18}>
                    {post.caption}
                </Paragraph>

                {/* Actions */}
                <XStack gap="$4" alignItems="center">
                    <XStack
                        alignItems="center"
                        gap="$1"
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => FeedStore.toggleLike(post.id)}
                    >
                        <Heart
                            size={18}
                            color={post.liked ? accentColors.accentRed : "$text6"}
                            fill={post.liked ? accentColors.accentRed : "none"}
                        />
                        <SizableText color="$text6" fontSize="$3">{post.likes}</SizableText>
                    </XStack>
                    <XStack
                        alignItems="center"
                        gap="$1"
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => router.push(`/feed/${post.id}` as never)}
                    >
                        <MessageCircle size={18} color="$text6" />
                        <SizableText color="$text6" fontSize="$3">
                            {post.comments.length}
                        </SizableText>
                    </XStack>
                </XStack>
            </YStack>
        </ShadowCard>
    );
});

const Feed = observer(() => {
    useEffect(() => {
        FeedStore.init();
    }, []);

    return (
        <Container header={({ isSticky }) => <Header isSticky={isSticky} />}>
            <YStack gap="$4" paddingBottom="$6">
                <H4 color="$text11">Feed</H4>

                {/* Study Sesh banner */}
                {FeedStore.studySeshes.filter((s) => s.isLive).length > 0 && (
                    <ShadowCard
                        pressStyle={{ opacity: 0.8 }}
                        onPress={() => router.push("/feed/study-sesh" as never)}
                    >
                        <XStack alignItems="center" gap="$3">
                            <View
                                backgroundColor="rgba(244,63,94,0.15)"
                                padding="$2"
                                borderRadius={999}
                            >
                                <Radio color={accentColors.accentRed} size={20} />
                            </View>
                            <YStack flex={1}>
                                <SizableText color="$text11" fontWeight="bold" fontSize="$4">
                                    {FeedStore.studySeshes.filter((s) => s.isLive).length} Live Study Sessions
                                </SizableText>
                                <SizableText color="$text6" fontSize="$2">
                                    Join your friends and lock in together
                                </SizableText>
                            </YStack>
                            <View
                                backgroundColor={accentColors.accentRed}
                                paddingHorizontal="$2"
                                paddingVertical="$1"
                                borderRadius={999}
                            >
                                <SizableText color="white" fontWeight="bold" fontSize={10}>
                                    LIVE
                                </SizableText>
                            </View>
                        </XStack>
                    </ShadowCard>
                )}

                {/* Posts */}
                {FeedStore.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </YStack>
        </Container>
    );
});

export default Feed;
