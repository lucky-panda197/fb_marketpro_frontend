import React from "react";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { useDeleteVpsMutation } from "services/apiService";
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
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";

function CustomTable({ data, isLoading, handleUpdateClick }) {
  const [deleteVps, { isLoading: isDeleteLoading }] = useDeleteVpsMutation();

  const handleDeleteClick = (id) => {
    deleteVps(id)
      .then(() => {
        ToastEmit("success", "VPS deleted successfully!");
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
              <TableCell align="center">IP</TableCell>
              <TableCell align="center">VPS Status</TableCell>
              <TableCell align="center">Facebook Account Name</TableCell>
              <TableCell align="center">Facebook Login Status</TableCell>
              <TableCell align="center">Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              data.map((vps, index) => (
                <TableRow key={vps._id} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{vps.ip}</TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 1,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        borderRadius: "4px",
                      }}
                    >
                      {vps.vps_status ? "On" : "Off"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{vps.fbaccount_name}</TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 1,
                        bgcolor: "secondary.main",
                        color: "secondary.contrastText",
                        borderRadius: "4px",
                      }}
                    >
                      {vps.fblogin_status ? "Login" : "Logout"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      variant="contained"
                      aria-label="outlined primary button group"
                    >
                      <Button
                        onClick={() => handleUpdateClick(vps)}
                        startIcon={<AiOutlineEdit />}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(vps._id)}
                        color="error"
                        startIcon={<AiFillDelete />}
                      >
                        Delete
                      </Button>
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

export default CustomTable;
