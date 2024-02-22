import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useGetAllGroupsQuery,
  useGetAllAdssQuery,
  useAddAdsMutation,
  useUpdateAdsMutation,
} from "services/apiService";
import { CustomAdsTable, Loading, Error, CustomModal } from "components"; // Make sure these are adapted to MUI if custom
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { IoMdAddCircle } from "react-icons/io";
import { MdOutlineTitle, MdOutlineDescription } from "react-icons/md";
import Snackbar from "@mui/material/Snackbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import { DropzoneArea } from "material-ui-dropzone";
import OpenAI from "openai";

const generateAdContent = async () => {
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // This is also the default, can be omitted
    dangerouslyAllowBrowser: true,
  });

  console.log(process.env.REACT_APP_OPENAI_API_KEY);
  console.log("openai", openai);

  try {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: "This story begins",
      max_tokens: 30,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating ad content:", error);
    return "Failed to generate ad content.";
  }
};

function AdsCenter() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [currentAds, setCurrentAds] = React.useState({});
  const [isUpdateModal, setIsUpdateModal] = React.useState(false);
  const { data, isFetching, error } = useGetAllAdssQuery();
  const {
    data: groups,
    isFetching: groupIsFetching,
    error: groupError,
  } = useGetAllGroupsQuery();
  const { register, handleSubmit, reset } = useForm();
  const [addAds, { isLoading: isAddLoading }] = useAddAdsMutation();
  const [updateAds, { isLoading: isUpdateLoading }] = useUpdateAdsMutation();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [images, setImages] = React.useState([]);
  const [adContent, setAdContent] = React.useState("");

  const handleGenerateContent = async () => {
    const content = await generateAdContent();
    setAdContent(content);
  };

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
    setCurrentAds({});
  };

  const handleUpdateClick = (Ads) => {
    setIsUpdateModal(true);
    setCurrentAds(Ads);
  };

  const handleUpdateSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    images.forEach((image) => formData.append("images", image));
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    const action = currentAds._id ? updateAds : addAds;

    action(currentAds._id ? { formData, _id: currentAds._id } : formData)
      .then(() => {
        !currentAds._id
          ? showSnackbar("Advertisement added successfully!", "success")
          : showSnackbar("Advertisements updated successfully!", "success");
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

  if (isFetching || groupIsFetching) {
    return <Loading />;
  }

  if (error || groupError) {
    return <Error />;
  }

  return (
    <>
      <div className="flex-1 px-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Advertise Management
        </h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<IoMdAddCircle />}
          onClick={handleAddClick}
          style={{ marginBottom: 20, float: "right" }}
        >
          Add
        </Button>
        <CustomAdsTable
          data={data}
          isLoading={isFetching}
          handleUpdateClick={handleUpdateClick}
        />
        <div>
          <button onClick={handleGenerateContent}>Generate Ad Content</button>
          <p>{adContent}</p>
        </div>
        <CustomModal
          title={!currentAds?._id ? "Add New Advertise" : "Update Advertise"}
          size="lg"
          open={isUpdateModal}
          onClose={() => setIsUpdateModal(false)}
        >
          <form onSubmit={handleSubmit(handleUpdateSubmit)} method="post">
            <input type="hidden" name="_method" value="PUT" />
            <Stack spacing={2} margin={2}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="group-select-label">Select Group</InputLabel>
                <Select
                  labelId="group-select-label"
                  required
                  id="group-select"
                  defaultValue={currentAds?.assigned_group?._id || ""}
                  {...register("assigned_group")}
                >
                  {groups.map((group) => (
                    <MenuItem key={group._id} value={group._id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                required
                label="Enter Title..."
                variant="outlined"
                {...register("title")}
                defaultValue={currentAds.title || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdOutlineTitle />
                    </InputAdornment>
                  ),
                }}
              />
              <DropzoneArea
                acceptedFiles={["image/*"]}
                filesLimit={parseInt(20)}
                dropzoneText={"Select your images"}
                onChange={(files) => setImages(files)}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Enter Description..."
                variant="outlined"
                {...register("description")}
                defaultValue={currentAds.description || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdOutlineDescription />
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
                  Save
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

export default AdsCenter;
