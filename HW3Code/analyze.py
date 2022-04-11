import findspark
findspark.init()

import pyspark
import sys
import json
import os
import os.path
from os.path import exists

try:
        os.remove("result.json")
except OSError:
        pass

inputUri = sys.argv[1]
myjson = json.loads(sys.argv[2])

mywords = myjson["wordlist"]
weights = {}
for key, value in myjson["weights"].items():
    weights[key.lower()] = value

myjson["weights"] = weights

result = {}

def getScore(sentence, weights):
    score = 0
    for i in sentence.lower():
        if i in list(weights.keys()):
            score += weights[i]
    return score

def myMapFunc(x): # takes an input, provides an output pairing
        return (x, getScore(x, myjson["weights"]))


def myReduceFunc(v1, v2): # Merge two values with a common key - operation must be assoc. and commut.
        return v2

sc = pyspark.SparkContext()

# textFile --> take the address of a text file, return it as an RDD (hadoop dataset) of strings
lines = sc.textFile(sys.argv[1])

wordCounts = words.map(myMapFunc).reduceByKey(myReduceFunc)
countDict = wordCounts.collectAsMap()

# sys.argv[0] analyze.py
# sys.argv[1] War_and_Peace.txt
# sys.argv[2] myjson

for word in mywords:
        filteredDict = {key: value for key, value in countDict.items() if word in key}
        for sentence in list(filteredDict.keys()):
                if filteredDict[sentence] == max(filteredDict.values()):
                        result[word] = sentence

with open("result.json", "w") as outfile:
        json.dump(result, outfile);

#print(result)
