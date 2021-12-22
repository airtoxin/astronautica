import { VoidFunctionComponent } from "react";
import { Outlet } from "react-router-dom";

type Props = {
  withoutHeader?: boolean;
};
export const AppLayout: VoidFunctionComponent<Props> = ({ withoutHeader }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen w-screen">
      <aside className="bg-white w-60 h-screen sticky top-0">
        <div className="flex items-center justify-center mt-10">
          <a href="/">Astronautica</a>
        </div>
        <nav className="mt-10">
          <a
            className="flex items-center py-2 px-8 bg-gray-200 text-gray-700 border-r-4 border-gray-700"
            href="/organization"
          >
            Organizations
          </a>
          <a
            className="flex items-center py-2 px-8 text-gray-600 border-r-4 border-white hover:bg-gray-100 hover:text-gray-700 hover:border-gray-700"
            href="/project"
          >
            Projects
          </a>
        </nav>
      </aside>

      <main className="w-full">
        {!withoutHeader && (
          <header className="bg-white flex w-full h-16 sticky top-0">
            <div>
              <div className="inline-block relative w-96 text-2xl">
                <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                  <option>
                    Really long option that will likely overlap the chevron
                  </option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </header>
        )}

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
