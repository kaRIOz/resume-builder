import { Link } from "react-router";
import { useTranslation } from "react-i18next";
//components
import { LanguageDropdown } from "./LanguageDropdown";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const Navbar = () => {
  const { t } = useTranslation();
  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold ">{t("RESUMIND")}</p>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/upload">
          <Button variant={"default"}>{t("Upload-Resume")}</Button>
        </Link>
        <LanguageDropdown />
        <ModeToggle />
      </div>
    </nav>
  );
};
export default Navbar;
