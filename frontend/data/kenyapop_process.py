# Convert GeoJSON Polygons to array of centroids and areas
import json

from osgeo import ogr
from osgeo import osr

source = osr.SpatialReference()
source.ImportFromEPSG(4326)

target = osr.SpatialReference()
target.ImportFromEPSG(5243)

transform = osr.CoordinateTransformation(source, target)
transformBack = osr.CoordinateTransformation(target, source)

with open('kenyapop/popdata_geojson.json') as f:
    gj = json.loads(f.read())

features = gj['features']
output = []

def area(coordList):
    s = 0.0
    for i in range(0, len(coordList) - 1):
        s += (coordList[i][0]*coordList[i+1][1]) - (coordList[i+1][0]*coordList[i][1])
    
    return 0.5 * s

def centroid(coordList, a):
    c = [0.0, 0.0]

    for i in range(0, len(coordList) - 1):
        c[0] += (coordList[i][0] + coordList[i+1][0]) * (coordList[i][0]*coordList[i+1][1] - coordList[i+1][0]*coordList[i][1])
        c[1] += (coordList[i][1] + coordList[i+1][1]) * (coordList[i][0]*coordList[i+1][1] - coordList[i+1][0]*coordList[i][1])

    c[0] = c[0] // (a*6)
    c[1] = c[1] // (a*6)

    return c

for feature in features:
    coords = feature['geometry']['coordinates'][0]
    poly = ogr.CreateGeometryFromJson(str(feature['geometry']))
    poly.Transform(transform)
    a = poly.GetArea()
    # a = area(coords)
    # the following doesn't work
    # c = poly.Centroid()
    # c.Transform(transformBack)
    minLat = 180
    maxLat = -180
    minLong = 180
    maxLong = -180

    for point in coords:
        if point[0] < minLat:
            minLat = point[0]
        if point[0] > maxLat:
            maxLat = point[0]
        
        if point[1] < minLong:
            minLong = point[1]
        if point[1] > maxLong:
            maxLong = point[1]
    
    c = [(minLat + maxLat) / 2, (minLong + maxLong) / 2]

    # geojson is backwards?? longlat??
    output.append([c[1], c[0], a])

f = open("kenyapop/heatmap_pointdata.json", "w")
f.write(json.dumps(output))
f.close()

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
