from flask import Flask, render_template, send_from_directory, redirect
from flask_frozen import Freezer
import os, sys, datetime

app = Flask(__name__)
app.config.from_object(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
freezer = Freezer(app)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/old')
def old_index():
    return render_template("main.html")


@app.route('/getstarted')
def getstarted():
    return render_template("getstarted.html")


@app.route('/about')
def about():
    return render_template("about.html")


# ----- Data collection and calibration -----
# Records the training data and trains the regression models from embeddings
@app.route('/datacollection/')
def datacollect():
    return render_template("datacollection.html")


# Trains a model offline
@app.route('/offlinetraining/')
def offlinetraining():
    return render_template("mainTesting.html")


# ----- Live testing for debugging -----
# Tests the original model, boosted with the regression model in real-time
@app.route('/keyboard/')
def keyboard():
    return render_template("svr.html")

@app.route('/svrtest/')
def keyboard_redir():
    return redirect("/keyboard", 301)


# Tests the original model, boosted with the regression model in real-time
@app.route('/svreyesonly/')
def svreyesonly():
    return render_template("svreyesonly.html")


# ----- Evaluation of gaze + acceleration together -----
# Evaluates performance of the regression model, then prints output.
@app.route('/grideval/')
def grideval():
    return render_template("evalgrid.html")


@app.route('/listeval/')
def listeval():
    return render_template("evallist.html")


# ----- Show results from the grid and list evaluations -----
@app.route("/results/")
def results():
    return render_template("blockresults.html")


# ----- Misc showcases and debug screens. -----
@app.route("/testing/")
def testing():
    return render_template("mainTesting.html")


@app.route('/dictionary/')
def dict():
    return send_from_directory("static", "t9/dictionary.txt")


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        print("Built at " + datetime.datetime.now().ctime())
        freezer.freeze()
    else:
        app.run(port=8000)
