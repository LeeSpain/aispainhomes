import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Instruction {
  id: string;
  category: 'property_search' | 'relocation' | 'services' | 'general';
  instruction: string;
  is_active: boolean;
  priority: number;
}

const CATEGORIES = [
  { value: 'property_search', label: 'Property Search' },
  { value: 'relocation', label: 'Relocation' },
  { value: 'services', label: 'Services' },
  { value: 'general', label: 'General' },
];

export default function AIInstructionsManager() {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newInstruction, setNewInstruction] = useState({
    category: 'general' as const,
    instruction: '',
    priority: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadInstructions();
  }, []);

  const loadInstructions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_client_instructions')
        .select('*')
        .eq('user_id', user.id)
        .order('priority', { ascending: false });

      if (error) throw error;
      setInstructions((data as Instruction[]) || []);
    } catch (error) {
      console.error('Error loading instructions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load instructions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newInstruction.instruction.trim()) {
      toast({
        title: 'Error',
        description: 'Instruction cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('ai_client_instructions')
        .insert({
          user_id: user.id,
          ...newInstruction,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Instruction added successfully',
      });

      setNewInstruction({ category: 'general', instruction: '', priority: 0 });
      loadInstructions();
    } catch (error) {
      console.error('Error adding instruction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add instruction',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_client_instructions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Instruction deleted successfully',
      });

      loadInstructions();
    } catch (error) {
      console.error('Error deleting instruction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete instruction',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('ai_client_instructions')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Instruction ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      loadInstructions();
    } catch (error) {
      console.error('Error toggling instruction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update instruction',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading instructions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom AI Instructions</CardTitle>
        <CardDescription>
          Define custom instructions to tailor the AI assistant's responses to your specific needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Instruction */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newInstruction.category}
                onValueChange={(value: any) =>
                  setNewInstruction({ ...newInstruction, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instruction">Instruction</Label>
              <Input
                id="instruction"
                placeholder="e.g., Always include property tax information in responses"
                value={newInstruction.instruction}
                onChange={(e) =>
                  setNewInstruction({ ...newInstruction, instruction: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority (0-10)</Label>
              <Input
                id="priority"
                type="number"
                min="0"
                max="10"
                value={newInstruction.priority}
                onChange={(e) =>
                  setNewInstruction({ ...newInstruction, priority: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <Button onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Instruction
          </Button>
        </div>

        {/* Instructions List */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Active Instructions</h3>
          {instructions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No instructions yet. Add one above to get started.</p>
          ) : (
            instructions.map(instruction => (
              <div
                key={instruction.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {CATEGORIES.find(c => c.value === instruction.category)?.label}
                    </Badge>
                    <Badge variant={instruction.is_active ? 'default' : 'secondary'}>
                      {instruction.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Priority: {instruction.priority}
                    </span>
                  </div>
                  <p className="text-sm">{instruction.instruction}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(instruction.id, instruction.is_active)}
                  >
                    {instruction.is_active ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(instruction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
