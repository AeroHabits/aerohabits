
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { UserMenu } from "@/components/UserMenu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUserPreferences, UserPreference } from "@/hooks/useUserPreferences";
import { Loader } from "@/components/ui/loader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Preferences() {
  const { preferences, updatePreferences, isLoading } = useUserPreferences();
  const [formValues, setFormValues] = useState<UserPreference>({...preferences});
  const [isSaving, setIsSaving] = useState(false);
  
  const { data: categories } = useQuery({
    queryKey: ['habit-categories'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data } = await supabase
        .from('habit_categories')
        .select('*')
        .eq('user_id', user.id);
        
      return data || [];
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updatePreferences(formValues);
    setIsSaving(false);
  };
  
  const handleCheckboxChange = (category: string, checked: boolean) => {
    setFormValues(prev => {
      const contentPreferences = [...(prev.contentPreferences || [])];
      
      if (checked) {
        contentPreferences.push(category);
      } else {
        const index = contentPreferences.indexOf(category);
        if (index !== -1) {
          contentPreferences.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        contentPreferences
      };
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <PageHeader />
          <UserMenu />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Display Preferences</CardTitle>
                <CardDescription className="text-gray-300">
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-white">Theme</Label>
                  <RadioGroup 
                    value={formValues.theme} 
                    onValueChange={(value) => setFormValues({...formValues, theme: value as 'light' | 'dark' | 'system'})}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light" className="text-gray-300">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark" className="text-gray-300">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system" className="text-gray-300">System</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-white">Language</Label>
                  <Select 
                    value={formValues.language} 
                    onValueChange={(value) => setFormValues({...formValues, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Notification Settings</CardTitle>
                <CardDescription className="text-gray-300">
                  Configure when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notification-frequency" className="text-white">Notification Frequency</Label>
                  <Select 
                    value={formValues.notificationFrequency} 
                    onValueChange={(value) => setFormValues({
                      ...formValues, 
                      notificationFrequency: value as 'daily' | 'weekly' | 'never'
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formValues.notificationFrequency === 'daily' && (
                  <div className="space-y-2">
                    <Label htmlFor="reminder-time" className="text-white">Daily Reminder Time</Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={formValues.dailyReminderTime || '09:00'}
                      onChange={(e) => setFormValues({...formValues, dailyReminderTime: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Content Preferences</CardTitle>
                <CardDescription className="text-gray-300">
                  Choose which types of content you want to see
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category.id}`}
                          checked={formValues.contentPreferences?.includes(category.name)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(category.name, checked === true)
                          }
                        />
                        <Label 
                          htmlFor={`category-${category.id}`} 
                          className="text-gray-300"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No habit categories found. Create some habit categories to filter your content.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                {isSaving ? <Loader size="sm" className="mr-2" /> : null}
                Save Preferences
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
