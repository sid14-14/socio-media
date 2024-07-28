import { Box } from "@mui/material";
import { styled } from "@mui/system";

// this will wraps our widget and give up base styling for every widget
const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem 1.5rem 0.75rem 1.5rem", //top bott left rig
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
}));

export default WidgetWrapper;
