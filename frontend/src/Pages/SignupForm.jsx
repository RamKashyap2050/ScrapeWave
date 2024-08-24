import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    console.log("Input Change Detected:", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted with Data:", formData);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response from server:", response);

      if (response.ok) {
        const result = await response.json();
        console.log("Signup successful:", result);

        // Send the token to the content script
        // This code should be part of your signup or login process
       // Send the token to the Chrome extension using postMessage
       window.postMessage({
        type: "SET_TOKEN",
        token: result,  // Assuming `result.token` contains the user token
    }, "*");
        alert("Signup successful!");
      } else {
        const errorResult = await response.json();
        console.log("Signup failed:", errorResult);
        alert(`Signup failed: ${errorResult.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          ScrapeWave: Personalized Music Discovery
        </Typography>
        <Typography variant="h5" component="h1" gutterBottom>
          Create an Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            required
            InputProps={{
              sx: {
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            required
            InputProps={{
              sx: {
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            required
            InputProps={{
              sx: {
                borderRadius: "8px",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: "8px",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Sign Up
          </Button>
        </form>
        <a href="/login">Already Have an Account?</a>
      </Box>
    </Container>
  );
};

export default SignupForm;
