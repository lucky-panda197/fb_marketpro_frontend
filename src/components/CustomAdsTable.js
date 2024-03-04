import React from "react";
import moment from "moment";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { VscDebugStart } from "react-icons/vsc";
import { useDeleteAdsMutation, useRemoveAssignGroupMutation } from "services/apiService";
import { Loading } from "components"; // Ensure this is adapted for MUI
import { Toast, ToastEmit } from "utils/flashMessages"; // Adjust for MUI or ensure compatibility
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

function CustomAdsTable({ data, isLoading, onUpdateClick, onStartClick }) {
  const [deleteAds, { isLoading: isDeleteLoading }] = useDeleteAdsMutation();
  const [removeAssignGroup] = useRemoveAssignGroupMutation();

  const handleDeleteClick = (ads) => {
    deleteAds(ads._id)
      .then(() => {
        ToastEmit("success", "Ads deleted successfully!");
        removeAssignGroup({ _id: ads.assigned_group._id, ad: ads._id })

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
              {/* <TableCell align="center">No</TableCell> */}
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Content</TableCell>
              <TableCell align="center">Images</TableCell>
              <TableCell align="center">Assigned Group</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              data.map((ads, index) => (
                <TableRow key={ads._id} hover>
                  {/* <TableCell align="center">{index + 1}</TableCell> */}
                  <TableCell align="center">{ads?.title}</TableCell>
                  <TableCell align="center">{ads?.description.slice(0, 150)}...</TableCell>
                  <TableCell
                    align="center"
                  >
                    {/* {" "} */}
                    {/* {ads?.images.map((path, index) => ( */}
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${ads?.images[0]}`}
                      alt={`img-${ads?.title}`}
                      style={{
                        width: "50px",
                        height: "auto",
                      }}
                    />
                    {/* ))} */}
                  </TableCell>
                  <TableCell align="center">
                    {ads?.assigned_group?.name}
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 1,
                        bgcolor: `${ads?.posted === "NEW" ? "green.darker" : ads?.posted === "PENDING" ? "yellow.dark" : "gray.main"}`,
                        color: "primary.contrastText",
                        borderRadius: "4px",
                      }}
                    >
                      {ads?.posted || "NEW"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {moment(ads?.created_at).format("YYYY-MM-DD hh:mm:ss a")}
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      variant="contained"
                      aria-label="outlined primary button group"
                    >
                      <IconButton
                        variant="contained"
                        color="success"
                        title="Start Post Advertise"
                        onClick={() => onStartClick(ads)}
                      >
                        <VscDebugStart />
                      </IconButton>

                      <IconButton
                        variant="contained"
                        title="Edit"
                        onClick={() => onUpdateClick(ads)}
                      >
                        <AiOutlineEdit />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        title="Delete"
                        onClick={() => handleDeleteClick(ads)}
                        color="error"
                      >
                        <AiFillDelete />
                      </IconButton>
                    </ButtonGroup>
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
