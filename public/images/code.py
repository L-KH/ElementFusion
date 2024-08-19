import os

def remove_min_suffix():
    # Get the directory where the script is located
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    for filename in os.listdir(current_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            name, ext = os.path.splitext(filename)
            if name.endswith('-min'):
                new_name = name[:-4] + ext
                old_path = os.path.join(current_dir, filename)
                new_path = os.path.join(current_dir, new_name)
                
                try:
                    os.rename(old_path, new_path)
                    print(f"Renamed: {filename} -> {new_name}")
                except Exception as e:
                    print(f"Error renaming {filename}: {e}")

if __name__ == "__main__":
    remove_min_suffix()
