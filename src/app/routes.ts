import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Hero } from "./components/Hero";
import { UnboxingExperience } from "./components/UnboxingExperience";
import { LandingPage } from "./components/LandingPage";
import { CollectionBrowsePage } from "./components/CollectionBrowsePage";
import { ContactPage } from "./components/ContactPage";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: LandingPage },
      { path: "collection", Component: CollectionBrowsePage },
      { path: "contact", Component: ContactPage },
      { path: "hero", Component: Hero },
      { path: "product/:id", Component: UnboxingExperience },
      { path: "landing", Component: LandingPage }, // Redirect /landing to LandingPage
      { path: "*", Component: NotFound }, // Catch all other routes
    ],
  },
]);