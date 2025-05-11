
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { Draft, FootballPlayer } from "@/types";
import { mockDrafts, getPlayersByMode, selectPlayer, aiDraftPick } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const DraftRoom = () => {
  const { draftId } = useParams();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<FootballPlayer[]>([]);
  const [currentFilter, setCurrentFilter] = useState<"GK" | "DEF" | "MID" | "FWD" | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the user's team
  const userTeam = draft?.teams.find(team => user && team.owner.id === user.id);
  
  // Check if it's the user's turn
  const isUserTurn = draft?.teams[draft?.currentTeamIndex || 0]?.owner.id === user?.id;
  
  // Determine which position to pick next based on team needs
  const getNextPositionToDraft = () => {
    if (!userTeam) return null;
    
    const teamPositionCounts = {
      GK: userTeam.players.filter(p => p.position === 'GK').length,
      DEF: userTeam.players.filter(p => p.position === 'DEF').length,
      MID: userTeam.players.filter(p => p.position === 'MID').length,
      FWD: userTeam.players.filter(p => p.position === 'FWD').length
    };
    
    if (teamPositionCounts.GK < 1) return "GK";
    if (teamPositionCounts.DEF < 4) return "DEF";
    if (teamPositionCounts.MID < 3) return "MID";
    if (teamPositionCounts.FWD < 3) return "FWD";
    
    return null; // Team is complete
  };
  
  // Load draft data
  useEffect(() => {
    const loadDraft = () => {
      if (!draftId) return;
      
      const foundDraft = mockDrafts.find(d => d.id === draftId);
      if (foundDraft) {
        setDraft(foundDraft);
        
        // Load available players based on mode
        const allPlayers = getPlayersByMode(foundDraft.mode);
        
        // Filter out already drafted players
        const draftedPlayerIds = foundDraft.teams.flatMap(team => team.players.map(p => p.id));
        const undraftedPlayers = allPlayers.filter(p => !draftedPlayerIds.includes(p.id));
        
        setAvailablePlayers(undraftedPlayers);
        
        // If draft is complete, redirect to view page
        if (foundDraft.status === 'completed') {
          navigate(`/draft/view/${draftId}`);
        }
      } else {
        toast({
          title: "Draft not found",
          description: "The requested draft could not be found.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    };
    
    loadDraft();
  }, [draftId, navigate, toast]);
  
  // Make AI picks if it's AI's turn
  useEffect(() => {
    if (!draft || !draftId) return;
    
    const currentTeam = draft.teams[draft.currentTeamIndex];
    if (!currentTeam) return;
    
    // If it's AI's turn, make a pick after a short delay
    if (currentTeam.owner.id.startsWith('ai-') && draft.status !== 'completed') {
      const timeoutId = setTimeout(() => {
        const updatedDraft = aiDraftPick(draftId);
        if (updatedDraft) {
          setDraft(updatedDraft);
          
          // Update available players
          const allPlayers = getPlayersByMode(updatedDraft.mode);
          const draftedPlayerIds = updatedDraft.teams.flatMap(team => team.players.map(p => p.id));
          const undraftedPlayers = allPlayers.filter(p => !draftedPlayerIds.includes(p.id));
          setAvailablePlayers(undraftedPlayers);
          
          // If the draft is now complete, redirect to view page
          if (updatedDraft.status === 'completed') {
            toast({
              title: "Draft Complete!",
              description: "All teams have completed their selection.",
            });
            navigate(`/draft/view/${draftId}`);
          }
        }
      }, 1500); // 1.5 second delay for AI picks
      
      return () => clearTimeout(timeoutId);
    }
  }, [draft, draftId, navigate, toast]);
  
  // Handle player selection
  const handleSelectPlayer = (playerId: string) => {
    if (!draft || !draftId || !user || !isUserTurn) return;
    
    const currentTeam = draft.teams[draft.currentTeamIndex];
    if (currentTeam.owner.id !== user.id) return;
    
    try {
      // Make the selection
      const updatedDraft = selectPlayer(draftId, playerId, currentTeam.id);
      if (updatedDraft) {
        setDraft(updatedDraft);
        
        // Update available players
        const allPlayers = getPlayersByMode(updatedDraft.mode);
        const draftedPlayerIds = updatedDraft.teams.flatMap(team => team.players.map(p => p.id));
        const undraftedPlayers = allPlayers.filter(p => !draftedPlayerIds.includes(p.id));
        setAvailablePlayers(undraftedPlayers);
        
        toast({
          title: "Player Selected",
          description: `You've added a player to your team.`,
        });
        
        // If the draft is now complete, redirect to view page
        if (updatedDraft.status === 'completed') {
          toast({
            title: "Draft Complete!",
            description: "All teams have completed their selection.",
          });
          navigate(`/draft/view/${draftId}`);
        }
      }
    } catch (error: any) {
      toast({
        title: "Selection Error",
        description: error.message || "Could not select this player",
        variant: "destructive",
      });
    }
  };
  
  // Filter players by position and search term
  const filteredPlayers = availablePlayers.filter(player => {
    const matchesPosition = currentFilter === "ALL" || player.position === currentFilter;
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          player.team.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPosition && matchesSearch;
  });
  
  // Get current team drafting
  const currentTeam = draft?.teams[draft?.currentTeamIndex || 0];
  
  if (!draft || !draftId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading draft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          {/* Draft Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{draft.name}</h1>
              <Badge className="text-sm" variant={draft.status === 'in_progress' ? 'default' : 'outline'}>
                {draft.status === 'setup' && 'Setup'}
                {draft.status === 'in_progress' && 'In Progress'}
                {draft.status === 'completed' && 'Completed'}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="bg-white p-2 px-4 rounded-lg border flex items-center">
                <span className="font-medium mr-2">Mode:</span>
                {draft.mode === 'champions_league' && 'Champions League'}
                {draft.mode === 'premier_league' && 'Premier League'}
                {draft.mode === 'top_5_leagues' && 'Top 5 Leagues'}
              </div>
              
              <div className="bg-white p-2 px-4 rounded-lg border">
                <span className="font-medium mr-2">Teams:</span>
                {draft.teams.length}
              </div>
              
              <div className="bg-white p-2 px-4 rounded-lg border flex items-center">
                <span className="font-medium mr-2">Formation:</span>
                4-3-3
              </div>
            </div>
          </div>
          
          {/* Current Turn Indicator */}
          <div className="bg-white p-4 rounded-lg border mb-8">
            <h2 className="text-lg font-semibold mb-2">
              {isUserTurn ? "It's your turn to draft!" : `Waiting for ${currentTeam?.owner.username} to make a pick...`}
            </h2>
            <div className="flex items-center">
              <div 
                className={`h-4 w-4 rounded-full mr-2 ${isUserTurn ? 'bg-green-500' : 'bg-amber-400'}`}
              ></div>
              <p>
                {isUserTurn ? (
                  <>
                    Pick a <strong>{getNextPositionToDraft() || 'player'}</strong> for your team
                  </>
                ) : (
                  "AI is making its selection..."
                )}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player Selection Panel */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Available Players</CardTitle>
                  <CardDescription>
                    Select players to build your team in 4-3-3 formation
                  </CardDescription>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search players or teams..."
                        className="w-full p-2 border rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Tabs value={currentFilter} onValueChange={(value) => setCurrentFilter(value as any)} className="w-full sm:w-auto">
                      <TabsList>
                        <TabsTrigger value="ALL">All</TabsTrigger>
                        <TabsTrigger value="GK">GK</TabsTrigger>
                        <TabsTrigger value="DEF">DEF</TabsTrigger>
                        <TabsTrigger value="MID">MID</TabsTrigger>
                        <TabsTrigger value="FWD">FWD</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {filteredPlayers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredPlayers.map((player) => (
                        <div
                          key={player.id}
                          className={`player-card bg-white border rounded-lg overflow-hidden shadow-sm ${
                            isUserTurn ? 'cursor-pointer hover:border-team-blue' : 'opacity-70'
                          }`}
                          onClick={() => isUserTurn && handleSelectPlayer(player.id)}
                        >
                          <div className={`h-2 ${
                            player.position === 'GK' ? 'bg-team-gold' : 
                            player.position === 'DEF' ? 'bg-team-blue' : 
                            player.position === 'MID' ? 'bg-green-500' : 
                            'bg-team-red'
                          }`}></div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{player.name}</h3>
                              <Badge variant="outline">{player.position}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{player.team}</p>
                            <p className="text-xs text-gray-500">{player.league}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No players match your search or filter.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Team Status Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Team Status</CardTitle>
                  <CardDescription>
                    Current teams and their progress
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {draft.teams.map((team, index) => {
                    const isCurrentTurn = index === draft.currentTeamIndex;
                    return (
                      <div 
                        key={team.id}
                        className={`border rounded-lg p-4 ${isCurrentTurn ? 'border-team-blue bg-blue-50' : ''}`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold">
                            {team.name}
                            {team.owner.id === user?.id && " (You)"}
                          </h3>
                          {isCurrentTurn && (
                            <Badge>Current Turn</Badge>
                          )}
                        </div>
                        
                        {/* Position counts */}
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">GK</div>
                            <div className="font-semibold">{team.players.filter(p => p.position === 'GK').length}/1</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">DEF</div>
                            <div className="font-semibold">{team.players.filter(p => p.position === 'DEF').length}/4</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">MID</div>
                            <div className="font-semibold">{team.players.filter(p => p.position === 'MID').length}/3</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">FWD</div>
                            <div className="font-semibold">{team.players.filter(p => p.position === 'FWD').length}/3</div>
                          </div>
                        </div>
                        
                        {/* Player list */}
                        <div className="text-sm">
                          {team.players.length > 0 ? (
                            <div>
                              <div className="font-medium mb-1">Selected Players:</div>
                              <div className="space-y-1">
                                {team.players.map(player => (
                                  <div key={player.id} className="flex justify-between">
                                    <span>{player.name}</span>
                                    <span className="text-gray-500">{player.position}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500 italic">No players selected yet</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DraftRoom;
