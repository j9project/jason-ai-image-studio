"use client";

import { useState } from "react";

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
            <input value={param.key} readOnly />
            <input value={param.value} readOnly />
            <input value={param.type} readOnly />
          </div>
        ))}
      </section>

      <button type="button">
        GENERATE IMAGE
      </button>
    </main>
  );
}
