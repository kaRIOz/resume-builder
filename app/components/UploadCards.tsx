// components
import ResumeCard from "~/components/ResumeCard";

const UploadCards = ({ resumes }: { resumes: Resume[] }) => {
  return (
    <section className="grid grid-cols-3 w-11/12 mx-auto">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </section>
  );
};

export default UploadCards;
