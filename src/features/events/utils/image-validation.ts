import { fileTypeFromBuffer } from "file-type";

const EVENT_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

const EVENT_IMAGE_MIME_TYPES = {
  "image/jpeg": {
    extensions: ["jpg", "jpeg"],
    canonicalExtension: "jpg",
  },
  "image/png": {
    extensions: ["png"],
    canonicalExtension: "png",
  },
  "image/webp": {
    extensions: ["webp"],
    canonicalExtension: "webp",
  },
  "image/gif": {
    extensions: ["gif"],
    canonicalExtension: "gif",
  },
} as const;

type EventImageMimeType = keyof typeof EVENT_IMAGE_MIME_TYPES;
type EventImageExtension = (typeof EVENT_IMAGE_MIME_TYPES)[EventImageMimeType]["extensions"][number];

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase();
}

function isAllowedEventImageMimeType(mimeType: string): mimeType is EventImageMimeType {
  return mimeType in EVENT_IMAGE_MIME_TYPES;
}

function isEventImageExtension(extension: string): extension is EventImageExtension {
  return ["jpg", "jpeg", "png", "webp", "gif"].includes(extension);
}

export async function validateEventImage(file: File) {
  if (file.size <= 0) {
    throw new Error("Event image must not be empty");
  }

  if (file.size > EVENT_IMAGE_MAX_SIZE_BYTES) {
    throw new Error("Event image must be 5MB or smaller");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedType = await fileTypeFromBuffer(buffer);

  if (!detectedType) {
    throw new Error("Unable to determine the event image file type");
  }

  if (!isAllowedEventImageMimeType(detectedType.mime)) {
    throw new Error("Event image must be a JPEG, PNG, WebP, or GIF file");
  }

  const fileExtension = getFileExtension(file.name);
  const allowedExtensions = new Set(EVENT_IMAGE_MIME_TYPES[detectedType.mime].extensions);

  if (!fileExtension) {
    throw new Error("Event image must include a file extension");
  }

  if (!isEventImageExtension(fileExtension)) {
    throw new Error("Event image uses an unsupported file extension");
  }

  if (!allowedExtensions.has(fileExtension)) {
    throw new Error(`Event image extension must match its ${detectedType.mime} content`);
  }

  return {
    mimeType: detectedType.mime,
    extension: EVENT_IMAGE_MIME_TYPES[detectedType.mime].canonicalExtension,
  };
}