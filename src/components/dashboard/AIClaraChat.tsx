import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, RefreshCw, ExternalLink } from 'lucide-react';
import { User as UserType } from '@/contexts/auth/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  tokensUsed?: number;
  citedResources?: string[];
}

interface AIClaraChatProps {
  user: UserType;
}

const AIClaraChat = ({ user }: AIClaraChatProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConversationHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setMessages(data.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.role as 'user' | 'assistant',
          timestamp: new Date(msg.created_at),
          tokensUsed: msg.tokens_used,
          citedResources: Array.isArray(msg.cited_resources) ? msg.cited_resources as string[] : []
        })));
      } else {
        setMessages([{
          id: '1',
          content: `Hello ${user.name}, I'm Clara, your AI assistant. I have access to 100+ official Spanish government resources to help with your relocation and property needs.`,
          sender: 'assistant',
          timestamp: new Date(),
          citedResources: []
        }]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      citedResources: []
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          sessionId,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || data.response,
        sender: 'assistant',
        timestamp: new Date(),
        tokensUsed: data.tokensUsed,
        citedResources: data.citedResources || []
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-primary/10 border-b">
        <CardTitle className="flex items-center text-lg">
          <Bot className="mr-2 h-5 w-5 text-primary" />
          Clara - Your AI Assistant
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
                {message.sender === 'assistant' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                <div className="flex-1">
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  {message.citedResources && message.citedResources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                      <p className="text-xs font-semibold flex items-center gap-1 text-green-600">
                        ✓ Verified Official Sources
                      </p>
                      {message.citedResources.map((url, idx) => (
                        <a 
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 group"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="group-hover:underline">{url}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {message.tokensUsed && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.tokensUsed} tokens
                    </p>
                  )}
                </div>
                {message.sender === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
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
                <p className="text-sm">Typing...</p>
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
            placeholder="Ask Clara about NIE, visas, property tax, healthcare..."
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

export default AIClaraChat;
