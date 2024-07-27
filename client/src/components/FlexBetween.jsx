import { Box } from "@mui/material";
import styled from "@emotion/styled";

const FlexBetween = styled(Box)({ //this is reusable style components, for css
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

export default FlexBetween;