export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("uploadPath", "images/jason-ai-image-studio");

    const response = await fetch(
      "https://kieai.redpandaai.co/api/file-stream-upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KIE_API_KEY}`,
        },
        body: uploadData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return Response.json(
        {
          error: data.msg || "Kie image upload failed.",
          details: data,
        },
        { status: response.status || 500 }
      );
    }

    return Response.json({
      url: data.data.downloadUrl,
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message || "Upload failed.",
      },
      { status: 500 }
    );
  }
}
