
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { ToggleFormLink } from "./ToggleFormLink";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone } from "lucide-react";

interface SignInFormProps {
  onToggleForm: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const SignInForm = ({
  onToggleForm,
  isLoading,
  setIsLoading
}: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [authTab, setAuthTab] = useState<"email" | "phone">("email");
  
  const {
    navigate,
    handleError,
    handleSuccess
  } = useAuthForm();

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      handleError({
        message: "Please enter your email address to reset your password"
      });
      return;
    }
    setIsLoading(true);
    try {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`
      });
      if (error) throw error;
      setResetLinkSent(true);
      handleSuccess("We've sent you a password reset link to your email address");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!email || !password) {
      handleError({
        message: "Please fill in all fields"
      });
      return;
    }
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (data.session) {
        navigate("/");
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!phone) {
      handleError({
        message: "Please enter your phone number"
      });
      return;
    }
    
    const formattedPhone = formatPhoneNumber(phone);
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone
      });
      
      if (error) throw error;
      
      setShowOtpInput(true);
      handleSuccess("We've sent you a one-time password");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!phone || !otp) {
      handleError({
        message: "Please enter the OTP sent to your phone"
      });
      return;
    }
    
    const formattedPhone = formatPhoneNumber(phone);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });
      
      if (error) throw error;
      
      if (data.session) {
        navigate("/");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    // Ensure the phone number is in E.164 format
    // If it doesn't start with +, add it
    return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  };

  return (
    <FormWrapper title="Welcome Back">
      <Tabs defaultValue="email" value={authTab} onValueChange={(value) => setAuthTab(value as "email" | "phone")} className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="mt-4">
          <form onSubmit={handleSignIn} className="space-y-6">
            <FormInput 
              id="email" 
              label="Email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value.trim())} 
              required 
              disabled={isLoading} 
            />
            <div className="space-y-2">
              <FormInput 
                id="password" 
                label="Password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                disabled={isLoading} 
              />
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={handleForgotPassword} 
                  disabled={isLoading} 
                  type="button" 
                  className="text-sm transition-colors duration-200 text-zinc-950 self-start"
                >
                  Forgot password?
                </button>
                {resetLinkSent && (
                  <div className="text-sm text-green-600">
                    Password reset link has been sent to your email.
                  </div>
                )}
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800 text-white transition-colors" 
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="phone" className="mt-4">
          {!showOtpInput ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <FormInput 
                id="phone" 
                label="Phone Number (include country code, e.g. +1)" 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value.trim())} 
                required 
                disabled={isLoading}
                placeholder="+12345678900"
              />
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white transition-colors" 
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <FormInput 
                id="otp" 
                label="One-Time Password" 
                type="text" 
                value={otp} 
                onChange={e => setOtp(e.target.value.trim())} 
                required 
                disabled={isLoading}
                placeholder="Enter the code we sent you"
              />
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white transition-colors" 
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Verify"}
              </Button>
              <button 
                type="button"
                onClick={() => setShowOtpInput(false)}
                className="w-full text-sm text-gray-500 underline"
                disabled={isLoading}
              >
                Change phone number
              </button>
            </form>
          )}
        </TabsContent>
      </Tabs>
      
      <ToggleFormLink 
        text="Don't have an account?" 
        linkText="Sign Up" 
        onClick={onToggleForm} 
      />
    </FormWrapper>
  );
};
