import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "constance";
import { convertPdfToImage } from "~/lib/pdf2img";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
//gsap
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { t } = useTranslation();
  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error: Failed to upload file");

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return setStatusText("Error: Failed to convert PDF to image");

    setStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Error: Failed to upload image");

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText(t("Analyzing..."));

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return setStatusText("Error: Failed to analyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");
    console.log(data);
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      delay: 1,
    });

    tl.from("form div", {
      y: 100,
      ease: "power1.inOut",
      stagger: 0.2,
      opacity: 0,
      duration: 0.5,
    });
  });

  return (
    <>
      <Navbar />

      <section className="flex flex-col items-center main-section">
        <div className="page-heading py-16">
          <h1>{t("Smartfeedbackforyourdreamjob")}</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-[50%]" />
            </>
          ) : (
            <h2>{t("DropyourresumeforanATSscoreandimprovementtips")}</h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col justify-center gap-4 mt-4"
            >
              <div className="form-div">
                <input
                  type="text"
                  name="company-name"
                  placeholder={t("CompanyName")}
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <input
                  type="text"
                  name="job-title"
                  placeholder={t("JobTitle")}
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder={t("JobDescription")}
                />
              </div>

              <div className="form-div">
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <Button
                className="w-full cursor-pointer"
                variant={"default"}
                type="submit"
              >
                {t("AnalyzeResume")}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};
export default Upload;
