
import { useState, useEffect, useMemo } from "react";

// react-router components
import { Route, Switch, Redirect, useLocation, useHistory } from "react-router-dom";
import "App.css";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import 'bootstrap/dist/css/bootstrap.min.css';
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";

// Vision UI Dashboard React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Vision UI Dashboard React themes
import theme from "assets/theme";


// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";

import createCache from "@emotion/cache";
import firebase from "./firebase";

import routes from "routes";
// Vision UI Dashboard React contexts
import { setUser, useVisionUIController, setMiniSidenav, setOpenConfigurator } from "context";
export default function App() {
  const history = useHistory();

  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor,auth } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} component={route.component} key={route.key} />;
      }

      return null;
    });
  useEffect(() => {

    firebase.onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        console.log(user, "user")
        if (user.email) {
          setUser(dispatch, user)
          return;
        }
        else{
          setUser(dispatch, {});
        }

      } else {
        setUser(dispatch,{});
      }
    });

  }, [])
  useEffect(()=>{
    if(!auth.email){
      history.push("/sign-in")
    }
  },[history.location.pathname])
  useEffect(()=>{
    if(!auth.email){
      history.push("/sign-in")
    }
  },[auth])
  const configsButton = (
    <VuiBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="info"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="white"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </VuiBox>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand=""
            brandName="BEAT BOX ADMIN"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Switch>
        {getRoutes(routes)}
        <Redirect from="*" to="/admin/beatbox" />
      </Switch>
    </ThemeProvider>
  );
}
