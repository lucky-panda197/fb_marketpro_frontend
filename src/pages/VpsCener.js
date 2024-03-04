import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useGetAllVpssQuery,
  useAddVpsMutation,
  useUpdateVpsMutation,
} from "services/apiService";
import { CustomVpsTable, Loading, Error, CustomModal } from "components"; // Make sure these are adapted to MUI if custom
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { IoMdAddCircle, IoMdRefresh } from "react-icons/io";
import { FaRegAddressBook, FaFacebook } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function VpsCenter() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [currentVps, setCurrentVps] = React.useState({});
  const [isUpdateModal, setIsUpdateModal] = React.useState(false);
  const { data, isFetching, error, refetch } = useGetAllVpssQuery(undefined, {
    pollingInterval: parseInt(process.env.FETCH_INTERVAL) || 60000,
  });
  const { register, handleSubmit, reset } = useForm();
  const [addVps, { isLoading: isAddLoading }] = useAddVpsMutation();
  const [updateVps, { isLoading: isUpdateLoading }] = useUpdateVpsMutation();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddClick = () => {
    console.log("111");
    setIsUpdateModal(true);
    setCurrentVps({});
  };

  const handleUpdateClick = (vps) => {
    setIsUpdateModal(true);
    setCurrentVps(vps);
  };

  const handleUpdateSubmit = (data) => {
    const action = currentVps._id ? updateVps : addVps;
    action(currentVps._id ? { ...data, _id: currentVps._id } : data)
      .then(() => {
        !currentVps._id
          ? showSnackbar("VPS added successfully!", "success")
          : showSnackbar("VPS updated successfully!", "success");
        setIsUpdateModal(false);
        reset();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error, try again!", "error");
      });
  };

  const handleRefreshClick = () => {
    refetch();
  };

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    if (!isUpdateModal) {
      reset();
    }
  }, [isUpdateModal, reset]);

  if (isFetching) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <>
      <div className="flex-1 px-8">
        <h1 className="text-3xl font-bold mb-4 text-center">VPS Management</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<IoMdAddCircle />}
          onClick={handleAddClick}
          style={{ marginBottom: 20, float: "right" }}
        >
          Add
        </Button>
        <Button
          variant="contained"
          color="secondary" // Set the color to default or any other you prefer
          startIcon={<IoMdRefresh />}
          onClick={handleRefreshClick} // Use the refresh function here
        >
          Refresh
        </Button>
        <CustomVpsTable
          data={data}
          isLoading={isFetching}
          onUpdateClick={handleUpdateClick}
        />
        <CustomModal
          title={!currentVps?._id ? "Add New VPS" : "Update VPS"}
          open={isUpdateModal}
          onClose={() => setIsUpdateModal(false)}
        >
          <form onSubmit={handleSubmit(handleUpdateSubmit)} method="post">
            <input type="hidden" name="_method" value="PUT" />
            <Stack spacing={2} margin={2}>
              <TextField
                fullWidth
                required
                label="Enter IP address..."
                variant="outlined"
                {...register("ip")}
                defaultValue={currentVps.ip || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaRegAddressBook />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Enter Facebook account name..."
                variant="outlined"
                {...register("fbaccount_name")}
                defaultValue={currentVps.fbaccount_name || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaFacebook />
                    </InputAdornment>
                  ),
                }}
              />
              <div style={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isAddLoading || isUpdateLoading}
                  startIcon={
                    isAddLoading || isUpdateLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                >
                  Save VPS
                </Button>
              </div>
            </Stack>
          </form>
        </CustomModal>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default VpsCenter;
