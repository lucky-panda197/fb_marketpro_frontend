import React from "react";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { useDeleteGroupMutation } from "services/apiService";
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
import Box from "@mui/material/Box";

function CustomGroupTable({ data, isLoading, onUpdateClick }) {
  const [deleteGroup, { isLoading: isDeleteLoading }] =
    useDeleteGroupMutation();

  const handleDeleteClick = (id) => {
    deleteGroup(id)
      .then(() => {
        ToastEmit("success", "Group deleted successfully!");
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
              <TableCell align="center">Group Name</TableCell>
              <TableCell align="center">VPS IPs</TableCell>
              <TableCell align="center">Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              data.map((group, index) => (
                <TableRow key={group._id} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{group.name}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      {group.vps_ips.map((vps) => (
                        <Typography
                          key={vps._id}
                          sx={{
                            bgcolor: "primary.dark",
                            color: "white",
                            borderRadius: 1,
                            padding: "4px 8px",
                            margin: "2px",
                            display: "inline-block",
                          }}
                        >
                          {vps.ip}
                        </Typography>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      variant="contained"
                      aria-label="outlined primary button group"
                    >
                      <Button
                        onClick={() => {
                          const vpsArray = group.vps_ips.map((vps) => vps._id);
                          onUpdateClick({ ...group, vps_ips: vpsArray });
                        }}
                        startIcon={<AiOutlineEdit />}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(group._id)}
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

export default CustomGroupTable;
