import Cookies from "js-cookie";
import {
  queryOptions,
  QueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { api } from "../lib/fetch";
import {
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router";
import { ListResponse } from "../types/response";
import { useEffect } from "react";
import { Loader } from "../components/loader/loader";
import { MainDrawer } from "../components/drawer/create-drawer";
import { DataTable } from "../components/table/data-table";
import { columns } from "../components/table/columns";

const listQuery = (q?: string) =>
  queryOptions<ListResponse>({
    queryKey: ["economic-operator", "list", q || "all"],
    queryFn: async () => {
      const keys = Cookies.get("rf");
      if (!keys) {
        throw new Error("User not authenticated");
      }

      const { api_key, api_secret } = JSON.parse(keys);

      const req = await api("/eolist", {
        awsCredentials: {
          accessKeyId: api_key,
          secretAccessKey: api_secret,
        },
        method: "GET",
      });

      if (!req.ok) {
        throw new Error(
          "There was an error while trying to fetch /eolist data",
        );
      }

      const data = await req.json();

      return data;
    },
  });

const loader =
  (qc: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    try {
      await qc.ensureQueryData(listQuery(q));
      return { q };
    } catch (err) {
      if (err instanceof Error && err.message === "User not authenticated") {
        return redirect("/auth/login");
      }
      throw err; // let other errors bubble up
    }
  };

function Home() {
  const { q } = useLoaderData();
  const navigate = useNavigate();
  const {
    data: economicOperators,
    isLoading,
    error,
  } = useSuspenseQuery<ListResponse>(listQuery(q));

  console.log(economicOperators, error);
  useEffect(() => {
    if (
      economicOperators.errorCode === 1056 ||
      economicOperators.errorCode === 1057
    ) {
      navigate(`/auth/login`);
    }
  }, [economicOperators, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <MainDrawer />
      <DataTable columns={columns} data={economicOperators.operators ?? []} />
    </section>
  );
}

export { loader, listQuery };
export default Home;
