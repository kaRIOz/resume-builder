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
import HowItWorks from "~/components/HowItWorks";

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
      smooth: 3,
      effects: true,
    });
  });

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
      <main>
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <Hero loadingResumes={loadingResumes} resumes={resumes} />
            <div>
              <HowItWorks />
            </div>
            <UploadCards resumes={resumes} />
          </div>
        </div>
      </main>
    </>
  );
};

export default home;
