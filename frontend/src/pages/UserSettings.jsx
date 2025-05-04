import { useState, useEffect, useRef ,useContext} from "react";
import { Link } from "react-router-dom";
import { decode } from "html-entities";
import QRCode from "react-qr-code";
import _ from "lodash";
import deepDiff from "../util/deepDiff";
import deepCopy from "../util/deepCopy";
import { updateUser } from "../api/userService.js";
import { convertImageBase64 } from "../util/image.js";
import useAuth from "../hooks/useAuth.js";

import {
  HiAtSymbol,
  HiInformationCircle,
  HiMail,
  HiUser,
  HiCog,
  HiClock,
  HiLockClosed,
} from "react-icons/hi";

import {
  Alert,
  Button,
  Clipboard,
  Datepicker,
  FileInput,
  Spinner,
  Tabs,
  TabItem,
  TextInput,
  Textarea,
  Label,
  ToggleSwitch,
  Select,
} from "flowbite-react";
import Unauthorised from "../components/Unauthorised.jsx";

function UserSettings() {
  const auth = useAuth();
  const [formData, setFormData] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const originalData = useRef({}); // Initial user data fetched from the server
  // to populate the form fields.

  useEffect(() => {
    if (auth.loggedIn) {
      auth
        .getUser()
        .then((user) => {
          // ─── hook in any existing usage settings from localStorage ───
         const savedGray = localStorage.getItem("usage_grayscale_level");
         if (savedGray != null) {
           user.usage = {
             ...user.usage,
             grayscale_level: parseInt(savedGray, 10),
           };
         }

          originalData.current = deepCopy(user);
          setFormData(user);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [auth]);

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
    const newUser = {
      ...formData,
    };
  
    // persist the chosen daily limit to localStorage
    if (newUser.usage?.time_limit) {
      localStorage.setItem(
        "usage_time_limit",
        String(newUser.usage.time_limit)
      );
    }

    // ─── persist the grayscale threshold (%) ───
    if (newUser.usage?.grayscale_level != null) {
      localStorage.setItem(
        "usage_grayscale_level",
        String(newUser.usage.grayscale_level)
      );
    }

    // Update password, if confirm password is matching
    if (newPassword !== "" || confirmPassword !== "") {
      if (newPassword == confirmPassword) {
        newUser.password = newPassword;
      } else {
        setAlertMessage({
          color: "failure",
          title: "Passwords do not match!",
        });
      }
    }

    // Only submit the fields that were changed, since this is an HTTP
    // PATCH request.
    const changes = deepDiff(originalData.current, newUser);
    const response = await updateUser(originalData.current._id, changes);

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

    // window.location.reload();
  };

  if (loading)
    return (
      <div className="p-16 text-center">
        <Spinner aria-label="Extra large spinner example" size="xl" />
      </div>
    );

  if (!auth.loggedIn) return <Unauthorised />;

  return (
    <>
      <Tabs aria-label="Tabs with underline" variant="underline">
        <TabItem title="Profile" icon={HiUser}>
          {loading ? (
            <div className="p-16 text-center">
              <Spinner aria-label="Extra large spinner example" size="xl" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-full sm:max-w-2xl">
                <form
                  className="flex max-w-2xl flex-col gap-4"
                  onSubmit={handleFormSubmit}
                >
                  {formData.profile_picture && (
                    <div className="flex justify-center">
                      <img
                        className="h-32 w-32 overflow-hidden rounded-full object-cover"
                        src={formData.profile_picture}
                        alt="Profile"
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
                      <Label htmlFor="biography" value="Bio" />
                    </div>
                    <Textarea
                      id="biography"
                      name="biography"
                      type="text"
                      placeholder="Write your thoughts here!..."
                      required
                      value={decode(formData?.biography)}
                      onChange={handleFormChange}
                    />
                  </div>
                  <Button type="submit">Update</Button>
                </form>
              </div>
            </div>
          )}
        </TabItem>
        <TabItem title="Account" icon={HiCog}>
          {loading ? (
            <div className="p-16 text-center">
              <Spinner aria-label="Extra large spinner example" size="xl" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-full sm:max-w-2xl">
                <form
                  className="flex max-w-2xl flex-col gap-4"
                  onSubmit={handleFormSubmit}
                >
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
                      <Label htmlFor="new-password" value="New Password" />
                    </div>
                    <TextInput
                      id="new-password"
                      name="new-password"
                      type="password"
                      placeholder="••••••••"
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="confirm-password"
                        value="Confirm Password"
                      />
                    </div>
                    <TextInput
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      // value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="mfa" value="Two-factor Authentication" />
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
                      <Clipboard.WithIconText
                        onClick={(e) => {
                          // Workaround to prevent this button from submitting the
                          // form. Does however disable the button animation.
                          e.preventDefault();
                          navigator.clipboard.writeText(formData?.mfa?.secret);
                        }}
                      />
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
                </form>
              </div>
            </div>
          )}
        </TabItem>
        <TabItem title="Personal" icon={HiLockClosed}>
          {loading ? (
            <div className="p-16 text-center">
              <Spinner aria-label="Extra large spinner example" size="xl" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-full sm:max-w-2xl">
                <form
                  className="flex max-w-2xl flex-col gap-4"
                  onSubmit={handleFormSubmit}
                >
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
                        <Label
                          htmlFor="address.line_1"
                          value="Address Line 1"
                        />
                      </div>
                      <TextInput
                        id="address.line_1"
                        name="address.line_1"
                        type="text"
                        placeholder=""
                        value={formData?.address?.line_1}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label
                          htmlFor="address.line_2"
                          value="Address Line 2"
                        />
                      </div>
                      <TextInput
                        id="address.line_2"
                        name="address.line_2"
                        type="text"
                        placeholder=""
                        value={formData?.address?.line_2}
                        onChange={handleFormChange}
                      />
                    </div>
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
                  <Button type="submit">Update</Button>
                </form>
              </div>
            </div>
          )}
        </TabItem>
        <TabItem title="Usage limits" icon={HiClock}>
          {loading ? (
            <div className="p-16 text-center">
              <Spinner aria-label="Loading spinner" size="xl" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-full sm:max-w-2xl">
                <form
                  className="flex max-w-2xl flex-col gap-4"
                  onSubmit={handleFormSubmit}
                >
                  {/* 1) Daily Time Limit Dropdown */}
                  <div>
                    <Label htmlFor="usage.time_limit" value="Daily Time Limit" />
                    <Select
                      id="usage.time_limit"
                      name="usage.time_limit"
                      value={formData.usage?.time_limit || ""}
                      onChange={handleFormChange}
                    >
                      <option value="">— Select one —</option>
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                      <option value="900">15 minutes</option>
                      <option value="1200">20 minutes</option>
                    </Select>
                  </div>

                  {/* 2) Grayscale Threshold Slider */}
                  <div>
                    <Label
                      htmlFor="usage.grayscale_level"
                      value="Grayscale Threshold (%)"
                    />
                    <input
                      type="range"
                      id="usage.grayscale_level"
                      name="usage.grayscale_level"
                      min="0"
                      max="100"
                      step="1"
                      value={formData.usage?.grayscale_level ?? 100}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          usage: {
                            ...formData.usage,
                            grayscale_level: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.usage?.grayscale_level ?? 100}%
                    </div>
                  </div>

                  {/* 3) Screen Time Reminders Toggle */}
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="usage.reminders_enabled"
                      value="Screen Time Reminders"
                    />
                    <ToggleSwitch
                      id="usage.reminders_enabled"
                      name="usage.reminders_enabled"
                      checked={formData.usage?.reminders_enabled}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          usage: {
                            ...formData.usage,
                            reminders_enabled: value,
                          },
                        })
                      }
                      label={formData.usage?.reminders_enabled ? "On" : "Off"}
                    />
                  </div>

                  <Button type="submit">Update Usage Limits</Button>
                </form>
              </div>
            </div>
          )}
        </TabItem>

      </Tabs>
      {Object.keys(alertMessage).length > 0 && (
        <div className="flex flex-col items-center justify-center">
          <div className="w-full sm:max-w-2xl">
            <Alert
              color={alertMessage.color}
              icon={alertMessage.icon || HiInformationCircle}
            >
              <span className="font-medium">{alertMessage.title}</span>{" "}
              {alertMessage.message}
            </Alert>
          </div>
        </div>
      )}
    </>
  );
}

export default UserSettings;
