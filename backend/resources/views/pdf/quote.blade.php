<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Devis {{ $quote->reference }} — Lartiska</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: "DejaVu Sans", sans-serif;
            font-size: 11px;
            color: #1a1208;
            margin: 0;
            line-height: 1.55;
        }
        .page { padding: 36px 44px 56px; }

        /* Header brandé */
        .header {
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 18px;
            margin-bottom: 28px;
        }
        .logo {
            font-family: "DejaVu Serif", serif;
            font-size: 32px;
            letter-spacing: 6px;
            font-weight: 300;
        }
        .logo span { color: #D4AF37; font-style: italic; }
        .tagline {
            font-size: 9px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #7A5408;
            margin-top: 4px;
        }
        .essence {
            font-size: 9px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #D4AF37;
            margin-top: 2px;
        }
        .header-meta {
            position: absolute;
            top: 36px;
            right: 44px;
            text-align: right;
        }
        .doc-type {
            font-size: 10px;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #7A5408;
        }
        .doc-ref {
            font-family: "DejaVu Sans Mono", monospace;
            font-size: 14px;
            color: #D4AF37;
            margin-top: 6px;
            font-weight: bold;
        }
        .doc-date {
            font-size: 10px;
            color: #5a4a30;
            margin-top: 4px;
        }

        /* Sections */
        .section-title {
            font-size: 9px;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #7A5408;
            margin: 22px 0 8px;
            border-bottom: 1px solid rgba(122, 84, 8, 0.2);
            padding-bottom: 4px;
        }

        .grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }
        .grid .col {
            display: table-cell;
            vertical-align: top;
            padding-right: 16px;
        }
        .grid .col:last-child { padding-right: 0; }

        .label {
            font-size: 8px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #7A5408;
        }
        .value {
            font-size: 12px;
            color: #1a1208;
            margin-top: 2px;
        }
        .value-lg {
            font-family: "DejaVu Serif", serif;
            font-size: 18px;
            color: #1a1208;
            margin-top: 4px;
            font-weight: 400;
        }

        /* Tableau lignes */
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        table.items th {
            font-size: 8px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #7A5408;
            text-align: left;
            padding: 8px 6px;
            border-bottom: 1px solid #D4AF37;
            font-weight: normal;
        }
        table.items th.r,
        table.items td.r { text-align: right; }
        table.items td {
            padding: 10px 6px;
            border-bottom: 1px solid rgba(122, 84, 8, 0.1);
            vertical-align: top;
        }
        table.items tr.total td {
            border-bottom: none;
            border-top: 2px solid #D4AF37;
            padding-top: 14px;
            font-weight: bold;
            color: #D4AF37;
            font-size: 14px;
        }

        /* Conditions */
        .conditions {
            margin-top: 32px;
            padding: 14px 16px;
            background: #FBF5E5;
            border-left: 3px solid #D4AF37;
            font-size: 9.5px;
            color: #3a2a18;
        }

        /* Signature */
        .signature {
            margin-top: 36px;
            display: table;
            width: 100%;
        }
        .signature .cell {
            display: table-cell;
            width: 50%;
            padding-right: 18px;
        }
        .signature .line {
            border-bottom: 1px solid #1a1208;
            height: 40px;
            margin-top: 24px;
        }

        /* Footer */
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1a1208;
            color: #F4ECD8;
            padding: 14px 44px;
            font-size: 8.5px;
            letter-spacing: 1px;
        }
        .footer .left { float: left; }
        .footer .right { float: right; }
        .footer-essence {
            color: #D4AF37;
            letter-spacing: 4px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="page">

        <div class="header-meta">
            <div class="doc-type">— Devis —</div>
            <div class="doc-ref">{{ $quote->reference }}</div>
            <div class="doc-date">Émis le {{ $generatedAt->format('d/m/Y') }}</div>
        </div>

        <header class="header">
            <div class="logo">Lartis<span>Ka</span></div>
            <div class="tagline">{{ $settings['company.tagline'] ?? "L'art qui transforme vos espaces" }}</div>
            @if (!empty($settings['company.essence']))
                <div class="essence">{{ $settings['company.essence'] }}</div>
            @endif
        </header>

        <div class="grid">
            <div class="col">
                <div class="section-title">Émetteur</div>
                <div class="value">{{ $settings['company.name'] ?? 'Lartiska' }}</div>
                <div class="value">{{ $settings['contact.address'] ?? 'Dakar, Sénégal' }}</div>
                @if (!empty($settings['contact.email']))
                    <div class="value">{{ $settings['contact.email'] }}</div>
                @endif
                @if (!empty($settings['contact.phones']) && is_array($settings['contact.phones']))
                    @foreach (array_slice($settings['contact.phones'], 0, 2) as $phone)
                        <div class="value">{{ $phone['phone'] ?? '' }}</div>
                    @endforeach
                @endif
            </div>
            <div class="col">
                <div class="section-title">Client</div>
                <div class="value-lg">{{ $quote->client_name }}</div>
                <div class="value">{{ $quote->client_email }}</div>
                <div class="value">{{ $quote->client_phone }}</div>
                @if ($quote->client_city || $quote->site_address)
                    <div class="value">{{ trim(($quote->client_city ?? '') . ' — ' . ($quote->site_address ?? ''), ' —') }}</div>
                @endif
            </div>
        </div>

        @if ($quote->service)
            <div class="section-title">Prestation principale</div>
            <div class="value-lg">{{ $quote->service->title }}</div>
            @if ($quote->service->description)
                <div class="value" style="margin-top:6px;color:#3a2a18;">{{ $quote->service->description }}</div>
            @endif
        @endif

        @if ($quote->description)
            <div class="section-title">Description du projet</div>
            <div class="value" style="white-space:pre-wrap;">{{ $quote->description }}</div>
        @endif

        @if ($quote->surface_m2 || $quote->estimated_budget)
            <div class="grid" style="margin-top:16px;">
                @if ($quote->surface_m2)
                    <div class="col">
                        <div class="label">Surface estimée</div>
                        <div class="value-lg">{{ number_format((float) $quote->surface_m2, 0, ',', ' ') }} m²</div>
                    </div>
                @endif
                @if ($quote->estimated_budget)
                    <div class="col">
                        <div class="label">Budget client annoncé</div>
                        <div class="value-lg">{{ number_format((float) $quote->estimated_budget, 0, ',', ' ') }} FCFA</div>
                    </div>
                @endif
            </div>
        @endif

        @if ($quote->items && $quote->items->isNotEmpty())
            <div class="section-title">Détail tarifaire</div>
            <table class="items">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="r">Qté</th>
                        <th>Unité</th>
                        <th class="r">PU (FCFA)</th>
                        <th class="r">Total (FCFA)</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($quote->items as $item)
                        <tr>
                            <td>{{ $item->description }}</td>
                            <td class="r">{{ rtrim(rtrim(number_format((float)$item->quantity, 2, ',', ' '), '0'), ',') }}</td>
                            <td>{{ $item->unit }}</td>
                            <td class="r">{{ number_format((float)$item->unit_price, 0, ',', ' ') }}</td>
                            <td class="r">{{ number_format((float)$item->total, 0, ',', ' ') }}</td>
                        </tr>
                    @endforeach
                    @if ($quote->total_amount)
                        <tr class="total">
                            <td colspan="4" class="r">Total estimé</td>
                            <td class="r">{{ number_format((float)$quote->total_amount, 0, ',', ' ') }} FCFA</td>
                        </tr>
                    @endif
                </tbody>
            </table>
        @elseif ($quote->total_amount)
            <div class="section-title">Montant estimé</div>
            <div class="value-lg" style="color:#D4AF37;">{{ number_format((float) $quote->total_amount, 0, ',', ' ') }} FCFA</div>
        @endif

        <div class="conditions">
            <strong>Conditions générales</strong> — Ce devis est valable 30 jours à compter de la date d'émission.
            Un acompte de 40% est demandé à la signature ; le solde à la livraison.
            Les prix s'entendent toutes taxes comprises. Toute modification de cahier des charges en cours de chantier
            peut entraîner une révision tarifaire avec avenant. Garantie 1 an sur les finitions Lartiska.
        </div>

        <div class="signature">
            <div class="cell">
                <div class="label">Pour Lartiska</div>
                <div class="line"></div>
                <div style="font-size:9px;color:#7A5408;margin-top:4px;">Tounkara — Fondateur</div>
            </div>
            <div class="cell">
                <div class="label">Bon pour accord — Le client</div>
                <div class="line"></div>
                <div style="font-size:9px;color:#7A5408;margin-top:4px;">Date et signature</div>
            </div>
        </div>

    </div>

    <div class="footer">
        <div class="left">
            Lartiska — Devis {{ $quote->reference }} — émis le {{ $generatedAt->format('d/m/Y H:i') }}
        </div>
        <div class="right footer-essence">
            {{ $settings['company.essence'] ?? 'émeraude · or · pièce signature' }}
        </div>
    </div>
</body>
</html>
