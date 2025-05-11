import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { Draft } from "@/types";
import { mockDrafts } from "@/data/mockData";

const FormationView = ({ team }: { team: Draft['teams'][0] }) => {
  // Get players by position
  const goalkeepers = team.players.filter(p => p.position === 'GK');
  const defenders = team.players.filter(p => p.position === 'DEF');
  const midfielders = team.players.filter(p => p.position === 'MID');
  const forwards = team.players.filter(p => p.position === 'FWD');
  
  return (
    <div className="pitch-background bg-pitch h-[600px] w-full max-w-md mx-auto rounded-xl shadow-lg overflow-hidden relative">
      {/* Field lines */}
      <div className="absolute inset-0">
        <div className="border-2 border-white opacity-50 h-full w-full"></div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white rounded-full opacity-50"></div>
        
        {/* Center line */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-0.5 bg-white opacity-50"></div>
        
        {/* Penalty boxes */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-16 border-b-2 border-x-2 border-white opacity-50"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 border-t-2 border-x-2 border-white opacity-50"></div>
      </div>
      
      {/* Forwards */}
      <div className="absolute top-[20%] left-0 right-0 flex justify-around">
        {forwards.map((player, idx) => (
          <div key={player.id} className="flex flex-col items-center">
            <div className="w-11 h-11 bg-team-red rounded-full flex items-center justify-center shadow-md mb-1">
              <span className="text-white font-bold text-sm">FWD</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-center max-w-[100px]">
              <div className="font-semibold text-xs truncate">{player.name}</div>
              <div className="text-[10px] text-gray-600 truncate">{player.team}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Midfielders */}
      <div className="absolute top-[40%] left-0 right-0 flex justify-around">
        {midfielders.map((player, idx) => (
          <div key={player.id} className="flex flex-col items-center">
            <div className="w-11 h-11 bg-pitch-dark rounded-full flex items-center justify-center shadow-md mb-1">
              <span className="text-white font-bold text-sm">MID</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-center max-w-[100px]">
              <div className="font-semibold text-xs truncate">{player.name}</div>
              <div className="text-[10px] text-gray-600 truncate">{player.team}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Defenders */}
      <div className="absolute top-[60%] left-0 right-0 flex justify-around">
        {defenders.map((player, idx) => (
          <div key={player.id} className="flex flex-col items-center">
            <div className="w-11 h-11 bg-team-blue rounded-full flex items-center justify-center shadow-md mb-1">
              <span className="text-white font-bold text-sm">DEF</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-center max-w-[100px]">
              <div className="font-semibold text-xs truncate">{player.name}</div>
              <div className="text-[10px] text-gray-600 truncate">{player.team}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Goalkeeper */}
      <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        {goalkeepers.length > 0 && (
          <>
            <div className="w-11 h-11 bg-team-gold rounded-full flex items-center justify-center shadow-md mb-1">
              <span className="text-black font-bold text-sm">GK</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-center">
              <div className="font-semibold text-xs">{goalkeepers[0].name}</div>
              <div className="text-[10px] text-gray-600">{goalkeepers[0].team}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ViewDraft = () => {
  const { draftId } = useParams();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const { toast } = useToast();
  
  // Load draft data
  useEffect(() => {
    if (!draftId) return;
    
    const foundDraft = mockDrafts.find(d => d.id === draftId);
    if (foundDraft) {
      setDraft(foundDraft);
      setShareUrl(`${window.location.origin}/draft/view/${draftId}`);
    }
  }, [draftId]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share this link with your friends.",
    });
  };
  
  if (!draft) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading draft results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          {/* Draft Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{draft.name}</h1>
              <Badge className="bg-green-500">Completed</Badge>
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
                <span className="font-medium mr-2">Completed:</span>
                {new Date(draft.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Share Link */}
          <Card className="mb-8">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-lg mb-1">Share Draft Results</h2>
                <p className="text-sm text-gray-600">Share this link with your friends so they can see the drafted teams.</p>
              </div>
              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="border rounded p-2 text-sm flex-1 bg-gray-50"
                />
                <Button onClick={handleCopyLink}>Copy</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Team Selection Tabs */}
          <div className="mb-4">
            <Tabs 
              defaultValue={`team-${activeTeamIndex}`}
              onValueChange={(value) => setActiveTeamIndex(parseInt(value.split('-')[1]))}
              className="w-full"
            >
              <TabsList className="w-full md:w-auto flex overflow-x-auto">
                {draft.teams.map((team, index) => (
                  <TabsTrigger key={team.id} value={`team-${index}`}>
                    {team.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Team View */}
          {draft.teams.map((team, index) => (
            <div key={team.id} className={activeTeamIndex === index ? 'block' : 'hidden'}>
              <Card>
                <CardHeader>
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription>
                    Managed by {team.owner.username}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formation View */}
                    <div>
                      <h3 className="font-semibold text-xl mb-4 text-center">4-3-3 Formation</h3>
                      <FormationView team={team} />
                    </div>
                    
                    {/* Player List View */}
                    <div>
                      <h3 className="font-semibold text-xl mb-4">Team Roster</h3>
                      
                      {/* Goalkeepers */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-gray-500 mb-2">Goalkeepers</h4>
                        {team.players.filter(p => p.position === 'GK').map(player => (
                          <div key={player.id} className="bg-white border rounded-lg p-3 mb-2 flex justify-between">
                            <div>
                              <div className="font-medium">{player.name}</div>
                              <div className="text-sm text-gray-600">{player.team}</div>
                            </div>
                            <Badge variant="outline">{player.position}</Badge>
                          </div>
                        ))}
                      </div>
                      
                      {/* Defenders */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-gray-500 mb-2">Defenders</h4>
                        <div className="space-y-2">
                          {team.players.filter(p => p.position === 'DEF').map(player => (
                            <div key={player.id} className="bg-white border rounded-lg p-3 flex justify-between">
                              <div>
                                <div className="font-medium">{player.name}</div>
                                <div className="text-sm text-gray-600">{player.team}</div>
                              </div>
                              <Badge variant="outline">{player.position}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Midfielders */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-gray-500 mb-2">Midfielders</h4>
                        <div className="space-y-2">
                          {team.players.filter(p => p.position === 'MID').map(player => (
                            <div key={player.id} className="bg-white border rounded-lg p-3 flex justify-between">
                              <div>
                                <div className="font-medium">{player.name}</div>
                                <div className="text-sm text-gray-600">{player.team}</div>
                              </div>
                              <Badge variant="outline">{player.position}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Forwards */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-500 mb-2">Forwards</h4>
                        <div className="space-y-2">
                          {team.players.filter(p => p.position === 'FWD').map(player => (
                            <div key={player.id} className="bg-white border rounded-lg p-3 flex justify-between">
                              <div>
                                <div className="font-medium">{player.name}</div>
                                <div className="text-sm text-gray-600">{player.team}</div>
                              </div>
                              <Badge variant="outline">{player.position}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          
          <div className="mt-6 flex justify-center">
            <Link to="/dashboard">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ViewDraft;
