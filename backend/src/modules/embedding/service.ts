export const EmbeddingService = {
  process: async (id: string) => {
    console.log(`[Embedding] Processing document ${id}`);
    return { status: "processing", id };
  },
};
