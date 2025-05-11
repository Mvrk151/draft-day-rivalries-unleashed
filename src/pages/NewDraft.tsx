
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { createDraft } from "@/data/mockData";

const NewDraft = () => {
  const [draftName, setDraftName] = useState("");
  const [gameMode, setGameMode] = useState<"champions_league" | "premier_league" | "top_5_leagues">("premier_league");
  const [numberOfTeams, setNumberOfTeams] = useState("2");
  const [teamNames, setTeamNames] = useState<{[key: string]: string}>({ userTeam: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Generate AI team name placeholders
  const generateTeamNamePlaceholder = (index: number) => {
    const options = [
      "The Champions", "Golden Stars", "Victory United", "Royal FC", 
      "Elite XI", "Thunder FC", "Phoenix Rising", "Titans FC"
    ];
    return options[(index + options.length) % options.length];
  };

  // Handle team name changes
  const handleTeamNameChange = (id: string, value: string) => {
    setTeamNames(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Validate team names are unique
  const validateTeamNames = () => {
    const names = Object.values(teamNames).filter(name => name.trim() !== "");
    const uniqueNames = new Set(names);
    
    if (names.length !== uniqueNames.size) {
      toast({
        title: "Duplicate team names",
        description: "Each team must have a unique name.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Generate default team names if empty
    const updatedTeamNames = { ...teamNames };
    if (!updatedTeamNames.userTeam.trim()) {
      updatedTeamNames.userTeam = `${user.username}'s Team`;
    }
    
    const numTeams = parseInt(numberOfTeams);
    for (let i = 1; i < numTeams; i++) {
      const teamId = `aiTeam${i}`;
      if (!updatedTeamNames[teamId] || !updatedTeamNames[teamId].trim()) {
        updatedTeamNames[teamId] = `AI Team ${i}`;
      }
    }
    
    setTeamNames(updatedTeamNames);
    
    // Validate unique team names
    if (!validateTeamNames()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const draft = createDraft(
        draftName || `${user.username}'s Draft`,
        gameMode,
        numTeams,
        user.id,
        updatedTeamNames.userTeam || `${user.username}'s Team`,
        Object.entries(updatedTeamNames)
          .filter(([key]) => key !== 'userTeam')
          .map(([_, name]) => name)
      );
      
      // Navigate to the draft room
      navigate(`/draft/room/${draft.id}`);
    } catch (error) {
      console.error("Error creating draft:", error);
      toast({
        title: "Error creating draft",
        description: "An error occurred while creating the draft.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Render additional team name inputs based on number of teams
  const renderTeamNameInputs = () => {
    const inputs = [];
    const numTeams = parseInt(numberOfTeams);
    
    // User team input (always first)
    inputs.push(
      <div key="userTeam" className="space-y-2">
        <Label htmlFor="userTeam">Your Team Name</Label>
        <Input
          id="userTeam"
          placeholder={user ? `${user.username}'s Team` : "My Team"}
          value={teamNames.userTeam || ''}
          onChange={(e) => handleTeamNameChange('userTeam', e.target.value)}
        />
      </div>
    );
    
    // AI team inputs
    for (let i = 1; i < numTeams; i++) {
      const teamId = `aiTeam${i}`;
      inputs.push(
        <div key={teamId} className="space-y-2">
          <Label htmlFor={teamId}>Opponent {i} Name</Label>
          <Input
            id={teamId}
            placeholder={generateTeamNamePlaceholder(i)}
            value={teamNames[teamId] || ''}
            onChange={(e) => handleTeamNameChange(teamId, e.target.value)}
          />
        </div>
      );
    }
    
    return inputs;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Create New Draft</h1>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Draft Setup</CardTitle>
                <CardDescription>
                  Configure your draft settings before starting the player selection process.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Draft Name */}
                <div className="space-y-2">
                  <Label htmlFor="draft-name">Draft Name</Label>
                  <Input
                    id="draft-name"
                    placeholder={user ? `${user.username}'s Draft` : "My Draft"}
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                  />
                </div>
                
                {/* Game Mode */}
                <div className="space-y-2">
                  <Label>Game Mode</Label>
                  <RadioGroup 
                    defaultValue="premier_league" 
                    value={gameMode}
                    onValueChange={(value) => setGameMode(value as any)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="premier_league" id="premier_league" />
                      <Label htmlFor="premier_league" className="cursor-pointer">Premier League</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="champions_league" id="champions_league" />
                      <Label htmlFor="champions_league" className="cursor-pointer">Champions League</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="top_5_leagues" id="top_5_leagues" />
                      <Label htmlFor="top_5_leagues" className="cursor-pointer">Top 5 Leagues</Label>
                    </div>
                  </RadioGroup>
                  <div className="text-sm text-gray-500 mt-2">
                    {gameMode === 'premier_league' && 'Draft from players in the English Premier League only.'}
                    {gameMode === 'champions_league' && 'Draft from players in teams participating in this year\'s Champions League.'}
                    {gameMode === 'top_5_leagues' && 'Draft from players in the Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.'}
                  </div>
                </div>
                
                {/* Number of Teams */}
                <div className="space-y-2">
                  <Label htmlFor="number-of-teams">Number of Teams</Label>
                  <Select 
                    value={numberOfTeams} 
                    onValueChange={(value) => {
                      setNumberOfTeams(value);
                      // Initialize team name fields for the new number of teams
                      const newTeamNames = { userTeam: teamNames.userTeam || '' };
                      for (let i = 1; i < parseInt(value); i++) {
                        const teamId = `aiTeam${i}`;
                        newTeamNames[teamId] = teamNames[teamId] || '';
                      }
                      setTeamNames(newTeamNames);
                    }}
                  >
                    <SelectTrigger id="number-of-teams">
                      <SelectValue placeholder="Select number of teams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Teams</SelectItem>
                      <SelectItem value="3">3 Teams</SelectItem>
                      <SelectItem value="4">4 Teams</SelectItem>
                      <SelectItem value="5">5 Teams</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-gray-500 mt-2">
                    You will control one team, and the rest will be controlled by friends taking turns on this device.
                  </div>
                </div>
                
                {/* Team Names */}
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                  <h3 className="font-semibold">Team Names</h3>
                  <p className="text-sm text-gray-500">Each team must have a unique name.</p>
                  <div className="grid gap-4">
                    {renderTeamNameInputs()}
                  </div>
                </div>
                
                {/* Formation Info */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Team Formation: 4-3-3</h3>
                  <p className="text-sm text-gray-600 mb-2">Each team will consist of:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>1 Goalkeeper (GK)</li>
                    <li>4 Defenders (DEF)</li>
                    <li>3 Midfielders (MID)</li>
                    <li>3 Forwards (FWD)</li>
                  </ul>
                </div>
                
                {/* Draft Rules */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Draft Rules</h3>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Teams take turns selecting players</li>
                    <li>Maximum 2 players from the same real-world team per draft team</li>
                    <li>Selected players are removed from the available pool</li>
                    <li>The draft ends when all teams have completed their 11-player roster</li>
                    <li>Play locally with friends taking turns on this device</li>
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-team-blue"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Draft..." : "Create Draft"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewDraft;
