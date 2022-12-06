/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

/** 
  All of the routes for the Vision UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Vision UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import ArtistMng from "layouts/ArtistMng";
import BannerMng from "layouts/BannerMng";
import Subscript from "layouts/Subscript";
import UserMng from "layouts/UserMng";
import SignIn from "layouts/authentication/sign-in";

// Vision UI Dashboard React icons
// import { IoRocketSharp } from "react-icons/io5";
import { IoIosDocument } from "react-icons/io";
// import { BsFillPersonFill } from "react-icons/bs";
// import { IoBuild } from "react-icons/io5";
import { BsCreditCardFill } from "react-icons/bs";
// import { IoStatsChart } from "☻react-icons/io5";
import { IoPersonCircle, IoPersonAdd } from "react-icons/io5";
// import { IoHome } from "react-☻icons/io5";

const routes = [
  {
    type: "collapse",
    name: "Artist Management",
    key: "artistMng",
    route: "/admin/artistMng",
    icon: <IoPersonAdd size="15px" color="inherit" />,
    component: ArtistMng,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Beatbox",
    key: "beatbox",
    route: "/admin/beatbox",
    icon: <BsCreditCardFill size="15px" color="inherit" />,
    component: Dashboard,
    noCollapse: true,
  },
  
  {
    type: "collapse",
    name: "User Management",
    key: "userMng",
    route: "/admin/userMng",
    icon: <IoPersonAdd size="15px" color="inherit" />,
    component: UserMng,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Subscriptions Management",
    key: "subscription",
    route: "/admin/subscriptions",
    icon: <IoPersonAdd size="15px" color="inherit" />,
    component: Subscript,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Banner Management",
    key: "subscription",
    route: "/admin/bannerMng",
    icon: <IoPersonAdd size="15px" color="inherit" />,
    component: BannerMng,
    noCollapse: true,
  },
 
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/sign-in",
    icon: <IoIosDocument size="15px" color="inherit" />,
    component: SignIn,
    noCollapse: true,
  },
 
];

export default routes;
