
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
  { name: 'Purple', value: '#a855f7' },
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
      className="space-y-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-center space-x-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full shadow-lg"
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-white"
        >
          Create New Habit
        </motion.div>
      </div>

      <div className="space-y-4">
        <motion.div
          animate={isTitleFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <Input
            placeholder="Enter your new habit..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            className="pl-10 bg-white/10 border-2 border-white/20 focus:border-blue-400 text-white placeholder:text-white/50 text-lg font-medium rounded-lg transition-all duration-300 hover:border-white/30 focus:ring-2 focus:ring-blue-400/50 focus:ring-opacity-50"
          />
        </motion.div>
        
        <motion.div
          animate={isDescriptionFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute top-3 left-3 pointer-events-none">
            <CircuitBoard className="w-5 h-5 text-blue-400" />
          </div>
          <Textarea
            placeholder="Describe your habit..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            className="pl-10 bg-white/10 border-2 border-white/20 focus:border-blue-400 text-white placeholder:text-white/50 text-base rounded-lg min-h-[100px] transition-all duration-300 hover:border-white/30 focus:ring-2 focus:ring-blue-400/50 focus:ring-opacity-50"
          />
        </motion.div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full bg-white/10 border-2 border-white/20 focus:border-blue-400 text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <LucideIcon 
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
                className="bg-white/10 border-2 border-white/20 hover:bg-white/20"
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
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full"
                />
                
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
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
                      <LucideIcon name={icon} className="w-4 h-4" />
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
        </div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <Button 
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden rounded-lg"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/40 to-indigo-400/40 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
          <span className="relative flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse" />
            Create Habit
          </span>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-white/60 text-sm mt-4"
      >
        Start your journey to better habits today
      </motion.div>
    </motion.form>
  );
}
