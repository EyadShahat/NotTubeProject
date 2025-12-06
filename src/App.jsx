import React from "react";
import { NotTubeProvider, useNotTube } from "./state/NotTubeState.jsx";

// pages
import NotTubeLogin from "./components/NotTubeLogin.jsx";
import NotTubeSignup from "./components/NotTubeSignup.jsx";
import HomePage from "./components/HomePage.jsx";
import LikedVideos from "./components/LikedVideos.jsx";
import WatchedVideos from "./components/WatchedVideos.jsx";
import SavedVideos from "./components/SavedVideos.jsx";
import ProfileSettings from "./components/ProfileSettings.jsx";
import VideoPage from "./components/VideoPage.jsx";
import ChannelPage from "./components/ChannelPage.jsx";
import UploadPage from "./components/UploadPage.jsx";
import ManageVideos from "./components/ManageVideos.jsx";
import SearchResults from "./components/SearchResults.jsx";
import ManageAppeals from "./components/ManageAppeals.jsx";
import FlagVideo from "./components/FlagVideo.jsx";
import FlagAccount from "./components/FlagAccount.jsx";
import FlagComment from "./components/FlagComment.jsx";
import MyFlags from "./components/MyFlags.jsx";

export default function App() {
  const [route, setRoute] = React.useState(parseRoute());

  React.useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <NotTubeProvider>
      <RouterContent route={route} />
    </NotTubeProvider>
  );
}

function RouterContent({ route }) {
  const { user, loading } = useNotTube();
  const authPage = route.name === "login" || route.name === "signup";

  React.useEffect(() => {
    if (!loading && !user && !authPage) {
      window.location.hash = "#/login";
    }
  }, [user, loading, authPage]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!user && authPage) {
    return route.name === "signup" ? <NotTubeSignup /> : <NotTubeLogin />;
  }

  if (!user) return <NotTubeLogin />;

  return (
    <>
      {route.name === "signup"   && <NotTubeSignup />}
      {route.name === "login"    && <NotTubeLogin />}
      {route.name === "home"     && <HomePage />}
      {route.name === "search"   && <SearchResults q={route.q} />}
      {route.name === "liked"    && <LikedVideos />}
      {route.name === "saved"    && <SavedVideos />}
      {route.name === "watched"  && <WatchedVideos />}
      {route.name === "profile"  && <ProfileSettings />}
      {route.name === "admin"     && <ManageAppeals />}
      {route.name === "admin-flag-video" && <FlagVideo />}
      {route.name === "admin-flag-account" && <FlagAccount />}
      {route.name === "admin-flag-comment" && <FlagComment />}
      {route.name === "upload"   && <UploadPage />}
      {route.name === "manage"   && <ManageVideos />}
      {route.name === "my-flags" && <MyFlags />}
      {route.name === "video"    && <VideoPage id={route.id} />}
      {route.name === "channel"  && <ChannelPage slug={route.slug} />}
    </>
  );
}

function parseRoute() {
  const h = window.location.hash || "#/login";
  const hl = h.toLowerCase();

  if (hl.startsWith("#/search")) {
    const qs = h.split("?")[1] || "";
    const params = new URLSearchParams(qs);
    return { name: "search", q: params.get("q") || "" };
  }

  if (hl.startsWith("#/signup"))  return { name: "signup" };
  if (hl.startsWith("#/home"))    return { name: "home" };
  if (hl.startsWith("#/liked"))   return { name: "liked" };
  if (hl.startsWith("#/saved"))   return { name: "saved" };
  if (hl.startsWith("#/watched")) return { name: "watched" };
  if (hl.startsWith("#/profile")) return { name: "profile" };
  if (hl.startsWith("#/upload"))  return { name: "upload" };
  if (hl.startsWith("#/manage"))  return { name: "manage" };
  if (hl.startsWith("#/my-flags")) return { name: "my-flags" };

  // Admin routes
  if (hl.startsWith("#/admin/flag-video"))   return { name: "admin-flag-video" };
  if (hl.startsWith("#/admin/flag-account")) return { name: "admin-flag-account" };
  if (hl.startsWith("#/admin/flag-comment")) return { name: "admin-flag-comment" };
  if (hl.startsWith("#/admin"))               return { name: "admin" };

  if (hl.startsWith("#/channel/")) {
    const slug = h.split("/")[2];
    return { name: "channel", slug };
  }

  if (hl.startsWith("#/video/")) {
    const id = h.split("/")[2];
    return { name: "video", id };
  }

  return { name: "login" };
}
