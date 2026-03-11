import { useEffect, useState } from "react";

function getAvatarInitial(name) {
  const normalizedName = String(name ?? "").trim();

  if (!normalizedName) {
    return "S";
  }

  return normalizedName.charAt(0).toUpperCase();
}

export default function UserAvatar({
  alt,
  className = "",
  fallbackClassName = "",
  imageClassName = "",
  name = "",
  src = null,
}) {
  const [imageUnavailable, setImageUnavailable] = useState(false);

  useEffect(() => {
    setImageUnavailable(false);
  }, [src]);

  const label = alt ?? (name ? `${name} avatar` : "User avatar");
  const shouldRenderImage = Boolean(src) && !imageUnavailable;

  return (
    <div
      aria-label={label}
      className={`relative overflow-hidden bg-primary/15 text-primary ${className}`.trim()}
      role="img"
    >
      {shouldRenderImage ? (
        <img
          alt={label}
          className={`h-full w-full object-cover ${imageClassName}`.trim()}
          onError={() => setImageUnavailable(true)}
          src={src}
        />
      ) : (
        <span
          className={`flex h-full w-full items-center justify-center font-black uppercase ${fallbackClassName}`.trim()}
        >
          {getAvatarInitial(name)}
        </span>
      )}
    </div>
  );
}
