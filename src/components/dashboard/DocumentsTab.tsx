
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { File, Upload, X, FileText, Download } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
}

const DocumentsTab = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!uploadName) {
        setUploadName(e.target.files[0].name);
      }
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: uploadName || selectedFile.name,
      type: selectedFile.type,
      size: formatFileSize(selectedFile.size),
      uploadDate: new Date().toLocaleDateString(),
    };
    
    setDocuments([...documents, newDocument]);
    setShowUploadForm(false);
    setUploadName("");
    setSelectedFile(null);
    
    toast.success("Document uploaded successfully");
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("Document deleted");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Your Documents</h2>
        <Button onClick={() => setShowUploadForm(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
      
      {showUploadForm && (
        <div className="border border-dashed rounded-lg p-6 mb-6">
          <form onSubmit={handleUpload}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentName">Document Name</Label>
                <Input 
                  id="documentName"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Enter document name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="documentFile">File</Label>
                <div className="mt-1">
                  <Input 
                    id="documentFile"
                    type="file"
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                </div>
                {selectedFile && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowUploadForm(false);
                    setUploadName("");
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Upload
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {documents.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-left">Upload Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t">
                  <td className="px-4 py-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {doc.name}
                  </td>
                  <td className="px-4 py-3">{doc.type.split('/')[1]}</td>
                  <td className="px-4 py-3">{doc.size}</td>
                  <td className="px-4 py-3">{doc.uploadDate}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" className="mr-1">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDelete(doc.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p>You haven't uploaded any documents yet.</p>
          <Button variant="outline" className="mt-4" onClick={() => setShowUploadForm(true)}>
            Upload Your First Document
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
