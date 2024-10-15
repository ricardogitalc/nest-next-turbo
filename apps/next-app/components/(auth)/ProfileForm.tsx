"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function ProfileForm() {
  const [profileData, setProfileData] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        }
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-4 pt-20">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={profileData.name} onChange={handleInputChange} placeholder="Your name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={profileData.email}
          onChange={handleInputChange}
          placeholder="Your email"
        />
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  );
}
