<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>@yield('title') — Lartiska</title>
    <style>
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            background: #07060A;
            color: #F4ECD8;
            font-family: Georgia, 'Cormorant Garamond', serif;
            display: grid;
            place-items: center;
            padding: 24px;
        }
        .frame {
            max-width: 560px;
            text-align: center;
            background: rgba(20, 16, 11, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(212, 175, 55, 0.18);
            border-radius: 22px;
            padding: 48px 36px;
        }
        .code {
            font-size: clamp(72px, 14vw, 140px);
            font-weight: 300;
            line-height: 1;
            color: #D4AF37;
            font-style: italic;
            letter-spacing: -0.05em;
            margin: 0;
        }
        .eyebrow {
            margin: 24px 0 12px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 11px;
            letter-spacing: 0.28em;
            text-transform: uppercase;
            color: #D4AF37;
            font-weight: 700;
        }
        h1 {
            font-weight: 300;
            font-size: clamp(1.75rem, 4vw, 2.5rem);
            margin: 0 0 16px;
            letter-spacing: -0.02em;
            line-height: 1.15;
        }
        h1 em { color: #D4AF37; font-style: italic; font-weight: 400; }
        p { color: rgba(244, 236, 216, 0.78); line-height: 1.7; margin: 0 0 28px; font-size: 15px; }
        .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-gold, .btn-ghost {
            display: inline-block;
            padding: 12px 26px;
            border-radius: 999px;
            text-decoration: none;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.5px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .btn-gold {
            background: #D4AF37;
            color: #0A0806;
            box-shadow: 0 12px 32px -12px rgba(212, 175, 55, 0.55);
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 16px 40px -12px rgba(212, 175, 55, 0.7); }
        .btn-ghost {
            background: transparent;
            color: #F4ECD8;
            border: 1px solid rgba(244, 236, 216, 0.4);
        }
        .btn-ghost:hover { border-color: #D4AF37; color: #D4AF37; }
        .footnote {
            margin-top: 32px;
            font-size: 10px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: rgba(212, 175, 55, 0.85);
            font-family: system-ui, -apple-system, sans-serif;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="frame">
        <p class="code">@yield('code')</p>
        <p class="eyebrow">✦ @yield('eyebrow') ✦</p>
        <h1>@yield('heading')</h1>
        <p>@yield('description')</p>
        <div class="actions">
            <a href="{{ config('app.frontend_url', 'https://lartiska.onrender.com') }}" class="btn-gold">Retour sur lartiska</a>
            <a href="{{ config('app.frontend_url', 'https://lartiska.onrender.com') }}/contact" class="btn-ghost">Nous contacter</a>
        </div>
        <p class="footnote">— Lartiska · Sénégal · Gambie · Mauritanie</p>
    </div>
</body>
</html>
