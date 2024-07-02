import { Typography } from "@mui/material";
import { Stack, Box } from "@mui/material";

import AccountManage from "../../components/AccountManage";
import React from "react";
const AccountsPage_Admin = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={3}
    >
      <AccountManage />
    </Box>
  );
};

export default AccountsPage_Admin;
