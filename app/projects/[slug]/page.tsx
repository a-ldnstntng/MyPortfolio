import { PROJECTS } from "@/lib/projects";
import ProjectDetailClient from "@/components/ProjectDetailClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolved = await params;
  const project = PROJECTS.find((p) => p.slug === resolved.slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.name} — Ali Andrei`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolved = await params;
  return <ProjectDetailClient slug={resolved.slug} />;
}
