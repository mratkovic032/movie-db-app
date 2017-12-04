from pymongo import MongoClient
import json


client = MongoClient("localhost", 27017)
mongo_db = client.singi

def init():
    f = open("movies_1k.csv","r")
    mList = []
    for line in f:
        #http://image.tmdb.org/t/p/w500/wNUDAq5OUMOtxMlz64YaCp7gZma.jpg
        # 0 adult
        # 1 belongs_to_collection
        # 2 budget
        # 3 genres
        # 4 homepage
        # 5 id
        # 6 imdb_id
        # 7 original_language
        # 8 original_title
        # 9 overview
        # 10 popularity
        # 11 poster_path
        # 12 production_companies
        # 13 production_countries
        # 14 release_date
        # 15 revenue
        # 16 runtime
        # 17 spoken_languages
        # 18 status
        # 19 tagline
        # 20 title
        # 21 video
        # 22 vote_average
        # 23 vote_count
        genres = ""
        try:
            parts = line.split('\t')
            popularity = 0
            popularity = float(parts[10])
            genres = parts[3]
            genres = genres.replace("'", "\"")
            movie = {
                'title': parts[20],
                'popularity': popularity,
                'poster_path': parts[11],
                'genres': json.loads(genres),
                'imdb_id': parts[6],
                'homepage': parts[4]
            }
            mongo_db.movies.update({'imdb_id':movie['imdb_id']}, movie, upsert=True)
            #mList.append(movie)
        except Exception as e:
            print genres
            print e
            pass
    #mList = sorted(mList[1:], key=lambda k: k['popularity'], reverse=True)

init()
