import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cards } from "../../constance/index";
// icons
import { CloudUpload } from "lucide-react";
import { Copy } from "lucide-react";
import { Eye } from "lucide-react";

export default function HowItWorks() {
  useGSAP(() => {
    const details = gsap.utils.toArray(
      ".desktopContentSection:not(:first-child)"
    );
    const photos = gsap.utils.toArray(".desktopPhoto:not(:first-child)") as any;
    const allPhotos = gsap.utils.toArray(".desktopPhoto") as any;

    gsap.set(photos, { yPercent: 101 });

    let mm = gsap.matchMedia();

    mm.add("(min-width: 600px)", () => {
      ScrollTrigger.create({
        trigger: ".gallery",
        start: "-1% top",
        end: "bottom bottom",
        pin: ".right",
      });

      details.forEach((detail: any, index) => {
        let headline = detail.querySelector("h1");
        let animation = gsap
          .timeline()
          .to(photos[index], { yPercent: 0 })
          .set(allPhotos[index], { autoAlpha: 0 });

        ScrollTrigger.create({
          trigger: headline,
          start: "top 80%",
          end: "top 50%",
          animation,
          scrub: true,
        });
      });
    });
  }, []);

  return (
    <>
      <div className="gallery flex">
        {/* Left (Desktop Content) */}
        <div className="left w-1/2 hidden sm:block">
          <div className="desktopContent w-4/5 mx-auto">
            {cards.map((c, i) => (
              <div
                key={i}
                className="desktopContentSection min-h-screen flex flex-col justify-center"
              >
                <h1 className="text-[clamp(2em,4vw,6em)]">STEP {c.step}</h1>
                <h2 className="text-[clamp(1.4em,2.5vw,3.5em)] leading-relaxed">
                  {c.title}
                </h2>
                <p className="text-[clamp(1.4em,2.5vw,3.5em)] leading-relaxed lg:mt-5">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right (Photos + Mobile Content) */}
        <div className="right w-full sm:w-1/2 sm:h-screen flex flex-col justify-center items-center">
          {/* Mobile Content */}
          <div className="mobileContent block sm:hidden w-[80vw]">
            <div className="mobilePhoto w-[80vw] h-[45vw] mt-20 rounded-[6vw] flex justify-center">
              <CloudUpload size={200} className="text-[#00d5ff]" />
            </div>
            <h1 className="text-4xl font-bold mt-4">STEP 1</h1>
            <p>
              Upload your resume in PDF format and let our system analyze it.
            </p>
            <div className="mobilePhoto w-[80vw] h-[45vw] mt-20 rounded-[6vw] flex justify-center">
              <Copy size={200} className="text-[#e100ff]" />
            </div>

            <h1 className="text-4xl font-bold mt-4">STEP 2</h1>
            <p>
              Copy and paste the job description or requirements of the
              positionyou’re applying for.
            </p>

            <div className="mobilePhoto w-[80vw] h-[45vw] mt-20 rounded-[6vw] flex justify-center">
              <Eye size={200} className="text-[#fff700]" />
            </div>
            <h1 className="text-4xl font-bold mt-4">STEP 3</h1>
            <p>
              Get your match score, key strengths, and improvement suggestions.
            </p>
          </div>

          {/* Desktop Photos */}
          <div className="desktopPhotos hidden sm:block w-[40vw] h-[40vw] rounded-2xl relative overflow-hidden shadow-lg">
            <div className="desktopPhoto flex items-center justify-center absolute w-full h-full">
              <CloudUpload size={256} className="text-[#00d5ff]" />
            </div>
            <div className="desktopPhoto flex items-center justify-center absolute w-full h-full bg-background">
              <Copy size={256} className="text-[#e100ff]" />
            </div>
            <div className="desktopPhoto flex items-center justify-center absolute w-full h-full bg-background">
              <Eye size={256} className="text-[#fff700]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
