import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { Draft, FootballPlayer } from "@/types";
import { mockDrafts, getPlayersByMode, selectPlayer } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const positionsMap = {
  'GK': { label: 'Goalkeeper', className: 'bottom-[5%] left-1/2 -translate-x-1/2', color: 'bg-white text-black' },
  'LB': { label: 'Left Back', className: 'bottom-[25%] left-[10%]', color: 'bg-white text-black' },
  'LCB': { label: 'Left Center Back', className: 'bottom-[18%] left-[30%]', color: 'bg-white text-black' },
  'RCB': { label: 'Right Center Back', className: 'bottom-[18%] right-[30%]', color: 'bg-white text-black' },
  'RB': { label: 'Right Back', className: 'bottom-[25%] right-[10%]', color: 'bg-white text-black' },
  'LCM': { label: 'Left Center Mid', className: 'top-[45%] left-[25%]', color: 'bg-white text-black' },
  'CM': { label: 'Center Mid', className: 'top-[50%] left-1/2 -translate-x-1/2', color: 'bg-white text-black' },
  'RCM': { label: 'Right Center Mid', className: 'top-[45%] right-[25%]', color: 'bg-white text-black' },
  'LW': { label: 'Left Wing', className: 'top-[20%] left-[15%]', color: 'bg-white text-black' },
  'ST': { label: 'Striker', className: 'top-[15%] left-1/2 -translate-x-1/2', color: 'bg-white text-black' },
  'RW': { label: 'Right Wing', className: 'top-[20%] right-[15%]', color: 'bg-white text-black' },
};

const positionCategories = {
  'GK': 'GK',
  'LB': 'DEF', 'LCB': 'DEF', 'RCB': 'DEF', 'RB': 'DEF',
  'LCM': 'MID', 'CM': 'MID', 'RCM': 'MID',
  'LW': 'FWD', 'ST': 'FWD', 'RW': 'FWD'
};

const DraftRoom = () => {
  const { draftId } = useParams();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<FootballPlayer[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<FootballPlayer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [showPositionSelector, setShowPositionSelector] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the user's team
  const userTeam = draft?.teams.find(team => user && team.owner.id === user.id);
  
  // Check if it's the user's turn
  const isUserTurn = draft?.teams[draft?.currentTeamIndex || 0]?.owner.id === user?.id;
  
  // Get position status for team formation
  const getPositionStatus = (position: string) => {
    if (!userTeam) return "empty";
    
    const playerWithPosition = userTeam.players.find(p => p.specificPosition === position);
    return playerWithPosition ? "filled" : "empty";
  };
  
  // Get player in position
  const getPlayerInPosition = (position: string) => {
    if (!userTeam) return null;
    
    return userTeam.players.find(p => p.specificPosition === position);
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
  
  // Handle filtering players by selected position
  useEffect(() => {
    if (selectedPosition && availablePlayers.length > 0) {
      const category = positionCategories[selectedPosition as keyof typeof positionCategories];
      const players = availablePlayers.filter(player => {
        const matchesCategory = player.position === category;
        const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             player.team.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });
      setFilteredPlayers(players);
    } else {
      setFilteredPlayers([]);
    }
  }, [selectedPosition, availablePlayers, searchTerm]);
  
  // Handle player selection
  const handleSelectPlayer = (playerId: string) => {
    if (!draft || !draftId || !user || !isUserTurn || !selectedPosition) {
      return;
    }
    
    const currentTeam = draft.teams[draft.currentTeamIndex];
    if (currentTeam.owner.id !== user.id) return;
    
    try {
      // First get the player to check position
      const player = availablePlayers.find(p => p.id === playerId);
      if (!player) return;
      
      // Verify player position matches selected position category
      const requiredCategory = positionCategories[selectedPosition as keyof typeof positionCategories];
      if (player.position !== requiredCategory) {
        toast({
          title: "Position mismatch",
          description: `This player can't play in the ${positionsMap[selectedPosition as keyof typeof positionsMap].label} position.`,
          variant: "destructive",
        });
        return;
      }
      
      // Create a copy of the player with the specific position
      const playerWithPosition = {
        ...player,
        specificPosition: selectedPosition as any
      };
      
      // Make the selection
      const updatedDraft = selectPlayer(draftId, playerId, currentTeam.id, selectedPosition as any);
      if (updatedDraft) {
        setDraft(updatedDraft);
        
        // Update available players
        const allPlayers = getPlayersByMode(updatedDraft.mode);
        const draftedPlayerIds = updatedDraft.teams.flatMap(team => team.players.map(p => p.id));
        const undraftedPlayers = allPlayers.filter(p => !draftedPlayerIds.includes(p.id));
        setAvailablePlayers(undraftedPlayers);
        
        // Reset position selection and close modal
        setSelectedPosition(null);
        setShowPositionSelector(false);
        
        toast({
          title: "Player Selected",
          description: `You've added ${player.name} as ${positionsMap[selectedPosition as keyof typeof positionsMap].label}`,
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
  
  const handlePositionClick = (position: string) => {
    if (!isUserTurn) {
      toast({
        title: "Not your turn",
        description: "Please wait for your turn to select a player.",
      });
      return;
    }
    
    // Check if position is already filled
    if (userTeam?.players.some(p => p.specificPosition === position)) {
      toast({
        title: "Position already filled",
        description: "This position already has a player assigned.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedPosition(position);
    setShowPositionSelector(true);
  };
  
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
            </div>
          </div>
          
          {/* Current Turn Indicator */}
          <div className="bg-white p-4 rounded-lg border mb-8">
            <h2 className="text-lg font-semibold mb-2">
              {isUserTurn ? "It's your turn to draft!" : `Waiting for ${currentTeam?.owner.username}'s turn...`}
            </h2>
            <div className="flex items-center">
              <div 
                className={`h-4 w-4 rounded-full mr-2 ${isUserTurn ? 'bg-green-500' : 'bg-amber-400'}`}
              ></div>
              <p>
                {isUserTurn ? (
                  <>
                    Click on an empty position to select a player
                  </>
                ) : (
                  "Another player is making a selection..."
                )}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formation View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Team Formation</CardTitle>
                  <CardDescription>
                    Click on a position to select a player - 4-3-3 formation
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="pitch-background bg-pitch h-[600px] w-full max-w-2xl mx-auto rounded-xl shadow-lg overflow-hidden relative">
                    {/* Field lines */}
                    <div className="absolute inset-0">
                      <div className="border-2 border-white opacity-50 h-full w-full"></div>
                      
                      {/* Center circle */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full opacity-50"></div>
                      
                      {/* Center line */}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-0.5 bg-white opacity-50"></div>
                      
                      {/* Penalty boxes */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border-b-2 border-x-2 border-white opacity-50"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border-t-2 border-x-2 border-white opacity-50"></div>
                      
                      {/* Goal boxes */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-8 border-b-2 border-x-2 border-white opacity-50"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-8 border-t-2 border-x-2 border-white opacity-50"></div>
                    </div>
                    
                    {/* Position spots */}
                    {Object.entries(positionsMap).map(([position, {label, className, color}]) => {
                      const playerInPosition = getPlayerInPosition(position);
                      const isEmpty = getPositionStatus(position) === "empty";
                      
                      return (
                        <div 
                          key={position}
                          className={`absolute ${className} flex flex-col items-center cursor-pointer transition-transform hover:scale-105`}
                          onClick={() => handlePositionClick(position)}
                        >
                          <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center shadow-md mb-2 border-2 border-gray-200`}>
                            <span className="font-bold text-sm">{position}</span>
                          </div>
                          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-center max-w-[120px] shadow-sm">
                            {isEmpty ? (
                              <span className="text-gray-600 italic text-xs">Click to select</span>
                            ) : (
                              <>
                                <div className="font-semibold text-xs truncate">{playerInPosition?.name}</div>
                                <div className="text-[10px] text-gray-600 truncate">{playerInPosition?.team}</div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Team Status Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Teams Status</CardTitle>
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
                                    <span className="text-gray-500">{player.specificPosition || player.position}</span>
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
      
      {/* Player Selection Modal */}
      {showPositionSelector && selectedPosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Select {positionsMap[selectedPosition as keyof typeof positionsMap].label}</CardTitle>
                  <CardDescription>
                    Choose a player for the {selectedPosition} position
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setShowPositionSelector(false);
                    setSelectedPosition(null);
                  }}
                >
                  ✕
                </Button>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search players or teams..."
                  className="w-full p-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="overflow-y-auto flex-grow py-4">
              {filteredPlayers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="player-card bg-white border rounded-lg overflow-hidden shadow-sm cursor-pointer hover:border-team-blue"
                      onClick={() => handleSelectPlayer(player.id)}
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
            
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setShowPositionSelector(false);
                  setSelectedPosition(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DraftRoom;
