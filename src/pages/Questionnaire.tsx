
import QuestionnaireContainer from "@/components/questionnaire/QuestionnaireContainer";
import { Helmet } from "react-helmet";

const Questionnaire = () => {
  return (
    <>
      <Helmet>
        <title>Spanish Relocation Questionnaire | Find Your Perfect Home & Services</title>
        <meta 
          name="description" 
          content="Complete our comprehensive questionnaire to receive personalized property matches and relocation services for your move to Spain. Get AI-powered recommendations tailored to your needs."
        />
      </Helmet>
      <QuestionnaireContainer />
    </>
  );
};

export default Questionnaire;
