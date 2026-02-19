import { ArrowLeft, Send } from "@tamagui/lucide-icons";
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
import { ShadowCard } from "../../../components/shadow.card";
import { accentColors } from "../../../theme/colors";
import { FeedStore } from "../../../data/feed.store";

const PostDetail = observer(() => {
    const { postId } = useLocalSearchParams<{ postId: string }>();
    const [newComment, setNewComment] = useState("");
    const post = FeedStore.getPost(postId ?? "");

    if (!post) {
        return (
            <Container>
                <YStack padding="$4" alignItems="center">
                    <Paragraph color="$text6">Post not found</Paragraph>
                </YStack>
            </Container>
        );
    }

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
                    <H4 color="$text11">Post</H4>
                </XStack>

                {/* Post summary */}
                <ShadowCard>
                    <XStack alignItems="center" gap="$2">
                        <Avatar name={post.userName} size="md" />
                        <YStack flex={1}>
                            <SizableText color="$text11" fontWeight="bold" fontSize="$4">
                                {post.userName}
                            </SizableText>
                            <SizableText color="$text6" fontSize="$2">
                                {FeedStore.formatTimestamp(post.timestamp)} • {FeedStore.formatTime(post.screenTimeMinutes)}
                            </SizableText>
                        </YStack>
                    </XStack>
                    <Paragraph color="$text11" fontSize="$3" marginTop="$2">
                        {post.caption}
                    </Paragraph>
                </ShadowCard>

                {/* Comments */}
                <SizableText color="$text11" fontWeight="bold" fontSize="$5">
                    Comments ({post.comments.length})
                </SizableText>
                {post.comments.map((comment) => (
                    <XStack key={comment.id} gap="$2" alignItems="flex-start">
                        <Avatar name={comment.userName} size="sm" showRing={false} />
                        <YStack flex={1}>
                            <XStack gap="$2" alignItems="center">
                                <SizableText
                                    color="$text11"
                                    fontWeight="bold"
                                    fontSize="$3"
                                >
                                    {comment.userName}
                                </SizableText>
                                <SizableText color="$text6" fontSize="$1">
                                    {FeedStore.formatTimestamp(comment.timestamp)}
                                </SizableText>
                            </XStack>
                            <Paragraph color="$text11" fontSize="$3">
                                {comment.text}
                            </Paragraph>
                        </YStack>
                    </XStack>
                ))}

                {/* Add comment */}
                <XStack gap="$2" alignItems="center">
                    <Input
                        flex={1}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                        size="$4"
                    />
                    <View
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => {
                            if (newComment.trim()) {
                                FeedStore.addComment(post.id, newComment.trim());
                                setNewComment("");
                            }
                        }}
                        backgroundColor={accentColors.accentBlue}
                        padding="$2"
                        borderRadius={999}
                    >
                        <Send color="white" size={18} />
                    </View>
                </XStack>
            </YStack>
        </Container>
    );
});

export default PostDetail;
