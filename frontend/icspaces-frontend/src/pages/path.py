import os

# Path to the directory containing your code file
code_dir = os.path.dirname(r'C:\Users\LJ\Desktop\Academics\2024\CMSC_128\frontend\frontend_ICSpaces\icspaces-frontend\src\pages\RoomPage.tsx')

# Path to the image file relative to the code directory
image_path = os.path.relpath(r'C:\Users\LJ\Desktop\Academics\2024\CMSC_128\frontend\frontend_ICSpaces\icspaces-frontend\src\assets\room_images\ICS.jpg', code_dir)

print("Relative path to the image:", image_path)