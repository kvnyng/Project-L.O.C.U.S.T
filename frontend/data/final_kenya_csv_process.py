import csv
import json

old_prediction = []
new_prediction = []

with open('predictions/new_kenya.csv', 'r') as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    for row in reader:
        if row[5] == '1':
            old_prediction.append([float(row[2]), float(row[3]), 1])
        if row[6] == '1':
            new_prediction.append([float(row[2]), float(row[3]), 1])

f1 = open("predictions/old_prediction.json", "w")
f1.write(json.dumps(old_prediction))
f1.close()

f2 = open("predictions/new_prediction.json", "w")
f2.write(json.dumps(new_prediction))
f2.close()

