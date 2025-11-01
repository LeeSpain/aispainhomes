import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Sparkles, BarChart2, TestTube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AIInstructionsManager from './AIInstructionsManager';
import AIUsageDashboard from './AIUsageDashboard';

const AISettingsTab = () => {
  const [model, setModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant for Spanish property relocation.');
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.log('No settings found, using defaults');
      } else if (data) {
        setModel(data.model);
        setTemperature([data.temperature]);
        setMaxTokens(data.max_tokens);
        setSystemPrompt(data.system_prompt);
        setIsEnabled(data.is_enabled);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('ai-settings-update', {
        body: {
          model,
          temperature: temperature[0],
          max_tokens: maxTokens,
          system_prompt: systemPrompt,
          is_enabled: isEnabled,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "AI settings have been updated successfully.",
      });

      loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('ai-test-connection', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Connection Successful",
          description: `Connected to ${data.model}. Used ${data.tokensUsed} tokens for test.`,
        });
      } else {
        throw new Error(data?.error || 'Connection failed');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to OpenAI API.',
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading AI settings...</div>;
  }

  return (
    <Tabs defaultValue="settings" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="settings">
          <Sparkles className="mr-2 h-4 w-4" />
          Settings
        </TabsTrigger>
        <TabsTrigger value="instructions">
          <Shield className="mr-2 h-4 w-4" />
          Instructions
        </TabsTrigger>
        <TabsTrigger value="usage">
          <BarChart2 className="mr-2 h-4 w-4" />
          Usage
        </TabsTrigger>
        <TabsTrigger value="test">
          <TestTube className="mr-2 h-4 w-4" />
          Test
        </TabsTrigger>
      </TabsList>

      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Model Configuration</CardTitle>
            <CardDescription>
              Configure the AI assistant behavior and model settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable AI Assistant</Label>
                <p className="text-sm text-muted-foreground">
                  Turn the AI assistant on or off for all users
                </p>
              </div>
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-5-2025-08-07">GPT-5 (Most Capable)</SelectItem>
                  <SelectItem value="gpt-5-mini-2025-08-07">GPT-5 Mini (Balanced)</SelectItem>
                  <SelectItem value="gpt-5-nano-2025-08-07">GPT-5 Nano (Fastest)</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o (Legacy)</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini (Legacy Fast)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                GPT-5 models are recommended for best performance
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature: {temperature[0]}</Label>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.1}
                value={temperature}
                onValueChange={setTemperature}
                disabled={model.startsWith('gpt-5')}
              />
              <p className="text-sm text-muted-foreground">
                {model.startsWith('gpt-5') 
                  ? 'Temperature not supported for GPT-5 models (fixed at 1.0)'
                  : 'Controls randomness. Lower is more focused, higher is more creative.'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
              <Input
                id="max-tokens"
                type="number"
                min={100}
                max={4000}
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Maximum length of the AI's response
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                rows={5}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                This defines how the AI assistant behaves and responds to users
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="instructions" className="space-y-4">
        <AIInstructionsManager />
      </TabsContent>

      <TabsContent value="usage" className="space-y-4">
        <AIUsageDashboard />
      </TabsContent>

      <TabsContent value="test" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Test OpenAI Connection</CardTitle>
            <CardDescription>
              Verify that the OpenAI API key is configured correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will make a minimal API call to test the connection. It will use approximately 5-10 tokens.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleTestConnection} disabled={testing} className="w-full">
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AISettingsTab;
