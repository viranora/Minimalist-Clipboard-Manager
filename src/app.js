// Maksimum kaç öğe tutulacak
const MAX_HISTORY = 10;
let clipboardHistory = []; // Pano geçmişini tutan dizi

// DOM elementlerini seç
const listContainer = document.getElementById('history-list');
const notification = document.getElementById('notification');

// 'preload.js' aracılığıyla 'main.js'den gelen pano güncellemelerini dinle
window.electronAPI.onClipboardUpdate((newText) => {
  // Eğer gelen metin zaten listenin başındaysa bir şey yapma
  if (clipboardHistory[0] === newText) {
    return;
  }

  // Yeni metni dizinin başına ekle
  clipboardHistory.unshift(newText);

  // Eğer liste maksimum kapasiteyi aştıysa sondakini sil
  if (clipboardHistory.length > MAX_HISTORY) {
    clipboardHistory.pop();
  }

  // Arayüzü yeniden çiz
  renderList();
});

// Arayüzü çizen fonksiyon
function renderList() {
  // Önce listeyi temizle
  listContainer.innerHTML = '';

  // Listenin en üstündeki (yeni) öğeye "yeni" animasyonu ekle
  let isFirstItem = true;

  // Geçmiş dizisindeki her öğe için bir div oluştur
  for (const itemText of clipboardHistory) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'history-item';
    
    // Metni güvenli bir şekilde ekle (HTML olarak değil)
    itemDiv.innerText = itemText; 

    // Tıklama olayı ekle
    itemDiv.addEventListener('click', () => {
      // 'main.js'e bu metni panoya yazmasını söyle
      window.electronAPI.writeToClipboard(itemText);
      // "Kopyalandı!" bildirimini göster
      showNotification();
    });

    // Listeye ekle
    listContainer.appendChild(itemDiv);

    // Sadece ilk (en yeni) öğe için animasyonu tetikle
    if (isFirstItem) {
      // CSS animasyonunu tetiklemek için küçük bir gecikme
      setTimeout(() => {
        itemDiv.classList.add('fade-in');
      }, 10);
      isFirstItem = false;
    } else {
      // Diğerleri animasyonsuz, direkt görünsün
      itemDiv.classList.add('fade-in'); 
    }
  }
}

let notificationTimer;
// "Kopyalandı!" bildirimini gösteren fonksiyon
function showNotification() {
  // Önceki zamanlayıcı varsa temizle
  clearTimeout(notificationTimer);
  
  notification.classList.add('show');

  // 2 saniye sonra bildirimi gizle
  notificationTimer = setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}
