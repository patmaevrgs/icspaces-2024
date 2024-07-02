import { Button, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const BackButton = () => {
  return (
    <Button
      startIcon={<ArrowBackIosIcon />}
      style={{ color: "grey", backgroundColor: "#f0f0f0" }}
      variant="contained"
      onClick={() => window.history.back()}
    >
      <Typography>Back</Typography>
    </Button>
  );
};

export default BackButton;
