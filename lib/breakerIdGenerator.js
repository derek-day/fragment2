// lib/breakerIdGenerator.js

/**
 * Check if a number is prime
 */
function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  
  const sqrt = Math.floor(Math.sqrt(num));
  for (let i = 3; i <= sqrt; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

/**
 * Generate a random 9-digit number
 */
function getRandomNineDigit() {
  // 9-digit numbers range from 100,000,000 to 999,999,999
  const min = 100000000;
  const max = 999999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Find the next prime number starting from a given number
 */
function nextPrime(num) {
  // If even, make it odd
  if (num % 2 === 0) num++;
  
  // Check odd numbers only
  while (!isPrime(num)) {
    num += 2;
    // Ensure we stay within 9 digits
    if (num > 999999999) {
      num = 100000001; // Start over with smallest 9-digit odd number
    }
  }
  
  return num;
}

/**
 * Generate a unique 9-digit prime Breaker ID
 * @returns {number} A 9-digit prime number
 */
export function generateBreakerID() {
  const randomNum = getRandomNineDigit();
  const primeId = nextPrime(randomNum);
  
  console.log(`Generated Breaker ID: ${primeId} (Prime: ${isPrime(primeId)})`);
  
  return primeId;
}

/**
 * Check if an existing ID is already in use (optional - use with Firestore)
 * @param {number} id - The ID to check
 * @param {object} db - Firestore database instance
 * @returns {Promise<boolean>} True if ID exists, false otherwise
 */
export async function isBreakerIDTaken(id, db) {
  const { collection, query, where, getDocs } = await import('firebase/firestore');
  
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('breakerId', '==', id));
  const snapshot = await getDocs(q);
  
  return !snapshot.empty;
}

/**
 * Generate a guaranteed unique Breaker ID
 * @param {object} db - Firestore database instance
 * @returns {Promise<number>} A unique 9-digit prime number
 */
export async function generateUniqueBreakerID(db) {
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loop
  
  while (attempts < maxAttempts) {
    const id = generateBreakerID();
    return id;
    
    // const taken = await isBreakerIDTaken(id, db);
    
    // if (!taken) {
    //   return id;
    // }
    
    attempts++;
    console.log(`Breaker ID ${id} already taken, generating new one... (attempt ${attempts})`);
  }
  
  throw new Error('Could not generate unique Breaker ID after 100 attempts');
}

/**
 * Format Breaker ID for display (adds hyphens)
 * @param {number} id - The Breaker ID
 * @returns {string} Formatted ID (e.g., "123-456-789")
 */
export function formatBreakerID(id) {
  const str = id.toString();
  return `${str.slice(0, 3)}-${str.slice(3, 6)}-${str.slice(6, 9)}`;
}