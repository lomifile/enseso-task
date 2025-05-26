import * as Yup from "yup";
import Cookies from "js-cookie";
import { Input } from "../components/input/input";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PasswordInput } from "../components/input/password-input";
import { useTranslation } from "react-i18next";
import { api } from "../lib/fetch";
import { useNavigate } from "react-router";
import { Button } from "../components/button/button";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const validator = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("No password is provided"),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(validator),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    const req = await api(`/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!req.ok) {
      throw new Error("There was an error while trying to call api function!");
    }

    const result = await req.json();
    if (result.errorCode !== 0) {
      if (result.errorCode === 1051) {
        setError("username", {
          message: result.errorMessage,
        });
        setError("password", {
          message: result.errorMessage,
        });
      }
      return;
    }

    const { api_key, api_secret } = result;

    Cookies.set(
      "rf",
      JSON.stringify({
        api_key,
        api_secret,
      }),
      {
        sameSite: "Lax",
      },
    );

    navigate("/home");
  };

  const onValidateError: SubmitErrorHandler<LoginFormValues> = (errors) => {
    if (errors.username && errors.username.message)
      setError("username", {
        message: errors.username.message,
      });
    if (errors.password && errors.password.message)
      setError("password", {
        message: errors.password.message,
      });
  };

  return (
    <section className="w-full h-full flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit, onValidateError)}>
        <Input
          label={t("login.username")}
          type="text"
          error={errors.username?.message}
          {...register("username")}
        />
        <PasswordInput
          label={t("login.password")}
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" isLoading={isSubmitting}>
          Submit
        </Button>
      </form>
    </section>
  );
}
