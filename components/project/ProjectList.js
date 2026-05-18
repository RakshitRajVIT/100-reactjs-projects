"use client";

import { db, auth } from "@/lib/firebase";
import { ref, remove } from "firebase/database";
import Link from "next/link";
import Image from "next/image";

export default function ProjectList({ projects, onProjectUpdate }) {
  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await remove(ref(db, `projects/${projectId}`));
      onProjectUpdate();
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error deleting project");
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-700/50">
        <p className="text-zinc-400">No projects yet. Create your first project!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700/50 hover:border-zinc-600 transition"
        >
          {project.image && (
            <div className="relative w-full h-48 bg-zinc-800">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              {project.difficulty && (
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                    project.difficulty === "Beginner"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : project.difficulty === "Intermediate"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {project.difficulty}
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-sm mb-4">{project.description}</p>

            <div className="mb-4">
              <p className="text-zinc-300 text-xs font-semibold mb-2">Technologies:</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white text-black text-sm font-bold py-2 rounded hover:bg-zinc-200 transition text-center"
                >
                  View Live
                </Link>
              )}
              {project.sourceUrl && (
                <Link
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-zinc-800 text-white text-sm font-bold py-2 rounded hover:bg-zinc-700 transition text-center"
                >
                  Source Code
                </Link>
              )}
            </div>

            <button
              onClick={() => handleDelete(project.id)}
              className="w-full bg-red-600/20 text-red-400 font-semibold py-2 rounded hover:bg-red-600/30 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
