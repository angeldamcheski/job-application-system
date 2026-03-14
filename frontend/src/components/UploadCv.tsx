import React, { useState } from "react";
import { cvApi } from "../api/cvApi";

type Props = {
  applicantId: number;
};

const UploadCV: React.FC<Props> = ({ applicantId }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    try {
      await cvApi.uploadCV(file, applicantId);
      alert("CV uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button onClick={handleUpload}>Upload CV</button>
    </div>
  );
};

export default UploadCV;
