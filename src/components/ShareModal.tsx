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
    const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(itemUrl)}&app_id=YOUR_FB_APP_ID`;
    window.open(messengerUrl);
  };

  const handleFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(itemUrl)}`;
    window.open(facebookUrl);
  };

  const handleTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(itemUrl)}`;
    window.open(twitterUrl);
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
            onClick={handleTwitter}
          >
            <FaTwitter className="h-5 w-5 text-[#a100ff]" />
            <span className="text-gray-700">Twitter</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 