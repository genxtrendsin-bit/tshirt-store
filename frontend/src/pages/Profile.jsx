import React, { useState } from "react";
import API from "../utils/axios";

export default function Profile() {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [name, setName] = useState(user.name);
  const [file, setFile] = useState(null);

  const updateProfile = async () => {
    try {
      const res = await API.put("/user/update-profile", { name });

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      alert("Profile updated ✅");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  const uploadAvatar = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await API.put("/user/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      alert("Avatar updated ✅");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  const removeAvatar = async () => {
    try {
      const res = await API.delete("/user/remove-avatar");

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      alert("Avatar removed ✅");
    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div className="page">

      <h2>Edit Profile</h2>

      {/* AVATAR */}
      {user.avatar && (
        <img
          src={user.avatar}
          alt="avatar"
          style={{ width: 100, borderRadius: "50%" }}
        />
      )}

      <br />

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={updateProfile}>
        Save Name
      </button>

      <hr />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={uploadAvatar}>
        Upload Avatar
      </button>

      {user.avatar && (
        <button onClick={removeAvatar} style={{ marginLeft: "10px" }}>
          Remove Avatar
        </button>
      )}

    </div>
  );
}