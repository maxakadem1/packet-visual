from flask import Flask, jsonify, request, send_file
from flask_restful import Resource, Api
from werkzeug.utils import secure_filename
import parse_pcapng
import uuid
import traceback
import os
import json
import matplotlib.pyplot as plt
import base64

layers = {}
# creating the flask app
app = Flask(__name__)
# creating an API object
api = Api(app)

#Class for different resources/Paths 
#Each class will be possess their own get/post/put/del methods which correspond 
#to the REST API methods being called by the react portion of the app
class userData(Resource):

    #Given the users UUID parse the pcab file and turn it into a json
    #If No errors return the json back to the user otherwise send error 404 message
    def get(self):

        userID = request.args.get('userId')
        print(userID)
        data = "" 
        error = 404
        try:
            fileName = parse_pcapng.parse_pcapng_file(userID)
            print("parsed")
        except Exception:
            print(traceback.format_exc())
            return {"Parsing error"},error

        try:
            with open(fileName, 'r') as file:
                data = json.load(file)
        except:
            return {"Reading error"},500
        return jsonify(data)
    
    #Generate a uuid for a user which is then used to access that users pcab file
    #Send the uuid back to the user for them to save it when they later request the json of the pcab
    def post(self):
        userID = str(uuid.uuid4())
        dataFolder = os.path.join("public", "data")
        fileName = os.path.join(dataFolder,userID) + ".pcapng"
        try:
            with open(fileName,"wb") as pcab:
                pcab.write(request.data)
        except:
            return {"error": "file error"}, 404
        return userID

#Send the index file for the get request
class homePage(Resource):

    def get(self):
        homePage = ""
        error = 404
        try:
            with open("public/index.html","r") as file:
                homePage = file.read()
        except:
            return {"error":"file error"},error
        return homePage

#WORK IN PROGRESS
class anaylyze(Resource):

    def get(self):
        userID = request.args.get('userId')
        path = os.path.join("public","data",userID)
        fileName = path + ".json"

        #Dictionary that contains the number of protocols sent from layers 1-7 
        # 8 is used for other protocols not reconized
        protoAnalysis = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0}
        osiModel = ["Physical", "Data Link",
                    "Network", "Transport", "Session",
                     "Presentation", "Application", "Undefined"]
        try:
            with open(fileName) as file:
                data = json.load(file)

                for key in data.keys():
                    packet = data[key]

                    protocol = packet["protocol"]

                    if(protocol in layers[1]):
                        protoAnalysis[1] += 1
                    elif(protocol in layers[2]):
                        protoAnalysis[2] += 1
                    elif(protocol in layers[3]):
                        protoAnalysis[3] += 1
                    elif(protocol in layers[4]):
                        protoAnalysis[4] += 1
                    elif(protocol in layers[5]):
                        protoAnalysis[5] += 1
                    elif(protocol in layers[6]):
                        protoAnalysis[6] += 1
                    elif(protocol in layers[7]):
                        protoAnalysis[7] += 1
                    else:
                        protoAnalysis[8] +=1
        except Exception:
            print(traceback.format_exc())
            return {"Generating protocol graph error"},505

        plotFileName = os.path.join("public","graphs",userID) + ".png"
        plt.bar(osiModel,protoAnalysis.values(), linewidth=2.0)
        plt.xlabel("OSI Layer")
        plt.ylabel("Packets sent from protocol")
        plt.savefig(plotFileName, bbox_inches='tight')
        return send_file(plotFileName, mimetype="image")

        

api.add_resource(homePage, '/')
api.add_resource(userData, '/userData')
api.add_resource(anaylyze, '/analyze')

if __name__ == '__main__':
    
    for i in range(1,8):
        startStr = "networkLayers/Layer"
        fileName = startStr + str(i) + ".txt"
        with open(fileName, "r") as file:
            lines = file.read()
            lines = lines.replace("\n","")
            layers[i]= lines
    app.run(debug=True)
