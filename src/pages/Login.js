import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { authLoginUser } from "features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import { HiOutlineMail } from "react-icons/hi";
import { AiOutlineLock } from "react-icons/ai";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const { isLoading, isAuthenticated, error } = useSelector(
    (state) => state.auth
  );

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("info"); // Can be "error", "warning", "info", "success"

  const handleSnackbarOpen = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const onSubmit = (data) => {
    dispatch(authLoginUser(data));
    reset();
  };

  //   React.useEffect(() => {
  //     if (error) {
  //       ToastEmit("error", error);
  //     }

  //     if (isAuthenticated) {
  //       ToastEmit("success", "Successfully Logged In!");
  //       navigate("/vps");
  //     }
  //   }, [error, isAuthenticated, navigate]);

  React.useEffect(() => {
    if (error) {
      handleSnackbarOpen(error, "error");
    }

    if (isAuthenticated) {
      handleSnackbarOpen("Successfully Logged In!", "success");
      navigate("/vps");
    }
  }, [error, isAuthenticated, navigate]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Box
          sx={{
            width: 500,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Blogify Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                type="email"
                label="Email Address"
                variant="outlined"
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HiOutlineMail />
                    </InputAdornment>
                  ),
                }}
                {...register("email")}
              />
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                required
                inputProps={{ minLength: 6 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AiOutlineLock />
                    </InputAdornment>
                  ),
                }}
                {...register("password")}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  endIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {isLoading ? "Loading" : "Login"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;
