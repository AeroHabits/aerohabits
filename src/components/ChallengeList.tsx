import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChallengeCard } from "./ChallengeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card } from "./ui/card";
import { Star, Flame, Award, Crown } from "lucide-react";

export function ChallengeList() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return data.map(challenge => ({
        ...challenge,
        milestones: Array.isArray(challenge.milestones) 
          ? challenge.milestones 
          : challenge.milestones 
            ? JSON.parse(challenge.milestones as string)
            : []
      }));
    },
  });

  const { data: userChallenges } = useQuery({
    queryKey: ["user-challenges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_challenges")
        .select("challenge_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map(uc => uc.challenge_id);
    },
  });

  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_challenges")
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-challenges"] });
    },
  });

  const filteredChallenges = challenges?.filter(challenge => 
    selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty
  );

  if (isLoading) {
    return <div className="text-center">Loading challenges...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Challenge Difficulty Levels</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-green-500" />
            <span><strong>Easy:</strong> Perfect for beginners. These challenges help build basic habits with manageable daily tasks.</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-yellow-500" />
            <span><strong>Medium:</strong> For those ready to push themselves. These challenges require more dedication and consistency.</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-red-500" />
            <span><strong>Hard:</strong> Advanced challenges that test your commitment. These require significant effort and dedication.</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-purple-500" />
            <span><strong>Master:</strong> Elite-level challenges for those seeking the ultimate test. These challenges demand exceptional discipline and unwavering commitment.</span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" onClick={() => setSelectedDifficulty("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="easy" onClick={() => setSelectedDifficulty("easy")}>
            Easy
          </TabsTrigger>
          <TabsTrigger value="medium" onClick={() => setSelectedDifficulty("medium")}>
            Medium
          </TabsTrigger>
          <TabsTrigger value="hard" onClick={() => setSelectedDifficulty("hard")}>
            Hard
          </TabsTrigger>
          <TabsTrigger value="master" onClick={() => setSelectedDifficulty("master")}>
            Master
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges?.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onJoin={(challengeId) => joinChallengeMutation.mutate(challengeId)}
            isJoined={userChallenges?.includes(challenge.id)}
          />
        ))}
      </div>
    </div>
  );
}