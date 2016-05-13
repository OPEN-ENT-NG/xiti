Application XiTi
================

# À propos de l'application XITI (marquage CDC / MEN)

* Licence : [AGPL v3](http://www.gnu.org/licenses/agpl.txt) - Copyright Conseil Régional Nord Pas de Calais - Picardie, Conseil départemental de l'Essonne, Conseil régional d'Aquitaine-Limousin-Poitou-Charentes

* Développeur(s) : Open Digital Education

* Financeur(s) : Région Nord Pas de Calais-Picardie,  Département 91, Région Aquitaine-Limousin-Poitou-Charentes

* Description : Application permettant de s'interfacer avec le dispositif et suivi d'audience des ENT mis en place par le MEN et la CDC


## Configuration du springboard

**Similiaire aux autres applications :**

- Ajouter la variable de version dans le fichier `gradle.properties` :
`xitiVersion=0.1-SNAPSHOT`

- Dans le fichier `build.gradle`, ajouter la ligne :
`deployment "fr.wseduc:xiti:$xitiVersion:deployment"`

- Déployer le springboard avec `gradle init`

**Spécifique à XiTi :**

- Copier les directives contenues dans le fichier  `[xiti]/src/main/resources/public/js/springboardDirectives/directives.js` dans le fichier des directives du springboard, typiquement situé dans `[springboard]/assets/themes/[nom du theme]/js/directives.js`. Des précisions sont écrites sous forme de commentaires javascript.

- Copier le script `src/main/resources/public/js/lib/xtfirst_ENT.js` dans le springboard.

- Passer la variable `xitiSwitch` du `test.properties` ou du `conf.properties` à true.

#### Configuration des applications

**Si l'application contient déjà un identifiant XiTi dans sa configuration, il n'est pas nécessaire de suivre cette partie.**

Dans le fichier de template de configuration généré par gradle, il faut modifier la configuration de chaque application afin de rajouter un identifiant XiTi propre au plan de marquage de chaque plateforme.

A ces fins, il faut déclarer un sous objet Json "xiti", placé dans le sous-objet contenant les propriété exposées de manière publique par l'application.

Afin de mieux comprendre, un exemple de configuration de l'application directory est proposé ci-dessous :

```json
{
      "name": "org.entcore~directory~1.14-SNAPSHOT",
      "config": {
        "main":"org.entcore.directory.Directory",
        "auto-redeploy": false,
        "ssl" : false,
        "mode": "dev",
        "host": "http://localhost:8090",
        "port": 8003,
        "email": "noreply@entcore.org",
        "workspace-url": "localhost",
        "workspace-port":8011,
        "workspace-prefix" : "/workspace",
        "user-book-data":{
          "default-theme":"default",
          "default-avatar": "no-avatar.jpg",
          "default-mood" : "default",
          "hobbies": ["sport","cinema", "animals", "music", "places", "books"]
        },
        "publicConf": {
            "xiti": {
                "ID_SERVICE": {
                    "default": 10,
                    "/userbook/mon-compte": "",
                    "/admin-console": ""
                }
            }
        }
      }
    },
```

`publicConf` : Configuration publique, c'est à dire objet Json exposé par l'application sur la route [appPrefix (ici directory)]/conf/public
`xiti`: Objet contenant la configuration xiti de l'application
`ID_SERVICE`: map de valeurs, de la forme [route -> identifiant], default étant la valeur par défaut si aucune route particulière n'est matchée.

#### Configuration des établissements et de la plateforme

Le paramétrage spécifique à la plateforme et aux établissements est contenu dans une IHM accessible dans la console d'administration.

Pour ajouter l'onglet nécessaires, il faut modifier la configuration du springboard une nouvelle fois an ajoutant au tableau admin-urls de l'application portal:

```javascript
//Ajouter au tableau:
"admin-urls": [
	//.....//
	{"name": "xiti", "url": "/xiti/admin-console", "allowed": ["SUPER_ADMIN"]}
]
```

<em>**Ne pas oublier de générer la configuration finale en utilisant `gradle generateConf`ou `gradle generateTestConf` une fois le paramétrage fini.**</em>
