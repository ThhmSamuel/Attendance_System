fetch('/getMC')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.getElementById('filesTable');
        data.forEach(file => {
          const startDate = new Date(file.startDate).toLocaleDateString(); // Parse and format start date
          const endDate = new Date(file.endDate).toLocaleDateString(); // Parse and format end date
          const row = document.createElement('tr');
          row.innerHTML = `
            
            <td>${file.studentName}</td>
            <td>${startDate}</td>
            <td>${endDate}</td>
            <td>
              <button onclick="showNotes('${file.notes}')" class="notes-btn">Notes</button>
              <button onclick="showImage(${file.id})" class="image-btn">View Image</button>
            </td>
            <td>${file.status}</td>
            <td>
            <button onclick="${file.status === 'Pending' ? `approveFile(${file.id})` : ''}" ${file.status !== 'Pending' ? 'disabled' : ''} style="background-color: ${file.status === 'Pending' ? 'green' : '#ccc'}">Approve</button>
            <button onclick="${file.status === 'Pending' ? `rejectFile(${file.id})` : ''}" ${file.status !== 'Pending' ? 'disabled' : ''} style="background-color: ${file.status === 'Pending' ? 'red' : '#ccc'}">Reject</button>
            </td>
          `;
          tableBody.appendChild(row);
          
        });
      })
      .catch(error => console.error('Error fetching files:', error));
    
    function showNotes(notes) {
      alert(notes); // You can replace this with a modal or popover
    }

    function showImage(fileId) {
      // Fetch the file data from the server
      fetch(`/getFileHandler/${fileId}`)
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
    
    

    function approveFile(id) {
      fetch(`/getMC/${id}/approve`, { method: 'POST' })
        .then(response => {
          if (response.ok) {
            alert('Leave/MC approved successfully');
            location.reload();
          } else {
            throw new Error('Failed to approve Leave/MC');
          }
        })
        .catch(error => console.error('Error approving file:', error));
    }

    function rejectFile(id) {
      fetch(`/getMC/${id}/reject`, { method: 'POST' })
        .then(response => {
          if (response.ok) {
            alert('Leave/MC rejected successfully');
            location.reload();
          } else {
            throw new Error('Failed to reject Leave/MC');
          }
        })
        .catch(error => console.error('Error rejecting Leave/MC:', error));
    }

    