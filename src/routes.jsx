import { createHashRouter } from "react-router-dom";

import Wrapper from "./components/Wrapper";
import LesMis from "./lesmis/LesMis";

const router = createHashRouter([
  {
    path: "/",
    element: <Wrapper />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LesMis />,
      },
      //   {
      //     path: "/inputs",
      //     element: <InputsPage />,
      //   },
      //   {
      //     path: "/outputs",
      //     element: <OutputsPage />,
      //   },
    ],
  },
]);

export default router;
