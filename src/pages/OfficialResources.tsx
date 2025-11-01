import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import OfficialResourcesBrowser from '@/components/resources/OfficialResourcesBrowser';

const OfficialResources = () => {
  return (
    <>
      <Helmet>
        <title>Official Resources - Spanish Relocation</title>
      </Helmet>
      <DashboardLayout title="Official Resources">
        <OfficialResourcesBrowser />
      </DashboardLayout>
    </>
  );
};

export default OfficialResources;
