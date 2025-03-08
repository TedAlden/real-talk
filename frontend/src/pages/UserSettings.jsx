import { useState, useEffect } from "react";
import { updateUser, getUserById } from "../api/userService.js";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import _ from "lodash";

import QRCode from "react-qr-code";

import { HiAtSymbol, HiInformationCircle, HiMail } from "react-icons/hi";
import {
  Alert,
  Button,
  Clipboard,
  Datepicker,
  FileInput,
  TextInput,
  Textarea,
  Label,
  ToggleSwitch,
} from "flowbite-react";

const emptyUser = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  telephone: "",
  biography: "",
  profile_picture: "",
  address: {
    line_1: "",
    line_2: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
  },
  mfa: {
    enabled: null,
    secret: "",
  },
  is_verified: null,
  is_admin: null,
};

function UserSettings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyUser);
  const [alertMessage, setAlertMessage] = useState("");
  const [userId, setUserId] = useState(Cookies.get("authUser"));
  const [profilePic, setProfilePic] = useState();

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = Cookies.get("authUser");
    if (!user) {
      // navigate("/"); // Redirect immediately if no token is found
      return;
    }
    setUserId(user);
    setLoggedIn(true);
    const loadUserData = async () => {
      const response = await getUserById(userId);
      if (response.success !== false) {
        setFormData(response.data);
      }
      if (response.data.picture) {
        setProfilePic(response.data.picture);
      }
    };

    loadUserData();
  }, [navigate, userId]);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileRead = async (e) => {
    const { files } = e.target;
    const file = files[0];
    const base64 = await convertBase64(file);
    base64 && setProfilePic(base64);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev };
      if (value) {
        _.set(updated, name, value);
      } else {
        _.unset(updated, name);
      }
      return updated;
    });
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submittedUser = { ...formData, _id: userId, picture: profilePic };
    const response = await updateUser(submittedUser);

    console.log(submittedUser);

    if (response.success !== false) {
      setAlertMessage({
        color: "success",
        title: "User updated successfully!",
      });
    } else {
      console.log(response);
      setAlertMessage({
        color: "failure",
        title: "User update failed!",
        message: response.error,
      });
    }
  };

  return loggedIn ? (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full rounded-lg bg-white shadow sm:max-w-xl md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="my-5 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Settings
          </h1>
          <form
            className="flex max-w-xl flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {profilePic && (
              <div className="flex justify-center">
                <img
                  className="h-32 w-32 overflow-hidden rounded-full"
                  src={profilePic}
                  alt="Profile"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="file-upload" value="Profile Picture" />
              </div>
              <FileInput
                id="file-upload"
                accept="image/*"
                onChange={handleFileRead}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput
                id="username"
                name="username"
                type="text"
                placeholder="username"
                // addon="@"
                icon={HiAtSymbol}
                required
                value={formData?.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                name="email"
                type="text"
                placeholder="email"
                icon={HiMail}
                required
                value={formData?.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                name="password"
                type="text"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="first_name" value="First Name" />
                </div>
                <TextInput
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="John"
                  required
                  value={formData?.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="last_name" value="Last Name" />
                </div>
                <TextInput
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  required
                  value={formData?.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="date_of_birth" value="Date of Birth" />
              </div>
              <Datepicker
                id="date_of_birth"
                name="date_of_birth"
                required
                value={formData?.date_of_birth}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="telephone" value="Telephone" />
              </div>
              <TextInput
                id="telephone"
                name="telephone"
                type="tel"
                placeholder="(123) 456-7890"
                value={formData?.telephone}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="address.country" value="Country" />
                </div>
                <TextInput
                  id="address.country"
                  name="address.country"
                  type="text"
                  placeholder=""
                  value={formData?.address?.country}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="address.state" value="State" />
                </div>
                <TextInput
                  id="address.state"
                  name="address.state"
                  type="text"
                  placeholder=""
                  value={formData?.address?.state}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="address.city" value="City" />
                </div>
                <TextInput
                  id="address.city"
                  name="address.city"
                  type="text"
                  placeholder=""
                  value={formData?.address?.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="address.postcode" value="Postal code" />
                </div>
                <TextInput
                  id="address.postcode"
                  name="address.postcode"
                  type="text"
                  placeholder=""
                  value={formData?.address?.postcode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="biography" value="Bio" />
              </div>
              <Textarea
                id="biography"
                name="biography"
                type="text"
                placeholder="Write your thoughts here!..."
                required
                value={formData?.biography}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="mfa" value="Two-factor authentication" />
              </div>
              <ToggleSwitch
                id="mfa.enabled"
                name="mfa.enabled"
                checked={formData?.mfa?.enabled}
                label="Enabled"
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    mfa: { ...formData.mfa, enabled: value },
                  })
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="mfa" value="Secret" />
              </div>
              <div className="relative">
                <TextInput
                  sizing="lg"
                  id="mfa.secret"
                  type="text"
                  placeholder="2FA Secret"
                  value={formData?.mfa?.secret}
                  readOnly
                />
                <Clipboard.WithIconText valueToCopy={formData?.mfa?.secret} />
              </div>
            </div>
            <div className="flex justify-center">
              <QRCode
                id="mfa.qr"
                size={128}
                value={`otpauth://totp/RealTalk:${formData?.email}?secret=${formData?.mfaSecret}&issuer=RealTalk`}
              />
            </div>
            <Button type="submit">Update</Button>
            {Object.keys(alertMessage).length > 0 && (
              <div className="">
                <Alert
                  color={alertMessage.color}
                  icon={alertMessage.icon || HiInformationCircle}
                >
                  <span className="font-medium">{alertMessage.title}</span>{" "}
                  {alertMessage.message}
                </Alert>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <h1 className="my-5 text-2xl font-bold text-gray-900 dark:text-white">
        Welcome
      </h1>
      <p className="my-5 text-gray-900 dark:text-white">
        You must{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          log in
        </Link>{" "}
        before you can view this page.
      </p>
    </div>
  );
}

export default UserSettings;
