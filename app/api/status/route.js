export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return Response.json(
        { error: "taskId is required." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(
        taskId
      )}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.KIE_API_KEY}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok || data.code !== 200) {
      return Response.json(
        {
          error: data.msg || "Failed to get task status.",
          details: data,
        },
        { status: response.status || 500 }
      );
    }

    return Response.json(data.data);
  } catch (error) {
    return Response.json(
      {
        error: error.message || "Failed to get task status.",
      },
      { status: 500 }
    );
  }
}
