import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

interface ClaraLoadingStateProps {
  title?: string;
  message?: string;
}

const ClaraLoadingState = ({ 
  title = "Clara is Working Her Magic",
  message = "Please wait while Clara curates personalized recommendations for you. This usually takes 20-30 seconds."
}: ClaraLoadingStateProps) => {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardContent className="pt-8 pb-8 text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 relative">
          <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          <Loader2 className="h-16 w-16 text-primary/30 animate-spin absolute" />
        </div>
        <h3 className="text-xl font-semibold text-primary">{title}</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {message}
        </p>
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaraLoadingState;