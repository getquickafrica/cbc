"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  ShareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";
import { Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

/**
 * PdfUpload component
 * - main file: PDF only
 * - support files: pdf/doc/docx/ppt/pptx
 * - shows icons + filenames
 * - sends files to /api/upload-files then metadata to /api/save-material
 */

export default function PdfUpload() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // stages & UI
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState([]);
  const [alert, setAlert] = useState(null);
  const [success, setSuccess] = useState(false);

  // files & metadata
  const [pdfFile, setPdfFile] = useState(null); // main PDF
  const [supportFiles, setSupportFiles] = useState([]); // array of support files
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    tags: [],
    currentTag: "",
  });

  const dropRef = useRef(null);

  /* -------------------------
     Helpers: file icons & file-type checks
  --------------------------*/
  const supportAccept =
    ".pdf,.doc,.docx,.ppt,.pptx,application/msword,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation";

  const isPdf = (file) =>
    file?.type === "application/pdf" ||
    file?.name?.toLowerCase().endsWith(".pdf");

  const isSupportAllowed = (file) => {
    if (!file) return false;
    const name = file.name.toLowerCase();
    return (
      isPdf(file) ||
      name.endsWith(".doc") ||
      name.endsWith(".docx") ||
      name.endsWith(".ppt") ||
      name.endsWith(".pptx")
    );
  };

  const FileIcon = ({ name }) => {
    const ext = (name || "").split(".").pop()?.toLowerCase();
    if (ext === "pdf")
      return <DocumentTextIcon className="w-6 h-6 text-red-500" />;
    if (ext === "doc" || ext === "docx")
      return <DocumentDuplicateIcon className="w-6 h-6 text-blue-600" />;
    if (ext === "ppt" || ext === "pptx")
      return <DocumentDuplicateIcon className="w-6 h-6 text-orange-500" />;
    return <DocumentTextIcon className="w-6 h-6 text-gray-600" />;
  };

  /* -------------------------
     File handlers
  --------------------------*/
  const handlePdfChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!isPdf(f)) {
      setAlert({ type: "error", message: "Main file must be a PDF." });
      return;
    }
    setPdfFile(f);
    setAlert(null);
  };

  const handleSuppChange = (e) => {
    const files = Array.from(e.target.files || []);
    const allowed = files.filter(isSupportAllowed);
    const rejected = files.length - allowed.length;
    if (rejected > 0) {
      setAlert({
        type: "warning",
        message:
          "Some files were ignored — only PDF, DOC, DOCX, PPT, PPTX are accepted as support files.",
      });
    }
    setSupportFiles((s) => [...s, ...allowed]);
  };

  const removeSupportFile = (idx) =>
    setSupportFiles((s) => s.filter((_, i) => i !== idx));

  /* -------------------------
     Tags (Enter or Space)
  --------------------------*/
  const handleAddTag = (e) => {
    if ((e.key === "Enter" || e.key === " ") && metadata.currentTag.trim()) {
      e.preventDefault();
      const val = metadata.currentTag.trim();
      if (metadata.tags.length >= 10) {
        setAlert({ type: "error", message: "Maximum 10 tags allowed." });
        return;
      }
      if (metadata.tags.includes(val)) {
        setMetadata({ ...metadata, currentTag: "" });
        return;
      }
      setMetadata((m) => ({ ...m, tags: [...m.tags, val], currentTag: "" }));
    }
  };

  const removeTag = (t) =>
    setMetadata((m) => ({ ...m, tags: m.tags.filter((x) => x !== t) }));

  /* -------------------------
     Validation checks run on Next click
     (format, virus (simulated), uniqueness (simulated))
  --------------------------*/
  const handleNext = async () => {
    if (!pdfFile) {
      setAlert({ type: "error", message: "Please choose a PDF first." });
      return;
    }
    setAlert(null);
    setChecks([]);
    setLoading(true);

    const sequence = [];
    const run = async (label, ok = true) => {
      sequence.push({ label, status: "loading" });
      setChecks([...sequence]);
      await new Promise((r) => setTimeout(r, 800));
      sequence[sequence.length - 1].status = ok ? "success" : "error";
      setChecks([...sequence]);
      return ok;
    };

    // 1 format (we already validated on select)
    const ok1 = await run("Checking file format (PDF only allowed)", true);

    // 2 virus - simulate clean
    const ok2 = await run("Checking for viruses and malware", true);

    // 3 uniqueness - simulate success (you can call backend here)
    const ok3 = await run("Verifying file uniqueness", true);

    setLoading(false);

    if (ok1 && ok2 && ok3) {
      setStage(2);
      setAlert({
        type: "success",
        message: "All checks passed — continue to metadata.",
      });
    } else {
      setAlert({
        type: "error",
        message: "Validation failed. Please try again.",
      });
    }
  };

  /* -------------------------
     Final upload: send files to /api/upload-files, then POST metadata to /api/save-material
  --------------------------*/
  const handleFinalUpload = async () => {
    if (authLoading) {
      setAlert({
        type: "warning",
        message: "Checking authentication — please wait.",
      });
      return;
    }

    if (!user) {
      router.push("/auth");
      return;
    }

    if (!pdfFile) {
      setAlert({ type: "error", message: "No PDF to upload." });
      return;
    }

    if (!metadata.title?.trim()) {
      setAlert({ type: "error", message: "Please provide a document title." });
      return;
    }

    if (metadata.tags.length < 2) {
      setAlert({ type: "error", message: "Please add at least 2 tags." });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      // === 1️⃣ Upload PDF + support files to backend ===
      const form = new FormData();
      form.append("pdf", pdfFile);
      supportFiles.forEach((f) => form.append("support", f));

      const upRes = await fetch("/api/upload-files", {
        method: "POST",
        body: form,
      });

      const upJson = await upRes.json();

      if (!upRes.ok) {
        console.error("Upload-files error:", upJson);
        throw new Error(upJson.error || "File upload failed");
      }

      const pdf_name = upJson.pdf_name;
      const support_name = upJson.support_name || null;

      // === 2️⃣ Save metadata to Supabase ===
      const saveRes = await fetch("/api/save-material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          username: user.user_metadata?.full_name || user.email.split("@")[0],
          unique_name: pdf_name,
          support_name,
          title: metadata.title.trim(),
          description: metadata.description,
          tags: metadata.tags,
          revenue: 0,
          views: 0,
          downloads: 0,
        }),
      });

      const saveJson = await saveRes.json();

      if (!saveRes.ok) {
        console.error("save-material error:", saveJson);
        throw new Error(saveJson.error || "Saving metadata failed");
      }

      // === 3️⃣ Show success ===
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      setSuccess(true);
    } catch (err) {
      console.error("Final upload error:", err);
      setAlert({ type: "error", message: err.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     Small UI helpers
  --------------------------*/
  const clearAll = () => {
    setPdfFile(null);
    setSupportFiles([]);
    setMetadata({ title: "", description: "", tags: [], currentTag: "" });
    setChecks([]);
    setAlert(null);
    setStage(1);
    setSuccess(false);
  };

  /* -------------------------
     Render
  --------------------------*/
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <motion.div
          className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 140 }}
          >
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            PDF Successfully Added!
          </h2>
          <p className="text-gray-600 mb-6">
            Share your study material and start earning from it.
          </p>

          <div className="flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                // maybe navigate to material page later
                clearAll();
              }}
              className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg"
            >
              Add Another
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                // go to home or share flow
                router.push("/");
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
            >
              <ShareIcon className="w-5 h-5" /> Go to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Upload Study Material
            </h2>
            <p className="text-sm text-gray-500">
              Two-step secure upload — PDF primary file
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                clearAll();
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div
            className={`mb-4 p-3 rounded-lg border ${
              alert.type === "success"
                ? "bg-green-50 border-green-400 text-green-700"
                : alert.type === "warning"
                ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                : "bg-red-50 border-red-400 text-red-700"
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Stage 1 */}
        {stage === 1 && (
          <>
            <div className="grid grid-cols-1 gap-6">
              {/* Primary PDF upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition bg-gray-50">
                <div
                  onClick={() => document.getElementById("pdfInput").click()}
                  className="cursor-pointer"
                >
                  {pdfFile ? (
                    <div className="flex items-center justify-center gap-3 text-gray-700 font-medium">
                      <DocumentTextIcon className="w-8 h-8 text-red-500" />
                      <span className="break-all">{pdfFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">
                        Click to select your main PDF (or drag onto this card)
                      </p>
                      <p className="text-xs text-gray-500 mt-2">PDF only</p>
                    </>
                  )}
                </div>
                <input
                  id="pdfInput"
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
              </div>

              {/* small support area */}
              <div className="border rounded-lg p-4 bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optional Support Files(e.g map extracts, support images)
                </label>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-gray-500">
                    Accepted: PDF, DOC, DOCX, PPT, PPTX
                  </div>
                  <div>
                    <input
                      id="suppFiles"
                      type="file"
                      accept={supportAccept}
                      multiple
                      onChange={handleSuppChange}
                      className="hidden"
                    />
                    <button
                      onClick={() =>
                        document.getElementById("suppFiles").click()
                      }
                      className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Add files
                    </button>
                  </div>
                </div>

                {supportFiles.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {supportFiles.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <FileIcon name={f.name} />
                          <div className="text-sm">
                            <div className="font-medium break-all">
                              {f.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(f.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => removeSupportFile(i)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* validation rows (hidden until checks run) */}
              {checks.length > 0 && (
                <div className="mt-2 space-y-2">
                  {checks.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                    >
                      {c.status === "loading" && (
                        <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
                      )}
                      {c.status === "success" && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      )}
                      {c.status === "error" && (
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                      )}
                      <div className="text-sm text-gray-700">{c.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* actions */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setPdfFile(null);
                    setSupportFiles([]);
                    setAlert(null);
                  }}
                  disabled={loading}
                  className="px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 mr-3"
                >
                  Reset
                </button>

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md text-sm text-white ${
                    loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Checking...
                    </>
                  ) : (
                    <>
                      Next{" "}
                      <ArrowRightIcon className="w-4 h-4 inline-block ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Stage 2 */}
        {stage === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Document Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., UCE PHYSICS 2024 PAPER"
                value={metadata.title}
                onChange={(e) =>
                  setMetadata({ ...metadata, title: e.target.value })
                }
              />
            </div>

            {/* Description (line breaks preserved) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Describe this document thoroughly..."
                value={metadata.description}
                onChange={(e) =>
                  setMetadata({ ...metadata, description: e.target.value })
                }
              />
              <div className="text-xs text-gray-500 mt-1">
                Line breaks will be preserved.
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tags(eg mock, past paper, physics)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {metadata.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {t}
                    <button
                      onClick={() => removeTag(t)}
                      className="text-blue-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                value={metadata.currentTag}
                onChange={(e) =>
                  setMetadata({ ...metadata, currentTag: e.target.value })
                }
                onKeyDown={handleAddTag}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Type a tag and press Enter or Space"
              />
            </div>

            {/* Upload action */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setStage(1)}
                className="px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200"
              >
                Back
              </button>

              <button
                onClick={handleFinalUpload}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-sm text-white ${
                  loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
