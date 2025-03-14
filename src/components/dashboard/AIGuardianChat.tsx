
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, RefreshCw } from 'lucide-react';
import { User as UserType } from '@/contexts/auth/types';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
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

  const handleSend = () => {
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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('property') || input.includes('home') || input.includes('house')) {
      return "I can help you find properties that match your requirements. Would you like me to guide you through setting up property alerts or refining your search criteria?";
    } else if (input.includes('service') || input.includes('provider')) {
      return "We have several trusted service providers from legal advisors to movers. You can view them in the service provider tabs. Is there a specific service you're looking for?";
    } else if (input.includes('relocation')) {
      return "Our relocation assistance can help with everything from legal paperwork to finding schools or healthcare. What specific aspect of relocation are you interested in?";
    } else if (input.includes('membership') || input.includes('subscription')) {
      return "Your current membership gives you access to our AI Guardian services, property matching, and service provider network. You can view full details in the membership section.";
    } else {
      return "I'm here to assist with your property search and relocation needs. I can help with finding suitable properties, connecting you with service providers, or answering questions about relocating to Spain.";
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
                <p>{message.content}</p>
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
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIGuardianChat;
