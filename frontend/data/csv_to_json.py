import csv
import json

final_list = []

with open('locustpoints/Filtered_Kenya_Points.csv', 'r') as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    for row in reader:
        final_list.append([float(row[1]), float(row[0])])

f = open("locustpoints/locust_points.json", "w")
f.write(json.dumps(final_list))
f.close()

