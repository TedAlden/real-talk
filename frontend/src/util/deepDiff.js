export default function deepDiff(obj1, obj2) {
  const diff = {};

  const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);

  // Recursive function to compare objects
  const compare = (obj1, obj2, path = '') => {
    for (const key in obj2) {
      const currentPath = path ? `${path}.${key}` : key;

      if (isObject(obj2[key])) {
        if (!isObject(obj1[key])) {
          diff[currentPath] = obj2[key];
        } else {
          compare(obj1[key], obj2[key], currentPath);
        }
      } else if (obj1[key] !== obj2[key]) {
        diff[currentPath] = obj2[key];
      }
    }
  };

  compare(obj1, obj2);

  // Convert the flat diff object to a nested structure
  const nestedDiff = {};
  for (const key in diff) {
    const keys = key.split('.');
    let current = nestedDiff;

    for (let i = 0; i < keys.length - 1; i++) {
      const part = keys[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    current[keys[keys.length - 1]] = diff[key];
  }

  return nestedDiff;
}
