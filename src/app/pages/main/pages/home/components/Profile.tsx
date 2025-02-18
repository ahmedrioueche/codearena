import React, { useState } from "react";
import { Sword, Target, Zap, Code, Edit2, Check, X } from "lucide-react";
import Button from "../../../../../../components/ui/Button";
import Input from "../../../../../../components/ui/Input";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex DevPro",
    title: "Full Stack Master",
    mmr: "2.5k",
    techStack: ["React", "Node.js", "TypeScript"],
  });
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const addTechStack = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const inputElement = event.target as HTMLInputElement; // Type assertion
      const newTech = inputElement.value.trim();

      if (newTech) {
        setEditedProfile((prev) => ({
          ...prev,
          techStack: [...prev.techStack, newTech],
        }));
        inputElement.value = ""; // Clear input field
      }
    }
  };

  const removeTech = (techToRemove: string) => {
    setEditedProfile({
      ...editedProfile,
      techStack: editedProfile.techStack.filter(
        (tech) => tech !== techToRemove
      ),
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-light-background dark:bg-dark-background rounded-xl shadow-lg mx-auto border border-light-border dark:border-dark-border">
      {/* Left Section - Avatar and Info */}
      <div className="flex items-center space-x-6 mb-4 md:mb-0">
        {/* Developer Avatar with Rank Border */}
        <img
          src="/icons/developer.png"
          className="h-12 w-12"
          alt="Developer Avatar"
        />

        {/* Name and Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <Input
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
                className="h-8 w-48"
              />
            ) : (
              <h2 className="text-xl font-stix font-bold text-light-foreground dark:text-dark-foreground">
                {profile.name}
              </h2>
            )}
            <span className="px-2 py-0.5 bg-light-primary/10 dark:bg-dark-primary/20 rounded text-xs font-medium text-light-primary dark:text-dark-primary">
              RANK 42
            </span>
          </div>

          {/* Level and Specialization */}
          <div className="flex items-center space-x-2">
            <Code
              size={16}
              className="text-light-primary dark:text-dark-primary"
            />
            {isEditing ? (
              <Input
                value={editedProfile.title}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, title: e.target.value })
                }
                className="h-6 w-40"
              />
            ) : (
              <span className="text-sm text-light-secondary dark:text-dark-secondary">
                {profile.title}
              </span>
            )}
            <span className="text-light-secondary dark:text-dark-secondary">
              •
            </span>
            {isEditing ? (
              <Input
                value={editedProfile.mmr}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, mmr: e.target.value })
                }
                className="h-6 w-20"
              />
            ) : (
              <span className="text-sm text-light-secondary dark:text-dark-secondary">
                {profile.mmr} MMR
              </span>
            )}
          </div>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-2">
            {(isEditing ? editedProfile : profile).techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-light-accent/10 dark:bg-dark-accent/10 rounded-full text-xs text-light-accent dark:text-dark-accent flex items-center gap-1"
              >
                {tech}
                {isEditing && (
                  <X
                    size={12}
                    className="cursor-pointer hover:text-light-accent dark:hover:text-dark-accent"
                    onClick={() => removeTech(tech)}
                  />
                )}
              </span>
            ))}
            {isEditing && (
              <Input
                placeholder="Add tech..."
                className="h-6 w-24 text-xs"
                onKeyPress={addTechStack}
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Battle Stats + Edit Controls */}
      <div className="flex flex-row justify-around md:justify-end w-full md:w-auto items-center">
        <div className="flex flex-col items-center px-4 group">
          <Sword
            size={24}
            className="text-light-primary dark:text-dark-primary mb-1 group-hover:scale-110 transition-transform"
          />
          <span className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
            284
          </span>
          <span className="text-xs text-light-secondary dark:text-dark-secondary">
            Wins
          </span>
        </div>

        <div className="flex flex-col items-center px-4 group">
          <Target
            size={24}
            className="text-light-accent dark:text-dark-accent mb-1 group-hover:scale-110 transition-transform"
          />
          <span className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
            92%
          </span>
          <span className="text-xs text-light-secondary dark:text-dark-secondary">
            Accuracy
          </span>
        </div>

        <div className="flex flex-col items-center px-4 group">
          <Zap
            size={24}
            className="text-green-500 mb-1 group-hover:scale-110 transition-transform"
          />
          <span className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
            12.4k
          </span>
          <span className="text-xs text-light-secondary dark:text-dark-secondary">
            Points
          </span>
        </div>

        <div className="ml-4 flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSave}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Check size={20} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X size={20} />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className=" text-light-foreground hover:text-light-primary hover:bg-light-primary/10"
            >
              <Edit2
                size={20}
                className="text-purple-500 dark:text-purple-500"
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
