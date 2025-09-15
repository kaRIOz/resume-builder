import { Link } from "react-router";
import { useTranslation } from "react-i18next";
//components
import { LanguageDropdown } from "./LanguageDropdown";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const Navbar = () => {
  const { t } = useTranslation();
  return (
    <header className="w-full fixed top-0 left-0 right-0 z-[100] flex justify-center items-center">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:w-[90%] xl:w-[85%] 2xl:w-[80%] my-4">
        <nav className="navbar">
          <Link to="/upload">
            <Button variant={"default"}>{t("Upload-Resume")}</Button>
          </Link>
          <Link to="/">
            <img
              src="./images/logo.png"
              alt="logo"
              className="w-32 object-cover"
            />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageDropdown />
            <ModeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
