import pandas as pd
from requests import get
from os.path import basename
from urllib.parse import urlparse

# Get Bootstrap Style Sheet
urls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
]
for url in urls:
    r = get(url, allow_redirects=True)
    open(basename(urlparse(url).path), 'wb').write(r.content)


# Get BT Wahl results 2021 + Wiederholungswahl 2024 in Berlin
CSV_FILE = 'https://www.bundeswahlleiterin.de/bundestagswahlen/2021/ergebnisse/opendata/btw21/20240211_wdhwahl-vgl2021/csv/kerg2.csv'
data = pd.read_csv(CSV_FILE, delimiter=";", decimal=",", header=9, encoding="utf-8")
data = data[(data.Gebietsart == "Bund") & (data.Gruppenart == "Partei") & (data.Stimme == 2) ][["Gruppenname", "Prozent"]].dropna()

# Query party colors from Wikidata
query = """
SELECT ?party ?partyLabel ?shortname (SAMPLE(?color) AS ?firstColor) (COALESCE(?shortname, ?partyLabel) AS ?Gruppenname) WHERE {
  ?party wdt:P31/wdt:P279* wd:Q2023214;    # Instance or subclass instance of political party
  OPTIONAL { ?party wdt:P1813 ?shortname. } # Optional shortname
  FILTER(lang(?shortname) = "de" || !BOUND(?shortname))
  {
    ?party wdt:P465 ?color.      # Has color
  } UNION {
    ?party wdt:P6364 ?colorItem. # Has secondary color
    ?colorItem wdt:P465 ?color.  # Color item has color
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de". }
}
GROUP BY ?party ?partyLabel ?shortname ?Gruppenname
"""

url = 'https://query.wikidata.org/sparql'
response = get(url, params={'format': 'json', 'query': query})
colors = pd.DataFrame(response.json()['results']['bindings']).applymap(lambda x: x["value"], na_action='ignore')[["Gruppenname","firstColor"]]
colors["Gruppenname_lower"] = colors["Gruppenname"].str.lower()

data["Gruppenname_lower"] = data["Gruppenname"].str.lower()
pd.merge(data, colors.drop("Gruppenname", axis=1), on="Gruppenname_lower", how="left").drop("Gruppenname_lower", axis=1).to_json("data.json", orient="values", force_ascii=False)