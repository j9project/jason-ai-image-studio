"use client";

import { useEffect, useState } from "react";

const defaultParams = [
  { key: "aspect_ratio", value: "1:1", type: "string" },
  { key: "quality", value: "basic", type: "string"  },
  { key: "output_format", value: "png", type: "string" },
  { key: "nsfw_checker", value: "false", type: "boolean" },
];

export default function Home() {
  const [model, setModel] = useState(
    "seedream/5-flash-image-to-image"
  );
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState([]);
  const [params, setParams] = useState(defaultParams);
  const [status, setStatus] = useState("");
const [resultUrl, setResultUrl] = useState("");
const [isGenerating, setIsGenerating] = useState(false);
function useSeedream5() {
  setModel("seedream/5-flash-image-to-image");
  setParams(defaultParams.map((item) => ({ ...item })));
}
  function useWan27() {
  setModel("wan/2-7-image");
  setParams([
    { key: "resolution", value: "1K", type: "string" },
    { key: "aspect_ratio", value: "1:1", type: "string" },
    { key: "n", value: "1", type: "number" },
    { key: "nsfw_checker", value: "false", type: "boolean" },
  ]);
}
  function updateParam(index, field, value) {
  setParams((old) =>
    old.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
  );
}

function addParam() {
  setParams((old) => [
    ...old,
    { key: "", value: "", type: "string" },
  ]);
}

function buildParams() {
  const output = {};

  params.forEach((param) => {
    if (!param.key.trim()) return;

    let value = param.value;

    if (param.type === "boolean") {
      value = param.value === "true";
    } else if (param.type === "number") {
      value = Number(param.value);
    }

    output[param.key] = value;
  });

  return output;
}
  async function uploadImages() {
  const urls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Image upload failed.");
    }

    urls.push(data.url);
  }

  return urls;
}
  async function createTask(imageUrls) {
  const response = await fetch("/api/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      image_urls: imageUrls,
      params: buildParams(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create image task.");
  }

  return data.taskId;
}
  async function checkStatus(taskId) {
  const response = await fetch(
    `/api/status?taskId=${encodeURIComponent(taskId)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to check task status.");
  }

  return data;
}
  async function handleGenerate() {
  if (!prompt.trim()) {
    setStatus("Please enter a prompt.");
    return;
  }

  try {
    setIsGenerating(true);
    setResultUrl("");
    setStatus("Uploading reference images...");

    const imageUrls = await uploadImages();

    setStatus("Creating image task...");
    const taskId = await createTask(imageUrls);

    setStatus("Generating image...");

    // Poll Kie until the task finishes
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const task = await checkStatus(taskId);

      if (task.state === "success") {
        const result = JSON.parse(task.resultJson || "{}");
        const urls = result.resultUrls || [];

        if (!urls.length) {
          throw new Error("Task succeeded but no image URL was returned.");
        }

        setResultUrl(urls[0]);
        setStatus("Done!");
        break;
      }

      if (task.state === "fail") {
        throw new Error(
          task.failMsg || "Image generation failed."
        );
      }
    }
  } catch (error) {
    setStatus(error.message || "Something went wrong.");
  } finally {
    setIsGenerating(false);
  }
}
  function removeParam(index) {
  setParams((old) => old.filter((_, i) => i !== index));
}
  function resetDefaults() {
  setParams(defaultParams.map((item) => ({ ...item })));
}
  useEffect(() => {
  try {
    const saved = localStorage.getItem("jason-ai-image-settings");
    if (!saved) return;

    const data = JSON.parse(saved);

    if (data.model) setModel(data.model);
    if (Array.isArray(data.params)) setParams(data.params);
  } catch {}
}, []);
  useEffect(() => {
  try {
    localStorage.setItem(
      "jason-ai-image-settings",
      JSON.stringify({ model, params })
    );
  } catch {}
}, [model, params]);
  return (
    <main>
      <h1>AI Image Studio</h1>
      <p>Seedream 5.0 Flash · Image Editing Playground</p>

      <section>
        <label>MODEL</label>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <button type="button" onClick={useSeedream5}>
  Seedream 5
</button>
            <button type="button" onClick={useWan27}>
  WAN 2.7
</button>
      </section>

      <section>
        <label>REFERENCE IMAGES</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <small>{files.length} image(s) selected</small>
      </section>

      <section>
        <label>PROMPT</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe exactly what you want to change..."
        />
      </section>

      <section>
        <label>GENERATION PARAMETERS</label>

        {params.map((param, index) => (
  <div key={index}>
    <input
      value={param.key}
      onChange={(e) =>
        updateParam(index, "key", e.target.value)
      }
    />

    <input
      value={param.value}
      onChange={(e) =>
        updateParam(index, "value", e.target.value)
      }
    />

    <input
      value={param.type}
      onChange={(e) =>
        updateParam(index, "type", e.target.value)
      }
    />

    <button
      type="button"
      onClick={() => removeParam(index)}
    >
      ×
    </button>
  </div>
))}

<button type="button" onClick={addParam}>
  + Add Parameter
</button>
  <button type="button" onClick={resetDefaults}>
  ↻ Reset Defaults
</button>
  {status && (
  <p>{status}</p>
)}

{resultUrl && (
  <section>
    <label>RESULT</label>
    <img
      src={resultUrl}
      alt="Generated result"
      style={{
        width: "100%",
        maxWidth: "700px",
        borderRadius: "12px",
      }}
    />
  </section>
)}
      </section>

     <button
  type="button"
  onClick={handleGenerate}
  disabled={isGenerating}
>
  {isGenerating ? "GENERATING..." : "GENERATE IMAGE"}
</button>
    </main>
  );
}
