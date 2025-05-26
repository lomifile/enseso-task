import { Outlet } from "react-router";
import { Navbar } from "../../components/navbar/navbar";

const HomeLayout = () => {
  return (
    <section>
      <Navbar />
      <section className="p-5">
        <Outlet />
      </section>
    </section>
  );
};

export { HomeLayout };
