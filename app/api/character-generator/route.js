export async function POST(req) {
  try {

    // IA desativada
    if (process.env.USE_AI !== "true" || !process.env.OPENAI_API_KEY) {
      
      return Response.json({
        success: false,
        ai_enabled: false,
        message: "A integração com IA está desativada."
      });
    }

    const { prompt } = await req.json();

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: prompt
        })
      }
    );

    const data = await response.json();

    return Response.json({
      success: true,
      ai_enabled: true,
      data: JSON.parse(data.output_text)
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      success: false,
      ai_enabled: true,
      message: "Erro ao gerar ficha."
    },{
      status: 500
    });
  }
}