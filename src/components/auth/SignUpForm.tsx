
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { ToggleFormLink } from "./ToggleFormLink";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignUpFormProps {
  onToggleForm: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const SignUpForm = ({ onToggleForm, isLoading, setIsLoading }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [authTab, setAuthTab] = useState<"email" | "phone">("email");
  
  const { handleError, handleSuccess } = useAuthForm();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Redirect to the onboarding questionnaire
        navigate('/onboarding');
      } else {
        handleSuccess("Please check your email to verify your account.");
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
    
    if (!phone || !fullName) {
      handleError({
        message: "Please fill in all required fields"
      });
      return;
    }
    
    const formattedPhone = formatPhoneNumber(phone);
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          data: {
            full_name: fullName,
          },
        }
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
        navigate("/onboarding");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    // Ensure the phone number is in E.164 format
    return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  };

  return (
    <FormWrapper title="Create Account">
      <Tabs defaultValue="email" value={authTab} onValueChange={(value) => setAuthTab(value as "email" | "phone")} className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="mt-4">
          <form onSubmit={handleSignUp} className="space-y-6">
            <FormInput
              id="fullName"
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isLoading}
            />
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800 text-white transition-colors" 
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="phone" className="mt-4">
          {!showOtpInput ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <FormInput
                id="fullNamePhone"
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
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
        text="Already have an account?"
        linkText="Sign In"
        onClick={onToggleForm}
      />
    </FormWrapper>
  );
}
