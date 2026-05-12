export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Something went wrong</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: #0b0b0b; color: #f5f5f5; min-height: 100vh; margin: 0; display: flex; align-items: center; justify-content: center; }
  .card { max-width: 480px; padding: 32px; text-align: center; }
  h1 { font-size: 24px; margin: 0 0 8px; }
  p { color: #a1a1aa; margin: 0 0 16px; font-size: 14px; }
  a { color: #fff; text-decoration: underline; }
</style>
</head>
<body>
  <div class="card">
    <h1>Something went wrong</h1>
    <p>The page failed to load. Try refreshing or head back home.</p>
    <a href="/">Go home</a>
  </div>
</body>
</html>`;
}
