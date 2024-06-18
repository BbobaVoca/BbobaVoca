import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotFound from "./components/NotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VocaPage from "./pages/VocaPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <NotFound />,
      children: [
        {
          path: "", // 기본 시작 페이지는 빈 문자열 경로 ("/")로 설정
          element: <Home />, // "Home" 페이지 연결
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "/:category/:description",
          element: <VocaPage />,
        },
      ],
    },
  ]);
  
  export default router;