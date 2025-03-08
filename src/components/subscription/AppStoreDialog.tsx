
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, AppleIcon, RefreshCw } from "lucide-react";

interface AppStoreDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSubscribed: boolean;
}

export function AppStoreDialog({ isOpen, onOpenChange, isSubscribed }: AppStoreDialogProps) {
  const dialogTitle = isSubscribed ? "Manage Your Subscription" : "Complete Your Subscription";
  
  const handleRedirect = () => {
    // For existing subscriptions
    if (isSubscribed) {
      window.location.href = "https://apps.apple.com/account/subscriptions";
    } else {
      // For new subscriptions - refresh the page which will trigger our native browser
      window.location.reload();
    }
    onOpenChange(false);
  };

  const handleRestore = () => {
    // Placeholder for restore purchases functionality
    window.location.href = "https://apps.apple.com/account/subscriptions";
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{dialogTitle}</DialogTitle>
          <DialogDescription className="text-gray-300 text-center">
            {isSubscribed ? (
              "To manage your existing subscription on an iOS device:"
            ) : (
              "To complete your subscription on an iOS device:"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isSubscribed ? (
            <ol className="list-decimal pl-6 space-y-2 text-gray-300">
              <li>Open the <span className="font-semibold text-white">Settings</span> app on your iOS device</li>
              <li>Tap your <span className="font-semibold text-white">Apple ID</span> at the top of the screen</li>
              <li>Select <span className="font-semibold text-white">Subscriptions</span></li>
              <li>Find and tap <span className="font-semibold text-white">AeroHabits</span> in your list of subscriptions</li>
              <li>Here you can manage or cancel your subscription</li>
            </ol>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="font-medium text-white mb-2 flex items-center">
                  <AppleIcon className="h-5 w-5 mr-2" />
                  iOS App Store
                </h3>
                <p className="text-sm text-gray-300">
                  We'll try to open a secure checkout in our app. If that doesn't work, you can complete your purchase 
                  directly through the App Store.
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">Note:</span> Your subscription will be managed by Apple. 
                  Your Apple ID will be charged at the end of the trial period unless canceled at least 24 hours before the end of the trial.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={handleRedirect}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {isSubscribed ? "Manage in App Store" : "Try Again"}
            </Button>
            
            <Button
              onClick={handleRestore}
              variant="outline"
              className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restore Purchases
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
