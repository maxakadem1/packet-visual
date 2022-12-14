from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from werkzeug.utils import secure_filename
import parse_pcapng
import uuid
import traceback
import os
import json


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

    def get(self,userID):
        return "TODO"

api.add_resource(homePage, '/')
api.add_resource(userData, '/userData')
api.add_resource(anaylyze, '/analyze')

if __name__ == '__main__':

    app.run(debug=True)
