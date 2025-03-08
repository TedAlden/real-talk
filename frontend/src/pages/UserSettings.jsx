import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import Cookies from "js-cookie";
import _ from "lodash";

import { updateUser, getUserById } from "../api/userService.js";
import { convertImageBase64 } from "../util.js/image.js";

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
    enabled: false,
    secret: "",
  },
  is_verified: false,
  is_admin: false,
};

function UserSettings() {
  const [formData, setFormData] = useState(emptyUser);
  const [alertMessage, setAlertMessage] = useState("");
  const [userId, setUserId] = useState(Cookies.get("authUser"));
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = Cookies.get("authUser");
    setUserId(user);
    setLoggedIn(true);
    (async () => {
      const response = await getUserById(userId);
      if (response.success !== false) {
        response.data.date_of_birth = new Date(response.data.date_of_birth);
        setFormData(response.data);
      }
    })();
  }, [userId]);

  const handleProfilePictureChange = async (e) => {
    const { files } = e.target;
    const file = files[0];
    const base64 = await convertImageBase64(file);
    base64 && setFormData({ ...formData, profile_picture: base64 });
  };

  const handleFormChange = (e) => {
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submittedUser = {
      ...formData,
      _id: userId,
    };
    const response = await updateUser(submittedUser);
    if (response.success !== false) {
      setAlertMessage({
        color: "success",
        title: "User updated successfully!",
      });
    } else {
      setAlertMessage({
        color: "failure",
        title: "User update failed!",
        message: response.message,
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
            onSubmit={handleFormSubmit}
          >
            {formData.profile_picture && (
              <div className="flex justify-center">
                <img
                  className="h-32 w-32 overflow-hidden rounded-full"
                  src={formData.profile_picture}
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
                onChange={handleProfilePictureChange}
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
                onChange={handleFormChange}
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
                onChange={handleFormChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleFormChange}
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
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
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
                weekStart={1}
                onChange={(value) => 
                  setFormData({ ...formData, date_of_birth: value })
                }
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
                onChange={handleFormChange}
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
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
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
                onChange={handleFormChange}
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
                value={`otpauth://totp/RealTalk:${formData?.email}?secret=${formData?.mfa?.secret}&issuer=RealTalk`}
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
