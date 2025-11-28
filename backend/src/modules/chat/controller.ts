import { ChatService } from "./service";

export const ChatController = {
  stream: async (body: { message: string }, set: any) => {
    return ChatService.stream(body.message, 5, set);
  },
};
