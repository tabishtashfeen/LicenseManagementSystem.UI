import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import api from "./Services/api";

const SignIn = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    tempErrors.loginEmail = loginEmail ? "" : "Email is required";
    tempErrors.loginPassword = loginPassword ? "" : "Password is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (validate()) {
      const newUser = {
        email: loginEmail,
        password: loginPassword,
      };
      try {
        const res = await api.post(`/Auth/AuthenticateUser`, newUser);
        if (res.data.success) {
          localStorage.setItem("token", JSON.stringify(res.data.result.token));
          localStorage.setItem(
            "userData",
            JSON.stringify(res.data.result.userData)
          );
          localStorage.setItem(
            "role",
            JSON.stringify(res.data.result.userData.role)
          );
          localStorage.setItem(
            "id",
            JSON.stringify(res.data.result.userData.id)
          );
          setToken(res.data.result.token);
          if (token) {
            window.location = "home";
          }
        } else {
          console.error(res.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (token) {
      window.location = "home";
    }
  }, [token]);

  return (
    <>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            License Management System
          </a>
        </div>
      </nav>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={handleChange} noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Enter Your Email"
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setErrors({ ...errors, loginEmail: "" });
                  }}
                  error={!!errors.loginEmail}
                  helperText={errors.loginEmail}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setErrors({ ...errors, loginPassword: "" });
                  }}
                  autoComplete="current-password"
                  error={!!errors.loginPassword}
                  helperText={errors.loginPassword}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Grid container>
              <Grid item>
                <Link href="signUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
};

export default SignIn;
