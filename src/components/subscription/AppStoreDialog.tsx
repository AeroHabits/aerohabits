
import { ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AppStoreDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSubscribed: boolean;
}

export function AppStoreDialog({ isOpen, onOpenChange, isSubscribed }: AppStoreDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-900 border border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {isSubscribed ? "Manage Your Subscription" : "Subscribe via App Store"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            {isSubscribed 
              ? "To manage your subscription on iOS devices, please follow these steps:" 
              : "To subscribe to AeroHabits Premium on iOS devices:"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-2 text-gray-300">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Open the <span className="font-medium text-white">Settings</span> app on your iOS device</li>
            <li>Tap your <span className="font-medium text-white">Apple ID</span> at the top of the screen</li>
            <li>Select <span className="font-medium text-white">Subscriptions</span></li>
            {isSubscribed ? (
              <>
                <li>Find and tap <span className="font-medium text-white">AeroHabits</span> in your list of subscriptions</li>
                <li>Here you can manage, cancel, or change your subscription options</li>
              </>
            ) : (
              <>
                <li>Tap <span className="font-medium text-white">+ Subscribe to a new service</span></li>
                <li>Find and select <span className="font-medium text-white">AeroHabits</span></li>
                <li>Choose the subscription plan that suits you</li>
              </>
            )}
          </ol>
          <div className="pt-2">
            <p className="text-sm text-gray-400 flex items-center gap-1.5">
              <ExternalLink className="h-4 w-4" />
              You'll be redirected to Apple's subscription management
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
            onClick={() => {
              // Open iOS subscription settings
              window.location.href = "https://apps.apple.com/account/subscriptions";
            }}
          >
            Open App Store
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
