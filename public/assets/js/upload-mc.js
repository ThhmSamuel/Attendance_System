//table to show mc application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch data from the server
        const response = await fetch('/applicationTable');
        const data = await response.json();

        // Check if the data is empty or not
        if (data.length === 0) {
            console.log('No files found.');
            return;
        }

        // Populate the table with the fetched data
        const tableBody = document.querySelector('#fileTable tbody');
        data.forEach(file => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="#" class="file-link" data-id="${file.id}">${file.file_name}</a></td>
                <td>${file.startDate}</td>
                <td>${file.endDate}</td>
                <td>${file.notes}</td>
                <td>${file.status}</td>
            `;
            tableBody.appendChild(row);
        });

        // Attach click event listener to file links
        const fileLinks = document.querySelectorAll('.file-link');
        fileLinks.forEach(link => {
            link.addEventListener('click', async function(event) {
                event.preventDefault();

                const fileId = this.getAttribute('data-id');
                const imageUrl = `/files/${fileId}`;

                // Open the image in a new tab
                window.open(imageUrl, '_blank');
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
});


document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const notes = document.getElementById('notes').value;


    if (file) {
        const formData = new FormData();

        formData.append('mypic', file);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('notes', notes);


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

function clearForm() {
    const form = document.getElementById('uploadForm');
    const elements = form.elements;

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        if (element.type !== 'submit') { // Exclude submit button
            element.value = ''; // Clear the value
        }
    }
}

document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    clearForm();
});

