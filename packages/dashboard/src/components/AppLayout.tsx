import { VoidFunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import { GlobalBreadcrumb } from "./GlobalBreadcrumb";

export const AppLayout: VoidFunctionComponent = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen w-screen text-gray-600">
      <aside className="bg-white w-60 h-screen sticky top-0">
        <div className="flex items-center justify-center mt-10">
          <a href="/">Astronautica</a>
        </div>
        <nav className="mt-10">
          <a
            className="flex items-center py-2 px-8 bg-gray-200 text-gray-800 border-r-4 border-gray-700"
            href="/organization"
          >
            Organizations
          </a>
          <a
            className="flex items-center py-2 px-8 border-r-4 border-white hover:bg-gray-100 hover:text-gray-700 hover:border-gray-700"
            href="/project"
          >
            Projects
          </a>
        </nav>
      </aside>

      <main className="w-full">
        <header className="bg-white flex w-full h-16 sticky top-0">
          <div className="ml-4 flex flex-column items-center w-full h-full">
            <GlobalBreadcrumb />
          </div>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
