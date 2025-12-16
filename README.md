# Comparatif useContext, Redux Toolkit et Zustand pour la gestion d’état global 

## 1. Introduction du projet

Cette application affiche une liste de films populaires issus d’une API (TMDb ou OMDb), permet d’ajouter des films en favoris, de filtrer par genre, de rechercher par titre et d’afficher une section dédiée aux favoris.  
Les mêmes fonctionnalités ont été implémentées avec trois solutions de gestion d’état global : **React useContext**, **Redux Toolkit** et **Zustand**, afin de comparer leur impact sur la structure du code et l’expérience développeur.  

## 2. Objectifs du comparatif

Ce comparatif vise à mettre en évidence les différences entre ces trois approches en termes de **complexité**, de **lignes de code**, de **gestion des appels API**, de **performance** et de **developer experience (DX)**.  
L’objectif est d’aider à **choisir la solution la plus adaptée** selon la taille et la complexité du projet (petit, moyen ou gros projet MERN).  

## 3. Présentation rapide des 3 solutions

- **useContext** : solution native de React pour partager un état global via un Context Provider, très simple à mettre en place, mais qui peut entraîner des re-renders de tous les composants consommateurs lorsque l’état change.  
- **Redux Toolkit** : standard moderne pour les applications complexes, avec `createSlice`, `createAsyncThunk`, un `store` centralisé et un `Provider` React-Redux offrant une structure claire pour actions, reducers et logique asynchrone.  
- **Zustand** : librairie légère basée sur un store créé avec `create`, sans Provider global, qui permet de définir state, actions et fonctions async dans un seul fichier concis.  

## 4. Architecture dans ce projet

### useContext

- Un provider, par exemple `MoviesProvider`, contient tout l’état global : liste des films, favoris, filtre, loading, ainsi que la logique `fetch` de l’API via `useEffect` et les fonctions `toggleFavorite`, `getFilteredMovies`, `getLikedMovies`, etc.  
- Les composants UI (`Header`, `FilterBar`, `MoviesGrid`, `FavoritesSidebar`) consomment le context via un hook personnalisé `useMovies`.  

### Redux Toolkit

- Un slice `moviesSlice` définit `initialState`, les reducers synchrones (`toggleFavorite`, `setFilter`) et un `createAsyncThunk` pour charger les films depuis l’API, avec `extraReducers` pour gérer les états `pending` et `fulfilled`.  
- Un `store` est configuré avec `configureStore`, l’application est enveloppée par le `Provider` de `react-redux`, et chaque composant utilise `useSelector` et `useDispatch` avec des selectors dérivés (`selectFilteredMovies`, `selectLikedMovies`, `selectLoading`).  

### Zustand

- Un store `useMoviesStore` est créé avec `create`, contenant le state global (films, favoris, filtre, loading), une fonction async `fetchMovies`, les actions `toggleFavorite`, `setFilter` et des sélecteurs comme `getFilteredMovies` et `getLikedMovies`.  
- Aucun `Provider` n’est nécessaire : les composants accèdent directement au state avec `useMoviesStore(state => state.xxx)` pour ne consommer que les morceaux d’état nécessaires.  

## 5. Différences principales entre useContext, Redux et Zustand

### Différences principales entre useContext, Redux Toolkit et Zustand

| Critère             | useContext                                          | Redux Toolkit                                                   | Zustand                                                     |
|---------------------|-----------------------------------------------------|-----------------------------------------------------------------|------------------------------------------------------------|
| Lignes de code      | ≈ 80 lignes pour la version context                 | ≈ 100 lignes (slice + store + hooks Redux)                      | ≈ 60 lignes pour un store complet                          |
| Gestion API         | `useEffect` dans le Provider                        | `createAsyncThunk` + `extraReducers` pour l’async               | Fonction async directement dans le store                   |
| Provider requis     | Oui, `Context.Provider` autour de l’app             | Oui, `Provider` de `react-redux`                                | Non, `App` rendu directement sans wrapper                  |
| Selectors           | Fonctions utilitaires dans le context (`getFiltered…`) | Selectors exportés (`selectFiltered…`, `selectLiked…`)         | Fonctions intégrées au store (`getFiltered…`)              |
| Complexité globale  | Moyenne (simple, un seul context global)            | Haute (plus de fichiers, patterns plus stricts)                 | Faible (API simple, très peu de boilerplate)               |
| Performance         | Tous les consommateurs re-rendent                   | Renders plus ciblés via `useSelector`                           | Sélection par “slice” de state, très léger                 |
| Idéal pour          | Petites applis, démos, TPs pédagogiques             | Grandes applis avec beaucoup de features et logique complexe    | Applis petites à moyennes, besoin de simplicité            |

## 6. Avantages et limites par solution

### useContext

**Avantages**

- Aucune dépendance supplémentaire : uniquement React, idéal pour débuter et pour des travaux pratiques simples.  
- Lecture du code intuitive, avec une seule source de vérité (par exemple films + favoris) centralisée dans un provider.  

**Limites**

- Chaque mise à jour du context peut déclencher des re-renders sur tous les composants consommateurs.  
- Devient plus difficile à maintenir si l’état global grossit ou si l’on multiplie les contexts pour différentes parties de l’app.  

### Redux Toolkit

**Avantages**

- Structure très claire avec séparation nette entre state, actions, reducers et logique asynchrone, facilitant le travail en équipe.  
- `createAsyncThunk` gère proprement loading/success/error, ce qui est idéal quand l’application consomme plusieurs endpoints d’API.  

**Limites**

- Boilerplate plus important : création de slice, configuration du store, ajout du Provider, hooks Redux, etc.  
- Peut être surdimensionné pour un simple projet de films ou une petite galerie.  

### Zustand

**Avantages**

- Le plus concis et lisible : un seul fichier pour le store avec state, actions et fonctions async.  
- Pas de Provider global, intégration très simple, particulièrement agréable pour prototyper et itérer rapidement.  

**Limites**

- Moins standard que Redux dans les cours et certaines entreprises, donc moins de tooling dédié.  
- Demande un minimum de rigueur pour éviter de centraliser toute la logique dans un store unique trop gros.  

## 7. Recommandations d’usage

- Pour un **TP** ou un **petit projet** (galerie, films, blog simple), il est recommandé de commencer par **useContext** ou **Zustand** pour aller vite et se concentrer sur les fonctionnalités.  
- Pour une **application MERN complète** avec beaucoup de fonctionnalités (authentification, dashboard, analytics, IA, etc.), **Redux Toolkit** est à privilégier pour sa structure et sa maintenabilité à long terme.  
- Pour **expérimenter rapidement** des nouvelles features (par exemple ajout d’IA pour recommander des films), **Zustand** offre un très bon compromis entre simplicité, flexibilité et puissance.  
