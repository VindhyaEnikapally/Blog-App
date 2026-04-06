import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import AuthorProfile from "./components/AuthorProfile";
import ArticleByID from "./components/ArticleByID";
import AuthorArticles from "./components/AuthorArticles";
import WriteArticle from "./components/WriteArticle";
import { Toaster } from "react-hot-toast";
import EditArticle from "./components/EditArticleForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement:<ErrorBoundary />,
      children: [
        ,
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "user-profile",
          element: 
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserProfile />
          </ProtectedRoute>,
        },
        {
          path: "author-profile",
          element: 
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <AuthorProfile />
          </ProtectedRoute>,
          
          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
        },
        {
          path:"edit-article",
          element:<EditArticle />
        },
        {
          path:"unauthorized",
          element:<Unauthorized />
        }
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;




//<ArticleByID />
// <ArticleByID > content </ArticleByID>