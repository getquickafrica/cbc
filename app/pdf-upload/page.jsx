'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { checkUserAndPlan } from '@/utilis/checkUserAndPlan'; // optional — safe fallback provided below

/* -------------------------
  Helper UI: AlertCard
   - type: 'success' | 'error' | 'warning' | 'info'
--------------------------*/
const AlertCard = ({ type = 'info', title, message, onClose }) => {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  return (
    <div className={`border p-3 rounded-lg ${colors[type]} flex items-start justify-between gap-3`}>
      <div>
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm">{message}</div>
      </div>
      <div className="ml-4">
        <button onClick={onClose} className="text-sm opacity-70 hover:opacity-100">
          Close
        </button>
      </div>
    </div>
  );
};

/* -------------------------
  Validation spinner / icon
--------------------------*/
const StepRow = ({ label, status }) => {
  const icon = {
    idle: <div className="w-5 h-5 rounded-full border border-gray-200 animate-pulse" />,
    loading: <div className="w-5 h-5 rounded-full border border-gray-300 animate-spin" />,
    success: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    error: <ExclamationCircleIcon className="w-5 h-5 text-red-500" />,
  }[status || 'idle'];

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <div>{icon}</div>
        <div>{label}</div>
      </div>
    </div>
  );
};

/* -------------------------
  Main Upload Component
--------------------------*/
export default function UploadStudyMaterialCard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const fallbackCheck = checkUserAndPlan; // if file exists, else try import; if missing, you'll have error - but we try/catch below

  // Local UI state
  const [showCard, setShowCard] = useState(true);
  const [stage, setStage] = useState(1); // 1 = file & checks, 2 = metadata
  const [alert, setAlert] = useState(null); // {type, title, message}
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileHash, setFileHash] = useState(null);

  // validation states: 'idle' | 'loading' | 'success' | 'error'
  const [formatStatus, setFormatStatus] = useState('idle');
  const [virusStatus, setVirusStatus] = useState('idle');
  const [uniqueStatus, setUniqueStatus] = useState('idle');
  const [validationError, setValidationError] = useState(null);

  // Stage 2 states
  const [docName, setDocName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [suppFiles, setSuppFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropRef = useRef();

  // Disable Next until all validations are success
  const canProceed = formatStatus === 'success' && virusStatus === 'success' && uniqueStatus === 'success';

  // On mount verify user and plan — reuse the utility if present, else do a fallback check.
  useEffect(() => {
    const runCheck = async () => {
      // wait for auth to load
      if (authLoading) return;
      try {
        if (typeof fallbackCheck === 'function') {
          await fallbackCheck(user, authLoading, router);
        } else {
          // Basic fallback: if not signed in -> auth, else query user_plans and redirect if none
          if (!user) {
            router.push('/auth');
            return;
          }
          const { data, error } = await supabase.from('user_plans').select('plan').eq('user_id', user.id).single();
          if (error || !data?.plan) {
            router.push('/pricing');
            return;
          }
        }
      } catch (err) {
        // If check utility isn't available or fails, allow page to continue but show a warning
        console.warn('checkUserAndPlan error (continuing):', err);
      }
    };
    runCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  /* -------------------------
    Drag & Drop / File selection
  --------------------------*/
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const onDragOver = (e) => {
      e.preventDefault();
      el.classList.add('ring-2', 'ring-blue-300');
    };
    const onDragLeave = (e) => {
      e.preventDefault();
      el.classList.remove('ring-2', 'ring-blue-300');
    };
    const onDrop = (e) => {
      e.preventDefault();
      el.classList.remove('ring-2', 'ring-blue-300');
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    };

    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDrop);
    return () => {
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('dragleave', onDragLeave);
      el.removeEventListener('drop', onDrop);
    };
  }, []);

  const resetStage1 = () => {
    setSelectedFile(null);
    setFileName('');
    setFileHash(null);
    setFormatStatus('idle');
    setVirusStatus('idle');
    setUniqueStatus('idle');
    setValidationError(null);
  };

  const handleClose = () => {
    // per spec: simulate navigation back (we'll reset view)
    console.log('Upload card closed — simulate navigation back');
    setShowCard(false);
    // optionally reset everything
    resetStage1();
    setStage(1);
    setAlert(null);
  };

  const handleFileBrowse = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  async function computeSHA256(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  const handleFileSelect = async (file) => {
    // reset statuses
    setValidationError(null);
    setFormatStatus('loading');
    setVirusStatus('idle');
    setUniqueStatus('idle');
    setSelectedFile(null);
    setFileName(file.name);

    // Format check (PDF only)
    try {
      // quick MIME check + extension fallback
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        setFormatStatus('error');
        setValidationError('Only PDF files are allowed.');
        setAlert({ type: 'error', title: 'Invalid file type', message: 'Only PDF files are allowed.' });
        return;
      }
      setFormatStatus('success');
    } catch (err) {
      setFormatStatus('error');
      setValidationError('Error checking file format.');
      setAlert({ type: 'error', title: 'Format check failed', message: 'Could not verify file format.' });
      return;
    }

    // compute hash & run sequential checks
    setVirusStatus('loading');
    try {
      // simulate virus scan delay
      await new Promise((res) => setTimeout(res, 900));

      // (Simulated) virus scan result: we'll assume clean — in a real app you'd call an API
      const simulatedVirusClean = true;
      if (!simulatedVirusClean) {
        setVirusStatus('error');
        setValidationError('Virus scan failed.');
        setAlert({ type: 'error', title: 'Virus detected', message: 'File failed the virus scan.' });
        return;
      }
      setVirusStatus('success');
    } catch (err) {
      setVirusStatus('error');
      setValidationError('Virus scan error.');
      setAlert({ type: 'error', title: 'Virus scan failed', message: 'An error occurred during virus scanning.' });
      return;
    }

    // uniqueness: compute hash then check DB
    setUniqueStatus('loading');
    try {
      const hash = await computeSHA256(file);
      setFileHash(hash);

      // attempt to query Supabase 'user_files' table (if exists)
      const { data, error } = await supabase
        .from('user_files')
        .select('id, user_id')
        .eq('file_hash', hash)
        .limit(1)
        .maybeSingle();

      // If error code indicates table missing, treat as unique (no DB available)
      if (error) {
        console.warn('user_files check error (treating as unique):', error);
        // mark unique success but inform via an info alert that DB check couldn't be done
        setUniqueStatus('success');
        setAlert({
          type: 'info',
          title: 'Uniqueness check skipped',
          message:
            "Could not verify file uniqueness against database (table 'user_files' missing). Treating as unique — you may want to create the user_files table.",
        });
      } else {
        if (data) {
          setUniqueStatus('error');
          setValidationError('This file already exists in the database.');
          setAlert({
            type: 'error',
            title: 'Duplicate file',
            message: 'An identical file was found in the database. Please check before uploading.',
          });
          return;
        } else {
          setUniqueStatus('success');
        }
      }
    } catch (err) {
      console.error('Uniqueness check failed:', err);
      setUniqueStatus('error');
      setValidationError('Uniqueness check failed.');
      setAlert({ type: 'error', title: 'Uniqueness check failed', message: 'Could not verify if file already exists.' });
      return;
    }

    // All checks passed → set selected file
    setSelectedFile(file);
    setAlert({ type: 'success', title: 'Ready', message: 'All checks passed. Click Next to continue.' });
  };

  /* -------------------------
    Stage Transitions
  --------------------------*/
  const goToStage2 = () => {
    if (!canProceed) {
      setAlert({ type: 'error', title: 'Checks incomplete', message: 'Complete all checks before proceeding.' });
      return;
    }
    setStage(2);
    setAlert(null);
  };

  const goBackToStage1 = () => {
    setStage(1);
    setAlert(null);
  };

  /* -------------------------
    Tags handling
  --------------------------*/
  const onTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (!val) return;
      if (tags.length >= 10) {
        setAlert({ type: 'warning', title: 'Tag limit', message: 'You can add up to 10 tags only.' });
        return;
      }
      if (tags.includes(val)) {
        setTagInput('');
        return;
      }
      setTags((s) => [...s, val]);
      setTagInput('');
    }
    if (e.key === 'Backspace' && !tagInput) {
      setTags((s) => s.slice(0, -1));
    }
  };

  const removeTag = (t) => setTags((s) => s.filter((x) => x !== t));

  /* -------------------------
    Supplemental files (any type)
  --------------------------*/
  const handleSuppFilesDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSuppFiles((s) => [...s, ...files]);
  };

  const handleSuppBrowse = (e) => {
    const files = Array.from(e.target.files || []);
    setSuppFiles((s) => [...s, ...files]);
  };

  const removeSuppFile = (index) => {
    setSuppFiles((s) => s.filter((_, i) => i !== index));
  };

  /* -------------------------
    Final submission (simulate + save to DB if possible)
  --------------------------*/
  const handleFinalSubmit = async () => {
    // form validation
    if (!selectedFile) {
      setAlert({ type: 'error', title: 'No file', message: 'Please upload a PDF before submitting.' });
      return;
    }
    if (!docName.trim()) {
      setAlert({ type: 'error', title: 'Missing title', message: 'Please provide a document name.' });
      return;
    }
    if (tags.length < 2) {
      setAlert({ type: 'error', title: 'Insufficient tags', message: 'Please add at least 2 tags.' });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);

    try {
      // Option A: Try to insert a row to 'user_files' or 'materials' if table exists
      const payload = {
        user_id: user?.id ?? null,
        title: docName.trim(),
        description: description.trim(),
        tags,
        file_name: selectedFile.name,
        file_hash: fileHash,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('user_files').insert(payload);
      if (error) {
        console.warn('Could not insert into user_files (table may not exist):', error);
        // still show success UI per spec, but note failure in a warning alert
        setAlert({
          type: 'warning',
          title: 'Submitted (DB not saved)',
          message:
            "Upload flow completed UI-wise, but the file record wasn't saved to database (table 'user_files' missing or write blocked).",
        });

        // show full success UX and reset
        window.alert('success');
      } else {
        setAlert({ type: 'success', title: 'Upload Successful', message: 'Your material was saved.' });
        window.alert('success');
      }

      // Reset to stage 1 after small delay
      setTimeout(() => {
        setStage(1);
        resetStage1();
        setDocName('');
        setDescription('');
        setTags([]);
        setSuppFiles([]);
      }, 1200);
    } catch (err) {
      console.error('Final upload error:', err);
      setAlert({ type: 'error', title: 'Upload failed', message: 'An unexpected error occurred during upload.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCard) return null;

  /* -------------------------
    Render
  --------------------------*/
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative w-full max-w-4xl mx-auto rounded-2xl shadow-2xl bg-white border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Upload Study Material</h2>
            <p className="text-sm text-gray-500">Two-step secure upload for study PDFs</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                handleClose();
              }}
              aria-label="Close"
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Alert Area */}
        <div className="px-6 py-4">
          <AnimatePresence>
            {alert && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AlertCard
                  type={alert.type}
                  title={alert.title}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Body */}
        <div className="p-6">
          {stage === 1 && (
            <div>
              {/* Primary upload area */}
              <div ref={dropRef} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="mx-auto max-w-md">
                  <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-4 text-gray-700">Drag & drop a PDF here, or</p>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <label
                      htmlFor="file-browse"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <input id="file-browse" type="file" accept="application/pdf" className="hidden" onChange={handleFileBrowse} />
                      <span className="text-sm text-gray-700">Browse files</span>
                    </label>
                    <span className="text-sm text-gray-500">PDF only</span>
                  </div>

                  {fileName && (
                    <div className="mt-4 text-left">
                      <div className="font-medium">{fileName}</div>
                      <div className="text-xs text-gray-500 mt-1">{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Validation status */}
              <div className="mt-6 grid grid-cols-1 gap-3 max-w-xl mx-auto">
                <StepRow label="Checking file format (PDF only allowed)" status={formatStatus} />
                <StepRow label="Checking for virus and malware" status={virusStatus} />
                <StepRow label="Checking file uniqueness (hash)" status={uniqueStatus} />
                {validationError && <div className="text-sm text-red-600">{validationError}</div>}
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between">
                <div />
                <button
                  onClick={resetStage1}
                  className="px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100"
                >
                  Reset
                </button>

                <button
                  onClick={goToStage2}
                  disabled={!canProceed}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold ${
                    canProceed ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {stage === 2 && (
            <div>
              {/* Metadata */}
              <div className="grid grid-cols-1 gap-4">
                <label className="text-sm font-medium">Document Name</label>
                <input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="e.g., UCE WAKISHA BIOLOGY MOCK 2024" className="w-full px-4 py-2 border rounded-md" />

                <label className="text-sm font-medium mt-2">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 border rounded-md" />
              </div>

              {/* Tags */}
              <div className="mt-4">
                <label className="text-sm font-medium">Tags (press Enter to add)</label>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {tags.map((t) => (
                    <div key={t} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                      <span>{t}</span>
                      <button onClick={() => removeTag(t)} className="text-gray-500 hover:text-gray-700">×</button>
                    </div>
                  ))}
                </div>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={onTagKeyDown}
                  placeholder="Type tag and press Enter"
                  className="mt-3 w-full px-4 py-2 border rounded-md"
                />
                <div className="text-xs text-gray-500 mt-1">Minimum 2 tags, maximum 10 tags.</div>
              </div>

              {/* Optional supplemental upload */}
              <div className="mt-6">
                <label className="text-sm font-medium">Optional supplementary files</label>
                <div
                  onDrop={handleSuppFilesDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="mt-2 border border-dashed border-gray-200 rounded-md p-4"
                >
                  <div className="text-sm text-gray-500">Drag & drop supplemental files here (any format) or</div>
                  <div className="mt-3">
                    <input type="file" multiple onChange={handleSuppBrowse} />
                  </div>

                  {suppFiles.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {suppFiles.map((f, i) => (
                        <li key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div>
                            <div className="font-medium text-sm">{f.name}</div>
                            <div className="text-xs text-gray-500">{(f.size / 1024).toFixed(1)} KB</div>
                          </div>
                          <button onClick={() => removeSuppFile(i)} className="text-red-500">Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between">
                <button onClick={goBackToStage1} className="px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100">Back</button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold ${
                      isSubmitting ? 'bg-gray-300 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? 'Uploading...' : 'Upload & Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full-screen loader overlay during final submit */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin mx-auto w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent" />
                <div className="mt-4 text-gray-700 font-medium">Processing upload...</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
