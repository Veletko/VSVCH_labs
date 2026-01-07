import os

def print_tree(dir_path, prefix='', exclude_names=None, max_depth=None, current_depth=0):
    if exclude_names is None:
        exclude_names = {'node_modules'}  # Добавьте сюда другие имена, например {'node_modules', 'другая_папка'}
    
    if max_depth is not None and current_depth >= max_depth:
        return
    
    try:
        items = sorted(os.listdir(dir_path))
    except PermissionError:
        print(prefix + "└── [Доступ запрещён]")
        return
    
    dirs = [item for item in items if os.path.isdir(os.path.join(dir_path, item))]
    files = [item for item in items if item not in dirs]
    all_items = dirs + files
    
    for i, item in enumerate(all_items):
        is_last = (i == len(all_items) - 1)
        pointer = '└── ' if is_last else '├── '
        connector = '    ' if is_last else '│   '
        
        full_path = os.path.join(dir_path, item)
        display = item + ('/' if os.path.isdir(full_path) else '')
        print(prefix + pointer + display)
        
        if os.path.isdir(full_path) and item in exclude_names:
            print(prefix + connector + '[ИСКЛЮЧЕНО: большая папка]')
            continue
        
        if os.path.isdir(full_path):
            print_tree(full_path, prefix + connector, exclude_names, max_depth, current_depth + 1)

# === НАСТРОЙКА ===
start_path = r'C:\uni\3curs\SVCH'  # Ваш путь
exclude = {'node_modules'}  # Имена больших папок

print(start_path)
print_tree(start_path, exclude_names=exclude)