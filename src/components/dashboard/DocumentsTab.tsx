
import { Button } from "@/components/ui/button";

const DocumentsTab = () => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Your Documents</h2>
      <div className="text-center py-12 border border-dashed rounded-lg">
        <p>You haven't uploaded any documents yet.</p>
        <Button variant="outline" className="mt-4">Upload Documents</Button>
      </div>
    </div>
  );
};

export default DocumentsTab;
