/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const settings = app.settings();

  if (settings.meta.appURL?.includes('/hcgi/platform')) {
    settings.meta.appURL = settings.meta.appURL.replace(/\/hcgi\/platform\/?$/, '');
  }

  app.save(settings);
});
