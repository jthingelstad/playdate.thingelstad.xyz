"""Draw the derived images from the game's own art, nearest-neighbour only.

    uv run --with pillow python tools/render-images.py

public/apple-touch-icon.png: the launcher icon (the king, 32 x 32) at 5x on 180 x 180 white.
public/share/throwing-wood.png: the title screen at 2.5x on a
1200 x 630 card, its edges carried out to the sides. Run again when the art changes.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent / "public"

icon = Image.open(root / "favicon.png").convert("1").resize((160, 160), Image.NEAREST)
touch = Image.new("1", (180, 180), 1)
touch.paste(icon, (10, 10))
touch.convert("L").save(root / "apple-touch-icon.png", optimize=True)

title = Image.open(root / "throwing-wood/title.png").convert("L").resize((1000, 600), Image.NEAREST)
card = Image.new("L", (1200, 630), 255)
card.paste(title, (100, 15))
for y in range(630):
    sy = min(max(y - 15, 0), 599)
    left, right = title.getpixel((0, sy)), title.getpixel((999, sy))
    for x in range(100):
        card.putpixel((x, y), left)
        card.putpixel((1100 + x, y), right)
    if y < 15 or y >= 615:
        for x in range(100, 1100):
            card.putpixel((x, y), title.getpixel((x - 100, sy)))
(root / "share").mkdir(exist_ok=True)
card.save(root / "share/throwing-wood.png", optimize=True)
