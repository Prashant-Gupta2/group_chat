let queue = [];
let running = false;

const WAIT = 1500; // 1.5 sec between requests

async function process() {
  if (running || queue.length === 0) return;

  running = true;

  const { fn, resolve, reject } = queue.shift();

  try {
    const result = await fn();
    resolve(result);
  } catch (err) {
    reject(err);
  }

  setTimeout(() => {
    running = false;
    process();
  }, WAIT);
}

function aiQueue(fn) {
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    process();
  });
}

module.exports = aiQueue;