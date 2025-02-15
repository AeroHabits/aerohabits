
interface ToggleFormLinkProps {
  text: string;
  linkText: string;
  onClick: () => void;
}

export const ToggleFormLink = ({ text, linkText, onClick }: ToggleFormLinkProps) => {
  return (
    <p className="text-center text-sm mt-6 text-white">
      {text}{" "}
      <button
        onClick={onClick}
        className="text-white hover:text-gray-200 transition-colors duration-200 font-semibold"
        type="button"
      >
        {linkText}
      </button>
    </p>
  );
};
