import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useAddCommentMutation,
  useGetAllGroupsQuery,
  useGetAllAdssQuery,
  useAddAdsMutation,
  useUpdateAdsMutation,
  usePostAdsMutation,
  useAssignGroupMutation,
  useRemoveAssignGroupMutation,
} from "services/apiService";
import { CustomAdsTable, Loading, Error, CustomModal } from "components"; // Make sure these are adapted to MUI if custom
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { IoMdAddCircle } from "react-icons/io";
import { MdOutlineTitle, MdOutlineDescription } from "react-icons/md";
import Snackbar from "@mui/material/Snackbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import { DropzoneArea } from "material-ui-dropzone";
import OpenAI from "openai";

const generateAdContent = async ({ title, description }) => {
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // This is also the default, can be omitted
    dangerouslyAllowBrowser: true,
  });

  // const openaiSecond = new OpenAI({
  //   apiKey: process.env.REACT_APP_OPENAI_API_KEY_SECOND, // This is also the default, can be omitted
  //   dangerouslyAllowBrowser: true,
  // });

  // const openaiThird = new OpenAI({
  //   apiKey: process.env.REACT_APP_OPENAI_API_KEY_THIRD, // This is also the default, can be omitted
  //   dangerouslyAllowBrowser: true,
  // });

  // const openaiFourth = new OpenAI({
  //   apiKey: process.env.REACT_APP_OPENAI_API_KEY_FOURTH, // This is also the default, can be omitted
  //   dangerouslyAllowBrowser: true,
  // });

  let messages = { content: "", comments: [] };

  try {
    const content = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `create impressive and fashion advertise content for this title - ${title} and here's the reference - ${description}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    messages.content = content.choices[0]?.message.content?.trim() || "";
    // const comment1 = await openaiSecond.chat.completions.create({
    //   messages: [
    //     {
    //       role: "user", content: `create positive comments with 10 - 20 words for the advertise having this title - ${title} and this content - ${description}`
    //     },],
    //   model: "gpt-3.5-turbo",
    // });
    // messages.comments.push({ comment: comment1.choices[0]?.message.content?.trim() || "" });
    // await new Promise(resolve => setTimeout(resolve, 40000));
    // const comment2 = await openaiThird.chat.completions.create({
    //   messages: [
    //     {
    //       role: "user", content: `create positive comments with 10 - 20 words for the advertise having this title - ${title} and this content - ${description}`
    //     },],
    //   model: "gpt-3.5-turbo",
    // });
    // messages.comments.push({ comment: comment2.choices[0]?.message.content?.trim() || "" });

    // const comment3 = await openaiFourth.chat.completions.create({
    //   messages: [
    //     {
    //       role: "user", content: `create positive comments with 10 - 20 words for the advertise having this title - ${title} and this content - ${description}`
    //     },],
    //   model: "gpt-3.5-turbo",
    // });
    // messages.comments.push({ comment: comment3.choices[0]?.message.content?.trim() || "" });
    return messages;
  } catch (error) {
    console.error("Error generating ad content:", error);
    return "Failed to generate ad content.";
  }
};

const generateAdComment = async ({ title, description }) => {
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // This is also the default, can be omitted
    dangerouslyAllowBrowser: true,
  });

  try {
    const content = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `create positive comment with less than 10 words for this advertisement content - title:${title};  content:${description}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    return content.choices[0]?.message.content?.trim() || "";
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
    isFetching: groupsIsFetching,
    error: groupsError,
  } = useGetAllGroupsQuery();
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [addAds, { isLoading: isAddLoading }] = useAddAdsMutation();
  const [addComment] = useAddCommentMutation();
  const [updateAds, { isLoading: isUpdateLoading }] = useUpdateAdsMutation();
  const [postAds] = usePostAdsMutation();
  const [assignGroup] = useAssignGroupMutation();
  const [removeAssignGroup] = useRemoveAssignGroupMutation();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [images, setImages] = React.useState([]);

  const handleClickGenerate = async () => {
    const messages = await generateAdContent({
      title: watch("title"),
      description: watch("descriptoin"),
    });
    setValue("description", messages.content);
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

  const handleStartClick = async (Ads) => {
    console.log(Ads);
    const earliestVps = Ads.assigned_group.vps_ips.reduce((a, b) =>
      new Date(a.posted_at) < new Date(b.posted_at) ? a : b
    );
    console.log("vpsforpost", earliestVps);
    const commentVpss = Ads.assigned_group.vps_ips.filter(
      (vps) => vps !== earliestVps
    );
    console.log("commentvps", commentVpss);

    try {
      // Mark the ad as pending using the earliest VPS
      await postAds({
        _id: Ads._id,
        posted: "PENDING",
        postVps: earliestVps._id,
      });
      showSnackbar("Start Advertising!");

      const comments = [];
      for (const vps of commentVpss) {
        // Generate and store comments for the ad using the remaining VPSs
        const comment = await generateAdComment({
          title: Ads.title,
          description: Ads.description,
        });
        comments.push({ ads: Ads._id, comment, vps: vps._id });

        // Wait for 20 seconds before proceeding to the next VPS
        await new Promise((resolve) => setTimeout(resolve, 20000));
      }
      console.log("comments", comments);
      for (const comment of comments) {
        try {
          await addComment(comment); // Add each comment to the database
        } catch (err) {
          console.log(err); // Handle individual comment addition errors
        }
      }
    } catch (err) {
      // Log and show error if the ad posting or comment generation fails
      console.log(err);
      showSnackbar("Error, try again!", "error");
    }
    // postAds({ _id: Ads._id, posted: "PENDING", postVps: earliestVps._id })
    //   .then(async () => {
    //     showSnackbar("Start Advertising!");

    //     const comments = [];
    //     for (const vps of commentVpss) {
    //       const comment = await generateAdComment({
    //         title: Ads.title,
    //         description: Ads.content,
    //       });
    //       comments.push({ ads: Ads._id, comment, vps: vps._id });
    //       await new Promise((resolve) => setTimeout(resolve, 20000));
    //     }
    //     console.log("comments", comments);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     showSnackbar("Error, try again!", "error");
    //   });
  };

  const handleUpdateSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    // formData.append("comments", JSON.stringify(comments));
    images.forEach((image) => formData.append("images", image));
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${JSON.stringify(value)})`);
    }
    if (currentAds._id && currentAds.assigned_group) {
      removeAssignGroup({
        _id: currentAds.assigned_group._id,
        ad: currentAds._id,
      });
    }
    const action = currentAds._id ? updateAds : addAds;

    action(currentAds._id ? { formData, _id: currentAds._id } : formData)
      .then(({ data }) => {
        !currentAds._id
          ? showSnackbar("Advertisement added successfully!", "success")
          : showSnackbar("Advertisements updated successfully!", "success");
        console.log("response", data);
        assignGroup({ _id: data?.ad.assigned_group, ad: data?.ad._id });
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

  if (isFetching || groupsIsFetching) {
    return <Loading />;
  }

  if (error || groupsError) {
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
          onUpdateClick={handleUpdateClick}
          onStartClick={handleStartClick}
        />
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
                label="Enter Content..."
                variant="outlined"
                {...register("description")}
                defaultValue={currentAds.description || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdOutlineDescription />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      title="Generate content"
                      sx={{ cursor: "pointer" }}
                      position="end"
                    >
                      <AutoFixHighIcon onClick={handleClickGenerate} />
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
