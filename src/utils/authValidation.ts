
export const validateSignInForm = (email: string, password: string, isResettingPassword: boolean) => {
  if (!email) {
    return "Please enter your email";
  }
  if (!isResettingPassword && !password) {
    return "Please enter your password";
  }
  return null;
};
