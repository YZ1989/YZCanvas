const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const root = path.resolve(__dirname, '..');
const url = 'http://127.0.0.1:3010/';
const noBrowser = process.argv.includes('--no-browser');
const logRoot = path.join(process.env.LOCALAPPDATA, 'YZCanvas', 'dev-preview');
async function ready() {
    let response;
    try { response = await fetch(url, { signal: AbortSignal.timeout(1500) }); }
    catch { return false; }
    const html = await response.text();
    if (!html.includes('<title>YZCanvas</title>') || !html.includes('/@vite/client')) {
        throw new Error('Port 3010 belongs to another app. Close that app and try again.');
    }
    return true;
}
async function main() {
    if (!await ready()) {
        const vite = path.join(root, 'web', 'node_modules', 'vite', 'bin', 'vite.js');
        if (!fs.existsSync(vite)) throw new Error('Run npm ci --legacy-peer-deps in the web folder first.');
        fs.mkdirSync(logRoot, { recursive: true });
        const out = fs.openSync(path.join(logRoot, 'stdout.log'), 'a');
        const err = fs.openSync(path.join(logRoot, 'stderr.log'), 'a');
        const server = spawn(process.execPath, [vite, '--host', '127.0.0.1', '--port', '3010', '--strictPort'], {
            cwd: path.join(root, 'web'), detached: true, windowsHide: true, stdio: ['ignore', out, err]
        });
        fs.closeSync(out); fs.closeSync(err);
        let failure;
        server.on('error', error => { failure = error; });
        server.unref();
        const deadline = Date.now() + 35000;
        while (!await ready()) {
            if (failure) throw failure;
            if (server.exitCode !== null || Date.now() > deadline) throw new Error(`Startup failed. See ${logRoot}`);
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }
    if (!noBrowser) {
        const browser = spawn('explorer.exe', [url], { detached: true, windowsHide: true, stdio: 'ignore' });
        browser.on('error', () => console.error(`Open ${url} in your browser.`));
        browser.unref();
    }
    console.log(`YZCanvas preview ready: ${url}`);
}
// A local lock prevents two double-clicks from racing to start the server.
const lock = net.createServer();
lock.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? 'YZCanvas launcher is already running. Try again shortly.' : error.message);
    process.exitCode = 1;
});
lock.listen(3011, '127.0.0.1', async () => {
    try { await main(); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
    finally { lock.close(); }
});
