import { useEffect, useState } from "react";

import type { Route } from "./+types/home";
import { Link, useNavigate } from "react-router";
// components
import Navbar from "./../components/Navbar";
import ResumeCard from "~/components/ResumeCard";
//zustand
import { usePuterStore } from "~/lib/puter";
import LightRays from "~/components/LightRays";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
//gsap
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Builder" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // useEffect(() => {
  //   if (!auth.isAuthenticated) navigate("/auth?next=/");
  // }, [auth.isAuthenticated]);
  const { t } = useTranslation();

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

  useGSAP(() => {
    const titleT = gsap.timeline({ delay: 0.5 });
    const titleSplit = SplitText.create(".title", { type: "words, lines" });

    titleT.from(titleSplit.words, {
      duration: 1,
      y: 100,
      stagger: 0.1,
      ease: "power1.inOut",
      zIndex: 1,
    });
  });

  return (
    <main>
      <Navbar />
      <section className="main-section">
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
        <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          <div className="page-heading ">
            <h1 className="title">
              {t("Track-Your-Applications-&-Resume-Ratings")}
            </h1>
            {!loadingResumes && resumes?.length === 0 ? (
              <h2>
                {t(
                  "No-resumes-found-Upload-your-first-resume-to-get-feedback-."
                )}
              </h2>
            ) : (
              <h2>
                {t("Review-your-submissions-and-check-AI-powered-feedback.")}
              </h2>
            )}
          </div>
          {loadingResumes && (
            <div className="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" className="w-[200px]" />
            </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
            <div className="resumes-section">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}

          {!loadingResumes && resumes?.length === 0 && (
            <div className="text-center mt-10">
              <Link to="/upload">
                <Button variant={"default"}>{t("Upload-Resume")}</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
