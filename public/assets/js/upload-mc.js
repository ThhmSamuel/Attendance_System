document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    console.log("check")

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('mypic', file);

        fetch('/uploadMC', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // If upload is successful, display success message
                document.getElementById('message').innerText = 'File uploaded successfully!';
            } else {
                console.error('Upload failed');
                document.getElementById('message').innerText = 'Upload failed';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('message').innerText = 'Error occurred. Please try again later.';
        });
    }
});