import { Grid, Stack } from "@mui/material";
import UserInfo from "../components/UserInfo";
import BackButton from "../components/BackButton";

const AccountPage = () => {
  return (
    <Grid container direction="column" mt={10}>
      <Grid container ml={4} mb={4}>
        <BackButton />
      </Grid>
      <Grid item container>
        <Stack sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <UserInfo />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AccountPage;
