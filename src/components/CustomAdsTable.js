import React from "react";
import moment from "moment";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { VscDebugStart } from "react-icons/vsc";
import { useDeleteAdsMutation } from "services/apiService";
import { Loading } from "components"; // Ensure this is adapted for MUI
import { Toast, ToastEmit } from "utils/flashMessages"; // Adjust for MUI or ensure compatibility
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

function CustomAdsTable({ data, isLoading, handleUpdateClick }) {
  const [deleteAds, { isLoading: isDeleteLoading }] = useDeleteAdsMutation();

  const handleDeleteClick = (id) => {
    deleteAds(id)
      .then(() => {
        ToastEmit("success", "Ads deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (isDeleteLoading) {
    return <Loading />;
  }

  return (
    <>
      <Toast />
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Images</TableCell>
              <TableCell align="center">Assigned Group</TableCell>
              <TableCell align="center">Post Id</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              data.map((ads, index) => (
                <TableRow key={ads._id} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{ads?.title}</TableCell>
                  <TableCell align="center">{ads?.description}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {" "}
                    {ads?.images.map((path, index) => (
                      <img
                        key={index}
                        src={`${process.env.REACT_APP_API_URL}/${path}`}
                        alt={`img-${index}`}
                        style={{
                          width: "50px",
                          height: "auto",
                          marginRight: "5px",
                        }}
                      />
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    {ads?.assigned_group?.name}
                  </TableCell>
                  <TableCell align="center">{ads?.post_id}</TableCell>
                  <TableCell align="center">
                    {moment(ads?.created_at).format("YYYY-MM-DD hh:mm:ss a")}
                  </TableCell>
                  <TableCell align="center">
                    {/* <ButtonGroup
                      variant="contained"
                      aria-label="outlined primary button group"
                    > */}
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateClick(ads)}
                      startIcon={<VscDebugStart />}
                    >
                      Start
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateClick(ads)}
                      startIcon={<AiOutlineEdit />}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteClick(ads._id)}
                      color="error"
                      startIcon={<AiFillDelete />}
                    >
                      Delete
                    </Button>
                    {/* </ButtonGroup> */}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CustomAdsTable;
