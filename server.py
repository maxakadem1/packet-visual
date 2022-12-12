from flask import Flask, jsonify, request
from flask_restful import Resource, Api


# creating the flask app
app = Flask(__name__)
# creating an API object
api = Api(app)

#Class for different resources/Paths 
#Each class will be possess their own get/post/put/del methods which correspond 
#to the REST API methods being called by the react portion of the app
class userData(Resource):

    def get(self):
        data = {"Data:":"Here"}

        return jsonify(data)
    
    def post(self):
        #Add the downloading of data here
        
        return jsonify()

class sampleData(Resource):

    def get(self):
        sampledata = "Blank temp"
        return jsonify(sampledata)

class homePage(Resource):

    def get(self):
        homePage = "Temp home page"
        return homePage

class anaylyze(Resource):

    def get(self):
        return "fuck"

api.add_resource(homePage, '/')
api.add_resource(userData, '/userData')
api.add_resource(sampleData,'/sampleData')
api.add_resource(anaylyze, '/analyze')

if __name__ == '__main__':

    app.run(debug=True)
