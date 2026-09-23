let configPromise;

const geneConfigDefaults = {
  path_prefix: '/',
  site_name: '',
  default_mode: 'advanced',
  show_intro: false,
  show_files_button: true,
  show_blogs_and_tutorials: true,
  phenolyzer_permitted: true,
  omim_api_key: '',
  intro_paragraph_1: '',
  intro_paragraph_2: '',
  intro_paragraph_3: '',
  intro_paragraph_4: ''
};

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

export function applyAppConfigDefaults(config) {
  config.gene = Object.assign({}, geneConfigDefaults, config.gene || {});
  return config;
}

export function getServiceUrl(config, name) {
  const service = config[name] || {};
  const origin = service.origin || config.origin || window.location.origin;

  if (!service.path_prefix) {
    return '';
  }

  return (origin + service.path_prefix).replace(/\/+$/, '');
}
