import { forwardRef, useImperativeHandle, useState } from "react";
import { uploadFiles } from "../utils/upload";
import { isVideoUrl } from "../utils/listings";

// initialUrls: URLs already saved (e.g. editing a listing that already has photos)
// ref.current.resolveUrls(token) uploads any newly picked files and returns the
// combined comma-separated URL string ready to send to the backend.
const FileUploadField = forwardRef(({ initialUrls = [] }, ref) => {
    const [existing, setExisting] = useState(initialUrls);
    const [pendingFiles, setPendingFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);

    useImperativeHandle(ref, () => ({
        resolveUrls: async (token) => {
            if (pendingFiles.length === 0) return existing.join(",");
            setUploading(true);
            try {
                const uploaded = await uploadFiles(pendingFiles, token);
                return [...existing, ...uploaded].join(",");
            } finally {
                setUploading(false);
            }
        },
    }));

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPendingFiles((prev) => [...prev, ...files]);
        setPreviews((prev) => [
            ...prev,
            ...files.map((f) => ({ url: URL.createObjectURL(f), isVideo: f.type.startsWith("video") })),
        ]);
        e.target.value = "";
    };

    const removeExisting = (url) => setExisting((prev) => prev.filter((u) => u !== url));
    const removePending = (idx) => {
        setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
        setPreviews((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="upload-field">
            <label className="upload-dropzone">
                <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <span>{uploading ? "Uploading..." : "Click to add photos or videos from your device"}</span>
            </label>

            {(existing.length > 0 || previews.length > 0) && (
                <div className="upload-thumbs">
                    {existing.map((url) => (
                        <div className="upload-thumb" key={url}>
                            {isVideoUrl(url) ? <video src={url} /> : <img src={url} alt="" />}
                            <button type="button" onClick={() => removeExisting(url)} aria-label="Remove">
                                &times;
                            </button>
                        </div>
                    ))}
                    {previews.map((p, i) => (
                        <div className="upload-thumb" key={i}>
                            {p.isVideo ? <video src={p.url} /> : <img src={p.url} alt="" />}
                            <button type="button" onClick={() => removePending(i)} aria-label="Remove">
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default FileUploadField;
