"use client";

import { projectConfig } from "@/config/projects";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaGithub, FaLink, FaSearch, FaYoutube } from "react-icons/fa";
import SearchBar from "./search-bar";

export default function ProjectGrid() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projectConfig.projects.filter((item) => {
      const query = searchQuery.toLowerCase();

      return (
        item.projectName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.techStack &&
          item.techStack.some((tech: string) =>
            tech.toLowerCase().includes(query),
          ))
      );
    });
  }, [searchQuery]);

  return (
    <div className="mt-15">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {filteredProjects.length > 0 ? (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={`/projects/${item.projectImage}`}
                  alt={item.projectName}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw,
                         (max-width: 1024px) 50vw,
                         33vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <div className="relative flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-start">
                    {item.projectName}
                  </h3>

                  <span
                   className={`rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${
                     item.difficulty === "Beginner"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : item.difficulty === "Intermediate"
                        ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>  

                <p className="mt-2 text-sm leading-relaxed text-foreground/70 font-medium text-start line-clamp-2">
                  {item.description}
                </p>

                {item.techStack && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.techStack.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex items-center gap-3">
                  {item.liveLink && (
                    <Link
                      href={item.liveLink}
                      target="_blank"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-all duration-300 hover:scale-110 hover:bg-muted"
                    >
                      <FaLink size={16} />
                    </Link>
                  )}

                  {item.githubLink && (
                    <Link
                      href={item.githubLink}
                      target="_blank"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-all duration-300 hover:scale-110 hover:bg-muted"
                    >
                      <FaGithub size={16} />
                    </Link>
                  )}

                  {item.ytLink && (
                    <Link
                      href={item.ytLink}
                      target="_blank"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-all duration-300 hover:scale-110 hover:bg-red-500 hover:text-white"
                    >
                      <FaYoutube size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FaSearch className="mb-4 text-4xl text-foreground/50" />
          <h3 className="text-lg font-semibold">
            {projectConfig.notFound.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {projectConfig.notFound.description}
          </p>
        </div>
      )}
    </div>
  );
}
