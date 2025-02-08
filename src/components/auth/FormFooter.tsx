
interface FormFooterProps {
  message: string;
  actionText: string;
  onAction: () => void;
}

export const FormFooter = ({ message, actionText, onAction }: FormFooterProps) => (
  <p className="text-center text-sm mt-6 text-white">
    {message}{" "}
    <button
      onClick={onAction}
      className="text-white hover:text-gray-200 transition-colors duration-200 font-semibold"
      type="button"
    >
      {actionText}
    </button>
  </p>
);
