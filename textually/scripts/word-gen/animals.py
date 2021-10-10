import re
import csv

with open('./animals.txt') as f:
  lines = f.readlines()

original_count = len(lines)

def allowed_animal(line: str):
  if ' ' in line:
    return False
  
  return True

lines = [
  line.lower() for line in lines if allowed_animal(line)
]

final_count = len(lines)

print(f"Removed {original_count - final_count} lines!")

with open('./animals.csv', 'w') as f:
  writer = csv.writer(f)
  writer.writerow(['id', 'name'])
  for line in enumerate(lines):
    writer.writerow([str(line).strip()])
