
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, RefreshCw, ExternalLink } from 'lucide-react';
import { User as UserType } from '@/contexts/auth/types';
import { siteTrackingService, TrackedSite } from '@/services/site/siteTrackingService';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  websites?: TrackedSite[];
}

interface AIGuardianChatProps {
  user: UserType;
}

const AIGuardianChat = ({ user }: AIGuardianChatProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user.name}, I'm your AI Guardian assistant. How can I help you with your property search or relocation needs today?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [trackedSites, setTrackedSites] = useState<TrackedSite[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load tracked sites on component mount
    const sites = siteTrackingService.getTrackedSites();
    setTrackedSites(sites);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Generate AI response with website suggestions as needed
      const aiResponse = await generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response. Please try again.');
      
      // Add fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an issue while generating a response. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    const input = userInput.toLowerCase();
    let content = '';
    let relevantSites: TrackedSite[] = [];
    
    // Check if input is related to websites or properties
    if (input.includes('website') || input.includes('site') || input.includes('property') || input.includes('real estate')) {
      // Find relevant tracked sites based on user input
      relevantSites = trackedSites.filter(site => {
        const siteName = site.name.toLowerCase();
        const siteUrl = site.url.toLowerCase();
        return input.includes(siteName) || siteName.includes(input.split(' ')[0]);
      });
      
      // Choose response based on sites found
      if (relevantSites.length > 0) {
        content = `I found ${relevantSites.length} relevant real estate websites that might help with your search:`;
      } else {
        // Use simplified response for demo
        content = getDefaultResponse(input);
        
        // Add suggestion to track new sites if none are relevant
        if (trackedSites.length === 0) {
          content += "\n\nYou don't have any property websites tracked yet. Would you like me to help you set up website tracking to monitor property listings?";
        } else {
          content += "\n\nI don't have any specific websites related to your query. Would you like to track a new property website?";
        }
      }
    } else {
      content = getDefaultResponse(input);
    }
    
    // For now, we're simulating OpenAI integration
    // In a production environment, we would make an actual API call to OpenAI here
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    return {
      id: (Date.now() + 1).toString(),
      content,
      sender: 'ai',
      timestamp: new Date(),
      websites: relevantSites.length > 0 ? relevantSites : undefined,
    };
  };

  const getDefaultResponse = (input: string): string => {
    if (input.includes('property') || input.includes('home') || input.includes('house')) {
      return "I can help you find properties that match your requirements. Would you like me to guide you through setting up property alerts or refining your search criteria?";
    } else if (input.includes('service') || input.includes('provider')) {
      return "We have several trusted service providers from legal advisors to movers. You can view them in the service provider tabs. Is there a specific service you're looking for?";
    } else if (input.includes('relocation')) {
      return "Our relocation assistance can help with everything from legal paperwork to finding schools or healthcare. What specific aspect of relocation are you interested in?";
    } else if (input.includes('membership') || input.includes('subscription')) {
      return "Your current membership gives you access to our AI Guardian services, property matching, and service provider network. You can view full details in the membership section.";
    } else if (input.includes('track') || input.includes('monitor')) {
      return "I can help you track property websites for new listings. You can manage your tracked sites in the Site Tracking section. Would you like me to take you there?";
    } else {
      return "I'm here to assist with your property search and relocation needs. I can help with finding suitable properties, connecting you with service providers, or answering questions about relocating to Spain.";
    }
  };

  const handleAddSite = (url: string, name: string) => {
    try {
      const newSite = siteTrackingService.addSiteToTrack(url, name);
      setTrackedSites(prev => [...prev, newSite]);
      toast.success(`${name} is now being tracked`);
      
      // Add confirmation message
      const confirmationMessage: Message = {
        id: Date.now().toString(),
        content: `I've added ${name} to your tracked websites. You can view and manage all tracked sites in the Site Tracking section.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, confirmationMessage]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add site');
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-primary/10 border-b">
        <CardTitle className="flex items-center text-lg">
          <Bot className="mr-2 h-5 w-5 text-primary" />
          AI Guardian Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted border'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'ai' && <Bot className="h-4 w-4 mt-1" />}
                <div>
                  <p>{message.content}</p>
                  
                  {/* Display relevant websites if available */}
                  {message.websites && message.websites.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.websites.map((site) => (
                        <div key={site.id} className="border border-border/50 rounded p-2 bg-background/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{site.name}</h4>
                              <p className="text-xs text-muted-foreground">{site.propertyCount} properties • Last updated: {new Date(site.lastChecked).toLocaleDateString()}</p>
                            </div>
                            <a 
                              href={site.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {message.sender === 'user' && <User className="h-4 w-4 mt-1" />}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted border">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <RefreshCw className="h-3 w-3 animate-spin" />
                <p>Typing...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t p-3">
        <form 
          className="flex w-full gap-2" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Guardian..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIGuardianChat;
