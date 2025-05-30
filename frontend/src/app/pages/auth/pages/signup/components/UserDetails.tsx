import React, { useState } from "react";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import { updateUser } from "../../../../../../api/user";
import { ExperienceLevel, UserUpdate } from "../../../../../../types/user";
import { Loader2 } from "lucide-react";
import { capitalize } from "../../../../../../utils/helper";
import InputField from "../../../../../../components/ui/InputField";
import { APP_DATA } from "../../../../../../constants/data";

interface UserDetailsProps {
  onSuccess: () => void;
}

const UserDetails = ({ onSuccess }: UserDetailsProps) => {
  const [formData, setFormData] = useState<UserUpdate>({
    fullName: "",
    age: undefined,
    experienceLevel: "beginner",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUser(formData);
      onSuccess();
    } catch (e) {
      location.href = "/";
      return e;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleExperienceLevelChange = (value: string) => {
    setFormData({
      ...formData,
      experienceLevel: value.toLowerCase() as ExperienceLevel,
    });
  };

  return (
    <div
      style={{ zoom: "92%" }}
      className="bg-black/40 backdrop-blur-xl p-12 rounded-3xl border border-white/10 shadow-2xl"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3 font-dancing">
            {APP_DATA.name}
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        </div>
        <p className="text-blue-300 font-stix text-lg mt-4">{APP_DATA.desc}</p>
      </div>

      {/* User Details Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Full Name */}
        <InputField
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />

        {/* Age */}
        <InputField
          name="age"
          type="number"
          placeholder="How old are you?"
          value={formData.age || ""}
          onChange={handleInputChange}
          required
        />

        {/* Experience Level */}
        <div className="space-y-2">
          <CustomSelect
            title=""
            options={[
              { value: "Beginner", label: "Beginner" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Senior", label: "Senior" },
            ]}
            selectedOption={capitalize(formData.experienceLevel) || ""}
            onChange={handleExperienceLevelChange}
            bgColor="bg-white/5 dark:bg-white/5"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              Processing...
            </span>
          ) : (
            "Complete Profile"
          )}
        </button>
      </form>
    </div>
  );
};

export default UserDetails;
