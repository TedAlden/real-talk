import viteLogo from "/vite.svg";
import UserProfileDetails from "../components/UserProfileDetails";

function UserProfile() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>REAL TALK</h1>
      <UserProfileDetails />
    </>
  );
}

export default UserProfile;
