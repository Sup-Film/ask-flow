import { ChatService } from "./service";

export const ChatController = {
  stream: async (body: { message: string; top_k?: number }, set: any) => {
    return ChatService.stream(body.message, body.top_k ?? 5, set);
  },
};
