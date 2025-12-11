import { Routes, Route } from "react-router-dom";
import Login from "./login/login";
import RegisUser from "./regis-user/regis-user";
import PasswordRecup from "./password-recup/password-recup";
import IndexForo from "./index-foro/index-foro";
import MainLayout from "./main-layout/main-layout";
import ProtectedRoute from "./components/ProtectedRoute"; 
import ForumCategories from "./category/category"; 
import CreatePost from './create-post/create-post';
import Profile from "./profile/profile";

// 🚀 IMPORTAR POST LIST
import PostList from "./post-list/post-list";

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLICAS */}
      <Route path="/" element={<Login />} />
      <Route path="/registrarte" element={<RegisUser />} />
      <Route path="/password-recup" element={<PasswordRecup />} />

      {/* PROTEGIDAS */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          {/* HOME DEL FORO */}
          <Route path="/foro" element={<IndexForo />} />

          {/* PERFIL */}
          <Route path="/main-layout/profile" element={<Profile />} />

          {/* CATEGORÍAS */}
          <Route path="/main-layout/categorias" element={<ForumCategories />} />
          <Route path="/main-layout/categorias/:id" element={<ForumCategories />} />

          {/* LISTA DE POSTS POR CATEGORÍA */}
          <Route path="/main-layout/post-list/:id" element={<PostList />} />

          {/* CREAR POST */}
          <Route path="/main-layout/create-post" element={<CreatePost />} />

        </Route>
      </Route>

    </Routes>
  );
}
