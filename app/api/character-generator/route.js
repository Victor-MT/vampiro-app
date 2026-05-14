export async function POST(req) {
  try {
    
    // IA desativada
    if (process.env.USE_AI !== "true" || !process.env.GEMINI_API_KEY) {
      
      return Response.json({
        success: false,
        ai_enabled: false,
        message: "A integração com IA está desativada."
      });
    }

    const { prompt } = await req.json();
      
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");

    return Response.json({
      success: true,
      ai_enabled: true,
      data: JSON.parse(text)
    });

  } catch (error) {

    console.log("Erro ao gerar ficha:", error.message);

    return Response.json({
      success: false,
      ai_enabled: true,
      message: `Erro ao gerar ficha: ${error.message}`
    },{
      status: 500
    });
  }
}
