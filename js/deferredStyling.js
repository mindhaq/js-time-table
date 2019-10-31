(function() {
  const deferredStyles = [
    {
      path: 'css/variables/palette.css',
      media: 'screen',
    },
    {
      path: 'css/variables/filters.css',
      media: 'screen',
    },
    {
      path: 'css/variables/transitions.css',
      media: 'screen',
    },
    {
      path: 'css/themes/theme-light.css',
      media: 'screen',
    },
    {
      path: 'css/themes/theme-dark.css',
      media: 'screen and (prefers-color-scheme:dark)',
    },
    {
      path: 'css/components/dialog.css',
      media: 'screen',
    },
    {
      path: 'css/components/dialog_md.css',
      media: 'screen and (min-width:568px)',
    },
    {
      path: 'css/components/form.css',
      media: 'screen',
    },
    {
      path: 'css/components/form_md.css',
      media: 'screen and (min-width:568px)',
    },
    {
      path: 'css/page/page-print.css',
      media: 'print',
    },
    {
      path: 'css/page/body_lg.css',
      media: 'screen and (min-width:1024px)',
    },
    {
      path: 'css/page/footer_md.css',
      media: 'screen and (min-width:568px)',
    },
    {
      path: 'css/page/header_lg.css',
      media: 'screen and (min-width:1024px)',
    },
    {
      path: 'css/page/content_lg.css',
      media: 'screen and (min-width:1024px)',
    },
    {
      path: 'css/components/table_md.css',
      media: 'screen and (min-width:568px)',
    },
  ];
  window.addEventListener('DOMContentLoaded', () => {
    deferredStyles.forEach(style => document.head.insertAdjacentHTML('beforeEnd', `<link rel="stylesheet" type="text/css" href="${style.path}" media="${style.media}">`))
  });
})();
