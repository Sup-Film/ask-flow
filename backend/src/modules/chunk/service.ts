export const ChunkService = {
  // ฟังก์ชันสำหรับแบ่งข้อความยาวๆ เป็นท่อนๆ (Chunks)
  // เพื่อไม่ให้เกิน Token Limit ของ AI Model
  chunk(text: string, chunkSize: number = 1000): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  },
};
