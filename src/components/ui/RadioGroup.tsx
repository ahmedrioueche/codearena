// Custom Radio Group Component
interface RadioOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  name,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {options.map((option) => (
        <label
          key={option.id}
          className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${
            value === option.id
              ? "border-light-primary dark:border-dark-primary bg-light-primary/5 dark:bg-dark-primary/10"
              : "border-light-border dark:border-dark-border hover:border-light-primary/50 dark:hover:border-dark-primary/50"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <div className="flex items-center space-x-3">
            {option.icon}
            <div>
              <p className="font-medium text-light-foreground dark:text-dark-foreground">
                {option.label}
              </p>
              {option.description && (
                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
