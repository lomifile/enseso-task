import {
  ErrorOption,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../components/input/input";
import { Select, SelectItem } from "../components/select/select";
import { Button } from "../components/button/button";
import { api, canonicalUri } from "../lib/fetch";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetOneResponse } from "../types/response";
import { Loader } from "../components/loader/loader";
import { AlertTriangleIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import { EconomicOperator } from "../types/models/economic-operator";
import { useTranslation } from "react-i18next";
import {
  CreateEoFormType,
  validator,
  deleteValidator,
  DeleteEoType,
} from "./validator";

interface EoFormProps {
  id?: string;
}

const EoForm = ({ id }: EoFormProps) => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery<GetOneResponse>({
    queryKey: ["economic-operator", id],
    queryFn: async () => {
      const keys = Cookies.get("rf");
      if (!keys) return undefined;

      const { api_key, api_secret } = JSON.parse(keys);
      const req = await api(canonicalUri(`/eolist/${id}`), {
        awsCredentials: {
          accessKeyId: api_key,
          secretAccessKey: api_secret,
        },
        method: "GET",
      });

      if (!req.ok) {
        throw await req.json();
      }

      const result = await req.json();

      if (result.errorCode !== 0) {
        throw new Error(result.errorMessage);
      }

      return result;
    },
    enabled: !!id,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    register,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(validator),
    defaultValues: {
      Message_Type: "1-1",
      EO_ID: "",
      EO_CODE: "",
      EO_Type: "1",
      EO_Name1: "",
      EO_Name2: "",
      EO_Address_Name: "",
      EO_Address_StreetOne: "",
      EO_Address_StreetTwo: "",
      EO_Address_PostCode: "",
      EO_Address_City: "",
      EO_A_Info: "",
      EO_CountryReg: "",
      EO_Email: "",
      EO_Phone: "",
      VAT_R: "0",
      VAT_N: "",
      TAX_N: "",
      EO_ExciseNumber1: "0",
      EO_ExciseNumber2: "",
      OtherEOID_R: "0",
      OtherEOID_N_list: {},
      Reg_3RD: "0",
      Reg_EOID: "",
      EO_OtherID: "",
      Extensibility: "",
    },
  });

  useEffect(() => {
    if (!data) return;
    for (const key of Object.keys(getValues()) as (keyof EconomicOperator)[]) {
      setValue(
        key as keyof CreateEoFormType,
        typeof data?.operator[key] === "number"
          ? data?.operator[key].toString()
          : data?.operator[key],
      );
    }
    setValue("Message_Type", "1-2");
    setValue("OtherEOID_N_list", {});
    setValue("EO_ID", data.operator["EO_ID"]);
  }, [data, setValue, getValues]);

  const navigate = useNavigate();
  const onSubmit: SubmitHandler<CreateEoFormType> = async (data) => {
    const keys = Cookies.get("rf");
    if (!keys) return undefined;

    const { api_key, api_secret } = JSON.parse(keys);
    const response = await api(id ? `/eo/${encodeURIComponent(id)}` : `/eo`, {
      method: id ? "PUT" : "POST",
      awsCredentials: {
        accessKeyId: api_key,
        secretAccessKey: api_secret,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await response.json();
    }

    navigate(0);
  };

  const onValidateError: SubmitErrorHandler<CreateEoFormType> = (error) => {
    for (const key of Object.keys(error) as (keyof EconomicOperator)[]) {
      setError(
        key as keyof CreateEoFormType,
        error[key as keyof CreateEoFormType] ?? ({} as ErrorOption),
      );
    }
  };

  const { mutate: removeEo, isPending } = useMutation({
    mutationFn: async (data: DeleteEoType) => {
      await deleteValidator.validate(data);
      const keys = Cookies.get("rf");
      if (!keys) return undefined;

      const { api_key, api_secret } = JSON.parse(keys);
      const response = await api(`/eo/${encodeURIComponent(id ?? "")}`, {
        method: "DELETE",
        awsCredentials: {
          accessKeyId: api_key,
          secretAccessKey: api_secret,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await response.json();
      }
    },
    onSuccess: () => {
      // navigate(0);
    },
  });

  if (isLoading) {
    return (
      <div className="w-full flex flex-row justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center">
        <AlertTriangleIcon className="text-red-800" />
        <span className="text-md text-red-800">{error.message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onValidateError)}>
      <div className="grid gridName1-cols-2 gap-2">
        <Input
          type="text"
          error={errors.EO_ID?.message}
          {...register("EO_ID")}
          label={t("form.EO_ID")}
        />
        <Input
          error={errors.EO_CODE?.message}
          type="text"
          {...register("EO_CODE")}
          label={t("form.EO_Code")}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="text"
          error={errors.EO_Name1?.message}
          {...register("EO_Name1")}
          label={t("form.EO_Name1")}
        />
        <Input
          error={errors.EO_Name2?.message}
          type="text"
          {...register("EO_Name2")}
          label={t("form.EO_Name2")}
        />
      </div>
      <label className="text-md py-5">{t("form.EO_Type")}</label>
      <Select
        defaultValue="1"
        onValueChange={(value: "1" | "2" | "3" | "4") =>
          setValue("EO_Type", value)
        }
        {...register("EO_Type")}
      >
        <SelectItem value="1">{t("form.EO_Type_Data.1")}</SelectItem>
        <SelectItem value="2">{t("form.EO_Type_Data.2")}</SelectItem>
        <SelectItem value="3">{t("form.EO_Type_Data.3")}</SelectItem>
        <SelectItem value="4">{t("form.EO_Type_Data.4")}</SelectItem>
      </Select>
      <Input
        type="text"
        error={errors.EO_Address_Name?.message}
        {...register("EO_Address_Name")}
        label={t("form.EO_Address_Name")}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="text"
          error={errors.EO_Address_StreetOne?.message}
          {...register("EO_Address_StreetOne")}
          label={t("form.EO_Address_StreetOne")}
        />
        <Input
          type="text"
          error={errors.EO_Address_StreetTwo?.message}
          {...register("EO_Address_StreetTwo")}
          label={t("form.EO_Address_StreetTwo")}
        />
      </div>
      <Input
        type="text"
        error={errors.EO_Address_PostCode?.message}
        {...register("EO_Address_PostCode")}
        label={t("form.EO_Address_PostCode")}
      />
      <Input
        type="text"
        error={errors.EO_Address_City?.message}
        {...register("EO_Address_City")}
        label={t("form.EO_Address_City")}
      />
      <Input
        type="text"
        error={errors.EO_A_Info?.message}
        {...register("EO_A_Info")}
        label={t("form.EO_A_Info")}
      />
      <Input
        type="text"
        error={errors.EO_CountryReg?.message}
        {...register("EO_CountryReg")}
        label={t("form.EO_CountryReg")}
        max={2}
      />
      <Input
        type="email"
        error={errors.EO_Email?.message}
        {...register("EO_Email")}
        label={t("form.EO_Email")}
      />
      <Input
        type="text"
        error={errors.EO_Phone?.message}
        {...register("EO_Phone")}
        label={t("form.EO_Phone")}
      />
      <label className="text-md mb-5">{t("form.VAT_R")}</label>
      <Select
        defaultValue="0"
        onValueChange={(value: "0" | "1") => setValue("VAT_R", value)}
        {...register("VAT_R")}
      >
        <SelectItem value="0">{t("form.VAT_R_Data.0")}</SelectItem>
        <SelectItem value="1">{t("form.VAT_R_Data.1")}</SelectItem>
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="text"
          error={errors.VAT_N?.message}
          {...register("VAT_N")}
          label={t("form.VAT_N")}
        />
        <Input
          type="text"
          error={errors.TAX_N?.message}
          {...register("TAX_N")}
          label={t("form.TAX_N")}
        />
      </div>
      <label className="text-md mb-5">{t("form.EO_ExciseNumber1")}</label>
      <Select
        defaultValue="0"
        onValueChange={(value: "0" | "1") =>
          setValue("EO_ExciseNumber1", value)
        }
        {...register("EO_ExciseNumber1")}
      >
        <SelectItem value="0">{t("form.EO_ExciseNumber1_Data.0")}</SelectItem>
        <SelectItem value="1">{t("form.EO_ExciseNumber1_Data.1")}</SelectItem>
      </Select>
      <Input
        type="text"
        error={errors.EO_ExciseNumber2?.message}
        {...register("EO_ExciseNumber2")}
        label={t("form.EO_ExciseNumber2")}
      />
      <label className="text-md mb-5">{t("form.Reg_3RD")}</label>
      <Select
        defaultValue="0"
        onValueChange={(value: "0" | "1") => setValue("Reg_3RD", value)}
        {...register("Reg_3RD")}
      >
        <SelectItem value="0">{t("yesno_data.0")}</SelectItem>
        <SelectItem value="1">{t("yesno_data.1")}</SelectItem>
      </Select>
      <label className="text-md mb-5">{t("form.OtherEOID_R")}</label>
      <Select
        defaultValue="0"
        onValueChange={(value: "0" | "1") => setValue("OtherEOID_R", value)}
        {...register("OtherEOID_R")}
      >
        <SelectItem value="0">{t("yesno_data.0")}</SelectItem>
        <SelectItem value="1">{t("yesno_data.1")}</SelectItem>
      </Select>
      <Input
        type="text"
        error={errors.Reg_EOID?.message}
        {...register("Reg_EOID")}
        label={t("form.Reg_EOID")}
      />
      <Input
        type="text"
        error={errors.EO_OtherID?.message}
        {...register("EO_OtherID")}
        label={t("form.EO_OtherID")}
      />
      <Input
        type="text"
        error={errors.Extensibility?.message}
        {...register("Extensibility")}
        label={t("form.Extensibility")}
      />
      <div className="flex flex-row gap-2">
        <Button type="submit" className="z-40" isLoading={isSubmitting}>
          {id ? t("form.trigger.update") : t("form.trigger.create")}
        </Button>
        {id && (
          <Button
            type="button"
            className="bg-red-800"
            isLoading={isPending}
            onClick={() => {
              const values = getValues();
              removeEo({
                Message_Type: "9-1",
                EO_ID: values["EO_ID"] as string,
                EO_CODE: values["EO_CODE"] as string,
                Reg_3RD: values["Reg_3RD"],
                Reg_EOID: values["Reg_EOID"],
              });
            }}
          >
            <Trash />
          </Button>
        )}
      </div>
    </form>
  );
};

export { EoForm };
