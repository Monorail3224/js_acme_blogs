function createElemWithText(tagName = "p", textContent = "", className) {
    const element = document.createElement(tagName);
    element.textContent = textContent;
    if (className) {
        element.classList.add(className);
    }
    return element;
}

function createSelectOptions(users) {
    if (!users) return undefined;
    return users.map(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
}

function toggleCommentSection(postId) {
    if (!postId) return undefined;
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if (!section) return null;
    section.classList.toggle('hide');
    return section;
}

function toggleCommentButton(postId) {
    if (!postId) return undefined;
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if (!button) return null;
    button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    return button;
}

function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) return undefined;
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
    return parentElement;
}

function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (buttons.length === 0) return buttons;
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener("click", function(event) {
                toggleComments(event, postId);
            });
        }
    });
    return buttons;
}

function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.removeEventListener("click", (event) => {
                toggleComments(event, postId);
            });
        }
    });
    return buttons;
}

function toggleComments(event, postId) {
    if (!event || !postId) return undefined;
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

function createComments(comments) {
    if (!comments) return undefined;
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const body = createElemWithText("p", comment.body);
        const email = createElemWithText("p", `From: ${comment.email}`);
        article.append(h3, body, email);
        fragment.appendChild(article);
    });
    return fragment;
}

function populateSelectMenu(users) {
    if (!users) return undefined;
    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(users);
    options.forEach(option => selectMenu.appendChild(option));
    return selectMenu;
}

async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function getUserPosts(userId) {
    if (!userId) return undefined;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) throw new Error(`Error fetching posts for user ${userId}: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user posts:', error);
    }
}

async function getUser(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) throw new Error(`Error fetching user ${userId}: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

async function getPostComments(postId) {
    if (!postId) return undefined;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if (!response.ok) throw new Error(`Error fetching comments for post ${postId}: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching post comments:', error);
    }
}

async function displayComments(postId) {
    try {
        const section = document.createElement('section');
        section.dataset.postId = postId;
        section.classList.add('comments', 'hide');
        const comments = await getPostComments(postId);
        const fragment = createComments(comments);
        section.appendChild(fragment);
        return section;
    } catch (error) {
        console.error(`Error displaying comments for post ${postId}:`, error);
    }
}

async function createPosts(posts) {
    if (!posts) return undefined;
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        const article = document.createElement('article');
        const h2 = createElemWithText('h2', post.title);
        const body = createElemWithText('p', post.body);
        const postIdPara = createElemWithText('p', `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const authorPara = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const companyCatchPhrase = createElemWithText('p', author.company.catchPhrase);
        const button = createElemWithText('button', 'Show Comments');
        button.dataset.postId = post.id;
        const section = await displayComments(post.id);
        article.append(h2, body, postIdPara, authorPara, companyCatchPhrase, button, section);
        fragment.appendChild(article);
    }
    return fragment;
}

async function displayPosts(posts) {
    const main = document.querySelector('main');
    const element = posts ? await createPosts(posts) : createElemWithText('p', 'Select an Employee to display their posts.', 'default-text');
    main.appendChild(element);
    return element;
}

async function refreshPosts(posts) {
    if (!posts) return undefined;
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector('main'));
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, main, fragment, addButtons];
}

async function selectMenuChangeEventHandler(event) {
    if (!event || !event.target) return undefined;
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const userId = parseInt(selectMenu.value) || 1;
    try {
        const posts = await getUserPosts(userId);
        const refreshPostsArray = await refreshPosts(posts);
        selectMenu.disabled = false;
        return [userId, posts, refreshPostsArray];
    } catch (error) {
        console.error(`Error in selectMenuChangeEventHandler:`, error);
        selectMenu.disabled = false;
        return [userId, [], []];
    }
}

async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

async function initApp() {
    await initPage();
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler);
}

document.addEventListener('DOMContentLoaded', initApp);
