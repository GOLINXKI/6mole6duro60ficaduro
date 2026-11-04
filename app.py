from flask import Flask, render_template

app = Flask(__name__, template_folder="html", static_folder="static")

@app.route("/")
def inicio():
    return render_template("projetocassino.html")

@app.route("/sobre")
def sobre():
    return render_template("index2.html")

if __name__ == "__main__":
    app.run(debug=True)


