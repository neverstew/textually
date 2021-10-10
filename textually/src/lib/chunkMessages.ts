import type { definitions } from 'src/types/database';

type MessageList = definitions['messages'][];

export interface ChunkedMessages {
	lastUserId?: string;
	chunks: MessageList[];
}

function chunkByUserId(state: ChunkedMessages, message: definitions['messages']): ChunkedMessages {
	const { lastUserId, chunks } = state;
	const thisUserId = message.user_id;

	const lastChunk = chunks.pop();
	if (!lastChunk) {
		return {
			lastUserId: thisUserId,
			chunks: [[message]]
		};
	}

	if (thisUserId === lastUserId) {
		lastChunk.push(message);
		chunks.push(lastChunk);
	} else {
		chunks.push(lastChunk);
		chunks.push([message]);
	}

	return {
		lastUserId: thisUserId,
		chunks
	};
}

export default function chunkMessages(messages: MessageList): ChunkedMessages {
	return messages.reduce(chunkByUserId, { lastUserId: undefined, chunks: [] });
}

export function appendToChunkedMessages(
	messages: ChunkedMessages,
	message: definitions['messages']
): ChunkedMessages {
	return chunkByUserId(messages, message);
}
