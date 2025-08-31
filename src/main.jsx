import { StrictMode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./Styles/theme";
import store from './store/store.js'
import { Provider } from "react-redux";
import React from 'react';
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import HomePage from './Pages/HomePage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import SignupPage from './Pages/SignupPage.jsx';
import ShopPage from './Pages/ShopPage.jsx';
import ContactPage from './Pages/ContactPage.jsx';
import AboutusPage from './Pages/AboutusPage.jsx';
import WishlistPage from './Pages/WishlistPage.jsx';
import CartPage from './Pages/CartPage.jsx';
import ProductDetail from './Pages/ProductDetail.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import OrderConfirmation from './Pages/OrderConfirmation.jsx';
import OrderDetailsPage from './Pages/OrderDetailsPage.jsx';
import { Addresses, AuthLayout, Coupons, DeleteAccount, Privacy, ProfileDetails, SavedCards, SavedUpi, Terms, OrderHistory } from './Components/index.js';
import OrderFailed from "./Pages/OrderFailed.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <SignupPage />
          </AuthLayout>
        ),
      },
      { path: "/shop", element: <ShopPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/aboutUs", element: <AboutusPage /> },
      { path: "/product/:id", element: <ProductDetail /> },
      {
        path: "/wishlist",
        element: (
          <AuthLayout authentication>
            <WishlistPage />
          </AuthLayout>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication>
            <ProfilePage />
          </AuthLayout>
        ),
        children: [
          { index: true, element: <ProfileDetails /> }, // default is profile details
          { path: "addresses", element: <Addresses /> },
          { path: "orders", element: <OrderHistory /> },
          { path: "coupons", element: <Coupons /> },
          { path: "cards", element: <SavedCards /> },
          { path: "upi", element: <SavedUpi /> },
          { path: "delete", element: <DeleteAccount /> },
          { path: "terms", element: <Terms /> },
          { path: "privacy", element: <Privacy /> }
        ]
      },
      {
        path: "/cart",
        element: (
          // <AuthLayout authentication>
            <CartPage />
          // </AuthLayout>
        ),
      },
      { path: "/order-confirmation/:orderId", element: <OrderConfirmation /> },
      { path: "/order-failed/:orderId", element: <OrderFailed /> },
      { path: "/orders/:orderId", element: <OrderDetailsPage /> }
    ],
  },
]);


const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
} else {
  console.error("Root Element Not Found!");
}
