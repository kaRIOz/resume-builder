// components
import { useEffect, useState } from "react";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";
import ChromaGrid from "./ChromaGrid";

const UploadCards = ({ resumes }: { resumes: Resume[] }) => {
  return (
    <section className="bg-black p-4 md:p-6">
      <ChromaGrid
        items={resumes}
        radius={300}
        damping={0.45}
        fadeOut={0.6}
        ease="power3.out"
      />
    </section>
  );
};

export default UploadCards;
