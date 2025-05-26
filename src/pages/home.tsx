import Cookies from "js-cookie";
import {
  queryOptions,
  QueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { api } from "../lib/fetch";
import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";
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
      if (!keys) return undefined;

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
    await qc.ensureQueryData(listQuery(q));
    return { q };
  };

function Home() {
  const { q } = useLoaderData();
  const navigate = useNavigate();
  const { data: economicOperators, isLoading } = useSuspenseQuery<ListResponse>(
    listQuery(q),
  );

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
