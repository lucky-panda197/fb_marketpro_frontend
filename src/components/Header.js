import React from "react";
import { useForm } from "react-hook-form";
import { useAddPostMutation } from "services/apiService";
import Navbar from "./Navbar";
import CustomModal from "components/CustomModal"; // Ensure CustomModal is adapted to use MUI if it's a custom component
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import { MdTitle } from "react-icons/md";
import { BiImage } from "react-icons/bi";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const Header = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isOpen, setIsOpen] = React.useState(false);
  const [addPost, { isLoading }] = useAddPostMutation();

  const onSubmit = (data) => {
    addPost(data)
      .then(() => {
        reset();
        setIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="flex flex-shrink-0 justify-between items-center py-2 px-8 shadow-lg sticky top-0 z-50 bg-white mb-8 outline-none">
        <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
      </div>
      <CustomModal
        modalIsOpen={isOpen}
        setIsOpen={setIsOpen}
        modalTitle="Add a new post!"
      >
        <form onSubmit={handleSubmit(onSubmit)} method="post">
          <input type="hidden" name="_method" value="PUT" />
          <Box sx={{ "& .MuiTextField-root": { m: 1 } }}>
            <TextField
              fullWidth
              type="text"
              label="Enter image url..."
              name="image"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BiImage />
                  </InputAdornment>
                ),
              }}
              {...register("image")}
            />
            <TextField
              fullWidth
              type="text"
              label="Enter title..."
              name="title"
              required
              inputProps={{ minLength: 3, maxLength: 255 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdTitle />
                  </InputAdornment>
                ),
              }}
              {...register("title")}
            />
            <TextareaAutosize
              minRows={3}
              placeholder="Enter content..."
              style={{ width: "98.5%", margin: "8px" }}
              {...register("content")}
            />
            <TextField
              select
              fullWidth
              label="Select your post tag"
              name="tag"
              defaultValue=""
              {...register("tag")}
            >
              <MenuItem value="design">Design</MenuItem>
              <MenuItem value="web">Web Development</MenuItem>
              <MenuItem value="mobile">Mobile Development</MenuItem>
              <MenuItem value="general">General</MenuItem>
            </TextField>
            <Box textAlign="right" sx={{ m: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Share Post"}
              </Button>
            </Box>
          </Box>
        </form>
      </CustomModal>
    </>
  );
};

export default Header;
