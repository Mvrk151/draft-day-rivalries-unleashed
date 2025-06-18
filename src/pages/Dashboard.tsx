
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Draft } from "@/types";
import { mockDrafts } from "@/data/mockData";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [userDrafts, setUserDrafts] = useState<Draft[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Filter drafts to only show ones where the user is a participant
    if (user) {
      const filteredDrafts = mockDrafts.filter(draft => 
        draft.teams.some(team => team.owner.id === user.id)
      );
      setUserDrafts(filteredDrafts);
    }
  }, [user]);

  const handleDeleteDraft = (draftId: string) => {
    setUserDrafts(prevDrafts => prevDrafts.filter(draft => draft.id !== draftId));
    toast({
      title: "Draft deleted",
      description: "The draft has been successfully deleted.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
            <p className="text-gray-600">Manage your football drafts and create new ones.</p>
          </div>
          
          {/* Actions Section */}
          <div className="mb-8">
            <Link to="/draft/new">
              <Button className="bg-team-blue">
                <Plus className="mr-2 h-4 w-4" />
                Create New Draft
              </Button>
            </Link>
          </div>
          
          {/* My Drafts Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">My Drafts</h2>
            
            {userDrafts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userDrafts.map((draft) => (
                  <Card key={draft.id} className="overflow-hidden relative">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-10 h-8 w-8 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{draft.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <CardHeader className="bg-team-blue text-white">
                      <CardTitle>{draft.name}</CardTitle>
                      <CardDescription className="text-gray-200">
                        {draft.mode === 'champions_league' && 'Champions League Mode'}
                        {draft.mode === 'premier_league' && 'Premier League Mode'}
                        {draft.mode === 'top_5_leagues' && 'Top 5 Leagues Mode'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-500">Status</p>
                          <div className="flex items-center mt-1">
                            <div className={`h-3 w-3 rounded-full mr-2 ${
                              draft.status === 'completed' 
                                ? 'bg-green-500' 
                                : draft.status === 'in_progress' 
                                  ? 'bg-amber-500'
                                  : 'bg-blue-500'
                            }`}></div>
                            <p>
                              {draft.status === 'completed' && 'Completed'}
                              {draft.status === 'in_progress' && 'In Progress'}
                              {draft.status === 'setup' && 'Setup'}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-semibold text-gray-500">Teams</p>
                          <p>{draft.teams.length} teams</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-semibold text-gray-500">Created</p>
                          <p>{new Date(draft.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t flex gap-3">
                      {draft.status === 'completed' ? (
                        <Link to={`/draft/view/${draft.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            View Results
                          </Button>
                        </Link>
                      ) : (
                        <Link to={`/draft/room/${draft.id}`} className="w-full">
                          <Button variant="default" className="w-full bg-team-blue">
                            {draft.status === 'setup' ? 'Start Draft' : 'Continue Draft'}
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white border rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">You don't have any drafts yet</h3>
                <p className="text-gray-600 mb-6">Create your first draft to get started!</p>
                <Link to="/draft/new">
                  <Button variant="default" className="bg-team-blue">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Draft
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
