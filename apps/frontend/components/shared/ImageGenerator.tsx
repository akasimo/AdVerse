import React, { useState } from "react";
import axios from "axios";
import { useAnalyzedWallet } from "@/store";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const ImageGenerator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { analyzedWallet } = useAnalyzedWallet();

  const generateImage = async () => {
    setIsLoading(true);
    try {
      console.log("Sending analysis:", analyzedWallet);

      const response = await axios.post(
        "http://207.154.208.36:8080/generate-image",
        { analysis: analyzedWallet },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Response:", response.data);
      if (response.data && response.data.image) {
        setImageUrl(response.data.image);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button className="m-4" onClick={() => setIsOpen(true)}>
        Generate Image
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generated Image</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <p>Generating image...</p>
          ) : imageUrl ? (
            <>
              <Button>Mint</Button>
              <img src={imageUrl} alt="Generated wallet visualization" />
            </>
          ) : (
            <Button onClick={generateImage}>Generate</Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGenerator;
