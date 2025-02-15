
import { ReactNode } from "react";

interface FormWrapperProps {
  title: string;
  children: ReactNode;
}

export const FormWrapper = ({ title, children }: FormWrapperProps) => {
  return (
    <>
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        {title}
      </h1>
      {children}
    </>
  );
};
