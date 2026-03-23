import { openDB } from 'idb';

const DB_NAME = 'tappd_db';
const DB_VERSION = 1;

export const STORES = {
  receipts: 'receipts',
  settings: 'settings'
};

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Receipts store
      const receiptStore = db.createObjectStore(STORES.receipts, {
        keyPath: 'id',
        autoIncrement: true
      });
      receiptStore.createIndex('date', 'date');
      receiptStore.createIndex('category', 'category');
      receiptStore.createIndex('total', 'total');
      
      // Settings store
      const settingsStore = db.createObjectStore(STORES.settings, {
        keyPath: 'key'
      });
    }
  });
  
  return db;
}

export async function saveReceipt(receiptData) {
  const db = await initDB();
  const tx = db.transaction(STORES.receipts, 'readwrite');
  const store = tx.objectStore(STORES.receipts);
  
  const receipt = {
    ...receiptData,
    createdAt: new Date().toISOString(),
    id: receiptData.id || undefined
  };
  
  const result = await store.put(receipt);
  await tx.complete;
  
  return result;
}

export async function getReceipts(options = {}) {
  const db = await initDB();
  const tx = db.transaction(STORES.receipts, 'readonly');
  const store = tx.objectStore(STORES.receipts);
  
  let receipts = await store.getAll();
  
  // Sort by date (newest first)
  receipts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Apply filters
  if (options.category) {
    receipts = receipts.filter(r => r.category === options.category);
  }
  
  if (options.startDate) {
    receipts = receipts.filter(r => new Date(r.date) >= new Date(options.startDate));
  }
  
  if (options.endDate) {
    receipts = receipts.filter(r => new Date(r.date) <= new Date(options.endDate));
  }
  
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    receipts = receipts.filter(r => 
      r.merchant?.toLowerCase().includes(searchLower) ||
      r.items?.some(item => item.name?.toLowerCase().includes(searchLower))
    );
  }
  
  return receipts;
}

export async function deleteReceipt(id) {
  const db = await initDB();
  const tx = db.transaction(STORES.receipts, 'readwrite');
  const store = tx.objectStore(STORES.receipts);
  
  await store.delete(id);
  await tx.complete;
}

export async function saveSetting(key, value) {
  const db = await initDB();
  const tx = db.transaction(STORES.settings, 'readwrite');
  const store = tx.objectStore(STORES.settings);
  
  await store.put({ key, value });
  await tx.complete;
}

export async function getSetting(key, defaultValue = null) {
  const db = await initDB();
  const tx = db.transaction(STORES.settings, 'readonly');
  const store = tx.objectStore(STORES.settings);
  
  const result = await store.get(key);
  return result ? result.value : defaultValue;
}

export async function exportToCSV() {
  const receipts = await getReceipts();
  
  const headers = [
    'Date', 'Merchant', 'Category', 'Currency', 'Total', 
    'Subtotal', 'Tax', 'Items', 'Notes'
  ];
  
  const rows = receipts.map(receipt => [
    receipt.date || '',
    receipt.merchant || '',
    receipt.category || '',
    receipt.currency || '',
    receipt.total || '',
    receipt.subtotal || '',
    receipt.tax || '',
    receipt.items ? receipt.items.map(item => `${item.name}: ${item.price}`).join('; ') : '',
    receipt.notes || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}
