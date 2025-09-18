// Gsap
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const cards = [
  {
    step: 1,
    title: "Upload your resume",
    description:
      "Upload your resume in PDF format and let our system analyze it.",
    textColor: "bg-blue-100 text-blue-600",
    translation: "translate-y-[-15%]",
  },
  {
    step: 2,
    title: "Paste the job requirements",
    description:
      "Copy and paste the job description or requirements of the positionyou’re applying for.",
    textColor: "bg-green-100 text-green-600",
    translation: "translate-y-[-10%]",
  },
  {
    step: 3,
    title: "See your results",
    description:
      "Get your match score, key strengths, and improvement suggestions.",
    textColor: "bg-purple-100 text-purple-600",
    translation: "translate-y-[-5%]",
  },
];

const HowItWorks = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });

    tl.to(".testimonials-section h3", {
      xPercent: 10,
    });

    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "-3% top",
        end: "200% top",
        scrub: 1.5,
        pin: true,
      },
    });

    pinTl.from(".vd-card", {
      yPercent: 150,
      stagger: 0.2,
      ease: "power1.inOut",
    });
  });

  return (
    <section className="testimonials-section bg-black/35">
      <div className="absolute size-full pt-[5vw]">
        <h3 className="uppercase text-[15.5vw] leading-[105%] tracking-[-.2vw] ml-[2vw] font-bold">
          How it works
        </h3>
      </div>
      <div className="pin-box">
        {cards.map((card, index) => (
          <div className="vd-card bg-neutral-800" key={index}>
            <div
              className={`w-14 h-14 flex items-center justify-center text-xl font-bold rounded-full mx-auto mb-4 ${card.textColor} ${card.translation}`}
            >
              {card.step}
            </div>
            <h4 className="text-xl font-semibold mb-2">{card.title}</h4>
            <p className="text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
