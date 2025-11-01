
import QuestionnaireContainer from "@/components/questionnaire/QuestionnaireContainer";
import { Helmet } from "react-helmet";

const Questionnaire = () => {
  return (
    <>
      <Helmet>
        <title>Find Your Perfect Home in Spain | AI Homes Spain</title>
      </Helmet>
      <QuestionnaireContainer />
    </>
  );
};

export default Questionnaire;
