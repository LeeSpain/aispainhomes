import QuestionnaireStep from '../QuestionnaireStep';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface RelocationTimelineStepProps {
  relocationTimeline: {
    timeframe: string;
    moveType: 'permanent' | 'temporary';
    visitedSpain: boolean;
  };
  onTimelineChange: (field: string, value: any) => void;
}

const RelocationTimelineStep = ({ relocationTimeline, onTimelineChange }: RelocationTimelineStepProps) => {
  return (
    <QuestionnaireStep
      title="When are you planning to relocate?"
      description="Understanding your timeline helps us prioritize the right services"
    >
      <div className="space-y-6">
        <div>
          <Label>Planned Relocation Timeframe *</Label>
          <Select value={relocationTimeline.timeframe} onValueChange={(value) => onTimelineChange('timeframe', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate (Within 1 month)</SelectItem>
              <SelectItem value="1-3months">1-3 months</SelectItem>
              <SelectItem value="3-6months">3-6 months</SelectItem>
              <SelectItem value="6-12months">6-12 months</SelectItem>
              <SelectItem value="12+months">12+ months</SelectItem>
              <SelectItem value="exploring">Just exploring options</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Type of Move</Label>
          <Select 
            value={relocationTimeline.moveType} 
            onValueChange={(value: 'permanent' | 'temporary') => onTimelineChange('moveType', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanent">Permanent relocation</SelectItem>
              <SelectItem value="temporary">Temporary stay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <Label>Have you visited Spain before?</Label>
            <p className="text-sm text-muted-foreground">This helps us tailor our recommendations</p>
          </div>
          <Switch
            checked={relocationTimeline.visitedSpain}
            onCheckedChange={(checked) => onTimelineChange('visitedSpain', checked)}
          />
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default RelocationTimelineStep;
