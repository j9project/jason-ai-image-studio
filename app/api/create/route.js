export async function POST(request) {
  try {
    const body = await request.json();

    const {
      model,
      prompt,
      image_urls = [],
      params = {},
    } = body;

    if (!model) {
      return Response.json(
        { error: "Model is required." },
        { status: 400 }
      );
    }

    if (!prompt) {
      return Response.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.kie.ai/api/v1/jobs/createTask",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KIE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          input: {
  prompt,
  ...(model === "wan/2-7-image"
    ? { input_urls: image_urls }
    : { image_urls }),
  ...params,
},
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.code !== 200) {
      return Response.json(
        {
          error: data.msg || "Failed to create image task.",
          details: data,
        },
        { status: response.status || 500 }
      );
    }

    return Response.json({
      taskId: data.data.taskId,
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message || "Failed to create image task.",
      },
      { status: 500 }
    );
  }
}
