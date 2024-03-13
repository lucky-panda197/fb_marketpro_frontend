import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useGetAllVpssQuery,
  useGetAllGroupsQuery,
  useUpdateGroupMutation,
  useAddGroupMutation,
} from "services/apiService";
import { CustomGroupTable, Loading, Error, CustomModal } from "components"; // Ensure these are adapted for MUI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import { FaRegAddressBook } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

function GroupCenter() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [currentGroup, setCurrentGroup] = React.useState({});
  const [isUpdateModal, setIsUpdateModal] = React.useState(false);
  const { data, isFetching, error } = useGetAllGroupsQuery();
  const {
    data: vpss,
    isFetching: vpsIsFetching,
    error: vpsError,
  } = useGetAllVpssQuery();
  const { register, handleSubmit, reset } = useForm();
  const [addGroup, { isLoading: isAddLoading }] = useAddGroupMutation();
  const [updateGroup, { isLoading: isUpdateLoading }] =
    useUpdateGroupMutation();
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
    setIsUpdateModal(true);
    setCurrentGroup({});
  };

  const handleUpdateClick = (group) => {
    setIsUpdateModal(true);
    setCurrentGroup(group);
  };

  const handleUpdateSubmit = (data) => {
    const action = currentGroup._id ? updateGroup : addGroup;
    action(currentGroup)
      .then(({ data }) => {
        !currentGroup._id
          ? showSnackbar("Group added successfully!", "success")
          : showSnackbar("Group updated successfully!", "success");
        setIsUpdateModal(false);
        reset();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error, try again!", "error");
      });
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

  if (isFetching || vpsIsFetching) {
    return <Loading />;
  }

  if (error || vpsError) {
    return <Error />;
  }

  const renderValue = (selected) => {
    // Map selected IDs back to their labels using the `vpss` array
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {vpss
          .filter((vps) => selected.includes(vps._id))
          .map((vps) => (
            <Chip key={vps.ip} label={vps.ip} />
          ))}
      </Box>
    );
  };

  return (
    <>
      <div style={{ padding: "32px" }}>
        <h1
          style={{
            textAlign: "center",
            margin: "0 0 16px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Group Management
        </h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<IoMdAddCircle />}
          onClick={handleAddClick}
          style={{ marginBottom: "20px", float: "right" }}
        >
          Add
        </Button>
        <CustomGroupTable
          data={data}
          isLoading={isFetching}
          onUpdateClick={handleUpdateClick}
        />
        <CustomModal
          title={!currentGroup?._id ? "Add New Group" : "Update Group"}
          open={isUpdateModal}
          onClose={() => setIsUpdateModal(false)}
        >
          <form onSubmit={handleSubmit(handleUpdateSubmit)}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                required
                label="Enter group name..."
                variant="outlined"
                {...register("name")}
                defaultValue={currentGroup?.name || ""}
                onChange={(e) =>
                  setCurrentGroup({ ...currentGroup, name: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaRegAddressBook />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth>
                <InputLabel id="vps-select-label">Select VPS</InputLabel>
                <Select
                  labelId="vps-select-label"
                  id="vps-select"
                  multiple
                  value={currentGroup?.vps_ips || []}
                  onChange={(e) =>
                    setCurrentGroup({
                      ...currentGroup,
                      vps_ips: e.target.value,
                    })
                  }
                  renderValue={renderValue}
                >
                  {vpss.map((vps) => (
                    <MenuItem key={vps._id} value={vps._id}>
                      {vps.ip}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                endIcon={
                  isAddLoading || isUpdateLoading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
              >
                Save Group
              </Button>
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

export default GroupCenter;
