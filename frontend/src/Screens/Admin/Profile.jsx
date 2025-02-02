import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setUserData } from "../../redux/actions";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";

const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const router = useLocation();
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });

  // Fetch user details when component loads
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          `${baseApiURL()}/${router.state.type}/details/getDetails`,
          { employeeId: router.state.loginid },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          const user = response.data.user[0];
          setData(user);
          dispatch(
            setUserData({
              fullname: `${user.firstName} ${user.middleName} ${user.lastName}`,
              semester: user.semester,
              enrollmentNo: user.enrollmentNo,
              branch: user.branch,
            })
          );
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, [dispatch, router.state.loginid, router.state.type]);

  // Validate and update password
  const checkPasswordHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseApiURL()}/admin/auth/login`,
        { loginid: router.state.loginid, password: password.current },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        await changePasswordHandler(response.data.id);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error validating password:", error);
      toast.error(error.response?.data?.message || "Failed to validate password.");
    }
  };

  const changePasswordHandler = async (id) => {
    try {
      const response = await axios.put(
        `${baseApiURL()}/admin/auth/update/${id}`,
        { loginid: router.state.loginid, password: password.new },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setPassword({ new: "", current: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.response?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="w-full mx-auto my-8 flex justify-between items-start">
      {data ? (
        <>
          <div>
            <p className="text-2xl font-semibold">
              Hello {data.firstName} {data.middleName} {data.lastName}👋
            </p>
            <div className="mt-3">
              <p className="text-lg font-normal mb-2">Employee Id: {data.employeeId}</p>
              <p className="text-lg font-normal mb-2">Phone Number: +20 {data.phoneNumber}</p>
              <p className="text-lg font-normal mb-2">Email Address: {data.email}</p>
            </div>
            <button
              className={`${
                showPass ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
              } px-3 py-1 rounded mt-4`}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Close Change Password" : "Change Password"}
            </button>

            {showPass && (
              <form
                className="mt-4 border-t-2 border-blue-500 flex flex-col justify-center items-start"
                onSubmit={checkPasswordHandler}
              >
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <button
                  type="submit"
                  className="mt-4 hover:border-b-2 hover:border-blue-500"
                >
                  Change Password
                </button>
              </form>
            )}
          </div>
          <img
            src={`${process.env.REACT_APP_MEDIA_LINK}/${data.profile}`}
            alt="student profile"
            className="h-[200px] w-[200px] object-cover rounded-lg shadow-md"
          />
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;
