import pandas as pd
import requests

# Get BT Wahl results 2021
CSV_FILE = 'https://www.bundeswahlleiterin.de/bundestagswahlen/2021/ergebnisse/opendata/csv/kerg2.csv'
data = pd.read_csv(CSV_FILE, delimiter=";", decimal=",", header=9)
data[(data.Gebietsart == "Bund") & (data.Gruppenart == "Partei") & (data.Stimme == 2) ][["Gruppenname", "Prozent"]].dropna().to_json("data.json", orient="values")


# Get Bootstrap Bundle and Style Sheet

JS_FILE = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js'
CSS_FILE = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
r = requests.get(JS_FILE, allow_redirects=True)
open('bootstrap.bundle.min.js', 'wb').write(r.content)

r = requests.get(CSS_FILE, allow_redirects=True)
open('bootstrap.min.css', 'wb').write(r.content)