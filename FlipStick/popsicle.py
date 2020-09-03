from PIL import Image, ImageDraw, ImageFont
import os
import random

data_dir = os.path.join(os.path.dirname(__file__), "data")
def draw_name(last_name=False):
    with open(os.path.join(data_dir, "names.txt")) as sf, Image.open(os.path.join(data_dir, "stick.png")) as stick_img:
        student = random.choice([s.strip().split()[0] if not last_name else s.strip() for s in sf.readlines()])
        draw = ImageDraw.Draw(stick_img)
        fnt = ImageFont.truetype("/Library/Fonts/Arial.ttf", 24)

        draw.text((stick_img.width // 10, stick_img.height / 4.5), text=student, fill="black", font=fnt, stroke_fill='white', stroke_width=1)
        stick_img.show(title=student)

if __name__ == '__main__':
    draw_name()
