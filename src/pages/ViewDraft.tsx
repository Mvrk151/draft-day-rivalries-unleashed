
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { Draft } from "@/types";
import { mockDrafts } from "@/data/mockData";

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

const FormationView = ({ team }: { team: Draft['teams'][0] }) => {
  // Get player for each specific position
  const getPlayerInPosition = (position: string) => {
    return team.players.find(p => p.specificPosition === position);
  };
  
  return (
    <div className="pitch-background bg-pitch h-[600px] w-full max-w-md mx-auto rounded-xl shadow-lg overflow-hidden relative">
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
      
      {/* Player positions */}
      {Object.entries(positionsMap).map(([position, {label, className, color}]) => {
        const player = getPlayerInPosition(position);
        
        return (
          <div key={position} className={`absolute ${className} flex flex-col items-center`}>
            <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center shadow-md mb-2 border-2 border-gray-200`}>
              <span className="font-bold text-lg">{position}</span>
            </div>
            {player && (
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-center max-w-[120px] shadow-sm">
                <div className="font-semibold text-xs truncate">{player.name}</div>
                <div className="text-[10px] text-gray-600 truncate">{player.team}</div>
              </div>
            )}
          </div>
        );
      })}
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
  
  const handleShareToInstagram = () => {
    // Create a message for Instagram sharing
    const shareText = draft ? 
      `Check out our ${draft.mode.replace('_', ' ')} Fantasy Draft: ${draft.name}! ⚽️ ${shareUrl}` : 
      `Check out this Fantasy Football Draft! ${shareUrl}`;
      
    // On mobile devices, deep links to Instagram stories might work
    // But for web, we can copy the text and prompt the user to paste in Instagram
    navigator.clipboard.writeText(shareText);
    
    // Open Instagram in a new tab
    window.open('https://www.instagram.com/', '_blank');
    
    toast({
      title: "Ready to share on Instagram!",
      description: "Text copied to clipboard. Paste it in your Instagram post or story.",
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
                <p className="text-sm text-gray-600">Share this link with your friends on Instagram</p>
              </div>
              <Button 
                onClick={handleShareToInstagram}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
              >
                <Instagram size={18} />
                <span>Share to Instagram</span>
              </Button>
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
                            <Badge variant="outline">{player.specificPosition || player.position}</Badge>
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
                              <Badge variant="outline">{player.specificPosition || player.position}</Badge>
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
                              <Badge variant="outline">{player.specificPosition || player.position}</Badge>
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
                              <Badge variant="outline">{player.specificPosition || player.position}</Badge>
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
