
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';

const AISettingsTab = () => {
  // OpenAI settings
  const [openAIApiKey, setOpenAIApiKey] = useState('');
  const [openAIModel, setOpenAIModel] = useState('gpt-4o');
  const [openAITemperature, setOpenAITemperature] = useState('0.7');
  const [openAISystemPrompt, setOpenAISystemPrompt] = useState(
    'You are AI Guardian, a helpful assistant for Spanish Home Finder. ' +
    'You help users find properties in Spain, connect with service providers, ' +
    'and navigate the relocation process.'
  );
  
  // AI Guardian settings
  const [guardianEnabled, setGuardianEnabled] = useState(true);
  const [maxResults, setMaxResults] = useState('5');
  const [includeContextualData, setIncludeContextualData] = useState(true);
  
  // Website scraping settings
  const [scrapingEnabled, setScrapingEnabled] = useState(true);
  const [scrapingFrequency, setScrapingFrequency] = useState('daily');
  const [scrapingDepth, setScrapingDepth] = useState('2');
  const [notifyOnChanges, setNotifyOnChanges] = useState(true);
  
  const handleSaveOpenAISettings = () => {
    // In a real app, this would save to a database or API
    if (!openAIApiKey) {
      toast.error("API Key is required");
      return;
    }
    
    // Simulate saving
    setTimeout(() => {
      toast.success("OpenAI settings saved successfully!");
    }, 500);
  };
  
  const handleSaveGuardianSettings = () => {
    // Simulate saving
    setTimeout(() => {
      toast.success("AI Guardian settings saved successfully!");
    }, 500);
  };
  
  const handleSaveScrapingSettings = () => {
    // Simulate saving
    setTimeout(() => {
      toast.success("Website scraping settings saved successfully!");
    }, 500);
  };
  
  const handleTestConnection = () => {
    if (!openAIApiKey) {
      toast.error("API Key is required to test connection");
      return;
    }
    
    // Simulate API request
    toast.info("Testing OpenAI connection...");
    
    setTimeout(() => {
      toast.success("Successfully connected to OpenAI API!");
    }, 1500);
  };
  
  return (
    <Tabs defaultValue="openai" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="openai">OpenAI</TabsTrigger>
        <TabsTrigger value="guardian">AI Guardian</TabsTrigger>
        <TabsTrigger value="scraping">Website Scraping</TabsTrigger>
      </TabsList>
      
      <TabsContent value="openai">
        <Card>
          <CardHeader>
            <CardTitle>OpenAI Integration Settings</CardTitle>
            <CardDescription>
              Configure your OpenAI API connection for AI Guardian functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-..."
                value={openAIApiKey}
                onChange={(e) => setOpenAIApiKey(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Your OpenAI API key is stored securely and never shared
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={openAIModel} onValueChange={setOpenAIModel}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={openAITemperature}
                  onChange={(e) => setOpenAITemperature(e.target.value)}
                />
                <div className="text-sm text-muted-foreground pt-2">
                  Values from 0 (deterministic) to 2 (creative)
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                rows={5}
                value={openAISystemPrompt}
                onChange={(e) => setOpenAISystemPrompt(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                This defines how the AI presents itself to users
              </p>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" onClick={handleTestConnection}>
                Test Connection
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveOpenAISettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="guardian">
        <Card>
          <CardHeader>
            <CardTitle>AI Guardian Settings</CardTitle>
            <CardDescription>
              Configure how AI Guardian interacts with users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ai-enabled">Enable AI Guardian</Label>
                <p className="text-sm text-muted-foreground">
                  Turn the AI assistant on or off across the platform
                </p>
              </div>
              <Switch
                id="ai-enabled"
                checked={guardianEnabled}
                onCheckedChange={setGuardianEnabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-results">Maximum Results to Display</Label>
              <Input
                id="max-results"
                type="number"
                min="1"
                max="20"
                value={maxResults}
                onChange={(e) => setMaxResults(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Maximum number of properties or services to show in responses
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="contextual-data">Include Contextual Data</Label>
                <p className="text-sm text-muted-foreground">
                  Allow AI to use user preferences and browsing history for better responses
                </p>
              </div>
              <Switch
                id="contextual-data"
                checked={includeContextualData}
                onCheckedChange={setIncludeContextualData}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveGuardianSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="scraping">
        <Card>
          <CardHeader>
            <CardTitle>Website Scraping Settings</CardTitle>
            <CardDescription>
              Configure how the system scrapes property websites for new listings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="scraping-enabled">Enable Website Scraping</Label>
                <p className="text-sm text-muted-foreground">
                  Turn automatic website scraping on or off
                </p>
              </div>
              <Switch
                id="scraping-enabled"
                checked={scrapingEnabled}
                onCheckedChange={setScrapingEnabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scraping-frequency">Scraping Frequency</Label>
              <Select value={scrapingFrequency} onValueChange={setScrapingFrequency}>
                <SelectTrigger id="scraping-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scraping-depth">Scraping Depth (pages)</Label>
              <Input
                id="scraping-depth"
                type="number"
                min="1"
                max="10"
                value={scrapingDepth}
                onChange={(e) => setScrapingDepth(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                How many pages deep to crawl on each website
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notify-changes">Notify on Property Changes</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications when new properties are found
                </p>
              </div>
              <Switch
                id="notify-changes"
                checked={notifyOnChanges}
                onCheckedChange={setNotifyOnChanges}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveScrapingSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AISettingsTab;
