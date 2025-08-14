
const supabaseUrl = 'https://fiiubtgrwbgcevojjjcg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpaXVidGdyd2JnY2V2b2pqamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjkzMTUsImV4cCI6MjA3MDc0NTMxNX0.dZefnAWLRMQC08KbHiBk5P0AbpzdlHRGM7L8WflB6uA';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'files';
const TARGET_FILE_NAME = 'sam5pk.zip'; // The fixed file name for uploading

// --- File Upload ---
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    // Upload the file with the fixed name and overwrite if it exists.
    const { data, error } = await supabaseClient
        .storage
        .from(BUCKET_NAME)
        .upload(TARGET_FILE_NAME, file, {
            cacheControl: '3600',
            upsert: true // true to overwrite existing file
        });

    if (error) {
        alert('Error uploading file: ' + error.message);
        console.error(error);
    } else {
        alert(`File successfully uploaded and saved as ${TARGET_FILE_NAME}!`);
        fileInput.value = ''; // Reset file input
        listFiles(); // Refresh the file list
    }
}

// --- File Listing ---
async function listFiles() {
    const fileListDiv = document.getElementById('fileList');
    fileListDiv.innerHTML = 'Loading...';

    const { data, error } = await supabaseClient
        .storage
        .from(BUCKET_NAME)
        .list();

    if (error) {
        fileListDiv.innerHTML = 'Error loading files.';
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        fileListDiv.innerHTML = 'No files found.';
        return;
    }

    const listHtml = data.map(file => `
        <li>
            <span>${file.name}</span>
            <button onclick="downloadFile('${file.name}')">Download</button>
        </li>
    `).join('');

    fileListDiv.innerHTML = `<ul>${listHtml}</ul>`;
}

// --- File Download ---
async function downloadFile(fileName) {
    const { data, error } = await supabaseClient
        .storage
        .from(BUCKET_NAME)
        .download(fileName);

    if (error) {
        alert('Error downloading file: ' + error.message);
        console.error(error);
        return;
    }

    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}


// --- Initial Load ---
// Load the list of files when the page loads
window.addEventListener('load', listFiles);
