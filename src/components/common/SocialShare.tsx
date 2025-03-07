
import { useState } from 'react';
import { Share2, X, Link as LinkIcon, Copy, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SocialShareProps {
  title: string;
  url?: string;
  description?: string;
}

const SocialShare = ({ title, url, description }: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareDescription = description || '';
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
      console.error('Failed to copy:', err);
    }
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    setIsOpen(false);
  };

  const shareViaTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
    setIsOpen(false);
  };

  const shareViaLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    setIsOpen(false);
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this link: ${shareUrl}\n\n${shareDescription}`)}`;
    setIsOpen(false);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareDescription,
        url: shareUrl,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center"
        onClick={handleNativeShare}
      >
        <Share2 className="mr-2 h-4 w-4" />
        <span>Share</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this page</DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 mt-4">
            <Input 
              readOnly 
              value={shareUrl} 
              className="flex-1 pr-12"
            />
            <Button
              type="button"
              variant={copied ? "default" : "outline"}
              size="sm"
              className="absolute right-12 hover:bg-transparent"
              onClick={handleCopyLink}
            >
              {copied ? (
                <Copy className="h-4 w-4" />
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex flex-col space-y-3 mt-4">
            <p className="text-sm text-muted-foreground">Share via</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={shareViaFacebook}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={shareViaTwitter}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={shareViaLinkedIn}
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={shareViaEmail}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SocialShare;
