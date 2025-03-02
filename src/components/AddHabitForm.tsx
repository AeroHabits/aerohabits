
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Target, 
  Brain, 
  CircuitBoard,
  Plus,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { HabitCategory } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { icons } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddHabitFormProps {
  onAddHabit: (habit: { title: string; description: string; category_id?: string }) => void;
}

const COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#9b87f5' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Teal', value: '#14b8a6' },
];

const ICON_LIST = [
  'Star', 'Heart', 'Dumbbell', 'Book', 'Laptop', 
  'Brain', 'Target', 'Sun', 'Moon', 'Music', 
  'Pencil', 'Coffee', 'Smile', 'Trophy'
];

export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<HabitCategory[]>([]);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [newCategoryIcon, setNewCategoryIcon] = useState("Star");
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('habit_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit title",
        variant: "destructive",
      });
      return;
    }

    onAddHabit({ 
      title, 
      description,
      category_id: selectedCategory || undefined
    });
    
    setTitle("");
    setDescription("");
    setSelectedCategory("");
    
    toast({
      title: "Success",
      description: "New habit added successfully!",
    });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
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
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Category created successfully!",
    });

    setNewCategoryName("");
    setNewCategoryColor("#3b82f6");
    setNewCategoryIcon("Star");
    setIsAddingCategory(false);
    fetchCategories();
  };

  const LucideIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
    const Icon = (icons as any)[name];
    return Icon ? <Icon {...props} /> : null;
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-7 backdrop-blur-lg rounded-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-center space-x-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="p-4 bg-[#9b87f5] rounded-full shadow-lg"
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-[#C8C8C9]"
        >
          Create New Habit
        </motion.div>
      </div>

      <div className="space-y-5">
        <motion.div
          animate={isTitleFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Target className="w-6 h-6 text-[#9b87f5]" />
          </div>
          <Input
            placeholder="Enter your new habit..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            className="pl-12 py-6 h-16 bg-[#2A2F3C] border-2 border-[#403E43] focus:border-[#9b87f5] text-[#C8C8C9] placeholder:text-[#8E9196] text-xl font-medium rounded-lg transition-all duration-300 hover:border-[#9b87f5]/50 focus:ring-2 focus:ring-[#9b87f5]/30"
          />
        </motion.div>
        
        <motion.div
          animate={isDescriptionFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute top-4 left-4 pointer-events-none">
            <CircuitBoard className="w-6 h-6 text-[#9b87f5]" />
          </div>
          <Textarea
            placeholder="Describe your habit..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            className="pl-12 pt-4 bg-[#2A2F3C] border-2 border-[#403E43] focus:border-[#9b87f5] text-[#C8C8C9] placeholder:text-[#8E9196] text-lg rounded-lg min-h-[120px] transition-all duration-300 hover:border-[#9b87f5]/50 focus:ring-2 focus:ring-[#9b87f5]/30"
          />
        </motion.div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full h-14 bg-[#2A2F3C] border-2 border-[#403E43] focus:border-[#9b87f5] text-[#C8C8C9] text-lg">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2F3C] border-[#403E43]">
              {categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2 text-[#C8C8C9] hover:bg-[#9b87f5]/20 text-lg py-3"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <LucideIcon 
                      name={category.icon} 
                      className="w-5 h-5"
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
                className="h-14 w-14 bg-[#2A2F3C] border-2 border-[#403E43] hover:bg-[#9b87f5]/20 hover:border-[#9b87f5]"
              >
                <Plus className="h-6 w-6 text-[#C8C8C9]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full h-12 text-lg"
                />
                
                <div className="grid grid-cols-4 gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={cn(
                        "w-10 h-10 rounded-full transition-transform",
                        newCategoryColor === color.value && "scale-125 ring-2 ring-white"
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewCategoryColor(color.value)}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {ICON_LIST.map((icon) => (
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
                      <LucideIcon name={icon} className="w-5 h-5" />
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingCategory(false)}
                    className="text-base py-5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddCategory}
                    className="text-base py-5"
                  >
                    Create Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <Button 
          type="submit"
          className="w-full bg-[#9b87f5] hover:bg-[#8b76f4] text-white font-semibold py-7 text-xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden rounded-lg"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
          <span className="relative flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
            Create Habit
          </span>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-[#8E9196] text-base mt-4"
      >
        Start your journey to better habits today
      </motion.div>
    </motion.form>
  );
}
