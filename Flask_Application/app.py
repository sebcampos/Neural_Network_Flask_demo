import pandas
from flask import Flask, Response, redirect, url_for, request, render_template, send_file, send_from_directory
from flask_ngrok import run_with_ngrok
from connect_sql_db import build_engine
from pprint import pprint
import os
import json
import time
from ML_Classifier import nueral_network_classifier

engine = build_engine(database_name="database1",host="35.225.193.21")

app = Flask(__name__)

run_with_ngrok(app)

df_main = pandas.read_sql("select * from cleaned_table", con=engine)

lat_lng = {
    'state':df_main["state"].tolist(),
    'name': df_main["name"].tolist(), 
    'lat':df_main["latitude"].tolist(),
    'lng':df_main["longitude"].tolist(),
    'review_count': df_main["review_count"].tolist(),
    "stars": df_main["stars"].tolist()
}

for column in df_main.drop(["address","city","state","postal_code","latitude","longitude","stars","review_count","business_id","name"], axis = 1).columns:
    lat_lng[column] = df_main[column].tolist()

categories = df_main.drop(["address","city","state","business_id","city", "postal_code","latitude","longitude","stars","review_count","name"],axis=1).columns.tolist()

with open("json_data/data.json","w") as outfile:
    json.dump(lat_lng, outfile)

print("json written")

#Favicon Directory
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path,'favicon_io'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

#Favicon Directory
@app.route('/apple-touch-icon-120x120-precomposed.png')
def favicon_apple120_pre():
    return send_from_directory(os.path.join(app.root_path,'favicon_io'), 'apple-touch-icon.png', mimetype='image/vnd.microsoft.icon')

#Favicon Directory
@app.route('/apple-touch-icon-120x120.png')
def favicon_apple120():
    return send_from_directory(os.path.join(app.root_path,'favicon_io'), 'apple-touch-icon.png', mimetype='image/vnd.microsoft.icon')

#Favicon Directory
@app.route('/apple-touch-icon-precomposed.png')
def favicon_apple_pre():
    return send_from_directory(os.path.join(app.root_path,'favicon_io'), 'apple-touch-icon.png', mimetype='image/vnd.microsoft.icon')

#Favicon Directory
@app.route('/apple-touch-icon.png')
def apple_touch_icon():
    return send_from_directory(os.path.join(app.root_path,'favicon_io'), 'apple-touch-icon.png', mimetype='image/vnd.microsoft.icon')












@app.route('/', methods=["GET","POST"])
def first_page():
    df_1 = df_main.copy()
    df = df_1.copy()
    categories = ["all"] + df_main.drop(["address","city","state","business_id","city", "postal_code","latitude","longitude","stars","review_count","name"],axis=1).columns.tolist()

    df.dropna(how="any", inplace=True)
    if request.method == "POST":
        state = request.form["state"]
        selection = request.form["category"]
        star_choice = request.form["star_rating"]

        return redirect(url_for("map",change_me="True",state=state,selection=selection,star_choice=star_choice,code=302,response=200,_scheme="https",_external=True))    
    



    return render_template(
        "homepage.html",
        categories=categories,
        df = df[["name","state","stars","review_count"]].sort_values("review_count", ascending = False),
        state_count = df.groupby("state").count()[["business_id"]].sort_values("business_id", ascending=False), 
        category_2="select category",
        states=["all"] + list(set(df_main.state.tolist())),
        state_2="all",
        star_choice = "all"
    )

@app.route('/map', methods=["GET","POST"])
def map():
    df_1 = df_main.copy()
    answer = request.args.get("change_me")
    if answer == "True":
        state = request.args.get("state")
        if state != "all":
            df2 = df_1.loc[df_1.state == state].dropna(how="any").copy()
        
        elif state == "all":
            df2 = df_1.copy().dropna(how="any")
        
        
        star_choice = request.args.get("star_choice")

        if star_choice != "all":
            df2 = df2.loc[df2.stars == int(star_choice)]

        selection = request.args.get("selection")
        
        if selection != "select category" and selection != "all":
            df2 = df2.loc[df2[selection] == 1]
            df2[selection] = df2[selection].apply(lambda x: "True" if x == 1 else "False")
            send_me = df2[["name","state","stars","review_count", selection]].sort_values("review_count", ascending = False)

        else:
            send_me = df2[["name","state","stars","review_count"]]
            send_me["all"] = "all"
            selection = "all"
        


        if request.method == "POST":
            state = request.form["state"]
            selection = request.form["category"]
            star_choice = request.form["star_rating"]
            print(request.form)
            return redirect(url_for("map",change_me="True",state=state,selection=selection,star_choice=star_choice,code=302,response=200,_scheme="https",_external=True))    
    
    
    return render_template(
        "homepage.html",
        categories=["all"] + categories,
        df = send_me,
        state_count = df2.groupby("state").count()[["business_id"]].sort_values("business_id", ascending=False), 
        category_2=selection,
        states=["all"] + list(set(df_main.state.tolist())),
        state_2=state,
        star_choice = star_choice
    )

@app.route('/prediction', methods=["GET","POST"])
def prediction():
    new_dict = {}
    for i in request.form:
        new_dict[i] = request.form[i].split(",")

    response = nueral_network_classifier(new_dict)
    return "<h1>"+str(response)+" Stars</h1>"
@app.route("/tab_page")
def page_2():
    return render_template("page_2.html")


@app.route("/json_data/data.json")
def get_json():
    return send_file("json_data/data.json")


if __name__ == "__main__":
    app.run()