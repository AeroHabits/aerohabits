
import React, { useState } from "react";
import { HabitCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { COLORS, ICON_LIST, DEFAULT_CATEGORIES } from "./constants";
import { LucideIconRenderer } from "./LucideIconRenderer";

interface CategorySelectorProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories: HabitCategory[];
  fetchCategories: () => Promise<void>;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  fetchCategories
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [newCategoryIcon, setNewCategoryIcon] = useState("Star");
  const { toast } = useToast();

  // Combine user categories with default ones if no user categories exist
  const displayCategories = categories.length > 0 
    ? categories 
    : DEFAULT_CATEGORIES;

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('habit_categories')
      .insert([{
        name: newCategoryName.trim(),
        color: newCategoryColor,
        icon: newCategoryIcon,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Category created successfully!"
    });
    setNewCategoryName("");
    setNewCategoryColor("#3b82f6");
    setNewCategoryIcon("Star");
    setIsAddingCategory(false);
    fetchCategories();
  };

  return <div className="flex items-center gap-2">
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full bg-[#2A2F3C]/70 border-2 border-[#403E43] focus:border-[#9b87f5] text-white">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="bg-[#2A2F3C] border-[#403E43] z-50">
          {displayCategories.map(category => (
            <SelectItem 
              key={category.id} 
              value={category.id} 
              className="flex items-center gap-2 text-[#C8C8C9] hover:bg-[#9b87f5]/20"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <LucideIconRenderer 
                  name={category.icon} 
                  className="w-4 h-4" 
                  style={{ color: category.color }}
                />
                <span>{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogTrigger asChild>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="bg-[#2A2F3C]/70 border-2 border-[#403E43] hover:bg-[#9b87f5]/20 hover:border-[#9b87f5] rounded-sm"
          >
            <Plus className="h-4 w-4 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Category name" 
              value={newCategoryName} 
              onChange={e => setNewCategoryName(e.target.value)} 
              className="w-full" 
            />
            
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map(color => (
                <button 
                  key={color.value} 
                  type="button" 
                  className={cn(
                    "w-8 h-8 rounded-full transition-transform", 
                    newCategoryColor === color.value && "scale-125 ring-2 ring-white"
                  )} 
                  style={{ backgroundColor: color.value }}
                  onClick={() => setNewCategoryColor(color.value)} 
                />
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {ICON_LIST.map(icon => (
                <button 
                  key={icon} 
                  type="button" 
                  className={cn(
                    "p-2 rounded-lg transition-all", 
                    newCategoryIcon === icon 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )} 
                  onClick={() => setNewCategoryIcon(icon)}
                >
                  <LucideIconRenderer name={icon} className="w-4 h-4" />
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddingCategory(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleAddCategory}
              >
                Create Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
