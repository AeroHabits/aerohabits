import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { HabitCategory } from "@/types";
import { FormHeading } from "@/components/habits/FormHeading";
import { HabitFormInputs } from "@/components/habits/HabitFormInputs";
import { CategorySelector } from "@/components/habits/CategorySelector";
import { SubmitButton } from "@/components/habits/SubmitButton";
interface AddHabitFormProps {
  onAddHabit: (habit: {
    title: string;
    description: string;
    category_id?: string;
  }) => void;
}
export function AddHabitForm({
  onAddHabit
}: AddHabitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<HabitCategory[]>([]);
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    const {
      data,
      error
    } = await supabase.from('habit_categories').select('*').order('name');
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
        variant: "destructive"
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
      description: "New habit added successfully!"
    });
  };
  return <motion.form onSubmit={handleSubmit} initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.4
  }} className="space-y-6 bg-gradient-to-br from-[#1F2A47] to-[#1A1F2C] backdrop-blur-lg p-8 shadow-2xl border border-[#403E43]/50 hover:border-[#9b87f5]/50 transition-all duration-300 rounded-md">
      <FormHeading />

      <div className="space-y-5">
        <HabitFormInputs title={title} setTitle={setTitle} description={description} setDescription={setDescription} />
        
        <CategorySelector selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} fetchCategories={fetchCategories} />
      </div>
      
      <SubmitButton />

      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.5
    }} className="text-center text-blue-200 text-sm mt-4">
        ✨ Start your journey to better habits today ✨
      </motion.div>
    </motion.form>;
}