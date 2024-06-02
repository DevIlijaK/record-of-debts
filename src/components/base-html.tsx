export const BaseHtml = ({children}: PropsWithChildren) => (
    <html>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Praćenje Troškova</title>
        <link
            href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
            rel="stylesheet"
        />
        <script
            src="https://unpkg.com/htmx.org@1.9.9"
            integrity="sha384-QFjmbokDn2DjBjq+fM+8LUIVrAgqcNW2s0PjAxHETgRn9l4fvX31ZxDxvwQnyMOX"
            crossorigin="anonymous"
        ></script>
        <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/ws.js"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
    </head>
    <body class="bg-gray-100 p-8">{children}</body>
    <script src="/public/js.js"></script>
    </html>
);
