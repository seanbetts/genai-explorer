"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "../utils/imageUtils";

interface ImageWithFallbackProps extends React.ComponentPropsWithoutRef<typeof Image> {
  src: string;
  alt: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  quality = 75, // Default quality for optimization
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      quality={quality}
      onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
    />
  );
};

export default ImageWithFallback;