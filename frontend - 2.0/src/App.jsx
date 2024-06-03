import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { AppProvider } from "../context/AppContext";
import { AuthLayout } from "../layouts/AuthLayout";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { ForgotPassword } from "../pages/ForgotPassword";
import { HomeLayout } from "../layouts/HomeLayout";
import { Posts } from "../pages/Posts"
import { NewThought } from "../pages/NewThought";
import { Following } from "../pages/Following";
import { Likes } from "../pages/Likes";
import { Profile } from "../pages/Profile";
import { EditProfile } from "../pages/EditProfile";
import { FollowersList } from "../pages/FollowersList";
import { FollowingList } from "../pages/FollowingList";
import { Post } from "../pages/Post";

export const App = () => {
  return (
    <BrowserRouter> {/* 2 rutas principales: Login y Home - Cada una con su layout y sus subrutas */}
    	<AuthProvider> {/* Context de Autentificacion */}
         <AppProvider> {/* Context de App */}
          <Routes>
            <Route path='/' element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path='signup' element={<SignUp />} />
              <Route path='forgot-password' element={<ForgotPassword />} />
            </Route>
            <Route path='/home' element={<HomeLayout />}>
              <Route index element={<Posts />} />
              <Route path='new-thought' element={<NewThought />} />
              <Route path='following' element={<Following />} />
              <Route path='likes' element={<Likes />} />
              <Route path='profile/:id' element={<Profile />} />
              <Route path='edit-profile/:id' element={<EditProfile />} />
              <Route path="profile/followers/:id" element={<FollowersList />} />
              <Route path="profile/following/:id" element={<FollowingList />} />
              <Route path='post/:id' element={<Post />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
