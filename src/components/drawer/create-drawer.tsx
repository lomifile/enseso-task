import { useTranslation } from "react-i18next";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { EoForm } from "../../forms/create-eo-form";

interface MainDrawerProps {
  id?: string;
  useCustomTrigger?: boolean;
  customTrigger?: boolean;
  onClose?: () => void;
}

const MainDrawer = ({
  id,
  customTrigger,
  useCustomTrigger = false,
  onClose,
}: MainDrawerProps) => {
  const { t } = useTranslation();

  if (useCustomTrigger) {
    return (
      <Drawer.Root open={customTrigger} onClose={onClose} direction="right">
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            aria-describedby={undefined}
            className="right-2 top-2 bottom-2 fixed z-10 outline-none w-[25em] flex"
            style={
              {
                "--initial-transform": "calc(100% + 8px)",
              } as React.CSSProperties
            }
          >
            <div className="w-full bg-white rounded-2xl shadow-2xl p-5 overflow-y-auto">
              <div className="max-w-md mx-auto flex flex-row justify-between items-center">
                <Drawer.Title className="font-bold text-xl mb-2 text-zinc-900 flex items-center">
                  {id ? t("update.title") : t("create.title")}
                </Drawer.Title>
                <Drawer.Close>
                  <X className="text-gray-800" />
                </Drawer.Close>
              </div>
              <EoForm id={id} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Drawer.Root fixed direction="right">
      <Drawer.Trigger className="flex w-full flex-row justify-center xl:justify-start focus:outline-none">
        <div className="flex flex-row py-3 px-5 rounded-2xl bg-teal-800 text-white text-md disabled:bg-teal-500 hover:cursor-pointer disabled:cursor-not-allowed">
          {t("create.trigger-title")}
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          aria-describedby={undefined}
          className="right-2 top-2 bottom-2 fixed z-10 outline-none w-[25em] flex"
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div className="w-full bg-white rounded-2xl shadow-2xl p-5 overflow-y-auto">
            <div className="max-w-md mx-auto flex flex-row justify-between items-center">
              <Drawer.Title className="font-bold text-xl mb-2 text-zinc-900 flex items-center">
                {t("create.title")}
              </Drawer.Title>
              <Drawer.Close>
                <X className="text-gray-800" />
              </Drawer.Close>
            </div>
            <EoForm />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export { MainDrawer };
