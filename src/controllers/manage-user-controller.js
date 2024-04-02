

document.getElementById('addUserForm').addEventListener('submit', async (event) => {
    console.log('successfull')
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
    const response = await fetch('/addUsers', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
    });
    if (response.ok) {
        alert('User added successfully');
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        fetchUsers();
    } else {
        const errorMessage = await response.text();
        alert(errorMessage);
    }
    } catch (error) {
    console.error('Error adding user:', error);
    alert('An error occurred, please try again');
    }
});

function fetchUsers() {
    fetch('/userList')
    .then(response => response.json())
    .then(users => {
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.email} (Role: ${user.role})`;
        userList.appendChild(li);
        });
        renderUserTable(users);
    })
    .catch(error => console.error('Error fetching users:', error));
}

function renderUserTable(users) {
    const tableRows = users.map(user => `<tr><td>${user.id}</td><td>${user.email}</td><td>${user.role}</td></tr>`);
    const table = `
    <table>
        <thead>
        <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
        </tr>
        </thead>
        <tbody>
        ${tableRows.join('')}
        </tbody>
    </table>
    `;
    document.getElementById('userTable').innerHTML = table; // Changed userList to userTable
}

fetchUsers();