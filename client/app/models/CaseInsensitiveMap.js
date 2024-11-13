class CaseInsensitiveMap {
  constructor() {
    this.map = {};
  }

  set(key, value) {
    this.map[key.toLowerCase()] = value;
  }

  get(key) {
    return this.map[key.toLowerCase()];
  }

  has(key) {
    return this.map.hasOwnProperty(key.toLowerCase());
  }

  delete(key) {
    return delete this.map[key.toLowerCase()];
  }

  // Additional methods as needed
}

export default CaseInsensitiveMap;