import { useState } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // particular icon
import { Formik } from "formik"; //forming lib
import * as yup from "yup"; //validation lib
import { useNavigate } from "react-router-dom"; //to navigate when they register
import { useDispatch } from "react-redux"; //to store user-info
import { setLogin } from "state";
import Dropzone from "react-dropzone"; //for user to add an image
import FlexBetween from "components/FlexBetween";

//yup validation schema, determines shape of how formik lib gona save info

const registerSchema = yup.object().shape({ //to validate what info user enters is correctly
	firstName: yup.string().required("required"),
	lastName: yup.string().required("required"),
	email: yup.string().email("invalid email").required("required"),
	password: yup.string().required("required"),
	location: yup.string().required("required"),
	occupation: yup.string().required("required"),
	picture: yup.string().required("required"),
})

const loginSchema = yup.object().shape({
	email: yup.string().email("invalid email").required("required"),
	password: yup.string().required("required"),
})

const initialValuesRegister = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	location: "",
	occupation: "",
	picture: "",
}

const initialValuesLogin = {
	email: "",
	password: "",
}

const Form = () => {
	//depending on pagetype whether its login/register
	const [pageType, setPageType] = useState("login");
	const { palette } = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isNonMobile = useMediaQuery("(min-width:600px");
	const isLogin = pageType === "login";
	const isRegister = pageType === "register";

	const register = async (values, onSubmitProps)=>{
		//we create somthing with form data, values avail as para, we can use it and pass into req body. but as we have pic imag we have to use formdata
		const FormData = new FormData(); //allows to send form info w image
		for( let value in values){
			FormData.append(value, values[value])
		}
		FormData.append('picturePath', values.picture.name) //adding the img manually

		const savedUserResponse = await fetch( //save whatever recieved from back-end
			"http://localhost:3001/auth/register",
			{
				method: "POST",
				body: FormData,
			}
		);
		const savedUser = await savedUserResponse.json();
		onsubmit.resetForm();

		if(savedUser){
			setPageType("login");
		}
		
	};

	const login = async (values, onSubmitProps) =>{
		const LoggedInResponse = await fetch( //save whatever recieved from back-end
			"http://localhost:3001/auth/login",
			{
				method: "POST",
				header: {"Content-Type": "applicaion/json"},
				body: JSON.stringify(values),
			}
		);
		const loggedIn = await LoggedInResponse.json();
		onsubmit.resetForm();

		if(loggedIn){
			dispatch(
				setLogin({ //this coming from our redux
					user: loggedIn.user,
					token: loggedIn.token
				})
			);
			navigate("/home");
		}
	};

	const handleFormSubmit = async (values, onSubmitProps) => {
		if(isLogin) await login(values, onSubmitProps); //if on login page run this func
		if(isRegister) await register(values, onSubmitProps);
	};

		return (
			<Formik onSubmit={handleFormSubmit} initialValues={isLogin ? initialValuesLogin : initialValuesRegister} validationSchema={isLogin ? loginSchema : registerSchema}
			>
				{({
					values,
					errors,
					touched,
					handleBlur,
					handleChange,
					handleSubmit,
					setFieldValue,
					resetForm,
				}) => (
					<form onSubmit={handleSubmit}>
						<Box
							display="grid"
							gap="30px"
							gridTemplateColumns="repeat(4, minmax(0,1fr))" //we splitting our grid into four sections, min it gonna be zero else equal fractions of 4
							sx={{
								"&>div": { gridColumn: isNonMobile ? undefined : "span 4" } //this done to adjust each block according to phone screen
								//we targeting any div ,anything right below it as div,we add this
							}}
						>
							{isRegister && ( //if its on register page we have number of components here
								<>
									<TextField //input component for material ui
										label="First Name"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.firstName}
										name="firstName"
										error={Boolean(touched.firstName) && Boolean(errors.firstName)} //checking if it hasnt been touched or is there an error, then it show we have an error
										helperText={touched.firstName && errors.firstName}
										sx={{ gridColumn: "span 2" }}
									/>
									<TextField //input component for material ui
										label="Last Name"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.lastName}
										name="lastName"
										error={Boolean(touched.lastName) && Boolean(errors.lastName)} //checking if it hasnt been touched or is there an error, then it show we have an error
										helperText={touched.lastName && errors.lastName}
										sx={{ gridColumn: "span 2" }}
									/>
									<TextField //input component for material ui
										label="Location"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.location}
										name="location"
										error={Boolean(touched.location) && Boolean(errors.location)} //checking if it hasnt been touched or is there an error, then it show we have an error
										helperText={touched.location && errors.location}
										sx={{ gridColumn: "span 4" }}
									/>
									<TextField //input component for material ui
										label="Occupation"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.occupation}
										name="occupation"
										error={Boolean(touched.occupation) && Boolean(errors.occupation)} //checking if it hasnt been touched or is there an error, then it show we have an error
										helperText={touched.occupation && errors.occupation}
										sx={{ gridColumn: "span 4" }}
									/>
									<Box
										gridColumn="span 4"
										border={`1px solid ${palette.neutral.medium}`}
										borderRadius="5px"
										p="1rem"
									>
										{/* hav automatic file validation */}
										<Dropzone 
											acceptedFiles=".jpg, .jpeg, .png"
											multiple={false}
											//  what we do with file once user drops it
											onDrop={(acceptedFiles) =>
												// we setfieldval val according to the format we defined above, as pic format different that name
												setFieldValue("picture", acceptedFiles[0])
											}
										>
											{({ getRootProps, getInputProps }) => (
												<Box
													{...getRootProps()}
													// something we have to do with dropzone
													border={`2px dashed ${palette.primary.main}`}
													p="1rem"
													sx={{ "&:hover": { cursor: "pointer" } }}
												>
													<input {...getInputProps()} />
													{!values.picture ? (
														<p>Ad Pic here</p>
													) : (
														<FlexBetween>
															{/* if pic available its name shown here */}
															<Typography>{values.picture.name}</Typography>
															<EditOutlinedIcon />
														</FlexBetween>
													)}
												</Box>
											)}
										</Dropzone>
									</Box>
								</>
							)}
							{/* this section common for both register and login */}
								<TextField //input component for material ui
										label="Email"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.email}
										name="email"
										error={Boolean(touched.email) && Boolean(errors.email)} //checking if it hasnt been touched or is there an error, then it show we have an error
										helperText={touched.email && errors.email}
										sx={{ gridColumn: "span 4" }}
									/>
								<TextField //input component for material ui
										label="Password"
										type="password"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.password}
										name="password"
										error={Boolean(touched.password) && Boolean(errors.password)} //checking if it hasnt been touched or is there an error, then it show we have an error
										helperText={touched.password && errors.password}
										sx={{ gridColumn: "span 4" }}
									/>
						</Box>
						{/* BUTTON */}
						<Box>
							<Button
							fullWidth
							type="submit" 
							// any time we have btn type submit in form, its going to run handlesubmit=>handlesubmit
							sx={{
								m: "2rem 0",
								p: "1rem",
								backgroundColor: palette.primary.main,
								color: palette.background.alt,
								"&:hover": { color: palette.primary.main},
							}}
							>
								{isLogin? "LOGIN": "REGISTER"}
							</Button>
							<Typography
								// to switch b/w login and register 
								onClick={()=>{
									setPageType(isLogin?"register": "login");
									resetForm();
								}}
								sx={{
									textDecoration: "underline",
									color: palette.primary.main,
									"&:hover":{
										cursor: "pointer",
										color: palette.primary.light,
									},
								}}
>
	{isLogin
	?"Don't have an acc? Sign up here." : "already have an acc? Login here."}
							</Typography>
						</Box>
					</form>
				)
				}
			</Formik>
		);

	};

export default Form;