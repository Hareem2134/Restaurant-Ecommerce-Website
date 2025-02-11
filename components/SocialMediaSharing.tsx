"use client";
import { FaFacebook, FaTwitter, FaWhatsapp, FaPinterest, FaLinkedin } from "react-icons/fa";

interface SocialMediaShareProps {
  productUrl: string;
  productName: string;
  productDescription: string;
  productImage: string;
}

const SocialMediaShare: React.FC<SocialMediaShareProps> = ({
  productUrl,
  productName,
  productDescription,
  productImage,
}) => {
  const shareProduct = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        // Facebook requires metadata on the shared page to display the image and description
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        break;
      case "twitter":
        // Twitter supports direct text and URL sharing
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          productUrl
        )}&text=${encodeURIComponent(productName)}`;
        break;
      case "whatsapp":
        // WhatsApp supports text sharing
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${productName}: ${productUrl}`
        )}`;
        break;
      case "pinterest":
        // Pinterest requires a media URL and description
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          productUrl
        )}&media=${encodeURIComponent(productImage)}&description=${encodeURIComponent(
          productName
        )}`;
        break;
      case "linkedin":
        // LinkedIn supports title, URL, and description
        shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
          productUrl
        )}&title=${encodeURIComponent(productName)}&summary=${encodeURIComponent(
          productDescription
        )}`;
        break;
      default:
        console.error("Unsupported platform");
        return;
    }

    // Open the sharing URL in a new popup window
    window.open(shareUrl, "_blank", "width=800,height=600");
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="font-semibold text-lg">Share:</span>
      <FaFacebook
        className="text-blue-600 w-5 h-5 cursor-pointer hover:scale-125 hover:opacity-90 transform transition-transform"
        onClick={() => shareProduct("facebook")}
      />
      <FaTwitter
        className="text-blue-400 w-5 h-5 cursor-pointer hover:scale-125 hover:opacity-90 transform transition-transform"
        onClick={() => shareProduct("twitter")}
      />
      <FaWhatsapp
        className="text-green-500 w-5 h-5 cursor-pointer hover:scale-125 hover:opacity-90 transform transition-transform"
        onClick={() => shareProduct("whatsapp")}
      />
      <FaPinterest
        className="text-red-600 w-5 h-5 cursor-pointer hover:scale-125 hover:opacity-90 transform transition-transform"
        onClick={() => shareProduct("pinterest")}
      />
      <FaLinkedin
        className="text-blue-700 w-5 h-5 cursor-pointer hover:scale-125 hover:opacity-90 transform transition-transform"
        onClick={() => shareProduct("linkedin")}
      />
    </div>
  );
};

export default SocialMediaShare;
