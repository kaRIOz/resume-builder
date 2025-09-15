import { useEffect, useState } from "react";
import type { Route } from "./+types/home";

import Hero from "~/components/Hero";
import { usePuterStore } from "~/lib/puter";
import UploadCards from "~/components/UploadCards";
import { useNavigate } from "react-router";
// components
import Navbar from "~/components/Navbar";
// Gsap
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Builder" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const home = () => {
  useGSAP(() => {
    ScrollSmoother.create({
      wrapper: ".main",
      content: ".content",
      smooth: 4,
      speed: 2,
      effects: true, // Enables data-speed and data-lag attributes
      smoothTouch: 0.1,
      normalizeScroll: true,
    });
  }, []);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const { auth, kv } = usePuterStore();

  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!auth.isAuthenticated) navigate("/auth?next=/");
  // }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <>
      <Navbar />

      <main className="main">
        <div className="content">
          <Hero loadingResumes={loadingResumes} resumes={resumes} />
          <UploadCards resumes={resumes} />
        </div>
      </main>
    </>
  );
};

export default home;
