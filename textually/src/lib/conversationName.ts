export default function conversationName(conversation, userId: string): string {
	const userAId = conversation.user_a.id;
	return userAId === userId ? conversation.user_b.name : conversation.user_a.name;
}
