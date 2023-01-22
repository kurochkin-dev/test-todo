const addName = document.querySelector('#addName');
const addMail = document.querySelector('#addMail');
const addTask = document.querySelector('#addTask');

const btnCreate = document.querySelector('#btnCreate');

const tbody = document.querySelector('.table tbody');
const thead = document.querySelector('.table thead');

const state = {
    token: localStorage.getItem('token'),
    orderBy: 'id_desc',
    total: 0,
    offset: 0
}

const sleep = async (ms) => new Promise((resolve) => {
    setTimeout(() => {
        resolve()
    }, ms)
});

const createTodoItem = (todo) => fetch('/api/todo', {
    method: 'PUT',
    body: JSON.stringify(todo)
}).then(response => response.json());

const getTodoItems = () => fetch(`/api/todo?orderBy=${state.orderBy}&offset=${state.offset}&limit=3`)
    .then(response => response.json());

const patch = async (id, data) => {
    return fetch(`/api/todo/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {'Authorization-Token': state.token}
    })
}

const finish = (id) => patch(id, {status: 'DONE'})

const deleteTodoItem = (id) => fetch(`/api/todo/${id}`, {
    method: 'DELETE',
    headers: {'Authorization-Token': state.token}
});

const logout = () => {
    localStorage.removeItem('token');
    state.token = null;
    return render();
}

const login = async () => {
    const {error, token} = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({
            username: document.querySelector('#username').value,
            password: document.querySelector('#password').value,
        })
    })
        .then(res => res.json());

    if (error) {
        throw error;
    }

    if (token) {
        localStorage.setItem('token', token);
        state.token = token;
    }

    await render();
};

const authHTML = () => state?.token
    ? '<div><button style="width: 100%" id="btnLogout" class="btn btn-primary">Log out</button></div>'
    : `
<div class="form-outline form-auth">
    <input type="text" id="username" class="form-control"/>
    <label class="form-label" for="username">username</label>
    <input type="password" id="password" class="form-control"/>
    <label class="form-label" for="password">password</label>
</div>
<button style="width: 100%;"  id="btnAuth" class="btn btn-primary">Auth</button>`;

const headHTML = () => {
    const orderIcon = (elementName) =>
        state.orderBy.includes(elementName)
            ? state.orderBy.includes('_desc')
                ? '▼'
                : '▲'
            : '';
    return `<tr>
                <th scope="col" class="column-order" data-column="id">No. ${orderIcon('id')}</th>
                <th scope="col" class="column-order" data-column="username">Name ${orderIcon('username')}</th>
                <th scope="col" class="column-order" data-column="email">E-mail ${orderIcon('email')}</th>
                <th scope="col" class="column-order" data-column="description">Description ${orderIcon('description')}</th>
                <th scope="col" class="column-order" data-column="status">Status ${orderIcon('status')}</th>
                ${state.token ? '<th scope="col">Actions</th>' : ''}
            </tr>`;
}

const paginationHTML = () => {
    const pages = Math.floor(state.total / 3) + 1;
    return (state.total > 3)
        ? `
<nav aria-label="Page navigation example">
  <ul class="pagination">
    ${state.offset > 0 ? `<li class="page-item"><a class="page-link" data-offset="${state.offset - 1}">Previous</a></li>` : ''}
    ${Array(pages)
            .fill(null
            ).map((nope, id) => `
<li class="page-item${state.offset === id ? ' active' : ''}">
    <a class="page-link" data-offset="${id}">${id + 1}</a>
</li>`)}
    ${state.offset < pages - 1
            ? `<li class="page-item"><a class="page-link" data-offset="${state.offset + 1}">Next</a></li>`
            : ''}
  </ul>
</nav>`
        : '';
}

const todoHTML = (todo) =>
    `<tr>
        <th scope="row">${todo.id}</th>
        <td id="updateTask">${todo.username}</td>
        <td>${todo.email}</td>
        <td>${state.token
        ? `<input class="edit-description" data-id="${todo.id}" value="${todo.description}" />`
        : todo.description}</td>
        <td id="updateStatus">${todo.status}</td>
        ${state.token ? `
        <td>
            <button type="button" data-id="${todo.id}" class="btn btn-danger btn-delete">Delete</button>
            ${todo.status !== 'DONE'
            ? `<button type="button" data-id="${todo.id}" class="btn btn-success btn-finish ms-1">Finish</button>`
            : ''}
        </td>`
        : ''}
</tr>`;



const renderAuth = () => {
    document.querySelector('.auth').innerHTML = authHTML()

    document.querySelector('#btnLogout')?.addEventListener('click', logout);

    document.querySelector('#btnAuth')?.addEventListener('click', login);
}

const renderHead = async () => {

    thead.innerHTML = headHTML();

    document
        .querySelectorAll('.table .column-order')
        .forEach(el => el
            .addEventListener('click', orderHandle))
}

const renderList = async () => {

    const {items, total} = await getTodoItems();
    state.total = total || 0;
    tbody.innerHTML = items.map(todoHTML).join();


    document.querySelectorAll('.edit-description')
        .forEach(el => el.addEventListener('keydown',
            editHandle));

    document.querySelectorAll('.btn-delete')
        .forEach(del => del.addEventListener('click', deleteHandle));

    document.querySelectorAll('.btn-finish')
        .forEach(fin => fin.addEventListener('click', finishHandle));

    await renderPagination();

};

const renderTable = () => Promise.all([
    renderHead(),
    renderList()
]);

const renderPagination = async () => {
    document.querySelector('.pagination')
        .innerHTML = paginationHTML();

    document.querySelectorAll('.pagination .page-link')
        .forEach(el => el.addEventListener('click', pageLinkHandle))
}


const pageLinkHandle = async ({target}) => {
    state.offset = parseInt(target.getAttribute('data-offset') || '0');
    await renderList();
}

const createHandle = async () => {
    await createTodoItem({
        username: addName.value,
        email: addMail.value,
        description: addTask.value
    })
    await render();
}

const orderHandle = async ({target}) => {
    const column = target.getAttribute('data-column');

    const isActiveSort = state.orderBy.includes(column);

    const isActiveSortDesc = isActiveSort && state.orderBy.includes('_desc');

    state.orderBy = isActiveSort
        ? isActiveSortDesc ? `${column}_asc` : `${column}_desc`
        : `${column}_desc`;

    await renderTable();
}

async function editHandle({target, key}) {
    const id = target.getAttribute('data-id');
    if (key === 'Enter') {
        target.style = 'color: #0d0 !important; font-weight: "bolder"';
        await patch(id, {description: this.value});
        await sleep(1000);
        target.style = null;
        await renderList();
    }
}

const finishHandle = async ({target}) => {
    const id = target.getAttribute('data-id');
    await finish(id);
    await renderList()
};

const deleteHandle = async ({target}) => {
    const id = target.getAttribute('data-id');
    await deleteTodoItem(id)
        .then(() => renderList())
        .catch(() => renderList());
}


const render = async () => {
    await renderTable();
    await renderAuth();
}

const init = async () => {
    btnCreate.addEventListener('click', createHandle);
    await render()
}

(init)();
