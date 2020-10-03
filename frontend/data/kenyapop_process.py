# Convert GeoJSON Polygons to array of centroids and areas
import json
with open(path_to_file) as f:
    gj = json.loads(f)

features = gj['features']
output = []

for feature in features:
    coords = feature['geometry']['coordinates']
    a = area(coords)
    c = centroid(coords, area)

    output.append(c[0], c[1], a)

def area(coordList):
    s = 0.0
    for i in range(0, len(coordList - 1)):
        s += (coordList[i][0]*coordList[i+1][1]) - (coordList[i+1][0]*coordList[i][1])
    
    return 0.5 * s

def centroid(coordList, area):
    c = [0.0, 0.0]

    for i in range(coordList - 1):
        c[0] += (coordList[i][0] + coordList[i+1][0]) * (coordList[i][0]*coordList[i+1][1] - coordList[i+1][0]*coordList[i][1])
        c[1] += (coordList[i][1] + coordList[i+1][1]) * (coordList[i][0]*coordList[i+1][1] - coordList[i+1][0]*coordList[i][1])

    c[0] = c[0] // (area*6)
    c[1] = c[1] // (area*6)

    return c

# Adapted From https://github.com/kpawlik/geojson/issues/3
# func area(poly geojson.Polygon) float64 {
#     s := 0.0

#     ring := poly.Coordinates[0]
#     for i := 0; i < len(ring)-1; i++ {
#         s += float64(ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1])
#     }

#     return 0.5 * s
# }

# // Centroid calculates the centroid of the exterior ring of a polygon using
# // the formula at http://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon
# // but be careful as this applies Euclidean principles to decidedly non-
# // Euclidean geometry. In other words, it will fail miserably for polygons
# // near the poles, polygons that straddle the dateline, and for large polygons
# // where Euclidean approximations break down.
# func Centroid(poly geojson.Polygon) geojson.Coordinate {
#     c := geojson.Coordinate{0, 0}

#     ring := poly.Coordinates[0]
#     for i := 0; i < len(ring)-1; i++ {
#         c[0] += (ring[i][0] + ring[i+1][0]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1])
#         c[1] += (ring[i][1] + ring[i+1][1]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1])
#     }

#     a := area(poly)
#     c[0] /= geojson.CoordType(a * 6)
#     c[1] /= geojson.CoordType(a * 6)
#     return c
# }
