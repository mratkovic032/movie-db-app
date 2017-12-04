#!/usr/bin/python
# -*- coding: utf-8 -*-
from pymongo import MongoClient
from flask import Flask
from flask import jsonify
from flask import request
import json
import pymongo

client = MongoClient("localhost", 27017)
mongo_db = client.singi


app = Flask(__name__, static_folder='www')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

@app.route('/<path:path>')
def static_file(path):
    try:
        return app.send_static_file(path)
    except:
        return "Error"

@app.route('/favorit', methods=['POST'])
def set_favorit():
    # search = request.args.get("search")
    # page = request.args.get("page")
    # email = request.form.get('email')
    # password = request.form.get('password')
    data = request.data
    movie = json.loads(data)
    print movie['imdb_id'], movie['title']
    rez = {'rez': "ok"}
    return jsonify(rez)

@app.route('/filmovi', methods=['GET'])
def get_films():
    text = request.args.get("search")
    query = {}
    if text != None or len(text)>0:
        query = {'title': {'$regex': text + '.*', '$options': 'i'}}
    cursor = mongo_db.movies.find(query).sort('popularity', pymongo.DESCENDING).limit(30)
    mList = []
    for obj in cursor:
        obj.pop('_id')
        mList.append(obj)
    rez = {'filmovi': mList}
    return jsonify(rez)


@app.route('/')
def root():
    return app.send_static_file('index.html')

app.run(host='0.0.0.0', port=8080, debug=True, use_reloader=False)
