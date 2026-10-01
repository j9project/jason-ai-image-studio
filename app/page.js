"use client";

import { useEffect, useState } from "react";

const defaultParams = [
  { key: "aspect_ratio", value: "1:1", type: "string" },
  { key: "size", value: "2K", type: "string" },
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
      </section>

      <button type="button">
        GENERATE IMAGE
      </button>
    </main>
  );
}
