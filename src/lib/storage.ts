import { encryptData, decryptData } from './encryption';

export interface ChequeRecord {
  id: string;
  payeeName: string;
  amount: number;
  amountWords: string;
  date: string;
  bank: string;
  layoutId: string;
  createdAt: string;
}

export interface ChequeLayout {
  id: string;
  name: string;
  payeeX: number;
  payeeY: number;
  amountX: number;
  amountY: number;
  amountWordsX: number;
  amountWordsY: number;
  dateX: number;
  dateY: number;
  acPayeeX: number;
  acPayeeY: number;
  backgroundImage?: string;
}

const DB_NAME = 'ChequePrinterDB';
const CHEQUES_STORE = 'cheques';
const LAYOUTS_STORE = 'layouts';
const VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(CHEQUES_STORE)) {
        db.createObjectStore(CHEQUES_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(LAYOUTS_STORE)) {
        db.createObjectStore(LAYOUTS_STORE, { keyPath: 'id' });
      }
    };
  });
}

// Cheque operations
export async function saveCheque(cheque: ChequeRecord): Promise<void> {
  const db = await openDB();
  const encrypted = await encryptData(JSON.stringify(cheque));
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHEQUES_STORE], 'readwrite');
    const store = transaction.objectStore(CHEQUES_STORE);
    const request = store.put({ id: cheque.id, data: encrypted });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getCheques(): Promise<ChequeRecord[]> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHEQUES_STORE], 'readonly');
    const store = transaction.objectStore(CHEQUES_STORE);
    const request = store.getAll();
    
    request.onsuccess = async () => {
      const encrypted = request.result;
      const decrypted = await Promise.all(
        encrypted.map(async (item: any) => {
          const data = await decryptData(item.data);
          return JSON.parse(data) as ChequeRecord;
        })
      );
      resolve(decrypted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteCheque(id: string): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHEQUES_STORE], 'readwrite');
    const store = transaction.objectStore(CHEQUES_STORE);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Layout operations
export async function saveLayout(layout: ChequeLayout): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LAYOUTS_STORE], 'readwrite');
    const store = transaction.objectStore(LAYOUTS_STORE);
    const request = store.put(layout);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getLayouts(): Promise<ChequeLayout[]> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LAYOUTS_STORE], 'readonly');
    const store = transaction.objectStore(LAYOUTS_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteLayout(id: string): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LAYOUTS_STORE], 'readwrite');
    const store = transaction.objectStore(LAYOUTS_STORE);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Initialize default layouts
export async function initializeDefaultLayouts(): Promise<void> {
  const existing = await getLayouts();
  if (existing.length > 0) return;
  
  const defaultLayouts: ChequeLayout[] = [
    {
      id: 'sbi',
      name: 'State Bank of India',
      payeeX: 60,
      payeeY: 35,
      amountX: 155,
      amountY: 35,
      amountWordsX: 15,
      amountWordsY: 45,
      dateX: 155,
      dateY: 15,
      acPayeeX: 110,
      acPayeeY: 80,
    },
    {
      id: 'hdfc',
      name: 'HDFC Bank',
      payeeX: 125,
      payeeY: 165,
      amountX: 950,
      amountY: 215,
      amountWordsX: 125,
      amountWordsY: 215,
      dateX: 940,
      dateY: 65,
      acPayeeX: 110,
      acPayeeY: 80,
    },
    {
      id: 'icici',
      name: 'ICICI Bank',
      payeeX: 62,
      payeeY: 36,
      amountX: 158,
      amountY: 36,
      amountWordsX: 16,
      amountWordsY: 46,
      dateX: 158,
      dateY: 16,
      acPayeeX: 110,
      acPayeeY: 80,
    },
  ];
  
  for (const layout of defaultLayouts) {
    await saveLayout(layout);
  }
}
