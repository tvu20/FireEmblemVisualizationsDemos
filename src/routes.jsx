import { createHashRouter } from "react-router-dom";

import Wrapper from "./components/Wrapper";
import App from "./App";
import LesMis from "./lesmis/LesMis";
import SocialGraphs from "./socialgraphs/SocialGraphs";

const router = createHashRouter([
  {
    path: "/",
    element: <Wrapper />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/les-mis",
        element: <LesMis />,
      },
      {
        path: "/social-graphs",
        element: <SocialGraphs />,
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
