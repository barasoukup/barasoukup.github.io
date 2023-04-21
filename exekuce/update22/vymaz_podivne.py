# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import json

R = "2"

with open("obce"+R+".geojson",encoding="utf-8") as obce:
    obce_features = json.load(obce)
    
    
for obec in obce_features["features"]:
    props = obec["properties"]
    if (props["poe2"]>2*props["poe1"] and (props["poe2"]/props["o2"]>0.15)):
        print(props["b"])
        props['pe'+R] = 0
        props['vc'+R] = 0
        props['poe'+R] = 0
        props['p1e'+R] = 0
        props['p2e'+R] = 0
        props['p3e'+R] = 0
        props['p4e'+R] = 0
        props['p5e'+R] = 0
        props['pde'+R] = 0
        props['pme'+R] = 0
        props['pse'+R] = 0
        props['mvc'+R] = 0
    

with open("obce"+R+"_upr.geojson", "w",encoding="utf-8") as outfile:
            json.dump(obce_features, outfile, separators=(',', ':'))
            
            
            
            
        
        
