import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Select, SelectItem } from "../select/select";
import { Button } from "../button/button";
import { useNavigate } from "react-router";

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <nav className="h-10 w-full bg-teal-800 flex flex-row items-center justify-center xl:justify-between p-10">
      <h1 className="text-2xl font-bold text-gray-300 xl:p-5">
        {t("navbar.title")}
      </h1>

      <div className="flex items-center justify-center gap-5">
        <div className="mt-4">
          <Select
            onValueChange={(lang) => i18n.changeLanguage(lang)}
            value={i18n.language}
          >
            <SelectItem
              className="hover:bg-gray-300 rounded-md hover:outline-none hover:cursor-pointer"
              value="en"
            >
              🇬🇧
            </SelectItem>
            <SelectItem
              className="hover:bg-gray-100 rounded-md hover:outline-none hover:cursor-pointer"
              value="hr"
            >
              🇭🇷
            </SelectItem>
          </Select>
        </div>
        <Button
          className="bg-white text-black p-3 text-sm"
          onClick={() => {
            Cookies.remove("rf");
            navigate(0);
          }}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}

export { Navbar };
