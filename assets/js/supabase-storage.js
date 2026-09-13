import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

window.SUPABASE_STORAGE_CONFIG = window.SUPABASE_STORAGE_CONFIG || {
  url: "https://oiywuogasvgnrwiuogfo.supabase.co",
  anonKey: "sb_publishable_gxfwUd57TBT80aM2VMDOpA_3--2PY-a",
  bucket: "data-bucket"
};

const config = window.SUPABASE_STORAGE_CONFIG;
const supabase = createClient(config.url, config.anonKey);

window.supabaseStorageClient = supabase;
window.supabaseStorageBucket = config.bucket;

window.uploadFileToSupabase = async function uploadFileToSupabase(file, path) {
  if (!file) {
    throw new Error("No file provided.");
  }

  const storagePath = path || `portfolio-uploads/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from(config.bucket)
    .upload(storagePath, file, {
      upsert: true,
      cacheControl: "3600"
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(config.bucket)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};

window.getSupabaseStorageUrl = async function getSupabaseStorageUrl(path) {
  if (!path) {
    throw new Error("Storage path is required.");
  }

  const { data } = supabase.storage.from(config.bucket).getPublicUrl(path);
  return data.publicUrl;
};

console.info("Supabase Storage initialized successfully.");
