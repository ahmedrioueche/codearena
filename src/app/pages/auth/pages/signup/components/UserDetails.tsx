import React, { useState } from "react";
import CustomSelect from "../../../../../../components/ui/CustomSelect";

interface UserDetailsProps {
  onSubmit: () => void;
}

const UserDetails = ({ onSubmit }: UserDetailsProps) => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    experienceLevel: "Beginner",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User details submitted:", formData);
    onSubmit();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle experience level change
  const handleExperienceLevelChange = (value: string) => {
    setFormData({ ...formData, experienceLevel: value });
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3 font-dancing">
            CodeArena
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        </div>
        <p className="text-blue-300 font-stix text-lg mt-4">
          Complete Your Profile
        </p>
      </div>

      {/* User Details Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="space-y-2">
          <input
            type="text"
            name="username"
            className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <input
            type="text"
            name="fullName"
            className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <CustomSelect
            title=""
            options={[
              { value: "Beginner", label: "Beginner" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Senior", label: "Senior" },
            ]}
            selectedOption={formData.experienceLevel}
            onChange={handleExperienceLevelChange}
            bgColor="bg-white/5 dark:bg-white/5"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Complete Profile
        </button>
      </form>
    </div>
  );
};

export default UserDetails;
