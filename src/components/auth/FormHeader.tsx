
interface FormHeaderProps {
  title: string;
}

export const FormHeader = ({ title }: FormHeaderProps) => (
  <h1 className="text-4xl font-bold text-center text-black mb-8">
    {title}
  </h1>
);
