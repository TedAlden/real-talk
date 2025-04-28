import { useState, useEffect, useRef } from "react";
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
} from "flowbite-react";

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

  return loading ? (
    <div className="p-16 text-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
    </div>
  ) : auth.loggedIn ? (
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
              <Spinner aria-label="Extra large spinner example" size="xl" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-full sm:max-w-2xl">
                <form
                  className="flex max-w-2xl flex-col gap-4"
                  onSubmit={handleFormSubmit}
                >
                  <div className="mb-4">
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Screen Time Limits
                    </h3>
                    <div className="mb-3">
                      <div className="mb-2 block">
                        <Label 
                          htmlFor="daily-limit" 
                          value="Daily time limit (minutes)" 
                        />
                      </div>
                      <TextInput
                        id="daily-limit"
                        name="anti_addiction.daily_limit_mins"
                        type="number"
                        min="1"
                        max="1440"
                        value={formData?.anti_addiction?.daily_limit_mins || 60}
                        onChange={handleFormChange}
                        helperText="Set your daily app usage limit (1-1440 minutes)"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={formData?.anti_addiction?.show_reminders || false}
                          onChange={(checked) => 
                            setFormData({
                              ...formData,
                              anti_addiction: {
                                ...formData.anti_addiction,
                                show_reminders: checked
                              }
                            })
                          }
                          id="show-reminders"
                          name="anti_addiction.show_reminders"
                        />
                        <Label htmlFor="show-reminders">
                          Show usage reminders and timer
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Grayscale Settings
                    </h3>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={formData?.anti_addiction?.grayscale_enabled || false}
                          onChange={(checked) => 
                            setFormData({
                              ...formData,
                              anti_addiction: {
                                ...formData.anti_addiction,
                                grayscale_enabled: checked
                              }
                            })
                          }
                          id="grayscale-enabled"
                          name="anti_addiction.grayscale_enabled"
                        />
                        <Label htmlFor="grayscale-enabled">
                          Enable progressive grayscale
                        </Label>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        App will gradually desaturate colors as you approach your daily limit
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="mb-2 block">
                        <Label 
                          htmlFor="grayscale-threshold" 
                          value="Start grayscale at (%)" 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="grayscale-threshold"
                          name="anti_addiction.grayscale_threshold"
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={formData?.anti_addiction?.grayscale_threshold || 0.8}
                          onChange={handleFormChange}
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                          disabled={!formData?.anti_addiction?.grayscale_enabled}
                        />
                        <span className="w-12 text-center text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round((formData?.anti_addiction?.grayscale_threshold || 0.8) * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-5 mb-3">
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={formData?.anti_addiction?.bedtime_grayscale?.enabled || false}
                          onChange={(checked) => 
                            setFormData({
                              ...formData,
                              anti_addiction: {
                                ...formData.anti_addiction,
                                bedtime_grayscale: {
                                  ...formData.anti_addiction?.bedtime_grayscale,
                                  enabled: checked
                                }
                              }
                            })
                          }
                          id="bedtime-grayscale"
                          name="anti_addiction.bedtime_grayscale.enabled"
                        />
                        <Label htmlFor="bedtime-grayscale">
                          Enable bedtime grayscale
                        </Label>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        App will automatically switch to grayscale during bedtime hours
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="mb-2 block">
                          <Label 
                            htmlFor="bedtime-start" 
                            value="Bedtime start" 
                          />
                        </div>
                        <TextInput
                          id="bedtime-start"
                          name="anti_addiction.bedtime_grayscale.start_time"
                          type="time"
                          value={formData?.anti_addiction?.bedtime_grayscale?.start_time || "22:00"}
                          onChange={handleFormChange}
                          disabled={!formData?.anti_addiction?.bedtime_grayscale?.enabled}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label 
                            htmlFor="bedtime-end" 
                            value="Bedtime end" 
                          />
                        </div>
                        <TextInput
                          id="bedtime-end"
                          name="anti_addiction.bedtime_grayscale.end_time"
                          type="time"
                          value={formData?.anti_addiction?.bedtime_grayscale?.end_time || "06:00"}
                          onChange={handleFormChange}
                          disabled={!formData?.anti_addiction?.bedtime_grayscale?.enabled}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Healthy Usage Rewards
                    </h3>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={formData?.anti_addiction?.gamification_enabled || false}
                          onChange={(checked) => 
                            setFormData({
                              ...formData,
                              anti_addiction: {
                                ...formData.anti_addiction,
                                gamification_enabled: checked
                              }
                            })
                          }
                          id="gamification-enabled"
                          name="anti_addiction.gamification_enabled"
                        />
                        <Label htmlFor="gamification-enabled">
                          Enable healthy usage rewards
                        </Label>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Earn badges and achievements for maintaining balanced app usage
                      </p>
                    </div>
                  </div>
                  
                  <Button type="submit">Update Settings</Button>
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
