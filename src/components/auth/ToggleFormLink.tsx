
interface ToggleFormLinkProps {
  text: string;
  linkText: string;
  onClick: () => void;
}

export function ToggleFormLink({ text, linkText, onClick }: ToggleFormLinkProps) {
  return (
    <p className="text-center mt-4 text-sm">
      {text}{" "}
      <button
        onClick={onClick}
        className="text-blue-600 hover:text-blue-700 font-medium"
        type="button"
      >
        {linkText}
      </button>
    </p>
  );
}
