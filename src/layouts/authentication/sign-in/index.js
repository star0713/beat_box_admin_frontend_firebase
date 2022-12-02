import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import GradientBorder from "examples/GradientBorder";
// Vision UI Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
// Images
import bgSignIn from "assets/images/signInImage.png";
import firebase from "firebase";
import { useVisionUIController } from "context";

function SignIn() {
  const history = useHistory();
  const [controller,] = useVisionUIController();
  const { auth } = controller;
  const [form, setForm] = useState({
    email: "",
    password: "",
  })


  useEffect(() => {
    if (auth.email) {
      history.push("/")
    }
  }, [auth])


  const handleSignIn = (e) => {
    firebase.signIn(form.email, form.password);
  }


  const InputChange = (e) => {
    let _form = { ...form };
    _form[e.target.type] = e.target.value;
    setForm(_form);
  }

  return (
    <CoverLayout
      title="Nice to see you!"
      color="white"
      description="Enter your email and password to sign in"
      premotto="INSPIRED BY THE FUTURE:"
      motto="BEAT BOX ADMIN DASHBOARD"
      image={bgSignIn}
    >
      <VuiBox component="form" role="form">
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Email
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            padding="1px"
            borderRadius={borders.borderRadius.lg}
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput type="email" value={form.email} onChange={InputChange} placeholder="Your email..." fontWeight="500" />
          </GradientBorder>
        </VuiBox>
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Password
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            borderRadius={borders.borderRadius.lg}
            padding="1px"
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput

              type="password"
              value={form.password}
              placeholder="Your password..."
              onChange={InputChange}
              sx={({ typography: { size } }) => ({
                fontSize: size.sm,
              })}
            />
          </GradientBorder>
        </VuiBox>

        <VuiBox mt={4} mb={1}>
          <VuiButton color="info" fullWidth onClick={handleSignIn}>
            SIGN IN
          </VuiButton>
        </VuiBox>

      </VuiBox>
    </CoverLayout>
  );
}

export default SignIn;
