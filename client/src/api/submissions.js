// client/src/api/submissions.js
import axios from 'axios';
const client = axios.create({ baseURL: '/', timeout: 120000 });

// Accepts either { file } OR { files } where files is Array<File>
export async function uploadSubmission({ file, files, user_id }) {
  const form = new FormData();

  if (files && files.length) {
    files.forEach((f) => form.append('media', f, f.name)); // repeated field name 'media'
  } else if (file) {
    form.append('media', file, file.name);
  } else {
    throw new Error('No file provided');
  }

  if (user_id) form.append('user_id', user_id);

  const resp = await client.post('/api/submissions/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return resp.data;
}