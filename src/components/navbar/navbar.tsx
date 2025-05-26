import { useTranslation } from "react-i18next";

function Navbar() {
  const { t } = useTranslation();
  return (
    <nav className="h-10 w-full bg-teal-800 flex flex-row items-center justify-center xl:justify-start p-10">
      <h1 className="text-2xl font-bold text-gray-300 xl:p-5">
        {t("navbar.title")}
      </h1>
    </nav>
  );
}

export { Navbar };
