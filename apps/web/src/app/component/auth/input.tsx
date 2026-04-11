type InputProps = {
  type?: string;
  placeholder: string;
};

export default function Input({ type = "text", placeholder }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="
        w-full px-4 py-2 rounded-lg
        bg-[#0F1115]/90 border border-gray-700
        text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-indigo-300
        transition
      "
    />
  );
}