from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from werkzeug import secure_filename
import parse_pcapng
import uuid


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
    def get(self,userID):
        data = {}
        error = 404
        try:
            fileName = parse_pcapng(userID)
            with open(fileName, 'r') as file:
                data = file.read()
        except:
            return {"error":"file error"},error
        return jsonify(data)
    
    #Generate a uuid for a user which is then used to access that users pcab file
    #Send the uuid back to the user for them to save it when they later request the json of the pcab
    def post(self):
        userID = uuid.uuid4()
        file = request.files("file")
        if file.filename != "":
            file.save(secure_filename("public/data/" + userID))
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
