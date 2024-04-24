

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


fetch('/getFileNames')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.querySelector('#fileTable tbody');

    // Populate table with data
    data.forEach(file => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${file.id}</td>
        <td><a href="#" onclick="showFile('${file.id}')">${file.file_name}</a></td>
        <td>${file.status}</td>
        <td>${file.startDate}</td>
        <td>${file.endDate}</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => console.error('Error fetching data:', error));


  function showFile(fileId) {
    // Fetch the file data from the server
    fetch(`/file/${fileId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blobData => {
        // Create a URL for the blob data
        const imageUrl = URL.createObjectURL(blobData);
  
        // Open a new window to display the image
        const imageWindow = window.open("", "_blank");
        imageWindow.document.write(`<img src="${imageUrl}" alt="File">`);
  
        // Handle window closing to release object URL
        imageWindow.onunload = () => URL.revokeObjectURL(imageUrl);
      })
      .catch(error => console.error('Error fetching file:', error));
  }
  