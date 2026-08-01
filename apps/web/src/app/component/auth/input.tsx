type InputProps = {
  type?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full rounded-2xl border border-feelingcare-light-border bg-feelingcare-light-bg/70 px-4 py-3.5 text-sm text-feelingcare-light-text placeholder:text-feelingcare-light-text-secondary transition-all duration-200 focus:border-feelingcare-primary focus:outline-none focus:ring-4 focus:ring-feelingcare-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg/50 dark:text-feelingcare-dark-text dark:placeholder:text-feelingcare-dark-text-secondary dark:focus:border-feelingcare-primary-dark dark:focus:ring-feelingcare-primary-dark/20"
    />
  );
}
