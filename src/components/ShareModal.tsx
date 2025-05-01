import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Link2, Mail, MessageCircle } from 'lucide-react';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { toast } from './ui/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemName: string;
}

export function ShareModal({ isOpen, onClose, itemId, itemName }: ShareModalProps) {
  const itemUrl = `${window.location.origin}/items/${itemId}`;
  const shareText = `Check out ${itemName} on ORentit!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(itemUrl);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEmail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(itemUrl)}`;
    window.open(mailtoUrl);
  };

  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${itemUrl}`)}`;
    window.open(whatsappUrl);
  };

  const handleMessenger = () => {
    // Using Facebook's Send Dialog for Messenger
    const messengerUrl = `https://www.facebook.com/dialog/send?app_id=254752783349744&link=${encodeURIComponent(itemUrl)}&redirect_uri=${encodeURIComponent(window.location.href)}`;
    
    // Open in a popup window
    const width = 550;
    const height = 435;
    const left = Math.floor((window.screen.width / 2) - (width / 2));
    const top = Math.floor((window.screen.height / 2) - (height / 2));
    
    window.open(
      messengerUrl,
      'messenger_share',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
    );
  };

  const handleFacebook = () => {
    // Using Facebook's Share Dialog
    const facebookUrl = `https://www.facebook.com/dialog/share?app_id=254752783349744&href=${encodeURIComponent(itemUrl)}&quote=${encodeURIComponent(shareText)}&redirect_uri=${encodeURIComponent(window.location.href)}`;
    
    // Open in a popup window
    const width = 550;
    const height = 435;
    const left = Math.floor((window.screen.width / 2) - (width / 2));
    const top = Math.floor((window.screen.height / 2) - (height / 2));
    
    window.open(
      facebookUrl,
      'facebook_share',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
    );
  };

  const handleX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(itemUrl)}`;
    window.open(xUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center justify-start gap-3 hover:bg-purple-50"
            onClick={handleCopyLink}
          >
            <Link2 className="h-5 w-5 text-[#a100ff]" />
            <span className="text-gray-700">Copy link</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-3 hover:bg-purple-50"
            onClick={handleEmail}
          >
            <Mail className="h-5 w-5 text-[#a100ff]" />
            <span className="text-gray-700">Email</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-3 hover:bg-purple-50"
            onClick={handleWhatsApp}
          >
            <FaWhatsapp className="h-5 w-5 text-[#a100ff]" />
            <span className="text-gray-700">WhatsApp</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-3 hover:bg-purple-50"
            onClick={handleMessenger}
          >
            <MessageCircle className="h-5 w-5 text-[#a100ff]" />
            <span className="text-gray-700">Messenger</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-3 hover:bg-purple-50"
            onClick={handleFacebook}
          >
            <FaFacebook className="h-5 w-5 text-[#a100ff]" />
            <span className="text-gray-700">Facebook</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-3 hover:bg-purple-50"
            onClick={handleX}
          >
            <FaTwitter className="h-5 w-5 text-[#a100ff]" />
            <span className="text-gray-700">X</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 