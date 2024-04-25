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
            <td>${file.notes}</td>
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

    function approveFile(id) {
      fetch(`/getMC/${id}/approve`, { method: 'POST' })
        .then(response => {
          if (response.ok) {
            alert('File approved successfully');
            location.reload();
          } else {
            throw new Error('Failed to approve file');
          }
        })
        .catch(error => console.error('Error approving file:', error));
    }

    function rejectFile(id) {
      fetch(`/getMC/${id}/reject`, { method: 'POST' })
        .then(response => {
          if (response.ok) {
            alert('File rejected successfully');
            location.reload();
          } else {
            throw new Error('Failed to reject file');
          }
        })
        .catch(error => console.error('Error rejecting file:', error));
    }

    