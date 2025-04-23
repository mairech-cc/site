import { Outlet } from "react-router";
import { ScrollToTop } from "./modules/scroll/scroll-to-top";

export default function BaseLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}
