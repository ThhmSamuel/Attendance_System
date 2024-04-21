
document.getElementById('addUserForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('Checked');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
    const response = await fetch('/addUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
    });
    
    if (response.ok) {
        const data = await response.json();
        alert(data.message);
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        fetchAndRenderUsers();
    } else {
        throw new Error('Network response was not ok');
    }
    
    
    } catch (error) {
    console.error('There was an error!', error);
    // Handle errors gracefully, display an error message to the user, etc.
    alert('An error occurred, please try again');
    }
});

document.getElementById('removeStudentForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('emailRemove').value;
    console.log("Email input element:",email);
    

    try {
    const response = await fetch('/removeUsers', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    if (response.ok) {
        const data = await response.json();
        alert(data.message);
        document.getElementById('emailRemove').value = '';
        fetchAndRenderUsers(); // Update user list after removing student
    } else {
        throw new Error('Network response was not ok');
    }
    
    } catch (error) {
    console.error('There was an error!', error);
    alert('An error occurred, please try again');
    }
});

// function fetchUsers() {
//     fetch('/userList')
//     .then(response => response.json())
//     .then(users => {
//         const userList = document.getElementById('userList');
//         userList.innerHTML = '';
//         users.forEach(user => {
//         const li = document.createElement('li');
//         li.textContent = `${user.email} (Role: ${user.roleID})`;
//         userList.appendChild(li);
//         });
//         renderUserTable(users);
//     })
//     .catch(error => console.error('Error fetching users:', error));
// }

// function renderUserTable(users) {
//     const tableRows = users.map(user => `<tr></td><td>${user.email}</td><td>${user.roleID}</td></tr>`);
//     const table = `
//     <table>
//         <thead>
//         <tr> 
//             <th>Email</th>
//             <th>Role</th>
//         </tr>
//         </thead>
//         <tbody>
//         ${tableRows.join('')}
//         </tbody>
//     </table>
//     `;
//     document.getElementById('userTable').innerHTML = table;
// }

// fetchUsers();

function fetchAndRenderUsers() {
    fetch('/userList')
      .then(response => response.json())
      .then(users => {
        const table = `
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(user => `<tr><td>${user.email}</td><td>${user.roleID}</td></tr>`).join('')}
            </tbody>
          </table>
        `;
  
        document.getElementById('userTable').innerHTML = table;
      })
      .catch(error => console.error('Error fetching users:', error));
  }
  
  fetchAndRenderUsers();
  
