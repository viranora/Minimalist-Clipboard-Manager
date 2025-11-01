const MAX_HISTORY = 10;
let clipboardHistory = []; 

const listContainer = document.getElementById('history-list');
const notification = document.getElementById('notification');

window.electronAPI.onClipboardUpdate((newText) => {

  if (clipboardHistory[0] === newText) {
    return;
  }

  clipboardHistory.unshift(newText);

  // Eğer liste maksimum kapasiteyi aştıysa sondakini sil
  if (clipboardHistory.length > MAX_HISTORY) {
    clipboardHistory.pop();
  }

  renderList();
});

function renderList() {

  listContainer.innerHTML = '';

  let isFirstItem = true;

  for (const itemText of clipboardHistory) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'history-item';

    itemDiv.innerText = itemText; 

    itemDiv.addEventListener('click', () => {
      window.electronAPI.writeToClipboard(itemText);
      showNotification();
    });

    // Listeye ekle
    listContainer.appendChild(itemDiv);

    if (isFirstItem) {

      setTimeout(() => {
        itemDiv.classList.add('fade-in');
      }, 10);
      isFirstItem = false;
    } else {

      itemDiv.classList.add('fade-in'); 
    }
  }
}

let notificationTimer;

function showNotification() {

  clearTimeout(notificationTimer);
  
  notification.classList.add('show');


  notificationTimer = setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}
