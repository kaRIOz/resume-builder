import { Link } from "react-router";
//zustand
import LightRays from "~/components/LightRays";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
// GSAP
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import ShinyText from "./ShinyText";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({
  loadingResumes,
  resumes,
}: {
  loadingResumes: boolean;
  resumes: Resume[];
}) {
  const { t } = useTranslation();

  return (
    <main className="w-full flex flex-col justify-center items-center min-h-[80vh] relative  ">
      <div className="absolute inset-0 w-full h-screen  overflow-hidden opacity-60 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#77d4ff"
          raysSpeed={1.5}
          lightSpread={2}
          rayLength={3}
          followMouse={false}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.3}
          className="custom-rays"
        />
      </div>
      <div className="h-screen relative z-10 flex flex-col justify-center items-center gap-y-2 max-w-4xl mx-auto px-4 text-center ">
        <div className="page-heading z-50">
          <h1 className="title">Discover Strengths and Fix Weaknesses Fast</h1>

          <ShinyText
            text="
            Get AI-powered feedback on every application and improve your
            chances of getting hired."
            disabled={false}
            speed={5}
            className="custom-class"
          />
        </div>

        <Link to="/upload">
          <Button className="mt-4 cursor-pointer" variant={"default"}>
            {t("Upload-Resume")}
          </Button>
        </Link>
      </div>
    </main>
  );
}
