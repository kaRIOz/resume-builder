import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
export function LanguageDropdown() {
  const { i18n } = useTranslation();
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language; // <html lang="fa">
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  };
  return (
    <Select defaultValue={i18n.language} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[122px]">
        <Globe className="h-4 w-4" />
        <SelectValue placeholder="lng" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fa">فارسی</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
}
