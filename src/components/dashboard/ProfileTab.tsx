import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Home, Users, Briefcase, FileCheck, Globe, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import PersonalInfoSection from './profile/PersonalInfoSection';
import RelocationSection from './profile/RelocationSection';
import PropertyPreferencesSection from './profile/PropertyPreferencesSection';
import HouseholdSection from './profile/HouseholdSection';
import ServicesSection from './profile/ServicesSection';

const ProfileTab = () => {
  const { user } = useAuth();
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    loadQuestionnaireData();
  }, [user]);

  const loadQuestionnaireData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setQuestionnaireData(data);
        calculateCompletion(data);
      }
    } catch (error) {
      console.error('Error loading questionnaire data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = (data: any) => {
    const sections = [
      data.personal_info,
      data.relocation_timeline,
      data.property_types,
      data.household_details,
      data.employment_status,
      data.legal_documentation,
      data.lifestyle_preferences,
      data.services_needed
    ];

    const completed = sections.filter(section => 
      section && Object.keys(section).length > 0
    ).length;

    setCompletionPercentage((completed / sections.length) * 100);
  };

  const handleUpdate = async (field: string, value: any) => {
    if (!user || !questionnaireData) return;

    try {
      const { error } = await supabase
        .from('questionnaire_responses')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', questionnaireData.id);

      if (error) throw error;

      // Track change in history
      await supabase
        .from('user_questionnaire_history')
        .insert({
          user_id: user.id,
          questionnaire_response_id: questionnaireData.id,
          field_changed: field,
          old_value: questionnaireData[field],
          new_value: value
        });

      setQuestionnaireData({ ...questionnaireData, [field]: value });
      toast.success('Profile updated successfully');
      loadQuestionnaireData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!questionnaireData) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No Profile Data Yet</h3>
        <p className="text-muted-foreground mb-4">
          Complete the questionnaire to set up your relocation profile
        </p>
        <a href="/questionnaire" className="text-primary hover:underline">
          Start Questionnaire
        </a>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Your Relocation Profile</h2>
            <p className="text-muted-foreground">Manage your preferences and track your progress</p>
          </div>
          <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
            {Math.round(completionPercentage)}% Complete
          </Badge>
        </div>
        <Progress value={completionPercentage} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: {new Date(questionnaireData.updated_at).toLocaleDateString()}
        </p>
      </Card>

      {/* Editable Sections */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          <TabsTrigger value="personal">
            <User className="w-4 h-4 mr-2" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="relocation">
            <Clock className="w-4 h-4 mr-2" />
            Relocation
          </TabsTrigger>
          <TabsTrigger value="property">
            <Home className="w-4 h-4 mr-2" />
            Property
          </TabsTrigger>
          <TabsTrigger value="household">
            <Users className="w-4 h-4 mr-2" />
            Household
          </TabsTrigger>
          <TabsTrigger value="legal">
            <FileCheck className="w-4 h-4 mr-2" />
            Legal
          </TabsTrigger>
          <TabsTrigger value="services">
            <Globe className="w-4 h-4 mr-2" />
            Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalInfoSection 
            data={questionnaireData.personal_info || {}} 
            onUpdate={(value) => handleUpdate('personal_info', value)}
          />
        </TabsContent>

        <TabsContent value="relocation" className="mt-6">
          <RelocationSection 
            data={questionnaireData.relocation_timeline || {}} 
            onUpdate={(value) => handleUpdate('relocation_timeline', value)}
          />
        </TabsContent>

        <TabsContent value="property" className="mt-6">
          <PropertyPreferencesSection 
            data={{
              property_types: questionnaireData.property_types,
              location_preferences: questionnaireData.location_preferences,
              budget_range: questionnaireData.budget_range,
              amenities_required: questionnaireData.amenities_required
            }}
            onUpdate={handleUpdate}
          />
        </TabsContent>

        <TabsContent value="household" className="mt-6">
          <HouseholdSection 
            data={questionnaireData.household_details || {}} 
            onUpdate={(value) => handleUpdate('household_details', value)}
          />
        </TabsContent>

        <TabsContent value="legal" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Legal & Documentation</h3>
            <p className="text-muted-foreground">Legal documentation section coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <ServicesSection 
            data={questionnaireData.services_needed || {}} 
            onUpdate={(value) => handleUpdate('services_needed', value)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTab;
