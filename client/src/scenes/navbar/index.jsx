import { useState } from "react";
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery
} from "@mui/material";
import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { SetMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";


const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false); //if we want to open mobile menu when on small screen, toggle this to on/off
    const dispatch = useDispatch(); //to dispatch actions from reducers
    const navigate = useNavigate();
    const user = useSelector((state) => state.user); //to grab user info
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); //use media-query w/o using directly, this used to determine if screen mobile size

    const theme = useTheme(); //this to access our theme.js file
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const fullName =(user)?`${user.firstName} ${user.lastName}`:"";
    return (<FlexBetween padding="1rem 6%" backgroundColor={alt}> {/* reusable component which has all the prop we defined already, it also has box component, which allows us to pass any type of css property and use them as component property */}
        <FlexBetween gap="1.75rem">
            <Typography
                fontWeight="bold"
                fontSize="clamp(1rem, 2rem, 2.25rem)"

                color="primary"
                onClick={() => navigate("/home")}
                sx={{
                    // *sx: this is where we put css properties, in situation when we have to pass pseudo props*
                    "&:hover": {
                        color: primaryLight,
                        cursor: "pointer",
                    },
                }}

            >
                {/*clamp is a func in css which does (min_val, preffered_val, max_val) for font */}
                Sociopedia
            </Typography>

            {isNonMobileScreens && (
                // if its a mobile screen we not going to show it
                <FlexBetween
                    backgroundColor={neutralLight}
                    borderRadius="9px"
                    gap="3rem"
                    padding="0.1rem 1.5rem"
                >
                    <InputBase placeholder="Search..." />
                    <IconButton>
                        <Search />
                    </IconButton>
                </FlexBetween>
            )}
        </FlexBetween>
        {/* DESKTOP NAV */}
        {isNonMobileScreens ? (
            <FlexBetween gap="2rem">
                <IconButton onClick={() => dispatch(SetMode())}>
                    {/* button for our light and dark mode, dispatvh of the action will change the mode, using eredux to flip switch light<->dark */}
                    {/* font size represents size of icon here */}
                    {theme.palette.mode === "dark" ? (
                        <DarkMode sx={{ fontSize: "25px" }} />
                    ) : (
                        <LightMode sx={{ color: dark, fontSize: "25px" }} />

                    )}
                </IconButton>
                <Message sx={{ fontSize: "25px" }} />
                <Notifications sx={{ fontSize: "25px" }} />
                <Help sx={{ fontSize: "25px" }} />
                <FormControl variant="standard">
                    <Select
                        value={fullName}
                        sx={{
                            backgroundColor: neutralLight,
                            width: "150px",
                            borderRadius: "0.25rem",
                            p: "0.25rem 1rem",
                            // "topbott leftright"
                            "& .MuiSvgIcon-root": {
                                //select within css class, target specific class name
                                pr: "0.25rem",
                                width: "3rem",

                            },
                            "& .MuiSelect-select:focus": {
                                //select within css class, target specific class name
                                backgroundColor: neutralLight
                            }
                        }}
                        input={<InputBase />}
                    >
                        <MenuItem value={fullName}>
                            {/* this not actually like select component where we selecting from drop-down, we just have a btn for logout here*/}
                            <Typography>{fullName}</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                    </Select>
                </FormControl>

                {/* drop-down for login/logout btn*/}
            </FlexBetween>
        ) : (
            <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
                <Menu />
                {/* this is gonna pop up as icon in menu in small screens */}
            </IconButton>)}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
            <Box
                position="fixed"
                right="0"
                bottom="0"
                height="100%"
                zIndex="10"
                maxWidth="500px"
                minWidth="300px"
                backgroundColor={background}
            >
                {/* CLOSE ICON */}
                <Box display="flex" justifyContent="flex-end" p="1rem">
                    <IconButton
                        onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    >
                        <Close />
                    </IconButton>
                </Box>

                {/* MENU ITEMS */}
                <FlexBetween display="flex" flexDirection="column" justifyContent="center" gap="3rem">
                    <IconButton onClick={() => dispatch(SetMode())} sx={{ fontSize: "25px" }}
                        >
                        {/* button for our light and dark mode, dispatvh of the action will change the mode, using eredux to flip switch light<->dark */}
                        {/* font size represents size of icon here */}
                        {theme.palette.mode === "dark" ? (
                            <DarkMode sx={{ fontSize: "25px" }} />
                        ) : (
                            <LightMode sx={{ color: dark, fontSize: "25px" }} />

                        )}
                    </IconButton>
                    <Message sx={{ fontSize: "25px" }} />
                    <Notifications sx={{ fontSize: "25px" }} />
                    <Help sx={{ fontSize: "25px" }} />
                    <FormControl variant="standard">
                        <Select
                            value={fullName}
                            sx={{
                                backgroundColor: neutralLight,
                                width: "150px",
                                borderRadius: "0.25rem",
                                p: "0.25rem 1rem",
                                // "topbott leftright"
                                "& .MuiSvgIcon-root": {
                                    //select within css class, target specific class name
                                    pr: "0.25rem",
                                    width: "3rem",

                                },
                                "& .MuiSelect-select:focus": {
                                    //select within css class, target specific class name
                                    backgroundColor: neutralLight
                                }
                            }}
                            input={<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                {/* this not actually like select component where we selecting from drop-down, we just have a btn for logout here*/}
                                <Typography>{fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                        </Select>
                    </FormControl>

                    {/* drop-down for login/logout btn*/}
                </FlexBetween>
            </Box>
        )}
    </FlexBetween >
    );
};

export default Navbar;