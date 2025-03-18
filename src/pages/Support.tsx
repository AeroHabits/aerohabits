
import React from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Mail, MessageSquare, FileQuestion, HeartHandshake } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { UserMenu } from "@/components/UserMenu";

const Support = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "container mx-auto px-4 pt-12 pb-4 md:py-6 space-y-6 md:space-y-8 safe-top",
          isMobile && "pb-20"
        )}
      >
        <div className="flex justify-between items-center">
          <PageHeader 
            title="Support" 
            description="Get help with AEROHABITS" 
          />
          <UserMenu />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-purple-500/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <HeartHandshake className="h-6 w-6 text-purple-400" />
                How Can We Help You?
              </CardTitle>
              <CardDescription className="text-white text-opacity-90">
                We're here to assist you with any questions or issues you might have with AEROHABITS.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-white/15 border border-white/15 hover:bg-white/20 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2 text-white">
                      <Mail className="h-5 w-5 text-blue-400" />
                      Email Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white text-opacity-90">
                      For personal assistance, please email us at:
                    </p>
                    <a 
                      href="mailto:Aerohabits@gmail.com" 
                      className="text-blue-200 font-medium block mt-2 hover:text-blue-100 transition-colors"
                    >
                      Aerohabits@gmail.com
                    </a>
                  </CardContent>
                </Card>

                <Card className="bg-white/15 border border-white/15 hover:bg-white/20 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2 text-white">
                      <FileQuestion className="h-5 w-5 text-emerald-400" />
                      FAQs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white text-opacity-90">
                      Check our frequently asked questions for quick answers to common questions.
                    </p>
                    <div className="mt-4">
                      <Button variant="glass" size="sm" className="w-full font-semibold text-white">
                        View FAQs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-white/15">
                <h3 className="text-xl text-white font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  We're Here For You
                </h3>
                <p className="text-white text-opacity-90">
                  Our support team is available Monday through Friday, 9AM to 5PM EST.
                  We usually respond to all inquiries within 24 hours.
                </p>
                <div className="mt-4">
                  <Button
                    variant="premium"
                    size="wide"
                    onClick={() => window.location.href = "mailto:Aerohabits@gmail.com"}
                    className="text-white font-semibold"
                  >
                    <Mail className="mr-2" /> 
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/15 pt-4 text-white text-opacity-80 text-sm">
              Thank you for using AEROHABITS. We're committed to providing you with the best support possible.
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Support;
