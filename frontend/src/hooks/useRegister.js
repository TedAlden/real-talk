import { useState } from "react";
import { registerUser } from "../api/authService";

export default function useRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedUser = {
      username,
      password,
      email,
    };
    const response = await registerUser(submittedUser);

    if (response.success !== false) {
      setAlertMessage("Registration successful!");
    } else {
      console.log(response);
      setAlertMessage("Registration failed! " + response.error);
    }
  };

  return {
    handleSubmit,
    setUsername,
    setEmail,
    setPassword,
    alertMessage,
  };
}
