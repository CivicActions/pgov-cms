import Image from "next/image";
import { absoluteUrl } from "lib/utils";

export interface FieldLogoProps {
  field_logo: {
    name: string;
    field_media_image: {
      uri: {
        url: string;
      }
    }
  };
}

export function FieldLogo({field_logo} : FieldLogoProps) {
  const { field_media_image, name } = field_logo;
  return (
    <Image
      src={absoluteUrl(field_media_image.uri.url)}
      width={150}
      height={150}
      alt={name}
      priority
      className="margin-top-3"
    />
  );
}



