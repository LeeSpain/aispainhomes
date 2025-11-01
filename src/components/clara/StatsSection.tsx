
import { Globe, Sparkles, MessageSquare } from "lucide-react";

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
        <Globe className="h-8 w-8 text-primary mb-3" />
        <h3 className="text-xl font-semibold mb-2">Multilingual</h3>
        <p className="text-muted-foreground">Support in 5 languages for seamless communication</p>
      </div>
      <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
        <Sparkles className="h-8 w-8 text-primary mb-3" />
        <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
        <p className="text-muted-foreground">Advanced technology for personalized assistance</p>
      </div>
      <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
        <MessageSquare className="h-8 w-8 text-primary mb-3" />
        <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
        <p className="text-muted-foreground">Always available to answer your questions</p>
      </div>
    </div>
  );
};

export default StatsSection;
