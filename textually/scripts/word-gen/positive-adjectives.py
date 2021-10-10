import re
import csv

with open('./adjectives.txt') as f:
  lines = f.readlines()

original_count = len(lines)

matching_endings = r'.*((^e)ed|ble|ing|ous)$'
lines = [
  line for line in lines if re.match(matching_endings, line)
]

final_count = len(lines)

print(f"Removed {original_count - final_count} lines!")

with open('./positive-adjectives.csv', 'w') as f:
  writer = csv.writer(f)
  writer.writerow(['id', 'name'])
  for [i, line] in enumerate(lines):
    writer.writerow([i, str(line).strip()])
