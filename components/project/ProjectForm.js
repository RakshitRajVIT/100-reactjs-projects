"use client";

import { useState, useRef } from "react";

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export default function ProjectForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    liveUrl: "",
    sourceUrl: "",
    image: "",
    difficulty: "Beginner",
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadFormData,
        }
      );

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        image: data.secure_url,
      }));
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        technologies: formData.technologies.split(",").map((t) => t.trim()),
      });

      setFormData({
        title: "",
        description: "",
        technologies: "",
        liveUrl: "",
        sourceUrl: "",
        image: "",
        difficulty: "Beginner",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("Error creating project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-lg p-8 border border-zinc-700/50 mb-10">
      <h3 className="text-2xl font-bold mb-6">Create New Project</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-zinc-300 font-semibold mb-2">Project Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition"
            placeholder="e.g., E-commerce Platform"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition h-24"
            placeholder="Describe your project..."
            required
          />
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-2">Technologies (comma-separated)</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition"
            placeholder="React, Node.js, MongoDB, Tailwind"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-2">Difficulty Level</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:border-white transition"
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-zinc-300 font-semibold mb-2">Live URL</label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-2">Source Code URL</label>
            <input
              type="url"
              name="sourceUrl"
              value={formData.sourceUrl}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition"
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-2">Project Image</label>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="flex-1 text-white"
            />
            {uploading && <span className="text-zinc-400">Uploading...</span>}
          </div>
          {formData.image && (
            <div className="mt-4">
              <p className="text-zinc-300 text-sm mb-2">Preview:</p>
              <img
                src={formData.image}
                alt="Project preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-white text-black font-bold py-2 rounded hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}
