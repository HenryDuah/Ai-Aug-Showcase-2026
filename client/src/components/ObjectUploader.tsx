import { useState } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  buttonVariant?: ButtonProps["variant"];
  children: ReactNode;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize,
  allowedFileTypes,
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  buttonVariant = "default",
  children,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        ...(maxFileSize !== undefined && { maxFileSize }),
        allowedFileTypes,
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: onGetUploadParameters,
      })
      .on("upload", () => {
        setIsUploading(true);
        setUploadComplete(false);
        setUploadProgress(0);
      })
      .on("progress", (progress) => {
        if (progress) {
          setUploadProgress(Math.round(progress));
        }
      })
      .on("upload-success", () => {
        setUploadProgress(100);
      })
      .on("complete", (result) => {
        setIsUploading(false);
        setUploadComplete(true);
        onComplete?.(result);
        setTimeout(() => {
          setShowModal(false);
          setTimeout(() => setUploadComplete(false), 2000);
        }, 1500);
      })
      .on("cancel-all", () => {
        setIsUploading(false);
        setUploadProgress(0);
      })
      .on("error", () => {
        setIsUploading(false);
      })
  );

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={() => setShowModal(true)} 
        className={buttonClassName}
        variant={buttonVariant}
        type="button"
      >
        {children}
      </Button>

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading... {uploadProgress}%</span>
        </div>
      )}

      {uploadComplete && !isUploading && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>Upload complete!</span>
        </div>
      )}

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
}
