'use strict';
// Minimal desktop shell: serves the unmodified ../index.html from a
// privileged custom scheme so it gets a real secure origin (AudioWorklet
// key lock, IndexedDB, localStorage) instead of file://. No preload, no
// Node in the renderer, no navigation away from the app, no new windows.
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { app, BrowserWindow, net, protocol } = require('electron');

const SCHEME = 'acro';
const HOST = 'app';
const ENTRY = `${SCHEME}://${HOST}/index.html`;
const INDEX = app.isPackaged
  ? path.join(process.resourcesPath, 'web', 'index.html')
  : path.join(__dirname, '..', 'index.html');

protocol.registerSchemesAsPrivileged([
  { scheme: SCHEME, privileges: { standard: true, secure: true } },
]);

const isAppUrl = url => {
  try {
    const u = new URL(url);
    return u.protocol === `${SCHEME}:` && u.host === HOST;
  } catch {
    return false;
  }
};

app.on('web-contents-created', (_e, contents) => {
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
  const guard = (e, url) => { if (!isAppUrl(url)) e.preventDefault(); };
  contents.on('will-navigate', guard);
  contents.on('will-redirect', guard);
});

app.whenReady().then(() => {
  protocol.handle(SCHEME, req => {
    const { host, pathname } = new URL(req.url);
    if (host !== HOST || (pathname !== '/' && pathname !== '/index.html')) {
      return new Response('Not found', { status: 404 });
    }
    return net.fetch(pathToFileURL(INDEX).toString());
  });

  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    title: 'Acro DJ Mixer',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.removeMenu();
  win.loadURL(ENTRY);
});

app.on('window-all-closed', () => app.quit());
