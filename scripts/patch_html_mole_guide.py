# -*- coding: utf-8 -*-
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

target = '<script src="js/traps.js?v=20261105"></script>'
replacement = '<script src="js/traps.js?v=20261105"></script>\n<script src="js/mole-guide.js?v=20261105"></script>'

if target in html:
    html = html.replace(target, replacement)
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Updated index.html to include mole-guide.js")
else:
    print("Target not found in index.html")
