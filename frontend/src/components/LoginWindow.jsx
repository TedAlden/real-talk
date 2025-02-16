import { useState } from "react";
import { loginUser } from "../api/userService";

function LoginWindow() {
  //Use setUsername and setPassword in the input elements to update the states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedUser = {
      username: username,
      password: password,
    };
    const response = await loginUser(submittedUser);
    //Replace the console.logs with actual actions later
    if (response) {
      console.log("Login successful!");
      console.log(response);
    } else {
      console.error("Login failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>this is where the nice form ui goes</p>
    </form>
  );
}

export default LoginWindow;
