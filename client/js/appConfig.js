let configPromise;

export function loadAppConfig() {
  if (!configPromise) {
    configPromise = fetch('./config.json').then(response => {
      if (!response.ok) {
        throw new Error('Unable to load config.json');
      }
      return response.json();
    });
  }
  return configPromise;
}

export function getServiceUrl(config, name) {
  const service = config[name] || {};
  const origin = service.origin || config.origin || window.location.origin;

  if (!service.path) {
    return '';
  }

  return (origin + service.path).replace(/\/+$/, '');
}
