const site = require("./site.json");
const catalog = require("./catalog.json");

function abs(path) {
  if (!path) return site.url;
  if (/^https?:\/\//i.test(path)) return path;
  return site.url + (path.startsWith("/") ? path : "/" + path);
}

function listItems(entries) {
  return entries.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    url: abs(item.path),
    description: item.note || undefined,
  }));
}

function person() {
  return {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    alternateName: site.alternateName,
    url: site.url,
    description: site.description,
    jobTitle: site.tagline,
    homeLocation: {
      "@type": "Place",
      name: site.location,
    },
    sameAs: site.sameAs,
  };
}

function website() {
  return {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: `${site.url}/`,
    description: site.description,
    publisher: { "@id": `${site.url}/#person` },
    inLanguage: "en-AU",
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function itemList(name, entries, id) {
  return {
    "@type": "ItemList",
    "@id": id,
    name,
    numberOfItems: entries.length,
    itemListElement: listItems(entries),
  };
}

const allGames = [
  ...catalog.games.singleplayer,
  ...catalog.games.multiplayer,
  ...catalog.games.online,
];

module.exports = {
  person: person(),
  website: website(),
  homeGraph: {
    "@context": "https://schema.org",
    "@graph": [
      website(),
      person(),
      itemList("Saxo_Broko games", allGames, `${site.url}/#games`),
      itemList("Saxo_Broko tools", catalog.tools, `${site.url}/#tools`),
    ],
  },
  personGraph: {
    "@context": "https://schema.org",
    "@graph": [person(), website()],
  },
  gamesList: {
    "@context": "https://schema.org",
    ...itemList("Saxo_Broko games", allGames, `${site.url}/games.html#list`),
  },
  toolsList: {
    "@context": "https://schema.org",
    ...itemList("Saxo_Broko tools", catalog.tools, `${site.url}/tools.html#list`),
  },
};
