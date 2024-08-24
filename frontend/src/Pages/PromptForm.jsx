import React, { useState } from "react";

const PromptForm = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(prompt); // Call the onSubmit prop with the prompt value
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <label style={labelStyle}>
        Enter a Prompt:
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={inputStyle}
          placeholder="Type your prompt here..."
        />
      </label>
      <button type="submit" style={buttonStyle}>
        Submit
      </button>
    </form>
  );
};

// Inline styles (optional)
const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  borderRadius: "5px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "400px",
  margin: "0 auto",
};

const labelStyle = {
  marginBottom: "10px",
  fontWeight: "bold",
  fontSize: "16px",
};

const inputStyle = {
  padding: "8px",
  width: "100%",
  margin: "5px 0",
  borderRadius: "3px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const buttonStyle = {
  padding: "10px 15px",
  borderRadius: "5px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  marginTop: "10px",
};

export default PromptForm;
