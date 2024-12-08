// Testing createElemWithText
const testElem = createElemWithText('h3', 'Test Heading', 'test-class');
document.body.appendChild(testElem);

// Testing createSelectOptions
const sampleUsers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
];
const selectMenu = document.getElementById('selectMenu');
const options = createSelectOptions(sampleUsers);
options.forEach(option => selectMenu.appendChild(option));

// Testing toggleCommentSection
const testSection = document.createElement('section');
testSection.dataset.postId = '1';
testSection.textContent = 'This is a comment section';
document.body.appendChild(testSection);
toggleCommentSection('1');

// Testing toggleCommentButton
const testButton = document.createElement('button');
testButton.dataset.postId = '1';
testButton.textContent = 'Show Comments';
document.body.appendChild(testButton);
toggleCommentButton('1');

// Testing deleteChildElements
const testContainer = document.createElement('div');
testContainer.innerHTML = '<p>Child 1</p><p>Child 2</p>';
document.body.appendChild(testContainer);
deleteChildElements(testContainer);
