async function testEndpoints() {
  const BASE_URL = "http://localhost:3030";

  console.log("Testing endpoints at " + BASE_URL);

  // 1. Test Root
  try {
    const res = await fetch(`${BASE_URL}/`);
    const text = await res.text();
    console.log(`[GET /] Status: ${res.status}, Response: ${text}`);
  } catch (e) {
    console.error(`[GET /] Failed: ${e}`);
  }

  // 2. Test Vector Search
  try {
    const res = await fetch(`${BASE_URL}/vector`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello", top_k: 1 }),
    });
    const json = await res.json();
    console.log(
      `[POST /vector] Status: ${res.status}, Response:`,
      JSON.stringify(json, null, 2)
    );
  } catch (e) {
    console.error(`[POST /vector] Failed: ${e}`);
  }

  // 3. Test Chat Stream
  try {
    const res = await fetch(`${BASE_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello", top_k: 1 }),
    });

    // Since it's a stream, we might just want to see if we get a 200 OK and some data.
    // For simplicity, let's just read the text (it might wait for the stream to end).
    // Or we can just check status.
    console.log(`[POST /chat/stream] Status: ${res.status}`);
    if (res.ok) {
      const reader = res.body?.getReader();
      if (reader) {
        const { value, done } = await reader.read();
        console.log(
          `[POST /chat/stream] First chunk received: ${new TextDecoder().decode(
            value
          )}`
        );
        // Cancel to stop stream
        await reader.cancel();
      }
    } else {
      const text = await res.text();
      console.log(`[POST /chat/stream] Error Response: ${text}`);
    }
  } catch (e) {
    console.error(`[POST /chat/stream] Failed: ${e}`);
  }
}

testEndpoints();
