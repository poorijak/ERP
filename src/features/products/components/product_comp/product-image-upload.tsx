"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductImage } from "@prisma/client";
import { ImagePlus, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ProductImageProps {
  onImageChange: (image: File[], index: number, deletedId?: string[]) => void;
  existingImages?: ProductImage[];
}

const ProductImageUpload = ({
  onImageChange,
  existingImages = [],
}: ProductImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [previewUrls, setPreviewUrl] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [initialMainImageSet, setInitialMainImageSet] = useState(false);

  // state ที่รับมา - ส่งออก
  const [exitingImageState, setExistingImageState] = useState(existingImages);
  const [deletedImageId, setDeletedImageId] = useState<string[]>([]);

  const notifyToParent = useCallback(() => {
    onImageChange(selectedFile, mainImageIndex, deletedImageId);
  }, [selectedFile, mainImageIndex, deletedImageId, onImageChange]);

  useEffect(() => {
    if (exitingImageState.length > 0 && !initialMainImageSet) {
      const mainIndex = exitingImageState.findIndex((image) => image.isMain);

      if (mainIndex >= 0) {
        setMainImageIndex(mainIndex);
        setInitialMainImageSet(true);
      }
    }

    notifyToParent();
  }, [exitingImageState, initialMainImageSet, notifyToParent]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handdleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      return;
    }

    const newPreviewUrls = imageFiles.map((file) => URL.createObjectURL(file));

    setPreviewUrl((prev) => [...prev, ...newPreviewUrls]);
    setSelectedFile((prev) => [...prev, ...imageFiles]);

    if (
      exitingImageState.length === 0 &&
      selectedFile.length === 0 &&
      imageFiles.length > 0
    ) {
      setMainImageIndex(0);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const haddelSetMain = (index: number, isExisting = false) => {
    if (isExisting) {
      setMainImageIndex(index);
    } else {
      setMainImageIndex(exitingImageState.length + index);
    }
  };

  const haddleRemoveImage = (index: number, isExisting = false) => {
    if (isExisting) {
      const imageToRemove = exitingImageState[index];
      setDeletedImageId((prev) => [...prev, imageToRemove.id]);
      setExistingImageState(exitingImageState.filter((_, i) => i !== index));

      if (mainImageIndex === index) {
        if (exitingImageState.length > 0) {
          setMainImageIndex(0);
        } else if (selectedFile.length > 0) {
          setMainImageIndex(0);
        } else {
          setMainImageIndex(-1);
        }
      } else if (mainImageIndex > index) {
        setMainImageIndex((prev) => prev - 1);
      }
    } else {
      URL.revokeObjectURL(previewUrls[index]);

      const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
      const newSelectedFile = selectedFile.filter((_, i) => i !== index);

      setPreviewUrl(newPreviewUrls);
      setSelectedFile(newSelectedFile);

      const actualRemoveIndex = exitingImageState.length + index;

      if (mainImageIndex === actualRemoveIndex) {
        if (exitingImageState.length > 0) {
          setMainImageIndex(0);
        } else if (previewUrls.length > 0) {
          setMainImageIndex(0);
        } else {
          setMainImageIndex(-1);
        }
      } else if (mainImageIndex > actualRemoveIndex) {
        setMainImageIndex((prev) => prev - 1);
      }
    }
  };

  const isMainImage = (index: number, isExisting: boolean) => {
    const actualIndex = isExisting ? index : exitingImageState.length + index;
    return mainImageIndex === actualIndex;
  };

  return (
    <div className="flex flex-col gap-4">
      <Label>
        Product Image<span className="text-red-500">*</span>
      </Label>

      {(exitingImageState?.length > 0 || previewUrls.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-col-3 md:grid-cols-4 gap-4 mb-4">
          {exitingImageState.map((image, index) => (
            <div
              key={`existing-${index}`}
              className={cn(
                "relative aspect-square group border rounded-md overflow-hidden",
                { "ring-2 ring-primary": isMainImage(index, true) }
              )}
            >
              <Image
                src={image.url}
                fill
                alt={`ProdutPreview ${index + 1}`}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto" />
              {isMainImage(index, true) && (
                <Badge className="absolute top-2 left-3">Main</Badge>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <Button
                  type="button"
                  onClick={() => haddelSetMain(index, true)}
                  variant="secondary"
                  className="size-6 sm:size-8 rounded-full"
                >
                  <Star
                    className={cn(
                      isMainImage(index, true) &&
                        "fill-yellow-400 text-yellow-400"
                    )}
                    size={16}
                  />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => haddleRemoveImage(index, true)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          {previewUrls.map((url, index) => (
            <div
              key={`new-${index}`}
              className={cn(
                "relative aspect-square group border rounded-md overflow-hidden",
                { "ring-2 ring-primary": isMainImage(index, false) }
              )}
            >
              <Image
                src={url}
                fill
                alt={`ProdutPreview ${index + 1}`}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              {isMainImage(index, false) && (
                <Badge className="absolute top-2 left-3">Main</Badge>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => haddelSetMain(index)}
                >
                  <Star
                    className={cn(
                      isMainImage(index, false) &&
                        "fill-yellow-400 text-yellow-400"
                    )}
                    size={16}
                  />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => haddleRemoveImage(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          <div
            className="aspect-square border rounded-md flex justify-center items-center cursor-pointer hover:bg-muted transition-colors"
            onClick={triggerFileInput}
          >
            <div className="flex flex-col gap-1 text-muted-foreground items-center">
              <Plus className="text-primary" size={24} />
              <span className="text-xs">Add image</span>
            </div>
          </div>
        </div>
      )}

      {exitingImageState.length === 0 && previewUrls.length === 0 && (
        <div
          className="border rounded-md p-8 flex flex-col gap-2 items-center justify-center cursor-pointer hover:bg-muted transition-colors"
          onClick={triggerFileInput}
        >
          <ImagePlus size={40} />
          <Button type="button" variant={"secondary"} size={"sm"}>
            Browse File
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handdleFileChange(e)}
      />
    </div>
  );
};

export default ProductImageUpload;
